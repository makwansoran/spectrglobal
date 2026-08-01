import { useCallback, useEffect, useRef, useState } from 'react'
import type { Artifact } from './artifacts'
import type { ChatMessage } from './types'
import { patchStep } from './agentSteps'
import { activeBackend } from './ai'

const uid = (): string => Math.random().toString(36).slice(2, 10)
const STORE_KEY = 'spectr-chats-v1'

/** Keep one live table card per title so cleanup jobs don't spam intermediate states. */
function coalesceArtifacts(list: Artifact[]): Artifact[] {
  const out: Artifact[] = []
  const tableIndex = new Map<string, number>()
  for (const a of list) {
    if (a.kind === 'table') {
      const i = tableIndex.get(a.title)
      if (i != null) {
        out[i] = a
        continue
      }
      tableIndex.set(a.title, out.length)
    }
    out.push(a)
  }
  return out
}

export interface ChatSession {
  id: string
  title: string
  /** When true, title is user-set and not overwritten by the first message. */
  renamed?: boolean
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

const GREETING: ChatMessage = {
  id: 'boot',
  role: 'assistant',
  createdAt: Date.now(),
  content: 'Welcome Back'
}

function greeting(): ChatMessage {
  return { ...GREETING, id: 'boot', createdAt: Date.now() }
}

function freshSession(): ChatSession {
  const now = Date.now()
  return {
    id: uid(),
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    messages: [greeting()]
  }
}

function titleFromMessages(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === 'user' && m.content.trim())
  if (!first) return 'New chat'
  const t = first.content.trim().replace(/\s+/g, ' ')
  return t.length > 32 ? `${t.slice(0, 32)}…` : t
}

function isBlank(session: ChatSession): boolean {
  return !session.messages.some((m) => m.role === 'user' || (m.artifacts && m.artifacts.length > 0))
}

interface Store {
  activeId: string
  sessions: ChatSession[]
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Store
      if (parsed?.sessions?.length && parsed.activeId) {
        // Drop in-flight streaming flags from a previous crash.
        const sessions = parsed.sessions.map((s) => ({
          ...s,
          messages: s.messages.map((m) => ({ ...m, streaming: false, phase: undefined }))
        }))
        const activeId = sessions.some((s) => s.id === parsed.activeId)
          ? parsed.activeId
          : sessions[0].id
        return { activeId, sessions }
      }
    }
  } catch {
    /* ignore */
  }
  const s = freshSession()
  return { activeId: s.id, sessions: [s] }
}

function writeStore(store: Store): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}

export function useChat() {
  const [store, setStore] = useState<Store>(() => readStore())
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const storeRef = useRef(store)
  storeRef.current = store

  const active = store.sessions.find((s) => s.id === store.activeId) ?? store.sessions[0]
  const messages = active?.messages ?? [greeting()]

  useEffect(() => {
    writeStore(store)
  }, [store])

  const patchActiveMessages = useCallback(
    (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setStore((prev) => {
        const sessions = prev.sessions.map((s) => {
          if (s.id !== prev.activeId) return s
          const nextMessages = updater(s.messages)
          return {
            ...s,
            messages: nextMessages,
            title: s.renamed ? s.title : titleFromMessages(nextMessages),
            updatedAt: Date.now()
          }
        })
        return { ...prev, sessions }
      })
    },
    []
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setBusy(false)
    patchActiveMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false, phase: undefined } : m))
    )
  }, [patchActiveMessages])

  const newChat = useCallback(() => {
    if (busy) stop()
    setStore((prev) => {
      const s = freshSession()
      // Drop other empty chats so blanks don't pile up; keep anything with content or a custom name.
      const kept = prev.sessions.filter((c) => !isBlank(c) || c.renamed)
      return { activeId: s.id, sessions: [s, ...kept] }
    })
  }, [busy, stop])

  const switchChat = useCallback(
    (id: string) => {
      if (id === storeRef.current.activeId) return
      if (busy) stop()
      setStore((prev) => {
        if (!prev.sessions.some((s) => s.id === id)) return prev
        return { ...prev, activeId: id }
      })
    },
    [busy, stop]
  )

  const deleteChat = useCallback(
    (id: string) => {
      if (busy && id === storeRef.current.activeId) stop()
      setStore((prev) => {
        const remaining = prev.sessions.filter((s) => s.id !== id)
        if (remaining.length === 0) {
          const s = freshSession()
          return { activeId: s.id, sessions: [s] }
        }
        const activeId =
          prev.activeId === id
            ? remaining.sort((a, b) => b.updatedAt - a.updatedAt)[0].id
            : prev.activeId
        return { activeId, sessions: remaining }
      })
    },
    [busy, stop]
  )

  const renameChat = useCallback((id: string, title: string) => {
    const next = title.trim()
    if (!next) return
    setStore((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === id
          ? { ...s, title: next.length > 48 ? `${next.slice(0, 48)}…` : next, renamed: true }
          : s
      )
    }))
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now()
      }
      const assistantId = uid()
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        streaming: true,
        steps: [],
        actions: []
      }

      const history = [...messages, userMsg]
      patchActiveMessages(() => [...history, assistantMsg])
      setBusy(true)

      const controller = new AbortController()
      abortRef.current = controller
      const sessionId = storeRef.current.activeId

      try {
        await activeBackend.send(
          history,
          (delta) => {
            // Only update if still on the same session.
            if (storeRef.current.activeId !== sessionId) return
            patchActiveMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m
                const next = { ...m }
                if (delta.content) next.content += delta.content
                if (delta.action) next.actions = [...(next.actions ?? []), delta.action]
                if (delta.steps) next.steps = delta.steps
                if (delta.step) next.steps = [...(next.steps ?? []), delta.step]
                if (delta.artifacts?.length) {
                  next.artifacts = coalesceArtifacts([
                    ...(next.artifacts ?? []),
                    ...delta.artifacts
                  ])
                }
                if (delta.run) next.run = delta.run
                if ('phase' in delta) next.phase = delta.phase
                if (delta.stepUpdate && next.steps) {
                  next.steps = patchStep(next.steps, delta.stepUpdate.id, {
                    status: delta.stepUpdate.status,
                    durationMs: delta.stepUpdate.durationMs,
                    detail: delta.stepUpdate.detail
                  })
                }
                if (delta.done) next.streaming = false
                return next
              })
            )
          },
          controller.signal
        )
      } catch {
        if (storeRef.current.activeId === sessionId) {
          patchActiveMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    streaming: false,
                    content:
                      m.content ||
                      'Connection to the intelligence backend failed. Check the data plane.'
                  }
                : m
            )
          )
        }
      } finally {
        if (storeRef.current.activeId === sessionId) {
          patchActiveMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false, phase: undefined } : m
            )
          )
        }
        setBusy(false)
        abortRef.current = null
      }
    },
    [busy, messages, patchActiveMessages]
  )

  const sessions = [...store.sessions].sort((a, b) => b.updatedAt - a.updatedAt)

  return {
    messages,
    busy,
    send,
    stop,
    sessions,
    activeId: active?.id ?? store.activeId,
    newChat,
    switchChat,
    deleteChat,
    renameChat
  }
}
