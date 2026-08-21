import { type JSX } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { NODE_META, type NodeKind } from '../../lib/model'

export type MetaphysicsFlowNode = Node<
  {
    kind: NodeKind
    label: string
    code: string
    qty: number
    status?: 'ok' | 'error' | 'stale' | 'unmapped' | 'building' | 'unset'
    detail?: string
    module?: string
  },
  'spectr'
>

function statusColor(
  status: MetaphysicsFlowNode['data']['status'],
  selected: boolean
): string | undefined {
  if (selected) return undefined
  if (status === 'error') return '#dc2626'
  if (status === 'stale' || status === 'building' || status === 'unmapped' || status === 'unset') {
    return '#ca8a04'
  }
  return undefined
}

export default function MetaphysicsNodeCard({
  data,
  selected
}: NodeProps<MetaphysicsFlowNode>): JSX.Element {
  const meta = NODE_META[data.kind]
  const accent = statusColor(data.status, selected) ?? meta.color
  const isCommand = data.kind === 'command'
  const kindTitle =
    data.kind === 'transform' && data.module === 'union' ? 'Union' : meta.title

  return (
    <div
      className="bevel-panel relative min-w-[180px] max-w-[240px] px-3.5 py-3"
      style={{
        background: selected || isCommand ? meta.color : meta.soft,
        color: selected || isCommand ? '#f4f5f7' : '#07080c',
        boxShadow: selected
          ? `0 8px 24px ${meta.color}40`
          : isCommand
            ? '0 12px 36px rgba(15,23,42,0.28)'
            : data.status === 'error'
              ? `0 0 0 2px #dc2626, 0 8px 28px rgba(15,23,42,0.08)`
              : data.status === 'unset' || data.status === 'stale'
                ? `0 0 0 2px #ca8a04, 0 8px 28px rgba(15,23,42,0.08)`
                : '0 8px 28px rgba(15,23,42,0.08)'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!-left-1 !h-2.5 !w-2.5 !border-0"
        style={{ background: selected || isCommand ? '#f4f5f7' : accent }}
      />

      <div
        className="text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          color: selected || isCommand ? 'rgba(244,245,247,0.75)' : accent
        }}
      >
        {kindTitle}
        {data.status === 'unset' ? (
          <span className="ml-1.5 font-mono normal-case tracking-normal opacity-80">unset</span>
        ) : null}
      </div>
      <div
        className={`mt-1.5 truncate font-semibold leading-tight ${isCommand ? 'font-spectr-os text-xl tracking-tight' : 'text-sm'}`}
      >
        {data.label}
      </div>
      {data.detail ? (
        <div
          className="mt-1 line-clamp-2 text-[11px] leading-snug"
          style={{
            color: selected || isCommand ? 'rgba(244,245,247,0.7)' : '#5b6470'
          }}
        >
          {data.detail}
        </div>
      ) : null}
      {(data.kind === 'feed' || data.kind === 'transform') && data.qty > 0 ? (
        <div
          className="mt-2 font-mono text-[10px] tabular"
          style={{
            color: selected ? 'rgba(244,245,247,0.8)' : '#5b6470'
          }}
        >
          {data.qty.toLocaleString()} rows
        </div>
      ) : null}

      <Handle
        type="source"
        position={Position.Right}
        className="!-right-1 !h-2.5 !w-2.5 !border-0"
        style={{ background: selected || isCommand ? '#f4f5f7' : accent }}
      />
    </div>
  )
}
