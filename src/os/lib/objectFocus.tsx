import { createContext, useContext } from 'react'

/**
 * Lets any object reference anywhere in a reply open its own situation, or be
 * attached to the composer, without threading callbacks through every artifact.
 */
export interface ObjectFocusApi {
  /** Render this object's situation inline in the conversation. */
  open: (ref: string) => void
  /** Attach this object to the composer as a chip. */
  attach: (ref: string) => void
}

const ObjectFocusContext = createContext<ObjectFocusApi>({
  open: () => {},
  attach: () => {}
})

export const ObjectFocusProvider = ObjectFocusContext.Provider

export function useObjectFocus(): ObjectFocusApi {
  return useContext(ObjectFocusContext)
}
