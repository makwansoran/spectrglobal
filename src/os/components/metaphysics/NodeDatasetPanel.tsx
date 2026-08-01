import { useCallback, useEffect, useMemo, useRef, useState, type JSX, type PointerEvent as ReactPointerEvent } from 'react'
import { Search, X } from 'lucide-react'
import type {
  Dataset,
  DatasetColumn,
  DatasetPage,
  FeedConfig,
  FeedDef,
  TransformDef
} from '@/os/shared/platform'
import { getRows, updateFeed, updateTransform } from '../../lib/platform'
import FeedSourceSetup, { type SourceCommit } from './FeedSourceSetup'
import UnionInputsPicker, { type CanvasDataOption } from './UnionInputsPicker'

type SideNav = 'about' | 'schedules' | 'columns'

const HEIGHT_KEY = 'spectr-metaphysics-panel-height-v1'
const MIN_HEIGHT = 180
const MAX_HEIGHT_RATIO = 0.85
const DEFAULT_HEIGHT = 360

function readStoredHeight(): number {
  try {
    const raw = localStorage.getItem(HEIGHT_KEY)
    const n = raw ? Number(raw) : NaN
    if (Number.isFinite(n) && n >= MIN_HEIGHT) return n
  } catch {
    /* ignore */
  }
  return DEFAULT_HEIGHT
}

function clampHeight(px: number): number {
  const max = Math.max(MIN_HEIGHT + 40, Math.floor(window.innerHeight * MAX_HEIGHT_RATIO))
  return Math.min(max, Math.max(MIN_HEIGHT, Math.round(px)))
}

export type InspectTarget =
  | { kind: 'feed'; feed: FeedDef; dataset: Dataset | null }
  | { kind: 'transform'; transform: TransformDef; dataset: Dataset | null }
  | { kind: 'draft'; id: string; label: string }

interface NodeDatasetPanelProps {
  target: InspectTarget
  tables: string[]
  /** Every Data node on the canvas (feeds + drafts). */
  canvasDataNodes?: CanvasDataOption[]
  onClose: () => void
  onApplySource: (target: InspectTarget, commit: SourceCommit) => Promise<void>
  onRenameDraft?: (draftId: string, label: string) => void
  onUnionSaved?: () => void
  /** Toggle a canvas data feed onto the open Union (keeps Union focused). */
  onToggleUnionFeed?: (feedId: string) => void
}

const TYPE_LABEL: Record<DatasetColumn['type'], string> = {
  text: 'String',
  number: 'Double',
  boolean: 'Boolean',
  timestamp: 'Timestamp'
}

const INTERVAL_OPTIONS: Array<{ label: string; ms: number }> = [
  { label: 'Every minute', ms: 60_000 },
  { label: 'Every 5 minutes', ms: 300_000 },
  { label: 'Every 15 minutes', ms: 900_000 },
  { label: 'Every hour', ms: 3_600_000 }
]

function cellText(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function formatWhen(ts?: number): string {
  if (!ts) return 'Never'
  return new Date(ts).toLocaleString()
}

export default function NodeDatasetPanel({
  target,
  tables,
  canvasDataNodes = [],
  onClose,
  onApplySource,
  onRenameDraft,
  onUnionSaved,
  onToggleUnionFeed
}: NodeDatasetPanelProps): JSX.Element {
  const isDraft = target.kind === 'draft'
  const isFeed = target.kind === 'feed'
  const isTransform = target.kind === 'transform'
  const isUnion = isTransform && target.transform.config.kind === 'union'
  const dataset = isDraft ? null : target.dataset
  const datasetId = dataset?.id ?? null

  const title = isFeed
    ? target.feed.label
    : isTransform
      ? target.transform.label
      : target.label
  const code = isFeed ? target.feed.code : isTransform ? target.transform.code : null

  const [nav, setNav] = useState<SideNav>(isUnion || isDraft ? 'about' : 'columns')
  const [page, setPage] = useState<DatasetPage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [columnQuery, setColumnQuery] = useState('')
  const [rowQuery, setRowQuery] = useState('')
  const [aboutLabel, setAboutLabel] = useState(title)
  const [aboutDescription, setAboutDescription] = useState(
    isFeed ? (target.feed.description ?? '') : ''
  )
  const [savingAbout, setSavingAbout] = useState(false)
  const [height, setHeight] = useState(() => clampHeight(readStoredHeight()))
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null)

  const onResizePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { startY: event.clientY, startHeight: height }
  }, [height])

  const onResizePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    // Dragging the top edge up increases height; down decreases it.
    const delta = dragRef.current.startY - event.clientY
    setHeight(clampHeight(dragRef.current.startHeight + delta))
  }, [])

  const onResizePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* already released */
    }
    setHeight((h) => {
      const next = clampHeight(h)
      try {
        localStorage.setItem(HEIGHT_KEY, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const onWinResize = (): void => setHeight((h) => clampHeight(h))
    window.addEventListener('resize', onWinResize)
    return () => window.removeEventListener('resize', onWinResize)
  }, [])

  const datasetVersion = dataset?.version ?? 0
  const targetKey = isDraft
    ? target.id
    : (datasetId ?? (isFeed ? target.feed.id : target.transform.id))
  const feedDescription = isFeed ? (target.feed.description ?? '') : ''

  useEffect(() => {
    setNav(isUnion || isDraft ? 'about' : 'columns')
    setColumnQuery('')
    setRowQuery('')
    setAboutLabel(title)
    setAboutDescription(feedDescription)
  }, [targetKey, isDraft, isUnion, title, feedDescription])

  useEffect(() => {
    if (!datasetId) {
      setPage(null)
      return
    }
    let cancelled = false
    setLoading(true)
    void getRows(datasetId, 50, 0)
      .then((next) => {
        if (cancelled) return
        setPage(next)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setPage(null)
        setError(err instanceof Error ? err.message : 'Could not load rows')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [datasetId, datasetVersion])

  const columns = page?.columns ?? dataset?.columns ?? []
  const filteredColumns = useMemo(() => {
    const q = columnQuery.trim().toLowerCase()
    if (!q) return columns
    return columns.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || TYPE_LABEL[c.type].toLowerCase().includes(q)
    )
  }, [columns, columnQuery])

  const visibleColumnNames = useMemo(() => columns.map((c) => c.name), [columns])

  const filteredRows = useMemo(() => {
    const rows = page?.rows ?? []
    const q = rowQuery.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      visibleColumnNames.some((name) => cellText(row[name]).toLowerCase().includes(q))
    )
  }, [page?.rows, rowQuery, visibleColumnNames])

  const sideNav: Array<{ id: SideNav; label: string; hidden?: boolean }> = [
    { id: 'about', label: 'About' },
    { id: 'schedules', label: 'Schedules', hidden: isTransform || isDraft },
    { id: 'columns', label: 'Columns', hidden: isUnion || (isDraft && !datasetId) }
  ]

  const saveAbout = async (): Promise<void> => {
    const label = aboutLabel.trim()
    if (!label) return
    setSavingAbout(true)
    try {
      if (isDraft) {
        onRenameDraft?.(target.id, label)
      } else if (isFeed) {
        await updateFeed(target.feed.id, {
          label,
          description: aboutDescription
        })
      } else if (isTransform) {
        await updateTransform(target.transform.id, { label })
      }
    } finally {
      setSavingAbout(false)
    }
  }

  const saveSchedule = async (intervalMs: number): Promise<void> => {
    if (!isFeed || target.feed.config.kind !== 'http.poll') return
    const next: FeedConfig = { ...target.feed.config, intervalMs }
    await updateFeed(target.feed.id, { config: next })
  }

  const needsSource = isDraft || (isFeed && !datasetId)

  return (
    <section
      className="relative flex shrink-0 flex-col border-t border-edge bg-white shadow-[0_-8px_28px_rgba(15,23,42,0.06)]"
      style={{ height }}
    >
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize data panel"
        title="Drag to resize"
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="group absolute inset-x-0 -top-1 z-20 flex h-3 cursor-row-resize items-center justify-center"
      >
        <span className="h-1 w-10 rounded-full bg-edge transition-colors group-hover:bg-ink/40 group-active:bg-ink/60" />
      </div>

      <button
        type="button"
        title="Close"
        onClick={onClose}
        className="absolute right-2 top-2 z-10 rounded-sm p-1.5 text-ink-faint transition-colors hover:bg-base-700 hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex min-h-0 flex-1">
        {/* Left: About / Schedules / Columns only */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-edge bg-base-900">
          <nav className="flex shrink-0 gap-0.5 border-b border-edge px-2 pt-2">
            {sideNav
              .filter((item) => !item.hidden)
              .map((item) => {
                const active = nav === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNav(item.id)}
                    className={`relative flex-1 px-2 py-2 text-[11px] font-medium transition-colors ${
                      active ? 'text-ink' : 'text-ink-faint hover:text-ink-dim'
                    }`}
                  >
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ink" />
                    ) : null}
                  </button>
                )
              })}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {nav === 'about' ? (
              <div className="space-y-3 p-3">
                <label className="block">
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
                    Name
                  </span>
                  <input
                    value={aboutLabel}
                    onChange={(e) => setAboutLabel(e.target.value)}
                    className="mt-1 w-full rounded-sm border border-edge bg-white px-2 py-1.5 text-[12px] text-ink outline-none focus:border-ink"
                  />
                </label>
                {code ? (
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
                      Code
                    </div>
                    <div className="mt-1 break-all font-mono text-[11px] text-ink">{code}</div>
                  </div>
                ) : null}
                {(isFeed || isDraft) && (
                  <label className="block">
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
                      Description
                    </span>
                    <textarea
                      value={aboutDescription}
                      onChange={(e) => setAboutDescription(e.target.value)}
                      rows={3}
                      placeholder="What this feed is for"
                      className="mt-1 w-full rounded-sm border border-edge bg-white px-2 py-1.5 text-[12px] text-ink outline-none focus:border-ink"
                    />
                  </label>
                )}
                {isFeed ? (
                  <div className="space-y-2 text-[11px] text-ink-dim">
                    <div className="flex justify-between gap-2">
                      <span className="text-ink-faint">Kind</span>
                      <span className="font-mono text-ink">{target.feed.kind}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-ink-faint">Status</span>
                      <span className="text-ink">{target.feed.status}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-ink-faint">Last loaded</span>
                      <span className="text-right text-ink">
                        {formatWhen(target.feed.lastLoadedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-ink-faint">Rows</span>
                      <span className="text-ink">
                        {(dataset?.rowCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : null}
                {isUnion ? (
                  <p className="text-[12px] text-ink-dim">
                    Union fuses selected data nodes into one dataset for Command.
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={savingAbout || !aboutLabel.trim()}
                  onClick={() => void saveAbout()}
                  className="bevel bevel-sm bevel-primary disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            ) : null}

            {nav === 'schedules' ? (
              <div className="space-y-3 p-3">
                {isFeed && target.feed.config.kind === 'http.poll' ? (
                  <>
                    <p className="text-[12px] text-ink-dim">
                      Poll for{' '}
                      <span className="font-medium text-ink">
                        {target.feed.config.connectionName ?? target.feed.label}
                      </span>
                    </p>
                    <div className="space-y-1">
                      {INTERVAL_OPTIONS.map((opt) => {
                        const active =
                          target.feed.config.kind === 'http.poll' &&
                          target.feed.config.intervalMs === opt.ms
                        return (
                          <button
                            key={opt.ms}
                            type="button"
                            onClick={() => void saveSchedule(opt.ms)}
                            className={`block w-full rounded-sm px-2.5 py-2 text-left text-[12px] transition-colors ${
                              active
                                ? 'bg-ink text-white'
                                : 'text-ink hover:bg-base-700/70'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-[10px] text-ink-faint">
                      Last loaded {formatWhen(target.feed.lastLoadedAt)}
                    </p>
                  </>
                ) : (
                  <p className="text-[12px] text-ink-dim">
                    No schedule on this feed. Connect an API source to poll on an interval.
                  </p>
                )}
              </div>
            ) : null}

            {nav === 'columns' ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className="border-b border-edge px-2 py-2">
                  <div className="flex items-center gap-2 rounded-sm border border-edge bg-white px-2 py-1.5">
                    <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                    <input
                      value={columnQuery}
                      onChange={(e) => setColumnQuery(e.target.value)}
                      placeholder="Search columns"
                      className="w-full bg-transparent text-[12px] text-ink outline-none placeholder:text-ink-faint"
                    />
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-1 py-1">
                  {filteredColumns.length === 0 ? (
                    <p className="px-2 py-3 text-[12px] text-ink-faint">
                      {needsSource ? 'Connect a source to profile columns.' : 'No columns yet.'}
                    </p>
                  ) : (
                    <ul>
                      {filteredColumns.map((col) => (
                        <li
                          key={col.name}
                          className="flex items-baseline justify-between gap-2 rounded-sm px-2 py-1.5 hover:bg-base-700/70"
                        >
                          <span className="truncate font-mono text-[12px] text-ink">
                            {col.name}
                          </span>
                          <span className="shrink-0 text-[10px] text-ink-faint">
                            {TYPE_LABEL[col.type]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        {/* Right: union picker, source setup, or data preview */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {isUnion ? (
            <UnionInputsPicker
              transform={target.transform}
              canvasDataNodes={canvasDataNodes}
              onSaved={onUnionSaved}
              onToggleFeed={onToggleUnionFeed}
            />
          ) : needsSource ? (
            <FeedSourceSetup
              tables={tables}
              search=""
              onCommit={(commit) => onApplySource(target, commit)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-edge px-3 py-2">
                <div className="text-[12px] text-ink-dim">
                  Previewing {Math.min(filteredRows.length, 50)} of{' '}
                  {(page?.rowCount ?? dataset?.rowCount ?? 0).toLocaleString()} rows
                  {columns.length ? ` · ${columns.length} columns` : null}
                </div>
                <div className="flex w-56 items-center gap-2 rounded-sm border border-edge px-2 py-1.5">
                  <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                  <input
                    value={rowQuery}
                    onChange={(e) => setRowQuery(e.target.value)}
                    placeholder="Search values"
                    className="w-full bg-transparent text-[12px] text-ink outline-none placeholder:text-ink-faint"
                  />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                {loading ? (
                  <p className="px-4 py-6 text-sm text-ink-faint">Loading data…</p>
                ) : error ? (
                  <p className="px-4 py-6 text-sm text-signal-red">{error}</p>
                ) : visibleColumnNames.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-ink-faint">No rows in this dataset yet.</p>
                ) : (
                  <table className="min-w-full border-collapse text-left text-[12px]">
                    <thead className="sticky top-0 bg-base-700/95 text-ink-faint backdrop-blur">
                      <tr>
                        <th className="w-10 px-2 py-1.5 font-mono font-normal">#</th>
                        {visibleColumnNames.map((name) => (
                          <th
                            key={name}
                            className="whitespace-nowrap px-2 py-1.5 font-mono font-normal"
                          >
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={visibleColumnNames.length + 1}
                            className="px-3 py-4 text-ink-faint"
                          >
                            No matching rows.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row, index) => (
                          <tr key={index} className="border-t border-edge hover:bg-base-700/40">
                            <td className="px-2 py-1.5 font-mono text-ink-faint">{index + 1}</td>
                            {visibleColumnNames.map((name) => (
                              <td
                                key={name}
                                className="max-w-[220px] truncate px-2 py-1.5 text-ink"
                                title={cellText(row[name])}
                              >
                                {cellText(row[name])}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
