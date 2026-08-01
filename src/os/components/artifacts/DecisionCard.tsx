import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { AlertTriangle, Check, Sparkles } from 'lucide-react'
import type { DecisionObject } from '../../lib/commandTypes'
import { subscribeDecisions } from '../../lib/decisions'
import { applyDecision } from '../../lib/tools/execute'
import ObjectChip from './ObjectChip'

const URGENCY: Record<string, { label: string; text: string; icon: string }> = {
  critical: { label: 'Critical', text: 'text-signal-red', icon: 'text-signal-red' },
  watch: { label: 'Needs a call', text: 'text-signal-amber', icon: 'text-signal-amber' },
  normal: { label: 'When you can', text: 'text-ink-dim', icon: 'text-ink-faint' }
}

const OPTION_TONE: Record<string, string> = {
  good: 'border-signal-green/40 hover:border-signal-green',
  risk: 'border-signal-amber/40 hover:border-signal-amber',
  neutral: 'border-edge hover:border-ink-faint'
}

/**
 * The only surface where a human is required. Everything else Spectr runs by
 * itself; here it stops, lays out the trade-off and waits.
 */
export default function DecisionCard({
  decisionId,
  dense
}: {
  decisionId: string
  dense?: boolean
}): JSX.Element | null {
  const [decision, setDecision] = useState<DecisionObject | null>(null)
  const [working, setWorking] = useState<string | null>(null)

  useEffect(
    () => subscribeDecisions((all) => setDecision(all.find((d) => d.id === decisionId) ?? null)),
    [decisionId]
  )

  if (!decision) return null

  const urgency = URGENCY[decision.urgency] ?? URGENCY.normal
  const resolved = decision.status === 'resolved'
  const chosen = decision.options.find((o) => o.id === decision.chosenOptionId)

  const choose = async (optionId: string): Promise<void> => {
    setWorking(optionId)
    try {
      await applyDecision(decision, optionId)
    } finally {
      setWorking(null)
    }
  }

  return (
    <section
      className={`bevel-panel overflow-hidden bg-white shadow-panel ${
        resolved ? 'opacity-70' : 'ring-1 ring-signal-amber/30'
      }`}
      style={{ ['--bevel-cut' as string]: '14px' }}
    >
      <header className="flex items-start justify-between gap-3 border-b border-edge px-4 pb-2.5 pt-3">
        <div className="min-w-0">
          <div
            className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em] ${
              resolved ? 'text-ink-faint' : urgency.text
            }`}
          >
            <AlertTriangle className={`h-3 w-3 ${resolved ? 'text-ink-faint' : urgency.icon}`} />
            {resolved ? 'Resolved' : urgency.label}
          </div>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-ink">{decision.question}</h3>
        </div>
      </header>

      <div className="px-4 py-3">
        {decision.subject.ref !== '—' && (
          <div className="mb-2">
            <ObjectChip
              type={decision.subject.type}
              label={decision.subject.ref}
              title={decision.subject.title}
            />
          </div>
        )}

        {decision.context && (
          <p className="text-[13px] leading-relaxed text-ink-dim">{decision.context}</p>
        )}

        {decision.rationale && !resolved && (
          <p className="mt-2 flex gap-1.5 rounded-[6px] bg-spectr-accent/5 px-2.5 py-2 text-[12px] leading-snug text-ink">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-spectr-accent" />
            <span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-spectr-accent">
                Spectr recommends ·{' '}
              </span>
              {decision.rationale}
            </span>
          </p>
        )}

        <div className={`mt-3 grid gap-2 ${dense ? '' : 'sm:grid-cols-2'}`}>
          {decision.options.map((o) => {
            const recommended = o.id === decision.recommendedOptionId
            const isChosen = o.id === decision.chosenOptionId

            if (resolved) {
              return (
                <div
                  key={o.id}
                  className={`rounded-[6px] border px-3 py-2 text-left ${
                    isChosen ? 'border-signal-green bg-signal-green/5' : 'border-edge opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                    {isChosen && <Check className="h-3 w-3 text-signal-green" />}
                    {o.label}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-dim">{o.impact}</p>
                </div>
              )
            }

            return (
              <button
                key={o.id}
                type="button"
                disabled={working != null}
                onClick={() => void choose(o.id)}
                className={`rounded-[6px] border bg-white px-3 py-2 text-left transition-colors disabled:opacity-50 ${
                  OPTION_TONE[o.tone] ?? OPTION_TONE.neutral
                } ${recommended ? 'ring-1 ring-spectr-accent/40' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-ink">{o.label}</span>
                  {recommended && (
                    <span className="shrink-0 text-[9px] font-mono uppercase tracking-[0.1em] text-spectr-accent">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-dim">{o.effect}</p>
                <p className="mt-1 text-[11px] leading-snug text-ink-faint">{o.impact}</p>
                {working === o.id && (
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-spectr-accent">
                    Executing…
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {resolved && chosen && (
          <p className="mt-2.5 text-[12px] text-ink-dim">
            You chose <span className="font-semibold text-ink">{chosen.label}</span>.{' '}
            {decision.outcome}
          </p>
        )}
      </div>
    </section>
  )
}
