/**
 * The agent runtime.
 *
 * The model runs in the Electron main process (that is where the API key is),
 * but every tool executes here in the renderer, where platform state lives. This
 * loop drives that handshake: stream a turn, run whatever tools the model asked
 * for, feed the results back, repeat until it answers in prose.
 */

import type { Artifact } from '../artifacts'
import { buildDatabaseBrief } from '../dataApi'
import { executeTool } from '../tools/execute'
import { toolSchemas } from '../tools/registry'
import type { AgentStep, ChatMessage, StreamDelta } from '../types'
import { agentFor } from './agents'
import type { ChatTurn, ToolCall } from './protocol'

const MAX_TURNS = 6

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Bridge to the locked main-process model, one turn at a time. */
async function runModelTurn(
  turns: ChatTurn[],
  onText: (text: string) => void,
  signal?: AbortSignal
): Promise<{ calls: ToolCall[]; stop: 'end' | 'tools'; error?: string }> {
  const api = window.spectr?.commandChat
  if (!api) return { calls: [], stop: 'end', error: 'Command Chat bridge unavailable.' }

  const requestId = uid()
  const calls: ToolCall[] = []
  let stop: 'end' | 'tools' = 'end'
  let error: string | undefined

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
      if (event.type === 'content') onText(event.text)
      else if (event.type === 'tool_call') calls.push(event.call)
      else if (event.type === 'error') error = event.message
      else if (event.type === 'done') {
        stop = event.stop
        finish()
      }
    })

    if (signal?.aborted) {
      onAbort()
      return
    }
    signal?.addEventListener('abort', onAbort)

    void api.send(requestId, turns, toolSchemas()).catch((err: unknown) => {
      if (settled) return
      unsub()
      signal?.removeEventListener('abort', onAbort)
      reject(err instanceof Error ? err : new Error('Command Chat failed'))
    })
  })

  return { calls, stop, error }
}

/** Chat history → provider-neutral turns. */
function seedTurns(messages: ChatMessage[]): ChatTurn[] {
  return messages
    .filter((m) => m.id !== 'boot')
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
}

/**
 * Tool payloads can be large (a full order graph). Keep them useful to the
 * model but bounded, so a long session does not blow the context window.
 */
function serializeResult(data: unknown): string {
  let json: string
  try {
    json = JSON.stringify(data)
  } catch {
    return '{"error":"unserializable"}'
  }
  if (json.length <= 6000) return json
  return `${json.slice(0, 6000)}…(truncated)`
}

export async function runCommand(
  messages: ChatMessage[],
  onDelta: (delta: StreamDelta) => void,
  signal?: AbortSignal
): Promise<void> {
  const startedAt = Date.now()
  const turns = seedTurns(messages)
  const dbBrief = await buildDatabaseBrief(12)
  turns.unshift({ role: 'system', content: dbBrief })
  const steps: AgentStep[] = []
  const agents = new Set<string>()
  let toolCallCount = 0

  const pushStep = (step: AgentStep): void => {
    steps.push(step)
    onDelta({ steps: [...steps] })
  }

  const patch = (id: string, patchFields: Partial<AgentStep>): void => {
    const i = steps.findIndex((s) => s.id === id)
    if (i >= 0) {
      steps[i] = { ...steps[i], ...patchFields }
      onDelta({ steps: [...steps] })
    }
  }

  onDelta({ phase: 'Reading the floor' })

  for (let iteration = 0; iteration < MAX_TURNS; iteration++) {
    if (signal?.aborted) return

    let assistantText = ''
    const { calls, error } = await runModelTurn(
      turns,
      (text) => {
        assistantText += text
        onDelta({ content: text })
      },
      signal
    )

    if (signal?.aborted) return

    if (error) {
      onDelta({ content: assistantText ? `\n\n${error}` : error, done: true })
      return
    }

    if (!calls.length) {
      onDelta({
        phase: undefined,
        run: {
          agents: [...agents],
          toolCalls: toolCallCount,
          durationMs: Date.now() - startedAt
        },
        done: true
      })
      return
    }

    // Model wants work done — record the assistant turn with its tool calls.
    turns.push({ role: 'assistant', content: assistantText, toolCalls: calls })

    onDelta({
      phase:
        calls.length === 1
          ? `Running ${agentFor(calls[0].name).replace(' Agent', '')}`
          : `Dispatching ${calls.length} agents`
    })

    for (const call of calls) {
      if (signal?.aborted) return

      const actor = agentFor(call.name)
      agents.add(actor)
      toolCallCount += 1

      const stepId = `step-${call.id || uid()}`
      pushStep({
        id: stepId,
        label: actor,
        detail: call.name,
        kind: call.name.startsWith('query') || call.name.startsWith('get') ? 'query' : 'dispatch',
        status: 'running'
      })

      const result = await executeTool(call.name, call.args ?? {}, { actor })

      patch(stepId, {
        status: result.ok ? 'done' : 'error',
        durationMs: result.durationMs,
        detail: result.summary
      })

      if (result.artifacts?.length) {
        onDelta({ artifacts: result.artifacts as Artifact[] })
      }

      turns.push({
        role: 'tool',
        toolCallId: call.id,
        content: serializeResult(result.data)
      } satisfies ChatTurn)
    }

    onDelta({ phase: 'Composing the brief' })
  }

  onDelta({
    phase: undefined,
    run: { agents: [...agents], toolCalls: toolCallCount, durationMs: Date.now() - startedAt },
    content: '\n\nI stopped after several rounds of work to avoid looping. Ask me to continue if you need more.',
    done: true
  })
}
