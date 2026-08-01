/**
 * Confirm actions — one-tap approve/abort for a pending tool call.
 * Spectr parks the work here; the operator hits green or red.
 */

export interface ConfirmAction {
  id: string
  title: string
  /** Plain-English command shown in the box, e.g. "Delete table employees". */
  command: string
  detail?: string
  confirmLabel: string
  abortLabel: string
  tool?: string
  args?: Record<string, unknown>
  status: 'pending' | 'confirmed' | 'aborted'
  createdAt: number
  resolvedAt?: number
  /** Set after confirm runs the parked tool. */
  resultSummary?: string
}

type Listener = (all: ConfirmAction[]) => void

const KEY = 'spectr-confirms-v1'
const listeners = new Set<Listener>()

function read(): ConfirmAction[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ConfirmAction[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  return []
}

function write(list: ConfirmAction[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
  for (const fn of listeners) fn(list)
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function subscribeConfirms(fn: Listener): () => void {
  listeners.add(fn)
  fn(read())
  return () => listeners.delete(fn)
}

export function getConfirm(id: string): ConfirmAction | null {
  return read().find((c) => c.id === id) ?? null
}

export function raiseConfirm(input: {
  title: string
  command: string
  detail?: string
  confirmLabel?: string
  abortLabel?: string
  tool?: string
  args?: Record<string, unknown>
}): ConfirmAction {
  const list = read()
  const action: ConfirmAction = {
    id: uid(),
    title: input.title.trim() || 'Confirm',
    command: input.command.trim(),
    detail: input.detail?.trim() || undefined,
    confirmLabel: input.confirmLabel?.trim() || 'Yes, continue',
    abortLabel: input.abortLabel?.trim() || 'Abort',
    tool: input.tool,
    args: input.args,
    status: 'pending',
    createdAt: Date.now()
  }
  write([action, ...list].slice(0, 40))
  return action
}

export function resolveConfirm(
  id: string,
  status: 'confirmed' | 'aborted',
  resultSummary?: string
): ConfirmAction | null {
  const list = read()
  const idx = list.findIndex((c) => c.id === id)
  if (idx < 0) return null
  if (list[idx].status !== 'pending') return list[idx]
  const next: ConfirmAction = {
    ...list[idx],
    status,
    resolvedAt: Date.now(),
    ...(resultSummary ? { resultSummary } : {})
  }
  list[idx] = next
  write(list)
  return next
}

/** Update outcome even after a failed confirm (for Retry). */
export function setConfirmOutcome(
  id: string,
  status: 'confirmed' | 'aborted',
  resultSummary?: string
): ConfirmAction | null {
  const list = read()
  const idx = list.findIndex((c) => c.id === id)
  if (idx < 0) return null
  const next: ConfirmAction = {
    ...list[idx],
    status,
    resolvedAt: Date.now(),
    ...(resultSummary !== undefined ? { resultSummary } : {})
  }
  list[idx] = next
  write(list)
  return next
}

export function patchConfirmResult(id: string, resultSummary: string): void {
  const list = read()
  const idx = list.findIndex((c) => c.id === id)
  if (idx < 0) return
  list[idx] = { ...list[idx], resultSummary }
  write(list)
}
