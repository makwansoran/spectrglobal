/**
 * Append-only audit of every tool call the agents make. Also the source for the
 * "Agent Activity" rail, so autonomous work is visible without being asked.
 */

import type { AuditEntry, AuditTier } from './commandTypes'

const KEY = 'spectr-audit-v1'
const MAX = 300

type Listener = (entries: AuditEntry[]) => void

const listeners = new Set<Listener>()

function read(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AuditEntry[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* fall through to empty */
  }
  return []
}

function write(list: AuditEntry[]): void {
  const trimmed = list.slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  for (const fn of listeners) fn(trimmed)
}

export function subscribeAudit(fn: Listener): () => void {
  listeners.add(fn)
  fn(read())
  return () => listeners.delete(fn)
}

export function listAudit(limit = 60): AuditEntry[] {
  return read().slice(0, limit)
}

export function recordAudit(entry: {
  actor: string
  tool: string
  tier: AuditTier
  summary: string
  subjectRef?: string
  ok: boolean
  detail?: string
}): AuditEntry {
  const row: AuditEntry = {
    id: Math.random().toString(36).slice(2, 10),
    at: Date.now(),
    ...entry
  }
  write([row, ...read()])
  return row
}

export function clearAudit(): void {
  write([])
}
