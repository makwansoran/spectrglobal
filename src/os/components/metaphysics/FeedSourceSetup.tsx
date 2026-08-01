import { useCallback, useState, type DragEvent, type JSX } from 'react'
import { FileUp, Loader2 } from 'lucide-react'
import type { FeedConfig, HttpPollFeedConfig } from '@/os/shared/platform'
import { SOURCE_KIND_META, configFromDataFile } from '../../lib/feedIdentity'

export type SourceCommit = {
  config: FeedConfig
  label?: string
  description?: string
}

interface FeedSourceSetupProps {
  tables: string[]
  search: string
  onCommit: (next: SourceCommit) => Promise<void> | void
}

type SourceStep =
  | 'list'
  | 'file'
  | 'csv'
  | 'api'
  | 'db'
  | 'manual'

const INTERVALS: Array<{ label: string; ms: number }> = [
  { label: 'Every minute', ms: 60_000 },
  { label: 'Every 5 minutes', ms: 300_000 },
  { label: 'Every 15 minutes', ms: 900_000 },
  { label: 'Every hour', ms: 3_600_000 },
  { label: 'Manual only', ms: 0 }
]

export default function FeedSourceSetup({
  tables,
  search,
  onCommit
}: FeedSourceSetupProps): JSX.Element {
  const [step, setStep] = useState<SourceStep>('list')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const [csvText, setCsvText] = useState('')
  const [dbTable, setDbTable] = useState(tables[0] ?? '')
  const [api, setApi] = useState({
    connectionName: '',
    description: '',
    url: '',
    apiKey: '',
    apiKeyHeader: 'bearer' as NonNullable<HttpPollFeedConfig['apiKeyHeader']>,
    apiKeyHeaderName: '',
    recordsPath: '',
    intervalMs: 60_000
  })

  const filtered = SOURCE_KIND_META.filter((m) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      String(m.kind).includes(q)
    )
  })

  const run = useCallback(
    async (fn: () => Promise<SourceCommit> | SourceCommit) => {
      setBusy(true)
      setError(null)
      try {
        await onCommit(await fn())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not apply source')
      } finally {
        setBusy(false)
      }
    },
    [onCommit]
  )

  const ingestFile = (file: File): void => {
    void run(async () => {
      const { config, suggestedLabel } = await configFromDataFile(file)
      return { config, label: suggestedLabel }
    })
  }

  const onDrop = (event: DragEvent): void => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) ingestFile(file)
  }

  if (step === 'file') {
    return (
      <div className="space-y-3 p-4">
        <button type="button" className="text-[12px] text-ink-faint hover:text-ink" onClick={() => setStep('list')}>
          ← All sources
        </button>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed px-6 py-10 text-center transition-colors ${
            dragOver ? 'border-ink bg-base-700/60' : 'border-edge bg-base-900'
          }`}
        >
          <FileUp className="h-6 w-6 text-ink-faint" />
          <div>
            <div className="text-sm font-medium text-ink">Drop a data file here</div>
            <div className="mt-1 text-[12px] text-ink-dim">
              CSV, TSV, Excel, JSON, XML, SQL, or plain text
            </div>
          </div>
          <label className="bevel bevel-sm bevel-primary cursor-pointer">
            Choose file
            <input
              type="file"
              className="hidden"
              accept=".csv,.tsv,.txt,.json,.xml,.sql,.xlsx,.xlsm,.log"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) ingestFile(file)
              }}
            />
          </label>
        </div>
        {error ? <p className="text-[12px] text-signal-red">{error}</p> : null}
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-ink-faint" /> : null}
      </div>
    )
  }

  if (step === 'csv') {
    return (
      <div className="space-y-3 p-4">
        <button type="button" className="text-[12px] text-ink-faint hover:text-ink" onClick={() => setStep('list')}>
          ← All sources
        </button>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={10}
          placeholder={'id,name\n1,Ada'}
          className="w-full resize-y rounded-sm border border-edge bg-base-900 px-3 py-2 font-mono text-[12px] text-ink outline-none focus:border-ink"
        />
        {error ? <p className="text-[12px] text-signal-red">{error}</p> : null}
        <button
          type="button"
          disabled={busy || !csvText.trim()}
          className="bevel bevel-sm bevel-primary disabled:opacity-40"
          onClick={() =>
            void run(() => ({
              config: { kind: 'csv', text: csvText, filename: 'paste.csv' }
            }))
          }
        >
          Use pasted data
        </button>
      </div>
    )
  }

  if (step === 'api') {
    return (
      <div className="space-y-3 overflow-y-auto p-4">
        <button type="button" className="text-[12px] text-ink-faint hover:text-ink" onClick={() => setStep('list')}>
          ← All sources
        </button>
        <Field
          label="Connection name"
          value={api.connectionName}
          onChange={(connectionName) => setApi((a) => ({ ...a, connectionName }))}
          placeholder="Inventory API"
        />
        <label className="block">
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Description
          </span>
          <textarea
            value={api.description}
            onChange={(e) => setApi((a) => ({ ...a, description: e.target.value }))}
            rows={2}
            placeholder="What this API provides and how it is used"
            className="mt-1 w-full rounded-sm border border-edge bg-base-900 px-2.5 py-2 text-[13px] text-ink outline-none focus:border-ink"
          />
        </label>
        <Field
          label="URL"
          value={api.url}
          onChange={(url) => setApi((a) => ({ ...a, url }))}
          placeholder="https://api.example.com/v1/items"
        />
        <Field
          label="API key"
          value={api.apiKey}
          onChange={(apiKey) => setApi((a) => ({ ...a, apiKey }))}
          placeholder="Optional secret"
          type="password"
        />
        <label className="block">
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            API key header
          </span>
          <select
            value={api.apiKeyHeader}
            onChange={(e) =>
              setApi((a) => ({
                ...a,
                apiKeyHeader: e.target.value as 'bearer' | 'x-api-key' | 'custom'
              }))
            }
            className="mt-1 w-full rounded-sm border border-edge bg-base-900 px-2.5 py-2 text-[13px] text-ink outline-none"
          >
            <option value="bearer">Authorization: Bearer</option>
            <option value="x-api-key">X-Api-Key</option>
            <option value="custom">Custom header</option>
          </select>
        </label>
        {api.apiKeyHeader === 'custom' ? (
          <Field
            label="Custom header name"
            value={api.apiKeyHeaderName}
            onChange={(apiKeyHeaderName) => setApi((a) => ({ ...a, apiKeyHeaderName }))}
            placeholder="X-Custom-Token"
          />
        ) : null}
        <Field
          label="Records path"
          value={api.recordsPath}
          onChange={(recordsPath) => setApi((a) => ({ ...a, recordsPath }))}
          placeholder="data.items (optional)"
        />
        <label className="block">
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Schedule
          </span>
          <select
            value={api.intervalMs}
            onChange={(e) => setApi((a) => ({ ...a, intervalMs: Number(e.target.value) }))}
            className="mt-1 w-full rounded-sm border border-edge bg-base-900 px-2.5 py-2 text-[13px] text-ink outline-none"
          >
            {INTERVALS.map((opt) => (
              <option key={opt.ms} value={opt.ms}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="text-[12px] text-signal-red">{error}</p> : null}
        <button
          type="button"
          disabled={busy || !api.url.trim() || !api.connectionName.trim()}
          className="bevel bevel-sm bevel-primary disabled:opacity-40"
          onClick={() =>
            void run(() => {
              const config: FeedConfig = {
                kind: 'http.poll',
                url: api.url.trim(),
                intervalMs: api.intervalMs > 0 ? api.intervalMs : 60_000,
                connectionName: api.connectionName.trim(),
                description: api.description.trim() || undefined,
                apiKey: api.apiKey.trim() || undefined,
                apiKeyHeader: api.apiKey ? api.apiKeyHeader : undefined,
                apiKeyHeaderName:
                  api.apiKeyHeader === 'custom' ? api.apiKeyHeaderName.trim() || undefined : undefined,
                recordsPath: api.recordsPath.trim() || undefined
              }
              return {
                config,
                label: api.connectionName.trim(),
                description: api.description.trim() || undefined
              }
            })
          }
        >
          Connect API
        </button>
      </div>
    )
  }

  if (step === 'db') {
    return (
      <div className="space-y-3 p-4">
        <button type="button" className="text-[12px] text-ink-faint hover:text-ink" onClick={() => setStep('list')}>
          ← All sources
        </button>
        {tables.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No local tables yet. Create one from Command chat.</p>
        ) : (
          <select
            value={dbTable}
            onChange={(e) => setDbTable(e.target.value)}
            className="w-full rounded-sm border border-edge bg-base-900 px-2.5 py-2 text-[13px] text-ink outline-none"
          >
            {tables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        {error ? <p className="text-[12px] text-signal-red">{error}</p> : null}
        <button
          type="button"
          disabled={busy || !dbTable}
          className="bevel bevel-sm bevel-primary disabled:opacity-40"
          onClick={() =>
            void run(() => ({
              config: { kind: 'db.table', table: dbTable },
              label: dbTable
            }))
          }
        >
          Use table
        </button>
      </div>
    )
  }

  if (step === 'manual') {
    return (
      <div className="space-y-3 p-4">
        <button type="button" className="text-[12px] text-ink-faint hover:text-ink" onClick={() => setStep('list')}>
          ← All sources
        </button>
        <p className="text-[13px] text-ink-dim">
          Creates an empty writable dataset. Add columns and rows after it is connected.
        </p>
        {error ? <p className="text-[12px] text-signal-red">{error}</p> : null}
        <button
          type="button"
          disabled={busy}
          className="bevel bevel-sm bevel-primary disabled:opacity-40"
          onClick={() =>
            void run(() => ({
              config: { kind: 'static', columns: ['id', 'name'], rows: [] }
            }))
          }
        >
          Create blank dataset
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2">
      <ul className="space-y-1">
        {filtered.map((item) => (
          <li key={String(item.kind)}>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setError(null)
                if (item.kind === 'file') setStep('file')
                else if (item.kind === 'csv') setStep('csv')
                else if (item.kind === 'http.poll') setStep('api')
                else if (item.kind === 'db.table') setStep('db')
                else if (item.kind === 'static') setStep('manual')
                else if (item.kind === 'http.push') {
                  void run(() => ({
                    config: {
                      kind: 'http.push',
                      slug: `feed-${Math.random().toString(36).slice(2, 7)}`,
                      token: Math.random().toString(36).slice(2, 10),
                      mode: 'replace'
                    }
                  }))
                }
              }}
              className="w-full rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-base-700/70"
            >
              <div className="text-[13px] font-medium text-ink">{item.name}</div>
              <div className="mt-0.5 text-[11px] text-ink-dim">{item.description}</div>
            </button>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className="px-3 py-4 text-[12px] text-ink-faint">No sources match your search.</p>
      ) : null}
      {error ? <p className="px-3 py-2 text-[12px] text-signal-red">{error}</p> : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  type?: string
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-edge bg-base-900 px-2.5 py-2 text-[13px] text-ink outline-none focus:border-ink"
      />
    </label>
  )
}
