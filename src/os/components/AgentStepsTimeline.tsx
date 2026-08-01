import { useState } from 'react'
import type { JSX } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Loader2,
  X
} from 'lucide-react'
import type { AgentStep, AgentStepStatus } from '../lib/types'
import { statusLabel, stepsProgress } from '../lib/agentSteps'

const KIND_TONE: Record<string, string> = {
  intent: 'text-ink-dim',
  query: 'text-spectr-accent',
  plan: 'text-ink',
  dispatch: 'text-signal-amber',
  verify: 'text-signal-green',
  tool: 'text-ink-dim',
  analysis: 'text-spectr-accent'
}

function StatusNode({ status }: { status: AgentStepStatus }): JSX.Element {
  if (status === 'done') {
    return (
      <span className="flex h-5 w-5 items-center justify-center bg-signal-green text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    )
  }
  if (status === 'running') {
    return (
      <span className="flex h-5 w-5 items-center justify-center bg-spectr-accent text-white">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="flex h-5 w-5 items-center justify-center bg-signal-red text-white">
        <X className="h-3 w-3" strokeWidth={3} />
      </span>
    )
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center border border-edge bg-white text-ink-faint">
      <Circle className="h-2 w-2 fill-current" />
    </span>
  )
}

function StepRow({
  step,
  depth,
  isLast
}: {
  step: AgentStep
  depth: number
  isLast: boolean
}): JSX.Element {
  const hasKids = (step.children?.length ?? 0) > 0
  const [open, setOpen] = useState(true)

  return (
    <div className="relative">
      <div className="flex gap-3" style={{ paddingLeft: depth * 16 }}>
        <div className="relative flex flex-col items-center">
          <StatusNode status={step.status} />
          {!isLast && (
            <span className="mt-1 w-px flex-1 min-h-[12px] bg-edge" aria-hidden />
          )}
          {hasKids && open && (
            <span
              className="absolute left-1/2 top-5 w-px bg-edge"
              style={{ height: 'calc(100% - 8px)' }}
              aria-hidden
            />
          )}
        </div>

        <div className="min-w-0 flex-1 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {hasKids ? (
                  <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="inline-flex items-center gap-1 text-left text-[13px] font-medium text-ink"
                  >
                    {open ? (
                      <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
                    )}
                    {step.label}
                  </button>
                ) : (
                  <span className="text-[13px] font-medium text-ink">{step.label}</span>
                )}
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider ${KIND_TONE[step.kind] ?? 'text-ink-faint'}`}
                >
                  {step.kind}
                </span>
              </div>
              {step.detail && (
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{step.detail}</p>
              )}
            </div>
            <div className="shrink-0 text-right font-mono text-[10px] text-ink-faint">
              <div>{statusLabel(step.status)}</div>
              {step.durationMs != null && step.status === 'done' && (
                <div>{(step.durationMs / 1000).toFixed(1)}s</div>
              )}
            </div>
          </div>

          {hasKids && open && (
            <div className="mt-2 border-l border-edge/80 pl-0">
              {step.children!.map((child, i) => (
                <StepRow
                  key={child.id}
                  step={child}
                  depth={depth + 1}
                  isLast={i === step.children!.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgentStepsTimeline({
  steps,
  streaming
}: {
  steps: AgentStep[]
  streaming?: boolean
}): JSX.Element {
  const prog = stepsProgress(steps)
  const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0

  return (
    <div
      className="bevel-panel w-full overflow-hidden bg-[#f4f5f7]"
      style={{ ['--bevel-cut' as string]: '12px' }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-edge/70 px-3.5 py-2.5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-faint">
            Agent execution
          </div>
          <div className="mt-0.5 text-[12px] text-ink-dim">
            {streaming
              ? 'Running WMS control loop…'
              : prog.errored
                ? 'Completed with errors'
                : 'Pipeline complete'}
          </div>
        </div>
        <div className="text-right font-mono text-[11px] tabular-nums text-ink">
          <div>
            {prog.done}/{prog.total}
          </div>
          <div className="text-ink-faint">{pct}%</div>
        </div>
      </div>

      <div className="h-1 w-full bg-edge/60">
        <div
          className="h-full bg-spectr-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="px-3.5 pt-3 pb-1">
        {steps.map((s, i) => (
          <StepRow key={s.id} step={s} depth={0} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  )
}
