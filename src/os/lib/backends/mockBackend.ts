import type { ChatBackend, StreamDelta } from '../types'

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function streamText(
  reply: string,
  onDelta: (d: StreamDelta) => void,
  signal?: AbortSignal
): Promise<void> {
  const tokens = reply.split(/(\s+)/)
  for (const tok of tokens) {
    if (signal?.aborted) return
    onDelta({ content: tok })
    await delay(12 + Math.random() * 22)
  }
  onDelta({ done: true })
}

const OFFLINE_REPLY =
  'Running offline. Connect a model to Command Chat to author feeds, datasets, and transforms.'

/** Offline stand-in so the shell still responds without a configured model. */
export const mockBackend: ChatBackend = {
  id: 'mock',
  label: 'Simulation',
  async send(_messages, onDelta, signal) {
    await streamText(OFFLINE_REPLY, onDelta, signal)
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Live Command Chat — API key stays in Electron main; renderer only streams deltas.
 */
export const liveBackend: ChatBackend = {
  id: 'live',
  label: 'Command Chat API',
  async send(messages, onDelta, signal) {
    const api = typeof window !== 'undefined' ? window.spectr?.commandChat : undefined
    if (!api) {
      await streamText(OFFLINE_REPLY, onDelta, signal)
      return
    }

    const status = await api.status()
    if (!status.configured) {
      await streamText(
        'Command Chat API key is not configured. Ask an administrator to set SPECTR_COMMAND_CHAT_API_KEY.',
        onDelta,
        signal
      )
      return
    }

    const requestId = uid()
    const turns = messages
      .filter((m) => m.id !== 'boot' && (m.role === 'user' || m.role === 'assistant'))
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    await new Promise<void>((resolve, reject) => {
      let settled = false
      const finish = (): void => {
        if (settled) return
        settled = true
        unsub()
        signal?.removeEventListener('abort', onAbort)
        resolve()
      }

      const onAbort = (): void => {
        void api.abort(requestId)
        finish()
      }

      const unsub = api.onDelta((id, event) => {
        if (id !== requestId) return
        if (event.type === 'content') onDelta({ content: event.text })
        if (event.type === 'error') onDelta({ content: `\n\n${event.message}` })
        if (event.type === 'done') {
          onDelta({ done: true })
          finish()
        }
      })

      if (signal?.aborted) {
        onAbort()
        return
      }
      signal?.addEventListener('abort', onAbort)

      void api.send(requestId, turns).catch((err: unknown) => {
        if (!settled) {
          unsub()
          signal?.removeEventListener('abort', onAbort)
          reject(err instanceof Error ? err : new Error('Command Chat failed'))
        }
      })
    })
  }
}
