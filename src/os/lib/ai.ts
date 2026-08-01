import type { ChatBackend } from './types'
import { commandBackend } from './backends/commandBackend'
import { liveBackend, mockBackend } from './backends/mockBackend'

/**
 * Central registry of available AI backends.
 * Command defaults to the tool-using agent runtime; the older prose-only and
 * simulated backends stay registered for offline demos.
 */
const backends: Record<string, ChatBackend> = {
  [commandBackend.id]: commandBackend,
  [liveBackend.id]: liveBackend,
  [mockBackend.id]: mockBackend
}

export let activeBackend: ChatBackend = commandBackend

export function setActiveBackend(id: string): void {
  const next = backends[id]
  if (next) activeBackend = next
}

export function listBackends(): ChatBackend[] {
  return Object.values(backends)
}

export function registerBackend(backend: ChatBackend): void {
  backends[backend.id] = backend
}
