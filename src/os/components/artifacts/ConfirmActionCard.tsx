import { useEffect, useState, type JSX } from 'react'
import {
  getConfirm,
  resolveConfirm,
  setConfirmOutcome,
  subscribeConfirms,
  type ConfirmAction
} from '../../lib/confirms'
import { executeTool } from '../../lib/tools/execute'

function looksFailed(action: ConfirmAction, error: string | null): boolean {
  if (error) return true
  const s = action.resultSummary ?? ''
  return /no table|failed|error|unavailable/i.test(s)
}

/**
 * Operator confirm box — green go / red abort for a parked command.
 */
export default function ConfirmActionCard({
  confirmId
}: {
  confirmId: string
}): JSX.Element | null {
  const [action, setAction] = useState<ConfirmAction | null>(() => getConfirm(confirmId))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return subscribeConfirms((all) => {
      setAction(all.find((c) => c.id === confirmId) ?? null)
    })
  }, [confirmId])

  if (!action) return null

  const pending = action.status === 'pending'
  const failed = action.status === 'confirmed' && looksFailed(action, error)
  const canRun = (pending || failed) && !busy

  const onConfirm = async (): Promise<void> => {
    if (!canRun) return
    setBusy(true)
    setError(null)
    try {
      if (action.tool) {
        const result = await executeTool(action.tool, action.args ?? {}, {
          actor: 'Operator'
        })
        setConfirmOutcome(action.id, 'confirmed', result.summary)
        if (!result.ok) {
          setError(result.summary || 'Action failed')
        } else {
          setError(null)
        }
      } else {
        resolveConfirm(action.id, 'confirmed')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setConfirmOutcome(action.id, 'confirmed', message)
    } finally {
      setBusy(false)
    }
  }

  const onAbort = (): void => {
    if ((!pending && !failed) || busy) return
    setConfirmOutcome(action.id, 'aborted', 'Aborted — nothing changed.')
    setError(null)
  }

  return (
    <section
      className="bevel-panel overflow-hidden bg-white shadow-panel"
      style={{ ['--bevel-cut' as string]: '12px' }}
    >
      <header className="border-b border-edge px-4 pb-2 pt-3">
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-faint">
          {pending ? 'Confirm' : failed ? 'Failed' : action.status === 'confirmed' ? 'Done' : 'Aborted'}
        </div>
        <h3 className="mt-1 text-sm font-semibold text-ink">{action.title}</h3>
      </header>

      <div className="space-y-3 px-4 py-3">
        <div className="rounded-md border border-edge bg-base-700/50 px-3 py-2.5">
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Command
          </div>
          <p className="mt-1 text-[13px] font-medium leading-snug text-ink">{action.command}</p>
          {action.detail ? (
            <p className="mt-1.5 text-[12px] leading-snug text-ink-dim">{action.detail}</p>
          ) : null}
        </div>

        {(error || (failed && action.resultSummary)) && (
          <p className="text-[12px] text-signal-red">{error || action.resultSummary}</p>
        )}

        {pending || failed ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onConfirm()}
              className="flex-1 rounded-md bg-signal-green px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Working…' : failed ? 'Retry' : action.confirmLabel}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onAbort}
              className="flex-1 rounded-md bg-signal-red px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {action.abortLabel}
            </button>
          </div>
        ) : (
          <p className="text-[12px] text-ink-faint">
            {action.status === 'confirmed'
              ? action.resultSummary || 'Confirmed — Spectr ran the command.'
              : 'Aborted — nothing changed.'}
          </p>
        )}
      </div>
    </section>
  )
}
