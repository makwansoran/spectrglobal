/**
 * Renderer client for the Spectr local database (Model tables + Command chat).
 */

export type ColumnType = 'text' | 'number' | 'boolean'

export interface TableColumn {
  name: string
  type: ColumnType
}

export interface DataTable {
  name: string
  columns: TableColumn[]
  rows: Array<Record<string, unknown>>
  createdAt: number
  updatedAt: number
}

export interface CreateTableInput {
  name: string
  columns: Array<string | TableColumn>
}

export interface InsertRowInput {
  table: string
  values: Record<string, unknown>
}

export interface UpdateRowInput {
  table: string
  id: string
  values: Record<string, unknown>
}

export interface DeleteRowInput {
  table: string
  id: string
}

export interface QueryRowsInput {
  table: string
  where?: Record<string, unknown>
  limit?: number
}

export interface AddEmployeeInput {
  name: string
  role?: string
  badge?: string
  zone?: string
  status?: string
}

type SpectrApi = {
  data?: {
    listTables: () => Promise<DataTable[]>
    getTable: (name: string) => Promise<DataTable | null>
    createTable: (input: CreateTableInput) => Promise<DataTable>
    ensureTable: (input: CreateTableInput) => Promise<DataTable>
    dropTable: (name: string) => Promise<boolean>
    setColumns: (table: string, columns: Array<string | TableColumn>) => Promise<DataTable>
    ensureColumns: (table: string, columns: Array<string | TableColumn>) => Promise<DataTable>
    insertRow: (input: InsertRowInput) => Promise<Record<string, unknown>>
    insertRows: (input: {
      table: string
      columns?: Array<string | TableColumn>
      rows: Array<Record<string, unknown>> | string
    }) => Promise<{
      table: DataTable
      inserted: number
      rows: Array<Record<string, unknown>>
    }>
    importTable: (input: {
      table: string
      data: string
      replace?: boolean
    }) => Promise<{
      table: DataTable
      inserted: number
      columns: string[]
    }>
    updateRow: (input: UpdateRowInput) => Promise<Record<string, unknown> | null>
    deleteRow: (input: DeleteRowInput) => Promise<boolean>
    queryRows: (input: QueryRowsInput) => Promise<Record<string, unknown>[]>
    addEmployee: (input: AddEmployeeInput) => Promise<Record<string, unknown>>
    brief: (sampleRows?: number) => Promise<string>
    dedupeTable: (table: string, column?: string) => Promise<DataTable | null>
  }
}

function api(): NonNullable<SpectrApi['data']> {
  const data = (window as unknown as { spectr?: SpectrApi }).spectr?.data
  if (!data) {
    throw new Error('Spectr database API unavailable — run inside Electron')
  }
  return data
}

export function getDataApi(): NonNullable<SpectrApi['data']> {
  return api()
}

export function tableCode(name: string): string {
  const n = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `data.db.${n}`
}

export function tableNameFromCode(code: string): string | null {
  if (code.startsWith('data.db.')) return code.slice('data.db.'.length) || null
  if (code.startsWith('data.mini-db.')) return code.slice('data.mini-db.'.length) || null
  return null
}

/** Live DB snapshot for Command chat system context. */
export async function buildDatabaseBrief(sampleRows = 12): Promise<string> {
  try {
    return await getDataApi().brief(sampleRows)
  } catch {
    return 'LOCAL DATABASE: unavailable in this session.'
  }
}

const PEOPLE_TABLE_NAMES = [
  'employees',
  'employee',
  'employe',
  'people',
  'staff',
  'workers',
  'labor'
]

const PEOPLE_DROP_ALIASES = new Set([
  ...PEOPLE_TABLE_NAMES,
  'person',
  'personnel',
  'roster',
  'team',
  'employee_database',
  'employees_database',
  'employee_db',
  'staff_roster'
])

function normalizeMaybeTable(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/** Resolve exact table or people-alias → real roster table. */
export async function resolveDropTableTarget(requested: string): Promise<string | null> {
  const key = normalizeMaybeTable(requested)
  if (!key) return null
  const tables = await getDataApi().listTables()
  if (tables.some((t) => t.name === key)) return key
  if (PEOPLE_DROP_ALIASES.has(key)) {
    const people = await resolvePeopleTable()
    return people?.name ?? null
  }
  return null
}

/** Resolve whichever people table the operator created. */
export async function resolvePeopleTable(): Promise<DataTable | null> {
  const tables = await getDataApi().listTables()
  for (const name of PEOPLE_TABLE_NAMES) {
    const hit = tables.find((t) => t.name === name)
    if (hit) return hit
  }
  return (
    tables.find((t) => t.columns.some((c) => c.name === 'name' || c.name === 'full_name')) ?? null
  )
}
