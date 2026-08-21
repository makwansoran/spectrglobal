import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { X } from 'lucide-react'
import type { DecisionObject } from '../lib/commandTypes'
import { subscribeDecisions } from '../lib/decisions'
import DecisionCard from './artifacts/DecisionCard'

function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/** One-line operator-facing summary for the list. */
function decisionLine(d: DecisionObject): string {
  return d.question.replace(/\?$/, '') || d.context
}

/**
 * Decision Engine — the only right-rail job.
 * Compact list (what needs you + when). Click opens the full decision modal.
 */
export default function ContextPanel(): JSX.Element {
  const [decisions, setDecisions] = useState<DecisionObject[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => subscribeDecisions(setDecisions), [])

  const pending = decisions.filter((d) => d.status === 'pending')
  const active = activeId ? pending.find((d) => d.id === activeId) ?? null : null

  // If the open decision was resolved, close the modal.
  useEffect(() => {
    if (
      activeId &&
      !decisions.some((d) => d.id === activeId && d.status === 'pending')
    ) {
      setActiveId(null)
    }
  }, [activeId, decisions])

  return (
    <>
      <aside
        id="decision-queue"
        className="flex w-72 shrink-0 flex-col border-l border-edge bg-base-900"
      >
        <header className="flex items-baseline justify-between gap-2 px-4 pb-3 pt-4">
          <h2 className="font-spectr-os text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Decisions
          </h2>
          <span className="font-mono text-[11px] text-ink-faint">{pending.length}</span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {pending.length === 0 ? (
            <p className="px-2 py-4 text-[12px] text-ink-faint">
              Nothing waiting. Spectr is running the pipeline.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {pending.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(d.id)}
                    className={`flex w-full items-start gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-base-600/80 ${
                      activeId === d.id ? 'bg-base-600/60' : ''
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        d.urgency === 'critical' ? 'bg-signal-red' : 'bg-signal-amber'
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] leading-snug text-ink">
                        {decisionLine(d)}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
                        {formatTime(d.createdAt)}
                        {d.subject.ref !== '—' ? ` · ${d.subject.ref}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 backdrop-blur-[2px]"
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Decision"
          >
            <button
              type="button"
              title="Close"
              onClick={() => setActiveId(null)}
              className="absolute right-3 top-3 z-10 text-ink-faint transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <DecisionCard decisionId={active.id} />
          </div>
        </div>
      )}
    </>
  )
}
