import { useEffect, useRef, useState, type JSX } from 'react'
import { History, Plus, X } from 'lucide-react'
import type { ChatSession } from '../lib/useChat'

function formatWhen(t: number): string {
  const d = new Date(t)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface MenuState {
  id: string
  x: number
  y: number
}

/**
 * Floating island over Command chat — open tabs, new chat, history, delete.
 */
export default function ChatTabsIsland({
  sessions,
  activeId,
  onNew,
  onSwitch,
  onDelete,
  onRename
}: {
  sessions: ChatSession[]
  activeId: string
  onNew: () => void
  onSwitch: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}): JSX.Element {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [enteringIds, setEnteringIds] = useState<Set<string>>(() => new Set())
  const rootRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLInputElement>(null)
  const knownIdsRef = useRef<Set<string> | null>(null)

  // Animate tabs that appear after the first paint (new chat / reopen).
  useEffect(() => {
    const ids = new Set(sessions.map((s) => s.id))
    if (knownIdsRef.current == null) {
      knownIdsRef.current = ids
      return
    }
    const fresh: string[] = []
    for (const id of ids) {
      if (!knownIdsRef.current.has(id)) fresh.push(id)
    }
    knownIdsRef.current = ids
    if (fresh.length === 0) return
    setEnteringIds((prev) => {
      const next = new Set(prev)
      for (const id of fresh) next.add(id)
      return next
    })
    const timer = window.setTimeout(() => {
      setEnteringIds((prev) => {
        const next = new Set(prev)
        for (const id of fresh) next.delete(id)
        return next
      })
    }, 280)
    return () => window.clearTimeout(timer)
  }, [sessions])

  useEffect(() => {
    if (!historyOpen && !menu) return
    const onDoc = (e: MouseEvent): void => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setHistoryOpen(false)
        setMenu(null)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [historyOpen, menu])

  useEffect(() => {
    if (editingId) editRef.current?.focus()
  }, [editingId])

  const openMenu = (e: React.MouseEvent, id: string): void => {
    e.preventDefault()
    e.stopPropagation()
    setHistoryOpen(false)
    setMenu({ id, x: e.clientX, y: e.clientY })
  }

  const startRename = (id: string): void => {
    const s = sessions.find((c) => c.id === id)
    setEditValue(s?.title ?? '')
    setEditingId(id)
    setMenu(null)
  }

  const commitRename = (): void => {
    if (editingId) {
      onRename(editingId, editValue)
      setEditingId(null)
    }
  }

  // Keep a few recent as open tabs; rest live in history.
  const tabs = sessions.slice(0, 6)

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-2xl px-6 pt-3">
      <div className="flex items-center gap-1 rounded-full bg-white px-1.5 py-1 shadow-panel">
        <button
          type="button"
          title="Chat history"
          onClick={() => {
            setMenu(null)
            setHistoryOpen((o) => !o)
          }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            historyOpen ? 'bg-base-600 text-ink' : 'text-ink-faint hover:bg-base-600 hover:text-ink'
          }`}
        >
          <History className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>

        <div className="scrollbar-invisible flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {tabs.map((s) => {
            const active = s.id === activeId
            const editing = editingId === s.id
            return (
              <div
                key={s.id}
                onContextMenu={(e) => openMenu(e, s.id)}
                className={`group flex max-w-[160px] shrink-0 items-center rounded-full pl-3 pr-1 ${
                  active ? 'bg-base-600' : 'hover:bg-base-600/70'
                } ${enteringIds.has(s.id) ? 'chat-tab-enter' : ''}`}
              >
                {editing ? (
                  <input
                    ref={editRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        commitRename()
                      }
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="min-w-0 flex-1 bg-transparent py-1.5 text-[12px] font-medium text-ink outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSwitch(s.id)}
                    className={`min-w-0 flex-1 truncate py-1.5 text-left text-[12px] ${
                      active ? 'font-medium text-ink' : 'text-ink-dim'
                    }`}
                    title={s.title}
                  >
                    {s.title}
                  </button>
                )}
                <button
                  type="button"
                  title="Delete chat"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(s.id)
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-faint opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          title="New chat"
          onClick={onNew}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-base-600 hover:text-ink"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {historyOpen ? (
        <div className="absolute left-6 right-6 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white shadow-panel">
          <div className="border-b border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            History
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {sessions.length === 0 ? (
              <li className="px-3 py-3 text-[12px] text-ink-faint">No chats yet.</li>
            ) : (
              sessions.map((s) => (
                <li key={s.id}>
                  <div
                    onContextMenu={(e) => openMenu(e, s.id)}
                    className={`group flex items-center gap-2 px-2 py-1 ${
                      s.id === activeId ? 'bg-base-600/80' : ''
                    }`}
                  >
                    {editingId === s.id ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            commitRename()
                          }
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="min-w-0 flex-1 rounded-md bg-base-700 px-2 py-1.5 text-[13px] text-ink outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSwitch(s.id)
                          setHistoryOpen(false)
                        }}
                        className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-left hover:bg-base-600/70"
                      >
                        <span className="block truncate text-[13px] text-ink">{s.title}</span>
                        <span className="block font-mono text-[10px] text-ink-faint">
                          {formatWhen(s.updatedAt)}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDelete(s.id)}
                      className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-faint opacity-0 transition-opacity hover:text-signal-red group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {menu ? (
        <div
          className="fixed z-50 min-w-[140px] overflow-hidden rounded-lg bg-white py-1 shadow-panel"
          style={{ left: menu.x, top: menu.y }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left text-[13px] text-ink hover:bg-base-600"
            onClick={() => startRename(menu.id)}
          >
            Rename
          </button>
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left text-[13px] text-signal-red hover:bg-base-600"
            onClick={() => {
              onDelete(menu.id)
              setMenu(null)
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  )
}
