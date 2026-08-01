/**
 * Command-centric Metaphysics projection.
 *
 * Command sits in the middle. Data feeds and processing live on the left and
 * flow into Command.
 */

import type { BuildStatus, FeedDef, PlatformSnapshot, TransformConfig } from '@/os/shared/platform'
import {
  COMMAND_NODE_ID,
  type EdgeStatus,
  type ModelEdge,
  type ModelGraph,
  type ModelNode
} from './model'

export type LayoutMap = Record<string, { x: number; y: number }>

export const DEFAULT_COMMAND_POSITION = { x: 520, y: 280 }

function buildStatus(status: BuildStatus | undefined): ModelNode['status'] {
  if (status === 'error') return 'error'
  if (status === 'stale' || status === 'building') return status === 'building' ? 'building' : 'stale'
  return 'ok'
}

function edgeStatusFrom(...statuses: Array<BuildStatus | ModelNode['status'] | undefined>): EdgeStatus {
  if (statuses.some((s) => s === 'error')) return 'error'
  if (statuses.some((s) => s === 'stale' || s === 'building' || s === 'unset')) return 'stale'
  return 'ok'
}

function transformInputIds(config: TransformConfig): string[] {
  switch (config.kind) {
    case 'union':
      return config.inputs.filter(Boolean)
    case 'join':
      return [config.left, config.right].filter(Boolean)
    case 'filter':
    case 'select':
    case 'aggregate':
      return config.input ? [config.input] : []
  }
}

const FEED_MODULE_LABEL: Record<string, string> = {
  csv: 'CSV',
  excel: 'Excel',
  json: 'JSON',
  xml: 'XML',
  sql: 'SQL',
  'http.poll': 'HTTP poll',
  'http.push': 'HTTP push',
  'db.table': 'Database table',
  static: 'Static'
}

/** Canvas-only nodes not yet persisted as platform entities (except data → feed). */
export type DraftNodeKind = 'data' | 'agent' | 'action'

export interface DraftNode {
  id: string
  label: string
  kind: DraftNodeKind
}

/** @deprecated use DraftNode — kept for older localStorage payloads */
export type DraftFeed = DraftNode

function draftModelKind(kind: DraftNodeKind): ModelNode['kind'] {
  if (kind === 'agent') return 'agent'
  if (kind === 'action') return 'action'
  return 'feed'
}

export function projectMetaphysics(
  snapshot: PlatformSnapshot,
  layout: LayoutMap = {},
  drafts: DraftNode[] = []
): ModelGraph {
  const commandPos = layout[COMMAND_NODE_ID] ?? DEFAULT_COMMAND_POSITION

  const nodes: ModelNode[] = [
    {
      id: COMMAND_NODE_ID,
      kind: 'command',
      label: 'Command',
      code: 'command.chat',
      qty: 0,
      x: commandPos.x,
      y: commandPos.y,
      status: 'ok',
      detail: 'Main AI'
    }
  ]

  const edges: ModelEdge[] = []

  /** Dataset id → feed id, for wiring transforms back to feed nodes. */
  const feedByDataset = new Map<string, string>()
  for (const feed of snapshot.feeds) {
    feedByDataset.set(feed.datasetId, feed.id)
  }

  /** Feed ids that already flow through a processing node into Command. */
  const feedsViaTransform = new Set<string>()

  snapshot.transforms.forEach((transform, index) => {
    const inputDatasets = transformInputIds(transform.config)
    const sourceFeeds = inputDatasets
      .map((datasetId) => feedByDataset.get(datasetId))
      .filter((id): id is string => Boolean(id))

    for (const feedId of sourceFeeds) feedsViaTransform.add(feedId)

    const output = snapshot.datasets.find((d) => d.id === transform.outputDatasetId)
    const pos = layout[transform.id] ?? {
      x: commandPos.x - 280,
      y: commandPos.y + (index - (snapshot.transforms.length - 1) / 2) * 120
    }

    nodes.push({
      id: transform.id,
      kind: 'transform',
      label: transform.label,
      code: transform.code,
      qty: output?.rowCount ?? 0,
      x: pos.x,
      y: pos.y,
      status: buildStatus(transform.status),
      detail: transform.error ?? transform.kind,
      module: transform.kind
    })

    for (const feedId of sourceFeeds) {
      edges.push({
        id: `reads:${feedId}:${transform.id}`,
        source: feedId,
        target: transform.id,
        kind: 'reads',
        qty: 0,
        status: edgeStatusFrom(transform.status),
        label: 'into'
      })
    }

    edges.push({
      id: `feeds:${transform.id}:${COMMAND_NODE_ID}`,
      source: transform.id,
      target: COMMAND_NODE_ID,
      kind: 'feeds',
      qty: 0,
      status: edgeStatusFrom(transform.status, output?.status),
      label: 'to Command'
    })
  })

  const dataDrafts = drafts.filter((d) => d.kind === 'data' || !d.kind)
  const otherDrafts = drafts.filter((d) => d.kind === 'agent' || d.kind === 'action')

  const feedSlots = [
    ...dataDrafts.map((d) => ({ draft: d, feed: null as FeedDef | null })),
    ...snapshot.feeds.map((f) => ({ draft: null as DraftNode | null, feed: f }))
  ]

  feedSlots.forEach((slot, index) => {
    if (slot.draft) {
      const pos = layout[slot.draft.id] ?? {
        x: commandPos.x - 520,
        y: commandPos.y + (index - (feedSlots.length - 1) / 2) * 120
      }
      nodes.push({
        id: slot.draft.id,
        kind: 'feed',
        label: slot.draft.label,
        code: '',
        qty: 0,
        x: pos.x,
        y: pos.y,
        status: 'unset',
        detail: 'Choose a source'
      })
      edges.push({
        id: `feeds:${slot.draft.id}:${COMMAND_NODE_ID}`,
        source: slot.draft.id,
        target: COMMAND_NODE_ID,
        kind: 'feeds',
        qty: 0,
        status: 'stale',
        label: 'to Command'
      })
      return
    }

    const feed = slot.feed!
    const pos = layout[feed.id] ?? {
      x: commandPos.x - 520,
      y: commandPos.y + (index - (feedSlots.length - 1) / 2) * 120
    }
    const dataset = snapshot.datasets.find((d) => d.id === feed.datasetId)
    nodes.push({
      id: feed.id,
      kind: 'feed',
      label: feed.label,
      code: feed.code,
      qty: dataset?.rowCount ?? 0,
      x: pos.x,
      y: pos.y,
      status: buildStatus(feed.status),
      detail: feed.error ?? FEED_MODULE_LABEL[feed.kind] ?? feed.kind,
      module: feed.kind
    })

    // Feeds already entering Command through a transform don't need a direct edge.
    if (feedsViaTransform.has(feed.id)) return

    edges.push({
      id: `feeds:${feed.id}:${COMMAND_NODE_ID}`,
      source: feed.id,
      target: COMMAND_NODE_ID,
      kind: 'feeds',
      qty: 0,
      status: edgeStatusFrom(feed.status, dataset?.status),
      label: 'to Command'
    })
  })

  otherDrafts.forEach((draft, index) => {
    const pos = layout[draft.id] ?? {
      x: commandPos.x + 280,
      y: commandPos.y + (index - (otherDrafts.length - 1) / 2) * 120
    }
    nodes.push({
      id: draft.id,
      kind: draftModelKind(draft.kind),
      label: draft.label,
      code: '',
      qty: 0,
      x: pos.x,
      y: pos.y,
      status: 'unset',
      detail: draft.kind === 'agent' ? 'Configure agent' : 'Configure action'
    })
  })

  return { nodes, edges }
}

export function layoutFromGraph(graph: ModelGraph): LayoutMap {
  const layout: LayoutMap = {}
  for (const node of graph.nodes) {
    layout[node.id] = { x: node.x, y: node.y }
  }
  return layout
}
