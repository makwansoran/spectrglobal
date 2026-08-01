import type { Artifact } from './artifacts'

export type Role = 'user' | 'assistant' | 'system'

export type AgentStepStatus = 'pending' | 'running' | 'done' | 'error' | 'skipped'

/** What SPECTR is doing in the WMS control loop. */
export type AgentStepKind =
  | 'intent'
  | 'query'
  | 'plan'
  | 'dispatch'
  | 'verify'
  | 'tool'
  | 'analysis'

export interface AgentStep {
  id: string
  label: string
  detail?: string
  kind: AgentStepKind
  status: AgentStepStatus
  /** Wall time for this step when completed. */
  durationMs?: number
  /** Nested sub-tasks (e.g. per-SKU query, per-dock scan). */
  children?: AgentStep[]
}

/**
 * @deprecated Prefer AgentStep trees. Kept for older deltas.
 */
export interface AgentAction {
  id: string
  label: string
  kind: 'query' | 'mutation' | 'navigation' | 'analysis'
  status: 'proposed' | 'running' | 'done' | 'error'
  detail?: string
}

/** Telemetry for the collapsed agent run summary. */
export interface AgentRunSummary {
  agents: string[]
  toolCalls: number
  durationMs: number
}

export interface ChatMessage {
  id: string
  role: Role
  content: string
  createdAt: number
  actions?: AgentAction[]
  /** Multi-step agent execution tree for this reply. */
  steps?: AgentStep[]
  /** Structured result blocks: tables, decisions, confirms. */
  artifacts?: Artifact[]
  /** Who ran and how much work it took. */
  run?: AgentRunSummary
  /** What the orchestrator is doing right now, for the live status strip. */
  phase?: string
  streaming?: boolean
}

export interface StreamDelta {
  content?: string
  action?: AgentAction
  /** Full step tree (replace) or single node upsert into tree. */
  steps?: AgentStep[]
  stepUpdate?: {
    id: string
    status: AgentStepStatus
    durationMs?: number
    detail?: string
  }
  /** Appended to the message as they are produced by tools. */
  artifacts?: Artifact[]
  /** Appended one at a time as the runtime plans work. */
  step?: AgentStep
  run?: AgentRunSummary
  phase?: string
  done?: boolean
}

export interface ChatBackend {
  readonly id: string
  readonly label: string
  send(
    messages: ChatMessage[],
    onDelta: (delta: StreamDelta) => void,
    signal?: AbortSignal
  ): Promise<void>
}
