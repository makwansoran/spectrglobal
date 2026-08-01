/**
 * Wire types shared with the Electron main process. Kept structurally identical
 * to the preload definitions so the renderer does not have to import across
 * tsconfig project boundaries.
 */

export interface ToolCall {
  id: string
  name: string
  args: Record<string, unknown>
}

export interface ToolSchema {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export type ChatTurn =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; toolCalls?: ToolCall[] }
  | { role: 'system'; content: string }
  | { role: 'tool'; toolCallId: string; name?: string; content: string }

export type CommandChatStreamEvent =
  | { type: 'content'; text: string }
  | { type: 'tool_call'; call: ToolCall }
  | { type: 'done'; stop: 'end' | 'tools' }
  | { type: 'error'; message: string }
