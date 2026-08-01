import type { JSX, ReactNode } from 'react'
import type { ChatMessage } from '../lib/types'
import type { ObjectType } from '../lib/commandTypes'
import AgentRunCard from './AgentRunCard'
import ArtifactRenderer from './artifacts/ArtifactRenderer'
import ObjectChip from './artifacts/ObjectChip'

const logo = '/os-assets/logo-white.png'

/** Platform codes Spectr mentions in prose become openable chips. */
const REF_PATTERN = /\b((?:feed|dataset|transform|object|link)\.[a-z0-9_.-]+)\b/gi

function refType(token: string): ObjectType {
  return token.split('.')[0].toLowerCase()
}

/**
 * Models drift into markdown even when told not to. This surface renders text
 * literally, so strip the emphasis markers rather than show them raw.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\s)\*(\S(?:.*?\S)?)\*(?=\s|$)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
}

function linkifyRefs(raw: string): ReactNode[] {
  const text = stripMarkdown(raw)
  const nodes: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  REF_PATTERN.lastIndex = 0

  while ((match = REF_PATTERN.exec(text)) != null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    nodes.push(
      <ObjectChip
        key={`${match[0]}-${match.index}`}
        type={refType(match[0])}
        label={match[0]}
        compact
      />
    )
    last = match.index + match[0].length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export default function MessageBubble({ message }: { message: ChatMessage }): JSX.Element {
  const isUser = message.role === 'user'
  const isGreeting = message.id === 'boot'

  if (isGreeting) {
    return (
      <div className="flex select-none items-center justify-center gap-3.5">
        <img src={logo} alt="" className="h-11 w-11 shrink-0 object-contain invert" aria-hidden />
        <span className="font-palantir text-3xl font-semibold tracking-tight text-ink">
          {message.content}
        </span>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] select-text whitespace-pre-wrap bg-spectr-accent/15 px-4 py-3 text-sm leading-relaxed text-ink">
          {message.content}
        </div>
      </div>
    )
  }

  const hasSteps = (message.steps?.length ?? 0) > 0
  const hasArtifacts = (message.artifacts?.length ?? 0) > 0

  return (
    <div className="flex flex-col gap-3">
      {hasSteps && (
        <AgentRunCard steps={message.steps!} run={message.run} streaming={message.streaming} />
      )}

      {hasArtifacts && <ArtifactRenderer artifacts={message.artifacts!} />}

      {(message.content || message.streaming) && (
        <div className="select-text whitespace-pre-wrap text-sm leading-relaxed text-ink">
          {linkifyRefs(message.content)}
          {message.streaming && !hasSteps && !hasArtifacts && (
            <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-blink bg-spectr-accent" />
          )}
        </div>
      )}
    </div>
  )
}
