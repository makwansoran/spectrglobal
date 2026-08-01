import type { ChatBackend } from '../types'
import { runCommand } from '../runtime/orchestrator'

/**
 * Live Command — the tool-using agent runtime. The API key stays in Electron
 * main; every tool runs here against platform state.
 */
export const commandBackend: ChatBackend = {
  id: 'command',
  label: 'Spectr Command',
  async send(messages, onDelta, signal) {
    const api = typeof window !== 'undefined' ? window.spectr?.commandChat : undefined

    if (!api) {
      onDelta({
        content:
          'Command is starting up. Refresh if this persists.',
        done: true
      })
      return
    }

    const status = await api.status()
    if (!status.configured) {
      onDelta({
        content:
          'Command chat is not configured. Set SPECTR_COMMAND_CHAT_API_KEY on the server and reload.',
        done: true
      })
      return
    }

    await runCommand(messages, onDelta, signal)
  }
}
