/**
 * Metaphysics canvas vocabulary — Command at the center, data on the left.
 */

export type NodeKind = 'command' | 'feed' | 'transform' | 'agent' | 'action'
export type EdgeKind = 'feeds' | 'reads' | 'produces'
export type EdgeStatus = 'ok' | 'error' | 'stale'

export interface ModelNode {
  id: string
  kind: NodeKind
  label: string
  code: string
  qty: number
  x: number
  y: number
  status?: 'ok' | 'error' | 'stale' | 'unmapped' | 'building' | 'unset'
  detail?: string
  /** Feed subtype once chosen, e.g. csv / static. */
  module?: string
}

export interface ModelEdge {
  id: string
  source: string
  target: string
  kind: EdgeKind
  qty: number
  status: EdgeStatus
  label?: string
}

export interface ModelGraph {
  nodes: ModelNode[]
  edges: ModelEdge[]
}

export const COMMAND_NODE_ID = 'command'

export const NODE_META: Record<
  NodeKind,
  { title: string; color: string; soft: string; hint: string }
> = {
  command: {
    title: 'Command',
    color: '#0f172a',
    soft: '#e2e8f0',
    hint: 'Command Chat — the main AI'
  },
  feed: {
    title: 'Data',
    color: '#0891b2',
    soft: '#cffafe',
    hint: 'Where records come from'
  },
  transform: {
    title: 'Processing',
    color: '#c026d3',
    soft: '#fae8ff',
    hint: 'Reshape data before it reaches Command'
  },
  agent: {
    title: 'AI Agent',
    color: '#b45309',
    soft: '#ffedd5',
    hint: 'An agent that works with data and Command'
  },
  action: {
    title: 'Action',
    color: '#047857',
    soft: '#d1fae5',
    hint: 'A step that does something with results'
  }
}

export function normalizeEdgeStatus(status: EdgeStatus | undefined | null): EdgeStatus {
  if (status === 'error') return 'error'
  if (status === 'stale') return 'stale'
  return 'ok'
}

export const EDGE_FLOW = {
  ok: {
    stroke: '#16a34a',
    className: 'spectr-edge-ok'
  },
  error: {
    stroke: '#dc2626',
    className: 'spectr-edge-error'
  },
  stale: {
    stroke: '#ca8a04',
    className: 'spectr-edge-stale'
  }
} as const

export function isCommandNode(id: string): boolean {
  return id === COMMAND_NODE_ID
}
