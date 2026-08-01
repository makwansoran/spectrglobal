import { useState } from 'react'
import type { JSX } from 'react'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import type { AgentRunSummary, AgentStep } from '../lib/types'
import AgentStepsTimeline from './AgentStepsTimeline'

/**
 * Collapsed by default: the operator sees that work happened and how much,
 * and can open the full tree when they want to audit it.
 */
export default function AgentRunCard({
  steps,
  run,
  streaming
}: {
  steps: AgentStep[]
  run?: AgentRunSummary
  streaming?: boolean
}): JSX.Element {
  const [open, setOpen] = useState(false)

  const agentCount = run?.agents.length ?? new Set(steps.map((s) => s.label)).size
  const calls = run?.toolCalls ?? steps.length
  const seconds = run ? (run.durationMs / 1000).toFixed(1) : null
  const running = steps.filter((s) => s.status === 'running')

  const summary = streaming
    ? running.length
      ? `${running[0].label} · ${running[0].detail ?? 'working'}`
      : 'Planning'
    : `${agentCount} agent${agentCount === 1 ? '' : 's'} · ${calls} tool call${calls === 1 ? '' : 's'}${
        seconds ? ` · ${seconds}s` : ''
      }`

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-base-700 px-2.5 py-1 text-[11px] text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
      >
        {streaming ? (
          <Loader2 className="h-3 w-3 animate-spin text-spectr-accent" />
        ) : open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <span className="font-mono">{summary}</span>
      </button>

      {open && (
        <div className="mt-2">
          <AgentStepsTimeline steps={steps} streaming={streaming} />
        </div>
      )}
    </div>
  )
}
