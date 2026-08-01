/**
 * Decision objects — the only things a human is asked to do.
 *
 * The risk gate parks high-impact tool calls here instead of executing them.
 * Choosing an option resolves the decision and hands the chosen branch back to
 * the runtime, which then executes it autonomously.
 */

import type { DecisionObject, DecisionOption, ObjectRef, RiskLevel } from './commandTypes'

const KEY = 'spectr-decisions-v1'

type Listener = (decisions: DecisionObject[]) => void

const listeners = new Set<Listener>()

function read(): DecisionObject[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DecisionObject[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* fall through to empty */
  }
  return []
}

function write(list: DecisionObject[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
  for (const fn of listeners) fn(list)
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function subscribeDecisions(fn: Listener): () => void {
  listeners.add(fn)
  fn(read())
  return () => listeners.delete(fn)
}

export function listDecisions(): DecisionObject[] {
  return read().sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
    const rank: Record<RiskLevel, number> = { critical: 0, watch: 1, normal: 2 }
    if (a.urgency !== b.urgency) return rank[a.urgency] - rank[b.urgency]
    return b.createdAt - a.createdAt
  })
}

export function pendingDecisions(): DecisionObject[] {
  return listDecisions().filter((d) => d.status === 'pending')
}

export function getDecision(id: string): DecisionObject | null {
  return read().find((d) => d.id === id) ?? null
}

export interface RaiseDecisionInput {
  question: string
  context: string
  subject: ObjectRef
  urgency: RiskLevel
  rationale: string
  recommendedOptionId: string
  options: DecisionOption[]
}

export function raiseDecision(input: RaiseDecisionInput): DecisionObject {
  const list = read()

  // One open decision per subject — the queue stays a to-do list, not a flood.
  const duplicate = list.find(
    (d) => d.status === 'pending' && d.subject.ref === input.subject.ref
  )
  if (duplicate) return duplicate

  const decision: DecisionObject = {
    id: `dec-${uid()}`,
    createdAt: Date.now(),
    status: 'pending',
    ...input
  }
  write([decision, ...list])
  return decision
}

export function resolveDecision(
  id: string,
  optionId: string,
  outcome?: string
): DecisionObject | null {
  const list = read()
  const i = list.findIndex((d) => d.id === id)
  if (i < 0) return null
  list[i] = {
    ...list[i],
    status: 'resolved',
    chosenOptionId: optionId,
    resolvedAt: Date.now(),
    outcome
  }
  write(list)
  return list[i]
}

export function clearResolvedDecisions(): void {
  write(read().filter((d) => d.status === 'pending'))
}

/** Wipe the queue — used when autonomy was too noisy and we need a clean slate. */
export function clearPendingDecisions(): void {
  write(read().filter((d) => d.status !== 'pending'))
}
