/**
 * The tool bus. Every capability Spectr has over the platform lives here with
 * an explicit risk tier:
 *
 *   auto     — Spectr executes immediately, operator is informed afterwards
 *   decision — Spectr parks the action as a Decision and waits for a human
 *
 * Read tools are always auto. Writes that destroy data or change what the
 * operator sees on the dashboard are decision-tier or go through ask_confirm.
 */

import type { Artifact, TableArtifact } from '../artifacts'
import { raiseConfirm } from '../confirms'
import { parsePastableTable } from '../tableImport'
import { getDataApi, resolveDropTableTarget, resolvePeopleTable, type DataTable } from '../dataApi'
import { createFeed, deleteFeed, getSnapshot } from '../platform'

export type RiskTier = 'auto' | 'decision'

export interface ToolContext {
  /** Which agent is calling — used for audit + the activity rail. */
  actor: string
}

export interface ToolResult {
  ok: boolean
  /** Structured payload handed back to the model. */
  data: unknown
  /** One-line human summary for audit and the activity rail. */
  summary: string
  artifacts?: Artifact[]
  decisionId?: string
}

export interface ToolDef {
  name: string
  description: string
  tier: RiskTier
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
  /** Short label shown in the agent step tree. */
  step: (args: Record<string, unknown>) => string
  run: (args: Record<string, unknown>, ctx: ToolContext) => Promise<ToolResult>
}

function str(args: Record<string, unknown>, key: string, fallback = ''): string {
  const v = args[key]
  return typeof v === 'string' ? v : fallback
}

function num(args: Record<string, unknown>, key: string, fallback: number): number {
  const v = args[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function bool(args: Record<string, unknown>, key: string): boolean {
  return args[key] === true
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Keep Metaphysics in sync when chat creates a local table — as a db.table feed. */
async function ensureDbTableFeed(tableName: string): Promise<void> {
  try {
    const snapshot = await getSnapshot()
    const exists = snapshot.feeds.some(
      (f) => f.config.kind === 'db.table' && f.config.table === tableName
    )
    if (exists) return
    await createFeed({
      label: tableName,
      config: { kind: 'db.table', table: tableName }
    })
  } catch {
    /* Metaphysics sync is best-effort */
  }
}

async function removeDbTableFeed(tableName: string): Promise<void> {
  try {
    const snapshot = await getSnapshot()
    const feed = snapshot.feeds.find(
      (f) => f.config.kind === 'db.table' && f.config.table === tableName
    )
    if (feed) await deleteFeed(feed.id)
  } catch {
    /* best-effort */
  }
}

/** Render a local DB table as a chat artifact the operator can see. */
function artifactFromDataTable(table: DataTable): TableArtifact {
  return artifactFromRows(table.name, table.columns.map((c) => c.name), table.rows)
}

/** Artifact from a filtered/search result — only the rows that matched. */
function artifactFromRows(
  tableName: string,
  columnNames: string[],
  rows: Array<Record<string, unknown>>,
  title?: string
): TableArtifact {
  const columns = columnNames.filter((n) => n !== 'id' && n !== 'created_at')
  const displayCols = columns.length ? columns : columnNames
  const label = title ?? tableName
  return {
    kind: 'table',
    id: `db-${tableName}-${uid()}`,
    title: label,
    subtitle: `${rows.length} row${rows.length === 1 ? '' : 's'}`,
    columns: displayCols,
    rows: rows.map((row, i) => ({
      ref: {
        type: 'dataset',
        id: `db:${tableName}:${String(row.id ?? i)}`,
        ref: String(row.name ?? row.employee_id ?? row.id ?? i),
        title: String(row.name ?? row.first_name ?? tableName)
      },
      openable: false,
      cells: displayCols.map((c) => (row[c] == null || row[c] === '' ? '—' : String(row[c])))
    }))
  }
}

async function loadTableArtifact(name: string): Promise<TableArtifact | null> {
  const table = await getDataApi().getTable(name)
  return table ? artifactFromDataTable(table) : null
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

/** Score how well a row matches a person/search query (higher = better). */
function rowSearchScore(row: Record<string, unknown>, q: string): number {
  const needle = q.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!needle) return 0
  const fields = [
    'name',
    'first_name',
    'last_name',
    'employee_id',
    'email',
    'job_title',
    'department',
    'badge'
  ]
  const values = fields
    .map((f) => String(row[f] ?? '').trim().toLowerCase())
    .filter(Boolean)
  const fullName = [String(row.first_name ?? ''), String(row.last_name ?? '')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (fullName) values.push(fullName)
  // Also scan any other string cells lightly
  for (const [k, v] of Object.entries(row)) {
    if (fields.includes(k) || k === 'id') continue
    if (typeof v === 'string' && v.trim()) values.push(v.trim().toLowerCase())
  }

  let best = 0
  for (const val of values) {
    if (val === needle) best = Math.max(best, 100)
    else if (val.startsWith(needle) || needle.startsWith(val)) best = Math.max(best, 80)
    else if (val.includes(needle) || needle.includes(val)) best = Math.max(best, 60)
    else {
      const parts = val.split(/\s+/)
      for (const p of parts) {
        if (!p) continue
        if (p === needle) best = Math.max(best, 95)
        else if (p.startsWith(needle) || needle.startsWith(p)) best = Math.max(best, 75)
        else {
          const dist = levenshtein(p, needle)
          const maxLen = Math.max(p.length, needle.length)
          if (maxLen <= 4 && dist <= 1) best = Math.max(best, 70)
          else if (maxLen <= 8 && dist <= 2) best = Math.max(best, 55)
          else if (dist === 1) best = Math.max(best, 50)
        }
      }
    }
  }
  return best
}

/* --------------------------------------------------------------- read tools */

const readTools: ToolDef[] = [
  {
    name: 'list_tables',
    description:
      'List every table in the Spectr local database. Always available. Use when you need table names, or rely on the LOCAL DATABASE snapshot already in context.',
    tier: 'auto',
    parameters: { type: 'object', properties: {} },
    step: () => 'List database tables',
    async run() {
      const tables = await getDataApi().listTables()
      return {
        ok: true,
        data: {
          tables: tables.map((t) => ({
            name: t.name,
            columns: t.columns.map((c) => c.name),
            rows: t.rows.length
          }))
        },
        summary:
          tables.length === 0
            ? 'No tables yet — create one with create_table or add_employee'
            : `${tables.length} table(s)`
      }
    }
  },
  {
    name: 'query_table',
    description:
      'Read rows from a local database table. Use where for exact field match, or search for a fuzzy text lookup (names, ids, emails). Always prefer search/where when the operator asks about one person or one record — never dump the whole table. The chat card shows only the matching rows.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name, e.g. employees' },
        where: {
          type: 'object',
          description: 'Optional equality filter, e.g. { "employee_id": "EMP-1004" }'
        },
        search: {
          type: 'string',
          description:
            'Fuzzy text search across name/id/email/etc. Use for "tell me about Noah" or typos like Noag.'
        },
        limit: { type: 'number', description: 'Max rows to return. Default 20; use 1–5 for person lookups.' }
      },
      required: ['table']
    },
    step: (a) =>
      str(a, 'search')
        ? `Search ${str(a, 'table')} · ${str(a, 'search')}`
        : `Query ${str(a, 'table')}`,
    async run(args) {
      try {
        const tableName = str(args, 'table')
        const table = await getDataApi().getTable(tableName)
        if (!table) {
          return {
            ok: false,
            data: { error: 'not_found' },
            summary: `Unknown table ${tableName}`
          }
        }
        const search = str(args, 'search').trim()
        const limit = num(args, 'limit', search ? 5 : 20)
        let rows = await getDataApi().queryRows({
          table: tableName,
          where:
            args.where && typeof args.where === 'object'
              ? (args.where as Record<string, unknown>)
              : undefined,
          limit: search ? 500 : limit
        })
        if (search) {
          const scored = rows
            .map((row) => ({ row, score: rowSearchScore(row, search) }))
            .filter((x) => x.score >= 50)
            .sort((a, b) => b.score - a.score)
          rows = scored.slice(0, limit).map((x) => x.row)
        } else {
          rows = rows.slice(0, limit)
        }
        const artifact = artifactFromRows(
          tableName,
          table.columns.map((c) => c.name),
          rows,
          search && rows.length === 1
            ? String(rows[0].name ?? rows[0].first_name ?? tableName)
            : search
              ? `${tableName} · “${search}”`
              : tableName
        )
        return {
          ok: true,
          data: { rows, count: rows.length, search: search || undefined },
          summary:
            rows.length === 0
              ? search
                ? `No rows matching “${search}” in ${tableName}`
                : `No rows in ${tableName}`
              : `${rows.length} row(s) from ${tableName}`,
          artifacts: rows.length ? [artifact] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Query failed'
        }
      }
    }
  },
  {
    name: 'find_employee',
    description:
      'Look up one employee / person by name, id, or typo-tolerant search (e.g. Noag → Noah). Returns only matching people — use this for “tell me about X”, not query_table of the whole roster.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Name, employee id, or partial — e.g. Noah, Noag, EMP-1004, Wilson'
        }
      },
      required: ['query']
    },
    step: (a) => `Find employee · ${str(a, 'query')}`,
    async run(args) {
      try {
        const query = str(args, 'query').trim()
        if (!query) {
          return { ok: false, data: { error: 'query_required' }, summary: 'Need a name or id' }
        }
        const people = await resolvePeopleTable()
        if (!people) {
          return {
            ok: false,
            data: { error: 'no_people_table' },
            summary: 'No employee table in the database'
          }
        }
        const scored = people.rows
          .map((row) => ({ row, score: rowSearchScore(row, query) }))
          .filter((x) => x.score >= 50)
          .sort((a, b) => b.score - a.score)
        const rows = scored.slice(0, 5).map((x) => x.row)
        if (rows.length === 0) {
          return {
            ok: false,
            data: { error: 'not_found', query },
            summary: `No employee matching “${query}”`
          }
        }
        const top = rows[0]
        const label = String(
          top.name ??
            [top.first_name, top.last_name].filter(Boolean).join(' ') ??
            top.employee_id ??
            'Employee'
        )
        const artifact = artifactFromRows(
          people.name,
          people.columns.map((c) => c.name),
          rows.length === 1 ? rows : rows.slice(0, 3),
          rows.length === 1 ? label : `Matches for “${query}”`
        )
        return {
          ok: true,
          data: {
            table: people.name,
            query,
            count: rows.length,
            employee: top,
            matches: rows
          },
          summary:
            rows.length === 1
              ? `Found ${label}`
              : `${rows.length} matches for “${query}” — top is ${label}`,
          artifacts: [artifact]
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Employee lookup failed'
        }
      }
    }
  },
]

/* -------------------------------------------------------------- write tools */

const writeTools: ToolDef[] = [
  {
    name: 'create_table',
    description:
      'Create a table in the Spectr database and attach a db.table feed on Metaphysics. Columns are field names (id is added automatically).',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Table name, e.g. employees' },
        columns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Column names, e.g. ["name","role","zone"]'
        }
      },
      required: ['name', 'columns']
    },
    step: (a) => `Create table ${str(a, 'name')}`,
    async run(args) {
      const name = str(args, 'name')
      const cols = Array.isArray(args.columns)
        ? args.columns.map((c) => String(c))
        : []
      try {
        const table = await getDataApi().ensureTable({ name, columns: cols })
        await ensureDbTableFeed(table.name)
        return {
          ok: true,
          data: {
            table: table.name,
            columns: table.columns.map((c) => c.name),
            rows: table.rows.length
          },
          summary: `Table ${table.name} ready`,
          artifacts: [artifactFromDataTable(table)]
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Create table failed'
        }
      }
    }
  },
  {
    name: 'insert_row',
    description: 'Insert a row into a database table. Creates the table first if you pass columns.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string' },
        values: { type: 'object', description: 'Column → value map' },
        columns: {
          type: 'array',
          items: { type: 'string' },
          description: 'If the table is missing, create it with these columns'
        }
      },
      required: ['table', 'values']
    },
    step: (a) => `Insert into ${str(a, 'table')}`,
    async run(args) {
      const tableName = str(args, 'table')
      const values =
        args.values && typeof args.values === 'object'
          ? (args.values as Record<string, unknown>)
          : {}
      try {
        const api = getDataApi()
        const existing = (await api.listTables()).some((t) => t.name === tableName)
        const colList = [
          ...(Array.isArray(args.columns) ? args.columns.map((c) => String(c)) : []),
          ...Object.keys(values)
        ]
        if (!existing) {
          await api.ensureTable({
            name: tableName,
            columns: colList.length ? colList : ['name']
          })
        } else if (colList.length && typeof api.ensureColumns === 'function') {
          await api.ensureColumns(tableName, colList)
        }
        const row = await api.insertRow({ table: tableName, values })
        await ensureDbTableFeed(tableName)
        const artifact = await loadTableArtifact(tableName)
        return {
          ok: true,
          data: { row },
          summary: `Inserted into ${tableName}`,
          artifacts: artifact ? [artifact] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Insert failed'
        }
      }
    }
  },
  {
    name: 'import_table',
    description:
      'ONE-SHOT import: paste the operator’s full markdown/CSV/TSV table as data and load every row. Prefer this over insert_rows / insert_row / add_employee when they paste a spreadsheet. Pass the table text unchanged in data. Use replace=true to wipe existing rows first. Creates columns automatically (snake_case).',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Target table, e.g. employees' },
        data: {
          type: 'string',
          description: 'Exact markdown/CSV/TSV paste from the operator, including header row'
        },
        replace: {
          type: 'boolean',
          description: 'If true, delete existing rows/table content before import'
        }
      },
      required: ['table', 'data']
    },
    step: (a) => `Import table → ${str(a, 'table')}`,
    async run(args) {
      try {
        const tableName = str(args, 'table') || 'employees'
        const data = str(args, 'data')
        if (!data.trim()) {
          return {
            ok: false,
            data: { error: 'empty_data' },
            summary: 'import_table needs the pasted table text in data'
          }
        }
        const api = getDataApi()
        if (typeof api.importTable !== 'function') {
          // Fallback: parse in renderer and insertRows / insertRow loop
          const parsed = parsePastableTable(data)
          if (bool(args, 'replace')) {
            try {
              await api.dropTable(tableName)
            } catch {
              /* ok */
            }
          }
          if (typeof api.insertRows === 'function') {
            const result = await api.insertRows({
              table: tableName,
              columns: parsed.columns,
              rows: parsed.rows
            })
            await ensureDbTableFeed(tableName)
            return {
              ok: true,
              data: {
                table: result.table.name,
                inserted: result.inserted,
                columns: result.table.columns.map((c) => c.name)
              },
              summary: `Imported ${result.inserted} row(s) into ${result.table.name}`,
              artifacts: [artifactFromDataTable(result.table)]
            }
          }
          await api.ensureTable({ name: tableName, columns: parsed.columns })
          for (const values of parsed.rows) {
            if (typeof api.ensureColumns === 'function') {
              await api.ensureColumns(tableName, Object.keys(values))
            }
            await api.insertRow({ table: tableName, values })
          }
          const table = await api.getTable(tableName)
          await ensureDbTableFeed(tableName)
          return {
            ok: true,
            data: {
              table: tableName,
              inserted: parsed.rows.length,
              columns: table?.columns.map((c) => c.name) ?? parsed.columns
            },
            summary: `Imported ${parsed.rows.length} row(s) into ${tableName}`,
            artifacts: table ? [artifactFromDataTable(table)] : []
          }
        }
        const result = await api.importTable({
          table: tableName,
          data,
          replace: bool(args, 'replace')
        })
        await ensureDbTableFeed(tableName)
        const artifact = artifactFromDataTable(result.table)
        return {
          ok: true,
          data: {
            table: result.table.name,
            inserted: result.inserted,
            columns: result.columns
          },
          summary: `Imported ${result.inserted} row(s) into ${result.table.name}`,
          artifacts: [artifact]
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Import failed'
        }
      }
    }
  },
  {
    name: 'insert_rows',
    description:
      'Bulk-import many rows when you already have structured JSON objects. Prefer import_table when the operator pasted markdown/CSV — it is more reliable. Creates the table or adds missing columns. Never invent fields like Picker.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name, e.g. employees' },
        columns: {
          type: 'array',
          items: { type: 'string' },
          description: 'All column names from the operator table'
        },
        rows: {
          type: 'array',
          items: { type: 'object' },
          description: 'One object per row with those column keys'
        }
      },
      required: ['table', 'rows']
    },
    step: (a) => {
      const n = Array.isArray(a.rows) ? a.rows.length : 0
      return `Insert ${n} row(s) into ${str(a, 'table')}`
    },
    async run(args) {
      try {
        const tableName = str(args, 'table')
        const columns = Array.isArray(args.columns)
          ? args.columns.map((c) => String(c))
          : undefined
        let rawRows: Record<string, unknown>[] = []
        if (Array.isArray(args.rows)) {
          rawRows = args.rows as Record<string, unknown>[]
        } else if (typeof args.rows === 'string') {
          try {
            const parsed = JSON.parse(args.rows) as unknown
            if (Array.isArray(parsed)) rawRows = parsed as Record<string, unknown>[]
          } catch {
            /* ignore */
          }
        }
        if (rawRows.length === 0) {
          return {
            ok: false,
            data: { error: 'no_rows' },
            summary:
              'insert_rows got no rows — use import_table with the pasted markdown instead'
          }
        }
        const rows = rawRows.map((row) => {
          const next: Record<string, unknown> = { ...row }
          const first = String(next.first_name ?? '').trim()
          const last = String(next.last_name ?? '').trim()
          if (!String(next.name ?? '').trim() && (first || last)) {
            next.name = [first, last].filter(Boolean).join(' ')
          }
          if (typeof next.email === 'string') {
            const m =
              next.email.match(/mailto:([^)\s]+)/i) || next.email.match(/[\w.+-]+@[\w.-]+/)
            if (m) next.email = (m[1] ?? m[0]).replace(/^mailto:/i, '')
          }
          if (typeof next.salary_usd === 'string') {
            next.salary_usd = next.salary_usd.replace(/,/g, '')
          }
          if (typeof next.salary === 'string') {
            next.salary = next.salary.replace(/,/g, '')
          }
          return next
        })
        const api = getDataApi()
        if (typeof api.insertRows === 'function') {
          const result = await api.insertRows({ table: tableName, columns, rows })
          await ensureDbTableFeed(tableName)
          return {
            ok: true,
            data: {
              table: result.table.name,
              inserted: result.inserted,
              columns: result.table.columns.map((c) => c.name)
            },
            summary: `Inserted ${result.inserted} row(s) into ${result.table.name}`,
            artifacts: [artifactFromDataTable(result.table)]
          }
        }
        // Legacy preload fallback
        await api.ensureTable({
          name: tableName,
          columns: columns ?? Object.keys(rows[0] ?? { name: 'name' })
        })
        for (const values of rows) {
          await api.insertRow({ table: tableName, values })
        }
        const table = await api.getTable(tableName)
        await ensureDbTableFeed(tableName)
        return {
          ok: true,
          data: { table: tableName, inserted: rows.length },
          summary: `Inserted ${rows.length} row(s) into ${tableName}`,
          artifacts: table ? [artifactFromDataTable(table)] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Bulk insert failed'
        }
      }
    }
  },
  {
    name: 'update_row',
    description:
      'Update fields on an existing database row by id. Only set fields the operator asked to change. Shows the updated table in chat.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string' },
        id: { type: 'string', description: 'Row id' },
        values: { type: 'object', description: 'Column → value map of fields to change' }
      },
      required: ['table', 'id', 'values']
    },
    step: (a) => `Update ${str(a, 'table')} · ${str(a, 'id')}`,
    async run(args) {
      try {
        const tableName = str(args, 'table')
        const values =
          args.values && typeof args.values === 'object'
            ? (args.values as Record<string, unknown>)
            : {}
        const row = await getDataApi().updateRow({
          table: tableName,
          id: str(args, 'id'),
          values
        })
        if (!row) {
          return {
            ok: false,
            data: { error: 'not_found' },
            summary: `No row ${str(args, 'id')} in ${tableName}`
          }
        }
        const artifact = await loadTableArtifact(tableName)
        return {
          ok: true,
          data: { row },
          summary: `Updated row in ${tableName}`,
          artifacts: artifact ? [artifact] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Update failed'
        }
      }
    }
  },
  {
    name: 'delete_row',
    description:
      'Delete a database row by id. Prefer dedupe_table for duplicate cleanup instead of deleting one by one. Shows the updated table in chat.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string' },
        id: { type: 'string', description: 'Row id to delete' }
      },
      required: ['table', 'id']
    },
    step: (a) => `Delete ${str(a, 'id')} from ${str(a, 'table')}`,
    async run(args) {
      try {
        const tableName = str(args, 'table')
        const ok = await getDataApi().deleteRow({
          table: tableName,
          id: str(args, 'id')
        })
        if (!ok) {
          return {
            ok: false,
            data: { error: 'not_found' },
            summary: `No row ${str(args, 'id')} in ${tableName}`
          }
        }
        const artifact = await loadTableArtifact(tableName)
        return {
          ok: true,
          data: { deleted: str(args, 'id') },
          summary: `Deleted row from ${tableName}`,
          artifacts: artifact ? [artifact] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Delete failed'
        }
      }
    }
  },
  {
    name: 'dedupe_table',
    description:
      'Remove duplicate rows in a table by a column (default name), keeping the first of each value. Preferred tool when the operator reports duplicates — call once, then stop. Shows only the cleaned table in chat.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string' },
        column: { type: 'string', description: 'Column to unique on, default name' }
      },
      required: ['table']
    },
    step: (a) => `Dedupe ${str(a, 'table')}`,
    async run(args) {
      try {
        const tableName = str(args, 'table')
        const column = str(args, 'column', 'name') || 'name'
        const before = await getDataApi().getTable(tableName)
        const beforeCount = before?.rows.length ?? 0
        const table = await getDataApi().dedupeTable(tableName, column)
        if (!table) {
          return {
            ok: false,
            data: { error: 'not_found' },
            summary: `Unknown table ${tableName}`
          }
        }
        const artifact = artifactFromDataTable(table)
        return {
          ok: true,
          data: {
            table: table.name,
            before: beforeCount,
            after: table.rows.length,
            removed: Math.max(0, beforeCount - table.rows.length)
          },
          summary: `Deduped ${tableName}: ${beforeCount} → ${table.rows.length} rows`,
          artifacts: [artifact]
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Dedupe failed'
        }
      }
    }
  },
  {
    name: 'drop_table',
    description:
      'Permanently delete a database table and all its rows. Accepts people/employees/staff aliases and resolves to the real roster table. Destructive — never call this directly when the operator asks to wipe data. Instead call ask_confirm with tool=drop_table so they get Yes/Abort buttons.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        table: {
          type: 'string',
          description:
            'Exact table name from LOCAL DATABASE, or a people alias (people, employees, staff). Prefer the exact name.'
        }
      },
      required: ['table']
    },
    step: (a) => `Drop table ${str(a, 'table')}`,
    async run(args) {
      try {
        const requested = str(args, 'table')
        const tableName = await resolveDropTableTarget(requested)
        if (!tableName) {
          return {
            ok: false,
            data: { error: 'not_found', requested },
            summary: `No table named ${requested}`
          }
        }
        const ok = await getDataApi().dropTable(tableName)
        if (!ok) {
          return {
            ok: false,
            data: { error: 'not_found', requested, table: tableName },
            summary: `No table named ${tableName}`
          }
        }
        await removeDbTableFeed(tableName)
        return {
          ok: true,
          data: { dropped: tableName, requested },
          summary: `Deleted table ${tableName}`
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Drop table failed'
        }
      }
    }
  },
  {
    name: 'add_employee',
    description:
      'Add one or more people by name only (creates a simple roster table if needed). For pasted spreadsheets with many columns (job title, email, salary, etc.) use insert_rows instead — never this tool. Prefer names[] when they list several people. Only pass role/badge/zone/status if the operator stated them — never invent values like Picker or Active. Duplicate names are skipped.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Single employee name' },
        names: {
          type: 'array',
          items: { type: 'string' },
          description: 'Multiple names in one call'
        },
        role: {
          type: 'string',
          description: 'Only if the operator stated a role. Do not invent.'
        },
        badge: { type: 'string', description: 'Only if stated.' },
        zone: { type: 'string', description: 'Only if stated.' },
        status: { type: 'string', description: 'Only if stated.' }
      }
    },
    step: (a) => {
      const many = Array.isArray(a.names) ? a.names.map(String).filter(Boolean) : []
      if (many.length > 1) return `Add ${many.length} employees`
      return `Add employee ${str(a, 'name') || many[0] || ''}`
    },
    async run(args) {
      try {
        const many = Array.isArray(args.names)
          ? args.names.map((n) => String(n).trim()).filter(Boolean)
          : []
        const single = str(args, 'name').trim()
        // Deduplicate within the same call (order preserved).
        const seen = new Set<string>()
        const names: string[] = []
        for (const n of many.length ? many : single ? [single] : []) {
          const key = n.toLowerCase()
          if (seen.has(key)) continue
          seen.add(key)
          names.push(n)
        }
        if (names.length === 0) {
          return {
            ok: false,
            data: { error: 'name_required' },
            summary: 'Need at least one employee name'
          }
        }
        const role = str(args, 'role').trim() || undefined
        const badge = str(args, 'badge').trim() || undefined
        const zone = str(args, 'zone').trim() || undefined
        const status = str(args, 'status').trim() || undefined
        const added: Record<string, unknown>[] = []
        for (const person of names) {
          added.push(
            await getDataApi().addEmployee({
              name: person,
              role,
              badge,
              zone,
              status
            })
          )
        }
        const people = await getDataApi().listTables()
        const peopleTable =
          people.find((t) =>
            ['employees', 'employee', 'employe', 'people', 'staff', 'workers', 'labor'].includes(
              t.name
            )
          )?.name ?? 'employees'
        await ensureDbTableFeed(peopleTable)
        const artifact = await loadTableArtifact(peopleTable)
        return {
          ok: true,
          data: { employees: added, table: peopleTable, count: added.length },
          summary:
            added.length === 1
              ? `Added ${String(added[0].name)} to ${peopleTable}`
              : `Added ${added.length} people to ${peopleTable}`,
          artifacts: artifact ? [artifact] : []
        }
      } catch (e) {
        return {
          ok: false,
          data: { error: e instanceof Error ? e.message : String(e) },
          summary: e instanceof Error ? e.message : 'Add employee failed'
        }
      }
    }
  },

  /* ---- ask the human directly ---- */

  {
    name: 'ask_confirm',
    description:
      'Show a confirm box under your answer with the exact command, a green Yes button and a red Abort button. Use for any irreversible wipe — delete employee database, drop a table, mass-delete rows. Park the real tool in tool+args; do NOT call drop_table / delete yourself. After calling, write 1–2 short sentences explaining what will be removed and that they must confirm. Never claim the delete already happened.',
    tier: 'auto',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Short heading, e.g. Delete employee database'
        },
        command: {
          type: 'string',
          description: 'Plain command shown in the box, e.g. Delete table employees'
        },
        detail: {
          type: 'string',
          description: 'Optional warning, e.g. Removes all staff records. Cannot be undone.'
        },
        confirmLabel: {
          type: 'string',
          description: 'Green button text, default Yes, delete'
        },
        abortLabel: {
          type: 'string',
          description: 'Red button text, default Abort'
        },
        tool: {
          type: 'string',
          description: 'Tool to run if they confirm, e.g. drop_table'
        },
        args: {
          type: 'object',
          description: 'Arguments for that tool, e.g. { "table": "employees" }'
        }
      },
      required: ['title', 'command', 'tool', 'args']
    },
    step: (a) => `Confirm · ${str(a, 'command').slice(0, 48)}`,
    async run(args) {
      const toolName = str(args, 'tool')
      if (!toolName || toolName === 'ask_confirm' || toolName === 'ask_decision') {
        return {
          ok: false,
          data: { error: 'bad_tool' },
          summary: 'ask_confirm needs a real action tool (e.g. drop_table)'
        }
      }
      let parkedArgs: Record<string, unknown> =
        args.args && typeof args.args === 'object'
          ? { ...(args.args as Record<string, unknown>) }
          : {}
      let command = str(args, 'command')
      let detail = str(args, 'detail') || undefined

      // Resolve people aliases so the box shows the real table and confirm actually works.
      if (toolName === 'drop_table') {
        const requested = str(parkedArgs, 'table')
        const resolved = await resolveDropTableTarget(requested)
        if (!resolved) {
          return {
            ok: false,
            data: { error: 'not_found', requested },
            summary: requested
              ? `No table named ${requested} — check LOCAL DATABASE for the exact name`
              : 'drop_table needs a table name'
          }
        }
        parkedArgs = { ...parkedArgs, table: resolved }
        if (!command || /people|employee/i.test(command)) {
          command = `Delete table ${resolved}`
        }
        if (!detail) {
          detail = `Removes all rows in ${resolved}. Cannot be undone.`
        }
      }

      const action = raiseConfirm({
        title: str(args, 'title'),
        command,
        detail,
        confirmLabel: str(args, 'confirmLabel', 'Yes, delete') || 'Yes, delete',
        abortLabel: str(args, 'abortLabel', 'Abort') || 'Abort',
        tool: toolName,
        args: parkedArgs
      })
      return {
        ok: true,
        data: { confirmId: action.id, status: 'awaiting_operator', args: parkedArgs },
        summary: `Confirm parked: ${action.command}`,
        artifacts: [
          { kind: 'confirm', id: action.id, confirmId: action.id }
        ]
      }
    }
  },
]

export const TOOLS: ToolDef[] = [...readTools, ...writeTools]

export const TOOL_BY_NAME: Record<string, ToolDef> = Object.fromEntries(
  TOOLS.map((t) => [t.name, t])
)

/** Wire format handed to the model. */
export function toolSchemas(): Array<{
  name: string
  description: string
  parameters: ToolDef['parameters']
}> {
  return TOOLS.map((t) => ({
    name: t.name,
    description:
      t.tier === 'decision'
        ? `${t.description} (This is decision-tier: calling it asks the operator to approve, it does not execute immediately.)`
        : t.description,
    parameters: t.parameters
  }))
}
