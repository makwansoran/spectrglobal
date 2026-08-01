import type { JSX } from 'react'
import { Boxes, Database, Filter, GitBranch, Radio, Shapes } from 'lucide-react'
import type { ObjectType } from '../../lib/commandTypes'
import { useObjectFocus } from '../../lib/objectFocus'

/**
 * Object types are declared by the operator, so the icon is a hint keyed off the
 * platform layer the ref belongs to rather than a fixed domain vocabulary.
 */
const ICON: Record<string, typeof Shapes> = {
  feed: Radio,
  dataset: Database,
  transform: Filter,
  object: Shapes,
  link: GitBranch,
  lineage: GitBranch,
  table: Boxes
}

/**
 * A clickable reference to a platform object. Used inside prose and inside
 * artifacts so the operator can pivot without leaving the conversation.
 */
export default function ObjectChip({
  type,
  label,
  title,
  compact
}: {
  type: ObjectType
  label: string
  title?: string
  compact?: boolean
}): JSX.Element {
  const { open } = useObjectFocus()
  const Icon = ICON[type] ?? Shapes

  return (
    <button
      type="button"
      title={title ?? `Open ${label}`}
      onClick={() => open(label)}
      className={`inline-flex items-center gap-1 rounded-[4px] border border-edge bg-base-700 align-baseline font-mono text-ink transition-colors hover:border-spectr-accent hover:bg-spectr-accent/10 hover:text-spectr-accent ${
        compact ? 'px-1 py-px text-[10px]' : 'px-1.5 py-0.5 text-[11px]'
      }`}
    >
      <Icon className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} strokeWidth={2} />
      {label}
    </button>
  )
}
