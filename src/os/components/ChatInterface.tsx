import { useEffect, useRef, useState } from 'react'
import type { JSX } from 'react'
import { ArrowUp, Loader2, Square, X } from 'lucide-react'
import type { useChat } from '../lib/useChat'
import type { ObjectRef } from '../lib/commandTypes'
import MessageBubble from './MessageBubble'
import ChatTabsIsland from './ChatTabsIsland'

const SUGGESTIONS = [
  'What data is connected?',
  'Union my two supplier sheets',
  'Show me the feeds in Metaphysics'
]

export default function ChatInterface({
  chat,
  attachedObjects,
  onRemoveObject,
  onClearObjects
}: {
  chat: ReturnType<typeof useChat>
  attachedObjects: ObjectRef[]
  onAttach: (ref: ObjectRef) => void
  onRemoveObject: (ref: string) => void
  onClearObjects: () => void
}): JSX.Element {
  const { messages, busy, send, stop, sessions, activeId, newChat, switchChat, deleteChat, renameChat } =
    chat
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Clear composer when switching chats.
  useEffect(() => {
    setInput('')
    onClearObjects()
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps -- only on chat switch

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = '2.75rem'
    ta.style.height = `${Math.min(Math.max(ta.scrollHeight, 44), 160)}px`
  }, [input])

  const submit = (): void => {
    const objectText = attachedObjects.length
      ? `Regarding ${attachedObjects.map((o) => o.ref).join(', ')}.`
      : ''
    const note = input.trim()
    const payload = [objectText, note].filter(Boolean).join('\n\n')
    if (!payload.trim() || busy) return

    send(payload)
    setInput('')
    onClearObjects()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const chatStarted = messages.some((m) => m.id !== 'boot')
  const canSend = Boolean(input.trim() || attachedObjects.length)
  const phase = messages.find((m) => m.streaming)?.phase

  return (
    <div className="relative flex h-full flex-col">
        <ChatTabsIsland
          sessions={sessions}
          activeId={activeId}
          onNew={newChat}
          onSwitch={switchChat}
          onDelete={deleteChat}
          onRename={renameChat}
        />

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div
            key={activeId}
            className={
              chatStarted
                ? 'chat-pane-enter mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8'
                : 'chat-pane-enter mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6 px-6'
            }
          >
            {(chatStarted ? messages.filter((m) => m.id !== 'boot') : messages).map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {!chatStarted && (
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-edge bg-white px-3 py-1.5 text-[12px] text-ink-dim transition-colors hover:border-spectr-accent hover:text-spectr-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-base-900 px-6 pb-5 pt-2">
          <div className="mx-auto w-full max-w-2xl">
            {busy && (
              <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-mono uppercase tracking-[0.12em] text-ink-dim">
                <Loader2 className="h-3 w-3 animate-spin text-spectr-accent" />
                <span>{phase ?? 'Working'}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div
                className="bevel min-h-[2.75rem] min-w-0 flex-1 !h-auto !justify-start !gap-0 !bg-white !px-0 !py-0 !normal-case !tracking-normal !font-normal hover:!opacity-100"
                style={{ ['--bevel-cut' as string]: '8px' }}
              >
                {attachedObjects.length > 0 && (
                  <div className="mb-1 flex flex-wrap gap-1.5 px-3 pt-2">
                    {attachedObjects.map((o) => (
                      <span key={o.ref} className="group relative inline-flex" title={o.title}>
                        <span
                          className="bevel bevel-sm bevel-secondary !gap-0 !normal-case !tracking-normal !font-medium max-w-[200px] truncate px-2.5 py-1.5 font-mono text-[11px]"
                          style={{ ['--bevel-cut' as string]: '6px' }}
                        >
                          {o.ref}
                        </span>
                        <button
                          type="button"
                          title="Remove"
                          onClick={() => onRemoveObject(o.ref)}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-white opacity-0 shadow-panel transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-2.5 w-2.5" strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <textarea
                  ref={taRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Tell Spectr what data you need"
                  className="scrollbar-invisible max-h-[160px] min-h-[2.75rem] w-full resize-none overflow-y-auto bg-transparent px-4 py-3 text-[15px] font-normal leading-[1.4] tracking-normal text-ink placeholder:text-ink-faint focus:outline-none"
                  style={{ userSelect: 'text', height: '2.75rem' }}
                />
              </div>

              {busy ? (
                <button
                  onClick={stop}
                  title="Stop"
                  className="bevel bevel-icon bevel-quiet shrink-0"
                >
                  <Square className="h-4 w-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canSend}
                  title="Send"
                  className="bevel bevel-icon bevel-primary shrink-0"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}
