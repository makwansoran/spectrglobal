/**
 * Parse pasted markdown / CSV / TSV tables into column + row records.
 * Used by Command import_table so the model can pass raw paste text in one call.
 */

export interface ParsedTable {
  columns: string[]
  rows: Array<Record<string, unknown>>
}

const HEADER_ALIASES: Record<string, string> = {
  employee_id: 'employee_id',
  emp_id: 'employee_id',
  first_name: 'first_name',
  last_name: 'last_name',
  job_title: 'job_title',
  title: 'job_title',
  department: 'department',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  country: 'country',
  start_date: 'start_date',
  employment_type: 'employment_type',
  manager: 'manager',
  salary_usd: 'salary_usd',
  salary: 'salary_usd',
  status: 'status',
  name: 'name',
  role: 'role',
  badge: 'badge',
  zone: 'zone'
}

export function toSnakeColumn(raw: string): string {
  const cleaned = raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\(usd\)/gi, 'usd')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  if (!cleaned) return 'col'
  return HEADER_ALIASES[cleaned] ?? cleaned
}

function cleanCell(raw: string): string {
  let s = raw.trim()
  // Markdown links: [text](mailto:x) or [text](url)
  const md = s.match(/^\[([^\]]*)\]\(([^)]+)\)$/)
  if (md) {
    const inner = md[1].trim()
    const href = md[2].trim()
    if (href.toLowerCase().startsWith('mailto:')) return href.slice(7).trim()
    if (inner.includes('@')) return inner
    if (href.includes('@')) return href.replace(/^mailto:/i, '')
    return inner || href
  }
  const mailto = s.match(/mailto:([^\s)]+)/i)
  if (mailto) return mailto[1]
  // Strip thousands separators in numeric-looking values
  if (/^[\d,]+(\.\d+)?$/.test(s)) return s.replace(/,/g, '')
  return s
}

function splitMarkdownRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, '')) || c === '')
}

function parseMarkdown(text: string): ParsedTable | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.includes('|'))
  if (lines.length < 2) return null

  const grid = lines.map(splitMarkdownRow).filter((cells) => cells.some((c) => c.length > 0))
  if (grid.length < 2) return null

  let headerIdx = 0
  if (grid.length > 1 && isSeparatorRow(grid[1])) {
    headerIdx = 0
  } else {
    // Find first non-separator as header
    headerIdx = grid.findIndex((r, i) => i === 0 || !isSeparatorRow(r))
    if (headerIdx < 0) return null
  }

  const headers = grid[headerIdx].map(toSnakeColumn)
  const rows: Array<Record<string, unknown>> = []

  for (let i = headerIdx + 1; i < grid.length; i++) {
    const cells = grid[i]
    if (isSeparatorRow(cells)) continue
    if (cells.every((c) => !c)) continue
    const row: Record<string, unknown> = {}
    headers.forEach((h, idx) => {
      if (!h || h === 'col') return
      row[h] = cleanCell(cells[idx] ?? '')
    })
    if (Object.values(row).some((v) => String(v ?? '').trim())) rows.push(row)
  }

  if (!headers.length || !rows.length) return null
  return { columns: unique(headers.filter(Boolean)), rows }
}

function parseDelimited(text: string, delim: ',' | '\t'): ParsedTable | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return null
  const headers = lines[0].split(delim).map((h) => toSnakeColumn(h.trim()))
  const rows: Array<Record<string, unknown>> = []
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delim)
    const row: Record<string, unknown> = {}
    headers.forEach((h, idx) => {
      if (!h) return
      row[h] = cleanCell((cells[idx] ?? '').trim())
    })
    if (Object.values(row).some((v) => String(v ?? '').trim())) rows.push(row)
  }
  if (!rows.length) return null
  return { columns: unique(headers.filter(Boolean)), rows }
}

function unique(cols: string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const c of cols) {
    if (seen.has(c)) continue
    seen.add(c)
    out.push(c)
  }
  return out
}

/** Enrich people rows with a display name. */
export function enrichPeopleRows(
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  return rows.map((row) => {
    const next = { ...row }
    const first = String(next.first_name ?? '').trim()
    const last = String(next.last_name ?? '').trim()
    if (!String(next.name ?? '').trim() && (first || last)) {
      next.name = [first, last].filter(Boolean).join(' ')
    }
    if (typeof next.email === 'string') {
      next.email = cleanCell(next.email)
    }
    if (typeof next.salary_usd === 'string') {
      next.salary_usd = next.salary_usd.replace(/,/g, '')
    }
    return next
  })
}

/**
 * Auto-detect markdown / TSV / CSV from pasted operator text.
 */
export function parsePastableTable(data: string): ParsedTable {
  const text = data.trim()
  if (!text) throw new Error('No table data provided')

  const md = parseMarkdown(text)
  if (md) return { columns: md.columns, rows: enrichPeopleRows(md.rows) }

  if (text.includes('\t')) {
    const tsv = parseDelimited(text, '\t')
    if (tsv) return { columns: tsv.columns, rows: enrichPeopleRows(tsv.rows) }
  }

  const csv = parseDelimited(text, ',')
  if (csv) return { columns: csv.columns, rows: enrichPeopleRows(csv.rows) }

  throw new Error('Could not parse table — paste a markdown, CSV, or TSV table')
}
