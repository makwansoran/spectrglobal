/**
 * Legacy model graph API — kept for IPC compatibility with main-process db.
 * Metaphysics no longer uses this for the canvas.
 */

export type NodeKind = 'command' | 'feed' | 'transform' | 'dataset' | 'objectType' | 'linkType' | 'agent' | 'data' | 'execution' | 'tool'
export type EdgeKind = string
export type EdgeStatus = 'ok' | 'error' | 'stale'

export interface ModelNode {
  id: string
  kind: NodeKind
  label: string
  code: string
  qty: number
  x: number
  y: number
  purpose?: string
}

export interface ModelEdge {
  id: string
  source: string
  target: string
  kind: EdgeKind
  qty: number
  status: EdgeStatus
}

export interface ModelGraph {
  nodes: ModelNode[]
  edges: ModelEdge[]
}

export interface CreateNodeInput {
  kind: NodeKind
  label: string
  code?: string
  qty?: number
  x?: number
  y?: number
}

export interface UpdateNodeInput {
  id: string
  label?: string
  code?: string
  qty?: number
  x?: number
  y?: number
  purpose?: string
}

export interface CreateEdgeInput {
  source: string
  target: string
  kind?: EdgeKind
  qty?: number
  status?: EdgeStatus
}

export interface UpdateEdgeInput {
  id: string
  status?: EdgeStatus
  qty?: number
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const KEY = 'spectr-model-v5'

function readLocal(): ModelGraph {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ModelGraph
      if (parsed.nodes && parsed.edges) return parsed
    }
  } catch {
    /* ignore */
  }
  const graph: ModelGraph = { nodes: [], edges: [] }
  localStorage.setItem(KEY, JSON.stringify(graph))
  return graph
}

function writeLocal(graph: ModelGraph): void {
  localStorage.setItem(KEY, JSON.stringify(graph))
}

const localApi = {
  async getGraph(): Promise<ModelGraph> {
    return readLocal()
  },
  async createNode(input: CreateNodeInput): Promise<ModelNode> {
    const graph = readLocal()
    const node: ModelNode = {
      id: uid(),
      kind: input.kind,
      label: input.label,
      code: input.code ?? '',
      qty: input.qty ?? 0,
      x: input.x ?? 120,
      y: input.y ?? 120
    }
    graph.nodes.push(node)
    writeLocal(graph)
    return node
  },
  async updateNode(input: UpdateNodeInput): Promise<ModelNode | null> {
    const graph = readLocal()
    const idx = graph.nodes.findIndex((n) => n.id === input.id)
    if (idx < 0) return null
    graph.nodes[idx] = { ...graph.nodes[idx], ...input }
    writeLocal(graph)
    return graph.nodes[idx]
  },
  async deleteNode(id: string): Promise<boolean> {
    const graph = readLocal()
    const before = graph.nodes.length
    graph.nodes = graph.nodes.filter((n) => n.id !== id)
    graph.edges = graph.edges.filter((e) => e.source !== id && e.target !== id)
    writeLocal(graph)
    return graph.nodes.length < before
  },
  async ensureFixedEndpoints(): Promise<ModelGraph> {
    return readLocal()
  },
  async createEdge(input: CreateEdgeInput): Promise<ModelEdge | null> {
    const graph = readLocal()
    const edge: ModelEdge = {
      id: uid(),
      source: input.source,
      target: input.target,
      kind: input.kind ?? 'link',
      qty: input.qty ?? 0,
      status: input.status ?? 'ok'
    }
    graph.edges.push(edge)
    writeLocal(graph)
    return edge
  },
  async updateEdge(input: UpdateEdgeInput): Promise<ModelEdge | null> {
    const graph = readLocal()
    const idx = graph.edges.findIndex((e) => e.id === input.id)
    if (idx < 0) return null
    graph.edges[idx] = { ...graph.edges[idx], ...input }
    writeLocal(graph)
    return graph.edges[idx]
  },
  async deleteEdge(id: string): Promise<boolean> {
    const graph = readLocal()
    const before = graph.edges.length
    graph.edges = graph.edges.filter((e) => e.id !== id)
    writeLocal(graph)
    return graph.edges.length < before
  },
  async updatePositions(positions: Array<{ id: string; x: number; y: number }>): Promise<boolean> {
    const graph = readLocal()
    const map = new Map(positions.map((p) => [p.id, p]))
    graph.nodes = graph.nodes.map((n) => {
      const p = map.get(n.id)
      return p ? { ...n, x: p.x, y: p.y } : n
    })
    writeLocal(graph)
    return true
  }
}

export type ModelApi = typeof localApi

export function getModelApi(): ModelApi {
  if (typeof window !== 'undefined' && window.spectr?.model) {
    return window.spectr.model as unknown as ModelApi
  }
  return localApi
}
