/**
 * Cross-view navigation into Command with a pending object focus.
 *
 * Dashboard widgets and Model canvas nodes call requestSituation(ref); App
 * switches to Command; CommandView consumes the pending ref once and asks the
 * agent about it.
 */

type Listener = (ref: string | null) => void

let pendingRef: string | null = null
const listeners = new Set<Listener>()
const navListeners = new Set<() => void>()

export function requestSituation(ref: string): void {
  const cleaned = ref.trim()
  if (!cleaned) return
  pendingRef = cleaned
  for (const fn of listeners) fn(pendingRef)
  for (const fn of navListeners) fn()
}

export function consumePendingSituation(): string | null {
  const next = pendingRef
  pendingRef = null
  for (const fn of listeners) fn(null)
  return next
}

export function peekPendingSituation(): string | null {
  return pendingRef
}

/** CommandView / useChat subscribe to open the sitrep when a ref arrives. */
export function onSituationRequest(fn: Listener): () => void {
  listeners.add(fn)
  if (pendingRef) fn(pendingRef)
  return () => listeners.delete(fn)
}

/** App subscribes to flip the active view to Command. */
export function onNavigateToCommand(fn: () => void): () => void {
  navListeners.add(fn)
  return () => navListeners.delete(fn)
}
