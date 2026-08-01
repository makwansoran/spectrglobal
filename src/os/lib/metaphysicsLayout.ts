/**
 * Draft canvas nodes and layout for Metaphysics.
 */

import { COMMAND_NODE_ID } from './model'
import {
  DEFAULT_COMMAND_POSITION,
  type DraftNode,
  type DraftNodeKind,
  type LayoutMap
} from './metaphysicsGraph'

const LAYOUT_KEY = 'spectr-metaphysics-layout-v2'
const DRAFTS_KEY = 'spectr-metaphysics-drafts-v1'

export function readLayout(): LayoutMap {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY)
    if (!raw) return { [COMMAND_NODE_ID]: { ...DEFAULT_COMMAND_POSITION } }
    const parsed = JSON.parse(raw) as LayoutMap
    if (!parsed[COMMAND_NODE_ID]) parsed[COMMAND_NODE_ID] = { ...DEFAULT_COMMAND_POSITION }
    return parsed
  } catch {
    return { [COMMAND_NODE_ID]: { ...DEFAULT_COMMAND_POSITION } }
  }
}

export function writeLayout(layout: LayoutMap): void {
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
}

export function upsertLayout(positions: Array<{ id: string; x: number; y: number }>): LayoutMap {
  const layout = readLayout()
  for (const p of positions) layout[p.id] = { x: p.x, y: p.y }
  writeLayout(layout)
  return layout
}

export function forgetLayout(ids: string[]): void {
  const layout = readLayout()
  for (const id of ids) delete layout[id]
  writeLayout(layout)
}

function normalizeDraft(raw: unknown): DraftNode | null {
  if (!raw || typeof raw !== 'object') return null
  const d = raw as { id?: unknown; label?: unknown; kind?: unknown }
  if (typeof d.id !== 'string' || typeof d.label !== 'string') return null
  const kind: DraftNodeKind =
    d.kind === 'agent' || d.kind === 'action' || d.kind === 'data' ? d.kind : 'data'
  return { id: d.id, label: d.label, kind }
}

export function readDrafts(): DraftNode[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeDraft).filter((d): d is DraftNode => Boolean(d))
  } catch {
    return []
  }
}

export function writeDrafts(drafts: DraftNode[]): void {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function addDraft(draft: DraftNode): DraftNode[] {
  const next = [...readDrafts(), draft]
  writeDrafts(next)
  return next
}

export function removeDraft(id: string): DraftNode[] {
  const next = readDrafts().filter((d) => d.id !== id)
  writeDrafts(next)
  forgetLayout([id])
  return next
}

export function renameDraft(id: string, label: string): DraftNode[] {
  const next = readDrafts().map((d) => (d.id === id ? { ...d, label } : d))
  writeDrafts(next)
  return next
}
