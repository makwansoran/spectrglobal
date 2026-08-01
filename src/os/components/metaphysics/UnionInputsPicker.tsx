import { useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { Check } from 'lucide-react'
import type { TransformDef } from '@/os/shared/platform'
import { updateTransform } from '../../lib/platform'

/** A Data node currently on the Metaphysics canvas. */
export interface CanvasDataOption {
  /** Feed id or draft id. */
  id: string
  label: string
  code?: string
  /** Dataset id when the feed is connected; null for unset drafts. */
  datasetId: string | null
  rowCount?: number
  ready: boolean
}

interface UnionInputsPickerProps {
  transform: TransformDef
  canvasDataNodes: CanvasDataOption[]
  onSaved?: () => void
  /** Prefer canvas/parent toggle so Union stays focused and edges update. */
  onToggleFeed?: (feedId: string) => void
}

function inputsKey(transform: TransformDef): string {
  if (transform.config.kind !== 'union') return ''
  return transform.config.inputs.join('\0')
}

/**
 * Union config: pick which canvas Data nodes to fuse.
 * You can also click Data nodes on the canvas while Union is open.
 */
export default function UnionInputsPicker({
  transform,
  canvasDataNodes,
  onSaved,
  onToggleFeed
}: UnionInputsPickerProps): JSX.Element {
  const savedKey = inputsKey(transform)
  const savedInputs =
    transform.config.kind === 'union' ? transform.config.inputs : []

  const [selected, setSelected] = useState<string[]>(savedInputs)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const savingRef = useRef(false)

  useEffect(() => {
    setSelected(savedInputs)
    setError(null)
  }, [transform.id, savedKey])

  const readyNodes = useMemo(
    () => canvasDataNodes.filter((n) => Boolean(n.datasetId)),
    [canvasDataNodes]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = canvasDataNodes
    if (!q) return list
    return list.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        (n.code ?? '').toLowerCase().includes(q)
    )
  }, [canvasDataNodes, query])

  const dirty = useMemo(() => {
    if (selected.length !== savedInputs.length) return true
    const a = [...selected].sort()
    const b = [...savedInputs].sort()
    return a.some((id, i) => id !== b[i])
  }, [selected, savedInputs])

  const apply = async (inputs: string[]): Promise<void> => {
    if (savingRef.current) return
    savingRef.current = true
    setBusy(true)
    setError(null)
    try {
      const updated = await updateTransform(transform.id, {
        config: {
          kind: 'union',
          inputs,
          mode: 'byName',
          sourceColumn: 'source'
        }
      })
      if (!updated) {
        throw new Error('Could not update union — platform bridge unavailable')
      }
      onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update union')
    } finally {
      savingRef.current = false
      setBusy(false)
    }
  }

  const toggleDataset = (feedId: string, datasetId: string): void => {
    const next = selected.includes(datasetId)
      ? selected.filter((id) => id !== datasetId)
      : [...selected, datasetId]
    setSelected(next)
    if (onToggleFeed) {
      onToggleFeed(feedId)
      return
    }
    if (next.length >= 2) void apply(next)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-edge px-3 py-2">
        <div className="text-[12px] text-ink-dim">
          {readyNodes.length === 0
            ? 'Connect sources on Data nodes, then click them here or on the canvas'
            : 'Click Data feeds here or on the canvas to attach lines into this Union'}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-40 rounded-sm border border-edge bg-white px-2 py-1.5 text-[12px] text-ink outline-none focus:border-ink"
          />
          <button
            type="button"
            disabled={busy || !dirty || selected.length < 2}
            onClick={() => void apply(selected)}
            className="bevel bevel-sm bevel-primary disabled:opacity-40"
          >
            {busy ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {canvasDataNodes.length === 0 ? (
          <p className="px-3 py-6 text-sm text-ink-faint">
            No Data nodes on the canvas. Use New node → Data first.
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-3 py-6 text-sm text-ink-faint">No data nodes match.</p>
        ) : (
          <ul className="grid gap-1 sm:grid-cols-2">
            {filtered.map((node) => {
              const datasetId = node.datasetId
              const canSelect = Boolean(datasetId)
              const on = Boolean(datasetId && selected.includes(datasetId))
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (datasetId) {
                        toggleDataset(node.id, datasetId)
                        return
                      }
                      setError('Open that Data node first and connect a source, then attach it here')
                    }}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-sm border px-3 py-3 text-left transition-colors ${
                      on
                        ? 'border-ink bg-ink text-white'
                        : canSelect
                          ? 'border-edge bg-white hover:border-ink/40 hover:bg-base-700/40'
                          : 'border-dashed border-edge bg-base-900 hover:bg-base-700/40'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                        on ? 'border-white bg-white text-ink' : 'border-edge bg-white'
                      }`}
                    >
                      {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13px] font-medium ${on ? 'text-white' : 'text-ink'}`}
                      >
                        {node.label}
                      </span>
                      <span
                        className={`mt-0.5 block truncate font-mono text-[11px] ${on ? 'text-white/70' : 'text-ink-faint'}`}
                      >
                        {canSelect
                          ? `${node.code ?? 'feed'}${node.rowCount != null ? ` · ${node.rowCount.toLocaleString()} rows` : ''}`
                          : 'Needs a source before it can join this Union'}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {error ? (
        <p className="shrink-0 border-t border-edge px-3 py-2 text-[12px] text-signal-red">
          {error}
        </p>
      ) : null}
    </div>
  )
}
