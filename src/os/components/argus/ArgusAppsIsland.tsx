import type { JSX } from 'react'
import { LayoutDashboard, Video } from 'lucide-react'

export type ArgusApp = 'dashboard' | 'video'

interface ArgusAppsIslandProps {
  active: ArgusApp
  onSelect: (app: ArgusApp) => void
  feedCount: number
}

/** Floating bottom island — Dashboard and Video feed as separate apps. */
export default function ArgusAppsIsland({
  active,
  onSelect,
  feedCount
}: ArgusAppsIslandProps): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-5">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white px-1.5 py-1 shadow-panel">
        <button
          type="button"
          title="Dashboard"
          onClick={() => onSelect('dashboard')}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] transition-colors ${
            active === 'dashboard'
              ? 'bg-base-600 font-medium text-ink'
              : 'text-ink-dim hover:bg-base-600/70'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          Dashboard
        </button>

        <button
          type="button"
          title="Video feed"
          onClick={() => onSelect('video')}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] transition-colors ${
            active === 'video'
              ? 'bg-base-600 font-medium text-ink'
              : 'text-ink-dim hover:bg-base-600/70'
          }`}
        >
          <Video className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          Video feed
          {feedCount > 0 && (
            <span
              className={`ml-0.5 rounded-full px-1.5 text-[10px] font-mono ${
                active === 'video' ? 'bg-ink/10 text-ink' : 'bg-base-600 text-ink-dim'
              }`}
            >
              {feedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
