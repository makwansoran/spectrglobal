import { useCallback, useState, type JSX } from 'react'
import { ArrowLeft, Plus, Video, X } from 'lucide-react'
import type { ArgusDashboard, ArgusFeed } from './argusStore'
import { createFeed } from './argusStore'
import ArgusAppsIsland, { type ArgusApp } from './ArgusAppsIsland'
import CreateFeedModal from './CreateFeedModal'

interface ArgusDashboardPageProps {
  dashboard: ArgusDashboard
  onBack: () => void
  onUpdate: (next: ArgusDashboard) => void
}

export default function ArgusDashboardPage({
  dashboard,
  onBack,
  onUpdate
}: ArgusDashboardPageProps): JSX.Element {
  const [app, setApp] = useState<ArgusApp>('dashboard')
  const [activeFeedId, setActiveFeedId] = useState<string | null>(null)
  const [feedModalOpen, setFeedModalOpen] = useState(false)

  const addFeed = useCallback(
    (name: string) => {
      const feed = createFeed(name)
      onUpdate({
        ...dashboard,
        feeds: [...dashboard.feeds, feed]
      })
      setApp('video')
      setActiveFeedId(feed.id)
    },
    [dashboard, onUpdate]
  )

  const removeFeed = useCallback(
    (id: string) => {
      const nextFeeds = dashboard.feeds.filter((f) => f.id !== id)
      onUpdate({ ...dashboard, feeds: nextFeeds })
      if (activeFeedId === id) {
        setActiveFeedId(nextFeeds[0]?.id ?? null)
      }
    },
    [activeFeedId, dashboard, onUpdate]
  )

  const selectApp = (next: ArgusApp): void => {
    setApp(next)
    if (next === 'video' && !activeFeedId && dashboard.feeds[0]) {
      setActiveFeedId(dashboard.feeds[0].id)
    }
  }

  const activeFeed =
    activeFeedId != null
      ? (dashboard.feeds.find((f) => f.id === activeFeedId) ?? null)
      : null

  return (
    <div className="relative flex h-full w-full flex-col bg-base-900">
      <header className="flex shrink-0 items-center gap-3 border-b border-edge px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          title="Back to Argus"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-dim transition-colors hover:bg-base-600 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div className="min-w-0">
          <h1 className="font-palantir truncate text-2xl font-semibold tracking-tight text-ink">
            {dashboard.name}
          </h1>
          <p className="mt-0.5 text-[12px] text-ink-dim">
            {app === 'dashboard' ? 'Dashboard' : 'Video feed'}
          </p>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-24 pt-6">
        {app === 'dashboard' ? (
          <DashboardApp feeds={dashboard.feeds} onGoToVideo={() => selectApp('video')} />
        ) : (
          <VideoFeedApp
            feeds={dashboard.feeds}
            activeFeed={activeFeed}
            onSelectFeed={setActiveFeedId}
            onAddFeed={() => setFeedModalOpen(true)}
            onRemoveFeed={removeFeed}
          />
        )}
      </div>

      <ArgusAppsIsland
        active={app}
        onSelect={selectApp}
        feedCount={dashboard.feeds.length}
      />

      <CreateFeedModal
        open={feedModalOpen}
        onClose={() => setFeedModalOpen(false)}
        onCreate={addFeed}
      />
    </div>
  )
}

function DashboardApp({
  feeds,
  onGoToVideo
}: {
  feeds: ArgusFeed[]
  onGoToVideo: () => void
}): JSX.Element {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium text-ink">Dashboard</h2>
          <p className="mt-0.5 text-[12px] text-ink-dim">
            Overview of this workspace. Video feeds live in the Video feed app.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToVideo}
          className="text-[12px] font-medium text-signal-green hover:underline"
        >
          Open video feed →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-sm border border-edge bg-white px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Video feeds
          </div>
          <div className="mt-1 font-palantir text-2xl font-semibold tracking-tight text-ink">
            {feeds.length}
          </div>
        </div>
        <div className="rounded-sm border border-edge bg-white px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Vision models
          </div>
          <div className="mt-1 font-palantir text-2xl font-semibold tracking-tight text-ink">
            0
          </div>
        </div>
        <div className="rounded-sm border border-edge bg-white px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Status
          </div>
          <div className="mt-1 text-[14px] font-medium text-ink">Idle</div>
        </div>
      </div>

      {feeds.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-faint">
          No feeds yet. Switch to Video feed to add cameras.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-edge border border-edge bg-white">
          {feeds.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-4 py-2.5">
              <Video className="h-4 w-4 text-ink-faint" />
              <span className="text-[13px] text-ink">{f.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VideoFeedApp({
  feeds,
  activeFeed,
  onSelectFeed,
  onAddFeed,
  onRemoveFeed
}: {
  feeds: ArgusFeed[]
  activeFeed: ArgusFeed | null
  onSelectFeed: (id: string) => void
  onAddFeed: () => void
  onRemoveFeed: (id: string) => void
}): JSX.Element {
  if (feeds.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-ink-faint">No video feeds yet.</p>
        <button type="button" onClick={onAddFeed} className="bevel bevel-primary">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add video feed
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl gap-4">
      <aside className="flex w-52 shrink-0 flex-col border border-edge bg-white">
        <div className="flex items-center justify-between border-b border-edge px-3 py-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">
            Feeds
          </span>
          <button
            type="button"
            title="Add video feed"
            onClick={onAddFeed}
            className="flex h-6 w-6 items-center justify-center rounded-sm text-ink-dim hover:bg-base-600 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto py-1">
          {feeds.map((f) => {
            const active = activeFeed?.id === f.id
            return (
              <li key={f.id} className="group flex items-center gap-0.5 px-1">
                <button
                  type="button"
                  onClick={() => onSelectFeed(f.id)}
                  className={`min-w-0 flex-1 truncate rounded-sm px-2 py-1.5 text-left text-[12px] ${
                    active ? 'bg-base-600 font-medium text-ink' : 'text-ink-dim hover:bg-base-600/60'
                  }`}
                >
                  {f.name}
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => onRemoveFeed(f.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-ink-faint opacity-0 hover:text-ink group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm border border-edge bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_60%)]" />
        {activeFeed ? (
          <div className="relative flex flex-col items-center gap-3 text-center">
            <Video className="h-10 w-10 text-white/30" />
            <div>
              <p className="text-[14px] font-medium text-white/80">{activeFeed.name}</p>
              <p className="mt-1 text-[12px] text-white/40">Video source not connected yet.</p>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-white/40">Select a feed</p>
        )}
      </div>
    </div>
  )
}
