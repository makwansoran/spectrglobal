/**
 * Helpers for unique Metaphysics feed identity — labels, draft ids, file → config.
 */

import type { FeedConfig, FeedKind } from '@/os/shared/platform'

/** Allocate a human label that is not already used by feeds or drafts. */
export function allocateUniqueFeedLabel(
  taken: Iterable<string>,
  base = 'Data feed'
): string {
  const set = new Set(
    [...taken].map((s) => s.trim().toLowerCase()).filter(Boolean)
  )
  if (!set.has(base.toLowerCase())) return base
  for (let i = 2; i < 10_000; i++) {
    const candidate = `${base} ${i}`
    if (!set.has(candidate.toLowerCase())) return candidate
  }
  return `${base} ${Date.now()}`
}

/** Fresh draft id that cannot collide with existing draft/feed/transform ids. */
export function allocateDraftId(taken: Iterable<string>): string {
  const set = new Set(taken)
  for (let i = 0; i < 32; i++) {
    const id = `draft-${Math.random().toString(36).slice(2, 10)}`
    if (!set.has(id)) return id
  }
  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsText(file)
  })
}

/** Map a dropped/picked file into a feed config by extension. */
export async function configFromDataFile(file: File): Promise<{
  config: FeedConfig
  suggestedLabel: string
}> {
  const name = file.name
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : ''
  const stem = name.replace(/\.[^.]+$/, '').trim() || 'Imported data'

  if (ext === 'xlsx' || ext === 'xlsm') {
    const base64 = await fileToBase64(file)
    return {
      suggestedLabel: stem,
      config: { kind: 'excel', base64, filename: name }
    }
  }

  const text = await fileToText(file)

  if (ext === 'json') {
    return { suggestedLabel: stem, config: { kind: 'json', text, filename: name } }
  }
  if (ext === 'xml') {
    return { suggestedLabel: stem, config: { kind: 'xml', text, filename: name } }
  }
  if (ext === 'sql') {
    return { suggestedLabel: stem, config: { kind: 'sql', text, filename: name } }
  }
  if (ext === 'tsv' || ext === 'tab') {
    return {
      suggestedLabel: stem,
      config: { kind: 'csv', text, delimiter: '\t', filename: name }
    }
  }
  // csv, txt, log, md, and unknown text-like → delimited
  if (
    ext === 'csv' ||
    ext === 'txt' ||
    ext === 'log' ||
    ext === '' ||
    text.includes(',') ||
    text.includes('\t') ||
    text.includes(';')
  ) {
    return { suggestedLabel: stem, config: { kind: 'csv', text, filename: name } }
  }

  throw new Error(
    `Unsupported file type ".${ext || '?'}". Use CSV, TSV, JSON, XML, SQL, Excel, or plain text.`
  )
}

export const SOURCE_KIND_META: Array<{
  kind: FeedKind | 'file'
  name: string
  description: string
}> = [
  {
    kind: 'file',
    name: 'Drop or pick a file',
    description: 'CSV, Excel, JSON, XML, SQL, TSV — any tabular data file'
  },
  {
    kind: 'static',
    name: 'Write manually',
    description: 'Empty table you fill yourself'
  },
  {
    kind: 'http.poll',
    name: 'API connection',
    description: 'Pull JSON or CSV with name, description, and API key'
  },
  {
    kind: 'http.push',
    name: 'HTTP push endpoint',
    description: 'Receive records posted into Spectr'
  },
  {
    kind: 'db.table',
    name: 'Local database table',
    description: 'Bind to a Spectr table'
  },
  {
    kind: 'csv',
    name: 'Paste CSV / text',
    description: 'Paste delimited text directly'
  }
]
