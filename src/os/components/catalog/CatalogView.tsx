import type { JSX } from 'react'
import { Search } from 'lucide-react'

/** Data catalog — browse and find datasets to use in Spectr. */
export default function CatalogView(): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col bg-base-900">
      <header className="shrink-0 border-b border-edge px-8 py-5">
        <h1 className="text-lg font-medium text-ink">Catalog</h1>
        <p className="mt-1 text-sm text-ink-dim">
          Find datasets to use across Command, Metaphysics, and applications.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-8 py-5">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            placeholder="Search datasets…"
            className="h-10 w-full rounded-sm border border-edge bg-white pl-10 pr-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-ink/30"
          />
        </div>

        <div className="mt-8 flex flex-1 items-start justify-center">
          <p className="max-w-md text-center text-sm text-ink-faint">
            No datasets yet. Connect a source or import data to populate the catalog.
          </p>
        </div>
      </div>
    </div>
  )
}
