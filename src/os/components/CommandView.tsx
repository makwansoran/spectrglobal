import { useCallback, useEffect, useMemo, useState } from 'react'
import type { JSX } from 'react'
import { useChat } from '../lib/useChat'
import { ObjectFocusProvider } from '../lib/objectFocus'
import type { ObjectRef } from '../lib/commandTypes'
import { consumePendingSituation, onSituationRequest } from '../lib/commandNav'
import ChatInterface from './ChatInterface'

/**
 * Owns the command session so chat and object-focus share one conversation.
 * Requests from other views open in the centre.
 */
export default function CommandView(): JSX.Element {
  const chat = useChat()
  const [attachedObjects, setAttachedObjects] = useState<ObjectRef[]>([])

  const attach = useCallback((ref: string | ObjectRef) => {
    const next: ObjectRef =
      typeof ref === 'string'
        ? { type: 'dataset', id: `raw:${ref}`, ref, title: ref }
        : ref
    setAttachedObjects((prev) => (prev.some((o) => o.ref === next.ref) ? prev : [...prev, next]))
  }, [])

  // Chat is the only control surface, so opening an object is just asking about it.
  const open = useCallback(
    (ref: string) => {
      void chat.send(`Show me ${ref}`)
    },
    [chat]
  )

  useEffect(() => {
    const pending = consumePendingSituation()
    if (pending) open(pending)
    return onSituationRequest((ref) => {
      if (!ref) return
      const next = consumePendingSituation() ?? ref
      open(next)
    })
  }, [open])

  const clearObjects = useCallback(() => setAttachedObjects([]), [])

  const focusApi = useMemo(() => ({ open, attach }), [open, attach])

  return (
    <ObjectFocusProvider value={focusApi}>
      <div className="h-full min-w-0 flex-1">
        <ChatInterface
          chat={chat}
          attachedObjects={attachedObjects}
          onAttach={attach}
          onRemoveObject={(ref) =>
            setAttachedObjects((prev) => prev.filter((o) => o.ref !== ref))
          }
          onClearObjects={clearObjects}
        />
      </div>
    </ObjectFocusProvider>
  )
}
