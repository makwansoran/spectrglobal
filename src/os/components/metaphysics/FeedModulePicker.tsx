import { useEffect, useState, type JSX } from 'react'
import { X } from 'lucide-react'
import type { FeedKind } from '@/os/shared/platform'

export interface FeedModuleOption {
  kind: FeedKind
  name: string
  description: string
}

export const FEED_MODULES: FeedModuleOption[] = [
  {
    kind: 'csv',
    name: 'CSV / text',
    description: 'Paste a spreadsheet export'
  },
  {
    kind: 'excel',
    name: 'Excel sheet',
    description: 'Import from an .xlsx workbook'
  },
  {
    kind: 'json',
    name: 'JSON',
    description: 'Paste a JSON array or object'
  },
  {
    kind: 'xml',
    name: 'XML',
    description: 'Paste XML with repeating row elements'
  },
  {
    kind: 'sql',
    name: 'SQL dump',
    description: 'INSERT … VALUES or a CSV result dump'
  },
  {
    kind: 'http.poll',
    name: 'API connection',
    description: 'Pull JSON or CSV on a schedule'
  },
  {
    kind: 'http.push',
    name: 'HTTP push',
    description: 'Receive records posted to Spectr'
  },
  {
    kind: 'db.table',
    name: 'Database table',
    description: 'Use a local Spectr table'
  },
  {
    kind: 'static',
    name: 'Manual rows',
    description: 'Empty table you fill yourself'
  }
]

interface FeedModulePickerProps {
  open: boolean
  anchorLabel?: string
  tables: string[]
  onClose: () => void
  onPick: (kind: FeedKind, payload?: string) => Promise<void> | void
}

/**
 * The module sheet that appears from a data-feed node's +.
 * Picks what the feed actually is — nothing more.
 */
export default function FeedModulePicker({
  open,
  anchorLabel,
  tables,
  onClose,
  onPick
}: FeedModulePickerProps): JSX.Element | null {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [step, setStep] = useState<'list' | 'csv' | 'excel' | 'http' | 'db' | 'json' | 'xml' | 'sql'>(
    'list'
  )
  const [payload, setPayload] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setStep('list')
      setPayload('')
      setBusy(false)
      setError(null)
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setShown(true))
      })
      return () => window.cancelAnimationFrame(id)
    }
    setShown(false)
    const t = window.setTimeout(() => setMounted(false), 200)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (step !== 'list') setStep('list')
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  if (!mounted) return null

  const commit = async (kind: FeedKind, value?: string): Promise<void> => {
    setBusy(true)
    setError(null)
    try {
      await onPick(kind, value)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set feed')
    } finally {
      setBusy(false)
    }
  }

  const onSelect = (kind: FeedKind): void => {
    if (kind === 'csv') {
      setStep('csv')
      return
    }
    if (kind === 'json') {
      setStep('json')
      return
    }
    if (kind === 'xml') {
      setStep('xml')
      return
    }
    if (kind === 'sql') {
      setStep('sql')
      return
    }
    if (kind === 'excel') {
      setStep('excel')
      return
    }
    if (kind === 'http.poll') {
      setStep('http')
      return
    }
    if (kind === 'db.table') {
      setStep('db')
      return
    }
    void commit(kind)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-200 ${
        shown ? 'bg-ink/25 backdrop-blur-[1px]' : 'bg-ink/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bevel-panel w-full max-w-md overflow-hidden bg-white shadow-panel transition-all duration-200 ${
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
        }`}
        style={{ ['--bevel-cut' as string]: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-edge px-4 py-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-dim">
              Data feed
            </div>
            <div className="mt-0.5 text-sm font-medium text-ink">
              {step === 'list'
                ? `What feeds ${anchorLabel ?? 'this node'}?`
                : step === 'csv'
                  ? 'Paste CSV'
                  : step === 'json'
                    ? 'Paste JSON'
                    : step === 'xml'
                      ? 'Paste XML'
                      : step === 'sql'
                        ? 'Paste SQL'
                        : step === 'excel'
                          ? 'Choose Excel file'
                          : step === 'http'
                            ? 'Endpoint URL'
                            : 'Pick a table'}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-dim hover:bg-base-600 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-3">
          {step === 'list' ? (
            <div className="flex flex-col gap-1.5">
              {FEED_MODULES.map((m) => (
                <button
                  key={m.kind}
                  type="button"
                  onClick={() => onSelect(m.kind)}
                  className="rounded-sm border border-edge px-3 py-2.5 text-left hover:border-spectr-accent"
                >
                  <div className="text-[13px] font-medium text-ink">{m.name}</div>
                  <div className="mt-0.5 text-[11px] text-ink-dim">{m.description}</div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 'csv' ? (
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={8}
              placeholder={'id,name\n1,Acme'}
              className="w-full resize-y border border-edge px-3 py-2 font-mono text-[12px] focus:border-spectr-accent focus:outline-none"
            />
          ) : null}

          {step === 'json' || step === 'xml' || step === 'sql' ? (
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={8}
              placeholder={
                step === 'json'
                  ? '[{"id":1,"name":"Acme"}]'
                  : step === 'xml'
                    ? '<rows><row><id>1</id><name>Acme</name></row></rows>'
                    : "INSERT INTO t (id, name) VALUES (1, 'Acme');"
              }
              className="w-full resize-y border border-edge px-3 py-2 font-mono text-[12px] focus:border-spectr-accent focus:outline-none"
            />
          ) : null}

          {step === 'excel' ? (
            <input
              type="file"
              accept=".xlsx"
              className="block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const result = reader.result
                  if (typeof result !== 'string') return
                  setPayload(result.split(',')[1] ?? '')
                }
                reader.readAsDataURL(file)
              }}
            />
          ) : null}

          {step === 'http' ? (
            <input
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="https://…"
              className="w-full border border-edge px-3 py-2 text-sm focus:border-spectr-accent focus:outline-none"
            />
          ) : null}

          {step === 'db' ? (
            <select
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full border border-edge px-3 py-2 text-sm focus:border-spectr-accent focus:outline-none"
            >
              <option value="">Select a table…</option>
              {tables.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : null}

          {error ? <p className="mt-2 text-[12px] text-signal-red">{error}</p> : null}
        </div>

        {step !== 'list' ? (
          <div className="flex justify-end gap-2 border-t border-edge px-4 py-3">
            <button
              type="button"
              onClick={() => setStep('list')}
              className="px-3 py-1.5 text-[13px] text-ink-dim"
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy || !payload.trim()}
              onClick={() =>
                void commit(
                  step === 'csv'
                    ? 'csv'
                    : step === 'json'
                      ? 'json'
                      : step === 'xml'
                        ? 'xml'
                        : step === 'sql'
                          ? 'sql'
                          : step === 'excel'
                            ? 'excel'
                            : step === 'http'
                              ? 'http.poll'
                              : 'db.table',
                  payload.trim()
                )
              }
              className="bevel bevel-sm bevel-primary px-4 py-1.5 text-[13px]"
            >
              {busy ? 'Setting…' : 'Use this'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
