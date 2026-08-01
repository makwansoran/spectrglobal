import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react'
import { X } from 'lucide-react'

interface CreateFeedModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export default function CreateFeedModal({
  open,
  onClose,
  onCreate
}: CreateFeedModalProps): JSX.Element | null {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setName('')
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const trimmed = name.trim()

  const submit = (e: FormEvent): void => {
    e.preventDefault()
    if (!trimmed) return
    onCreate(trimmed)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bevel-panel w-full max-w-md overflow-hidden bg-white shadow-panel"
        style={{ ['--bevel-cut' as string]: '16px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add video feed"
      >
        <div className="flex items-start justify-between border-b border-edge px-4 py-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-dim">
              Argus
            </div>
            <div className="mt-0.5 text-sm font-medium text-ink">New video feed</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-dim hover:bg-base-600 hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="px-4 py-4">
          <label className="block text-[11px] font-mono uppercase tracking-[0.12em] text-ink-dim">
            Feed name
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gate cam 1"
              className="mt-2 h-10 w-full rounded-sm border border-edge bg-white px-3 text-[13px] font-sans normal-case tracking-normal text-ink outline-none placeholder:text-ink-faint focus:border-ink/30"
            />
          </label>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="bevel bevel-sm bevel-quiet">
              Cancel
            </button>
            <button type="submit" disabled={!trimmed} className="bevel bevel-sm bevel-primary">
              Add feed
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
