import { useEffect, useRef, useState, type JSX } from 'react'
import { Bot, ChevronDown, Database, GitMerge, Plus, Zap } from 'lucide-react'

export type NewNodeKind = 'agent' | 'data' | 'union' | 'action'

const NODE_OPTIONS: Array<{
  kind: NewNodeKind
  label: string
  description: string
  icon: typeof Plus
}> = [
  {
    kind: 'agent',
    label: 'AI Agent',
    description: 'An agent that works with data and Command',
    icon: Bot
  },
  {
    kind: 'data',
    label: 'Data',
    description: 'A dataset or feed into the graph',
    icon: Database
  },
  {
    kind: 'union',
    label: 'Union',
    description: 'Stack multiple datasets into one',
    icon: GitMerge
  },
  {
    kind: 'action',
    label: 'Action',
    description: 'A step that does something with results',
    icon: Zap
  }
]

interface MetaphysicsNavbarProps {
  onAddNode: (kind: NewNodeKind) => void
}

/** Full-width Metaphysics top bar. New node is the first control. */
export default function MetaphysicsNavbar({ onAddNode }: MetaphysicsNavbarProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent): void => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center gap-1 border-b border-edge bg-white px-3">
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-[12px] font-medium transition-colors ${
            open
              ? 'bg-ink text-white'
              : 'text-ink hover:bg-base-700'
          }`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New node
          <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[260px] overflow-hidden rounded-sm border border-edge bg-white shadow-panel"
          >
            {NODE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.kind}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false)
                    onAddNode(opt.kind)
                  }}
                  className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-base-700/60"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-dim" />
                  <span>
                    <span className="block text-[13px] font-medium text-ink">{opt.label}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-dim">{opt.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </header>
  )
}
