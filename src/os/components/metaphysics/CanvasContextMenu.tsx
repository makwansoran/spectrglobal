import type { JSX } from 'react'

export interface ContextMenuItem {
  id: string
  label: string
  description?: string
  disabled?: boolean
  danger?: boolean
}

interface CanvasContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onPick: (id: string) => void
  onClose: () => void
}

/** Lightweight right-click menu for multi-select actions on the canvas. */
export default function CanvasContextMenu({
  x,
  y,
  items,
  onPick,
  onClose
}: CanvasContextMenuProps): JSX.Element {
  return (
    <>
      <button
        type="button"
        aria-label="Dismiss menu"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault()
          onClose()
        }}
      />
      <div
        className="fixed z-50 min-w-[200px] overflow-hidden rounded-sm border border-edge bg-white shadow-panel"
        style={{ left: x, top: y }}
        role="menu"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return
              onPick(item.id)
            }}
            className={`block w-full px-3 py-2.5 text-left transition-colors ${
              item.disabled
                ? 'cursor-not-allowed opacity-40'
                : item.danger
                  ? 'hover:bg-signal-red/10'
                  : 'hover:bg-base-600/50'
            }`}
          >
            <div
              className={`text-[13px] font-medium ${item.danger ? 'text-signal-red' : 'text-ink'}`}
            >
              {item.label}
            </div>
            {item.description ? (
              <div className="mt-0.5 text-[11px] text-ink-dim">{item.description}</div>
            ) : null}
          </button>
        ))}
      </div>
    </>
  )
}
