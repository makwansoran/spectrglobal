/** Tree helpers for the agent step timeline. */

import type { AgentStep, AgentStepStatus } from './types'

export function flattenSteps(steps: AgentStep[]): AgentStep[] {
  const out: AgentStep[] = []
  const walk = (list: AgentStep[]): void => {
    for (const s of list) {
      out.push(s)
      if (s.children?.length) walk(s.children)
    }
  }
  walk(steps)
  return out
}

export function patchStep(
  steps: AgentStep[],
  id: string,
  patch: Partial<Pick<AgentStep, 'status' | 'durationMs' | 'detail'>>
): AgentStep[] {
  return steps.map((s) => {
    if (s.id === id) return { ...s, ...patch }
    if (s.children?.length) {
      return { ...s, children: patchStep(s.children, id, patch) }
    }
    return s
  })
}

export function stepsProgress(steps: AgentStep[]): {
  total: number
  done: number
  running: number
  errored: number
} {
  const flat = flattenSteps(steps)
  return {
    total: flat.length,
    done: flat.filter((s) => s.status === 'done' || s.status === 'skipped').length,
    running: flat.filter((s) => s.status === 'running').length,
    errored: flat.filter((s) => s.status === 'error').length
  }
}

export function statusLabel(status: AgentStepStatus): string {
  if (status === 'done') return 'Done'
  if (status === 'running') return 'Running'
  if (status === 'error') return 'Error'
  if (status === 'skipped') return 'Skipped'
  return 'Pending'
}
