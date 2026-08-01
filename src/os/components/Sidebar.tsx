import { useState } from 'react'
import type { JSX } from 'react'
import clsx from 'clsx'
import {
  Eye,
  Library,
  Map,
  MessageSquare,
  Settings,
  Share2
} from 'lucide-react'
import type { ViewId } from '../lib/views'

const logo = '/os-assets/logo-white.png'

interface NavLeaf {
  id: ViewId
  label: string
  icon: typeof MessageSquare
}

const PRIMARY_NAV: NavLeaf[] = [
  { id: 'command', label: 'Command', icon: MessageSquare },
  { id: 'metaphysics', label: 'Metaphysics', icon: Share2 }
]

const APPLICATION_NAV: NavLeaf[] = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'catalog', label: 'Catalog', icon: Library },
  { id: 'argus', label: 'Argus', icon: Eye }
]

type NavVariant = 'default' | 'purple' | 'yellow' | 'green'

const APP_VARIANTS: Partial<Record<ViewId, NavVariant>> = {
  map: 'purple',
  catalog: 'yellow',
  argus: 'green'
}

interface SidebarProps {
  active: ViewId
  onNavigate: (id: ViewId) => void
}

function NavButton({
  item,
  active,
  expanded,
  onNavigate,
  variant = 'default'
}: {
  item: NavLeaf
  active: ViewId
  expanded: boolean
  onNavigate: (id: ViewId) => void
  variant?: NavVariant
}): JSX.Element {
  const Icon = item.icon
  const isActive = active === item.id
  const isPurple = variant === 'purple'
  const isYellow = variant === 'yellow'
  const isGreen = variant === 'green'
  const isFilled = isPurple || isYellow || isGreen

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      title={item.label}
      className={clsx(
        'relative flex h-11 w-full items-center gap-3 rounded-sm px-3 transition-colors',
        isPurple &&
          clsx('bg-signal-violet text-white hover:bg-[#6d28d9]', isActive && 'ring-1 ring-white/30'),
        isYellow &&
          clsx(
            'bg-[#eab308] text-black hover:bg-[#ca8a04]',
            isActive && 'ring-1 ring-white/40'
          ),
        isGreen &&
          clsx(
            'bg-signal-green text-white hover:bg-[#15803d]',
            isActive && 'ring-1 ring-white/30'
          ),
        !isFilled && (isActive ? 'text-white' : 'text-white/55 hover:text-white')
      )}
    >
      {!isFilled && isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 bg-white" />
      )}
      <Icon
        className={clsx(
          'h-[18px] w-[18px] shrink-0',
          isPurple && 'text-white',
          isYellow && 'text-black',
          isGreen && 'text-white'
        )}
      />
      {expanded && (
        <span className="truncate text-[13px] font-medium">{item.label}</span>
      )}
    </button>
  )
}

export default function Sidebar({ active, onNavigate }: SidebarProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  return (
    <nav
      className={clsx(
        'flex shrink-0 flex-col border-r border-white/10 bg-black py-3 transition-[width] duration-200 ease-out',
        expanded ? 'w-60' : 'w-16'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={clsx(
          'mb-2 flex h-14 items-center',
          expanded ? 'justify-start gap-3 px-4' : 'justify-center'
        )}
      >
        <img src={logo} alt="Spectr" className="h-8 w-8 shrink-0 object-contain" />
        {expanded && (
          <span className="font-palantir truncate text-[22px] font-semibold tracking-[-0.02em] text-white">
            Spectr
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 px-2">
        {PRIMARY_NAV.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active}
            expanded={expanded}
            onNavigate={onNavigate}
          />
        ))}

        <div className={clsx('mt-3 mb-1', expanded ? 'px-3' : 'px-1')}>
          {expanded && (
            <p className="mb-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-white/35">
              Applications
            </p>
          )}
          <div className="border-t border-white/10" />
        </div>

        {APPLICATION_NAV.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active}
            expanded={expanded}
            onNavigate={onNavigate}
            variant={APP_VARIANTS[item.id] ?? 'default'}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-0.5 px-2 pt-2">
        <NavButton
          item={{ id: 'settings', label: 'Settings', icon: Settings }}
          active={active}
          expanded={expanded}
          onNavigate={onNavigate}
        />
      </div>
    </nav>
  )
}
