import { useCallback, useEffect, useState, type JSX } from 'react'
import { Plus } from 'lucide-react'
import CreateDashboardModal from './CreateDashboardModal'
import ArgusDashboardPage from './ArgusDashboardPage'
import {
  createDashboard,
  readDashboards,
  writeDashboards,
  type ArgusDashboard
} from './argusStore'

/** Argus — computer vision dashboards for cameras. */
export default function ArgusView(): JSX.Element {
  const [dashboards, setDashboards] = useState<ArgusDashboard[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    setDashboards(readDashboards())
  }, [])

  const persist = useCallback((list: ArgusDashboard[]) => {
    setDashboards(list)
    writeDashboards(list)
  }, [])

  const onCreateDashboard = useCallback(
    (name: string) => {
      const next = createDashboard(name)
      persist([next, ...readDashboards()])
      setOpenId(next.id)
    },
    [persist]
  )

  const onUpdateDashboard = useCallback(
    (updated: ArgusDashboard) => {
      const list = readDashboards().map((d) => (d.id === updated.id ? updated : d))
      persist(list)
    },
    [persist]
  )

  const openDashboard = dashboards.find((d) => d.id === openId) ?? null

  if (openDashboard) {
    return (
      <ArgusDashboardPage
        dashboard={openDashboard}
        onBack={() => setOpenId(null)}
        onUpdate={onUpdateDashboard}
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-base-900">
      <header className="flex shrink-0 items-end justify-between gap-4 border-b border-edge px-8 py-6">
        <div>
          <h1 className="font-palantir text-3xl font-semibold tracking-tight text-ink">Argus</h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-dim">
            Computer vision page — create camera dashboards and add vision models.
          </p>
        </div>
        {dashboards.length > 0 && (
          <button type="button" onClick={() => setModalOpen(true)} className="bevel bevel-primary">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create new
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        {dashboards.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <button type="button" onClick={() => setModalOpen(true)} className="bevel bevel-primary">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create new
            </button>
          </div>
        ) : (
          <ul className="mx-auto grid w-full max-w-3xl gap-2">
            {dashboards.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(d.id)}
                  className="flex w-full items-center justify-between rounded-sm border border-edge bg-white px-4 py-3 text-left transition-colors hover:border-ink/25"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium text-ink">{d.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-faint">
                      {d.feeds.length} video feed{d.feeds.length === 1 ? '' : 's'}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] font-mono text-ink-faint">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateDashboardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={onCreateDashboard}
      />
    </div>
  )
}
