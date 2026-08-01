/**
 * The platform data model — the contract shared by main, preload and renderer.
 *
 * Lives outside any one process so there is a single definition rather than a
 * copy per side of the IPC boundary.
 *
 * Four layers, each strictly downstream of the last:
 *
 *   Feed        — where records come from. Produces exactly one raw dataset.
 *   Dataset     — a typed table with a profiled schema. Raw or derived.
 *   Transform   — union / join / filter / select / aggregate. Produces one
 *                 derived dataset, rebuilt whenever anything upstream changes.
 *   Object type — the operator's declared vocabulary, explicitly mapped from a
 *                 dataset. Nothing is promoted to an object type implicitly.
 *
 * Dashboard widgets are inferred from dataset schemas and object-type property
 * roles, so connecting data is the only thing needed to get a visual.
 */

export type ColumnType = 'text' | 'number' | 'boolean' | 'timestamp'

/** A column plus the profile the build engine measured while writing it. */
export interface DatasetColumn {
  name: string
  type: ColumnType
  /** Share of rows carrying a non-empty value, 0..1. */
  fill: number
  /** Distinct value count, capped at DISTINCT_CAP. */
  distinct: number
  /** True when distinct hit the cap and is therefore a floor, not an exact count. */
  distinctCapped?: boolean
  /** Range for number and timestamp columns. */
  min?: number
  max?: number
  /** A few real values, for schema previews. Never invented. */
  samples?: string[]
}

/* -------------------------------------------------------------------- feeds */

export type FeedKind =
  | 'csv'
  | 'excel'
  | 'json'
  | 'xml'
  | 'sql'
  | 'http.poll'
  | 'http.push'
  | 'db.table'
  | 'static'

/**
 * Feed kinds whose datasets can be edited in place. A derived dataset is a
 * function of its inputs, so writing to one would be overwritten on rebuild.
 */
export const WRITABLE_FEED_KINDS: readonly FeedKind[] = ['static', 'db.table']

export interface CsvFeedConfig {
  /** Raw file text. Held inline so a feed is reproducible without the file. */
  text: string
  delimiter?: string
  /** Original filename, for display only. */
  filename?: string
}

export interface ExcelFeedConfig {
  /** Workbook bytes, base64. */
  base64: string
  sheet?: string
  filename?: string
}

export interface JsonFeedConfig {
  /** Raw JSON text (array of objects, or an object with a records path). */
  text: string
  recordsPath?: string
  filename?: string
}

export interface XmlFeedConfig {
  /** Raw XML text. Repeating child elements under the root become rows. */
  text: string
  /** Optional tag name for row elements. When omitted, the most common child tag is used. */
  rowTag?: string
  filename?: string
}

export interface SqlFeedConfig {
  /**
   * SQL dump or query result text. Spectr extracts INSERT … VALUES rows when
   * present; otherwise it treats the text as delimited (CSV/TSV).
   */
  text: string
  filename?: string
}

export interface HttpPollFeedConfig {
  url: string
  intervalMs: number
  headers?: Record<string, string>
  /** Dot path to the array of records inside the response, e.g. `data.items`. */
  recordsPath?: string
  /** Operator-facing connection name (distinct from the feed label). */
  connectionName?: string
  /** What this API is for — shown in About. */
  description?: string
  /** Secret / API key. Sent via apiKeyHeader. */
  apiKey?: string
  /** How to attach apiKey. Default bearer. */
  apiKeyHeader?: 'bearer' | 'x-api-key' | 'custom'
  /** Used when apiKeyHeader is custom — header name only. */
  apiKeyHeaderName?: string
}

export interface HttpPushFeedConfig {
  /** Path segment records are posted to: POST /api/feed/<slug>. */
  slug: string
  token: string
  /** Replace all rows on each post, or append. */
  mode: 'replace' | 'append'
}

export interface DbTableFeedConfig {
  table: string
}

export interface StaticFeedConfig {
  columns: string[]
  rows: Array<Record<string, unknown>>
}

export type FeedConfig =
  | ({ kind: 'csv' } & CsvFeedConfig)
  | ({ kind: 'excel' } & ExcelFeedConfig)
  | ({ kind: 'json' } & JsonFeedConfig)
  | ({ kind: 'xml' } & XmlFeedConfig)
  | ({ kind: 'sql' } & SqlFeedConfig)
  | ({ kind: 'http.poll' } & HttpPollFeedConfig)
  | ({ kind: 'http.push' } & HttpPushFeedConfig)
  | ({ kind: 'db.table' } & DbTableFeedConfig)
  | ({ kind: 'static' } & StaticFeedConfig)

export type BuildStatus = 'stale' | 'building' | 'ok' | 'error'

export interface FeedDef {
  id: string
  /** Operator-facing code, e.g. `feed.suppliers_march`. Stable and unique. */
  code: string
  label: string
  /** Free-text description of what this feed is for. */
  description?: string
  kind: FeedKind
  config: FeedConfig
  /** The raw dataset this feed writes into. One feed, one dataset. */
  datasetId: string
  status: BuildStatus
  error?: string
  lastLoadedAt?: number
  createdAt: number
  updatedAt: number
}

/* ----------------------------------------------------------------- datasets */

export type DatasetOrigin =
  | { kind: 'feed'; feedId: string }
  | { kind: 'transform'; transformId: string }

export interface Dataset {
  id: string
  /** Operator-facing code, e.g. `dataset.suppliers_all`. */
  code: string
  label: string
  origin: DatasetOrigin
  columns: DatasetColumn[]
  rowCount: number
  /** Bumped on every successful build, so downstream can detect change. */
  version: number
  status: BuildStatus
  error?: string
  builtAt?: number
  createdAt: number
  updatedAt: number
}

/* --------------------------------------------------------------- transforms */

export type TransformKind = 'union' | 'join' | 'filter' | 'select' | 'aggregate'

export interface UnionConfig {
  /** Dataset ids, in order. */
  inputs: string[]
  /**
   * byName aligns columns by name and fills gaps with null — the honest default
   * when two sheets nearly agree. byPosition trusts column order instead.
   */
  mode: 'byName' | 'byPosition'
  /** When set, adds a column tagging which input each row came from. */
  sourceColumn?: string
}

export interface JoinConfig {
  left: string
  right: string
  /** Key pairs, ANDed together. */
  on: Array<{ left: string; right: string }>
  type: 'inner' | 'left'
  /** Prefix applied to right-hand columns that would otherwise collide. */
  prefixRight?: string
}

export type FilterOp =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'empty'
  | 'notEmpty'

export interface FilterClause {
  column: string
  op: FilterOp
  value?: string | number | boolean
}

export interface FilterConfig {
  input: string
  clauses: FilterClause[]
  combine: 'and' | 'or'
}

export interface SelectConfig {
  input: string
  /** Columns to keep, optionally renamed. Empty `columns` keeps everything. */
  columns: Array<{ from: string; to?: string }>
  drop?: string[]
}

export type AggregateFn = 'count' | 'sum' | 'avg' | 'min' | 'max'

export interface AggregateConfig {
  input: string
  groupBy: string[]
  metrics: Array<{ fn: AggregateFn; column?: string; as: string }>
}

export type TransformConfig =
  | ({ kind: 'union' } & UnionConfig)
  | ({ kind: 'join' } & JoinConfig)
  | ({ kind: 'filter' } & FilterConfig)
  | ({ kind: 'select' } & SelectConfig)
  | ({ kind: 'aggregate' } & AggregateConfig)

export interface TransformDef {
  id: string
  /** Operator-facing code, e.g. `transform.union_suppliers`. */
  code: string
  label: string
  kind: TransformKind
  config: TransformConfig
  /** The derived dataset this transform writes into. */
  outputDatasetId: string
  status: BuildStatus
  error?: string
  builtAt?: number
  createdAt: number
  updatedAt: number
}

/* -------------------------------------------------------------- object types */

/**
 * What a property means, not what it stores. Roles are what let the dashboard
 * and the agents do something sensible without being told about the domain.
 */
export type PropertyRole =
  | 'id'
  | 'title'
  | 'category'
  | 'quantity'
  | 'amount'
  | 'timestamp'
  | 'status'
  | 'none'

/**
 * A constraint on a property's values. Enums are the important one: a status
 * the operator has enumerated is a status the agents cannot invent.
 */
export interface ValueType {
  /** Permitted values. Empty or absent means unconstrained. */
  allowed?: string[]
  /** Unit label for quantities, e.g. `kg`, `EUR`. Display only. */
  unit?: string
  /** Inclusive bounds for numbers. */
  min?: number
  max?: number
}

/**
 * Computed properties are a fixed set of named functions rather than an
 * expression language: no parser, no eval, and the UI can enumerate them.
 */
export type ComputedExpr =
  | { fn: 'daysSince'; property: string }
  | { fn: 'daysUntil'; property: string }
  | { fn: 'concat'; properties: string[]; separator?: string }
  | { fn: 'sum'; properties: string[] }
  | { fn: 'difference'; properties: [string, string] }
  | { fn: 'product'; properties: [string, string] }
  | { fn: 'coalesce'; properties: string[] }

export interface ObjectProperty {
  name: string
  type: ColumnType
  role: PropertyRole
  required?: boolean
  valueType?: ValueType
  /** When set, the value is derived rather than read from a column. */
  computed?: ComputedExpr
}

export interface ObjectMapping {
  datasetId: string
  /** Property name to dataset column name. Explicit, never guessed at build. */
  columns: Record<string, string>
}

/** One problem found while checking an object type or link against real rows. */
export interface OntologyIssue {
  severity: 'warn' | 'error'
  property?: string
  message: string
  /** How many instances or rows are affected. */
  count: number
}

export interface ObjectTypeHealth {
  instanceCount: number
  /** Rows skipped because the key was blank — those objects do not exist. */
  missingKeys: number
  /** Key values seen more than once. Non-zero means identity is not identity. */
  duplicateKeys: number
  issues: OntologyIssue[]
  checkedAt: number
}

export interface ObjectTypeDef {
  id: string
  /** Operator-facing code, e.g. `object.supplier`. */
  code: string
  label: string
  plural: string
  /**
   * Property that uniquely identifies an instance. Without a working key there
   * are no stable object ids, so nothing can be linked, cited or audited.
   */
  keyProperty: string
  /** Property used as the human-facing label. Falls back to the key. */
  titleProperty?: string
  properties: ObjectProperty[]
  /** Backing datasets. Instances are the union across all of them. */
  mappings: ObjectMapping[]
  /** unmapped until a dataset is bound; error when the binding does not typecheck. */
  status: 'unmapped' | 'ok' | 'error'
  error?: string
  health?: ObjectTypeHealth
  createdAt: number
  updatedAt: number
}

/* -------------------------------------------------------------- link types */

export type LinkCardinality = 'oneToOne' | 'oneToMany' | 'manyToMany'

export interface LinkHealth {
  /** Source instances with at least one match. */
  linked: number
  /** Source instances whose key matched nothing — dangling references. */
  orphans: number
  /** Total resolved pairs. */
  pairs: number
  checkedAt: number
}

/**
 * A relationship between two object types. Links are what make this an
 * ontology rather than a list of tables.
 */
export interface LinkTypeDef {
  id: string
  /** Operator-facing code, e.g. `link.order_supplier`. */
  code: string
  /** How the link reads from the source side, e.g. "Supplier". */
  label: string
  /** How it reads from the target side, e.g. "Orders". */
  reverseLabel: string
  sourceObjectTypeId: string
  targetObjectTypeId: string
  cardinality: LinkCardinality
  /** Direct join: a source property matching a target property. */
  on: { sourceProperty: string; targetProperty: string }
  /**
   * Junction dataset for many-to-many, holding a column of source keys and a
   * column of target keys. When set, `on` is ignored.
   */
  through?: { datasetId: string; sourceColumn: string; targetColumn: string }
  status: 'ok' | 'error'
  error?: string
  health?: LinkHealth
  createdAt: number
  updatedAt: number
}

/* --------------------------------------------------------------- instances */

/** A materialised object. Every value traces back to a real dataset row. */
export interface ObjectInstance {
  /** Stable id, `<objectTypeCode>:<key>`, e.g. `object.supplier:ACME`. */
  id: string
  objectTypeId: string
  objectTypeCode: string
  key: string
  title: string
  properties: Record<string, unknown>
  /** Dataset the backing row came from, so lineage stays traceable. */
  sourceDatasetId: string
}

export interface ObjectQuery {
  objectTypeId: string
  /** Free-text match across key, title and text properties. */
  search?: string
  where?: Array<{ property: string; op: FilterOp; value?: string | number | boolean }>
  limit?: number
  offset?: number
}

export interface ObjectQueryResult {
  objectTypeId: string
  instances: ObjectInstance[]
  /** Matches before paging. */
  total: number
}

/** Objects reached by following one link from a given instance. */
export interface LinkedObjects {
  linkTypeId: string
  linkCode: string
  /** Reading direction actually traversed. */
  direction: 'forward' | 'reverse'
  /** Label for the direction traversed. */
  label: string
  targetObjectTypeId: string
  instances: ObjectInstance[]
  total: number
}

/* --------------------------------------------------------------- dashboard */

export type WidgetKind = 'metric' | 'bar' | 'line' | 'donut' | 'table'

/** An inferred widget. Never persisted — recomputed from schema on every read. */
export interface WidgetSpec {
  /** Deterministic from its inputs, so overrides survive a rebuild. */
  id: string
  datasetId: string
  kind: WidgetKind
  title: string
  subtitle?: string
  /** Column driving categories or the time axis. */
  dimension?: string
  /** Column being measured. Absent means "count rows". */
  measure?: string
  agg?: 'count' | 'sum' | 'avg'
  span: 1 | 2
  /** Why the engine chose this widget, shown in the dashboard's edit affordance. */
  reason: string
}

/** Operator corrections to inference. The only dashboard state worth saving. */
export interface WidgetOverride {
  widgetId: string
  hidden?: boolean
  kind?: WidgetKind
  title?: string
  span?: 1 | 2
  order?: number
}

/* ------------------------------------------------------------------- store */

export interface PlatformSnapshot {
  feeds: FeedDef[]
  datasets: Dataset[]
  transforms: TransformDef[]
  objectTypes: ObjectTypeDef[]
  linkTypes: LinkTypeDef[]
  widgetOverrides: WidgetOverride[]
}

/** Rows are read on demand — snapshots stay small enough to send over IPC. */
export interface DatasetPage {
  datasetId: string
  columns: DatasetColumn[]
  rows: Array<Record<string, unknown>>
  rowCount: number
  version: number
}

/** A widget with its series already computed, ready to render. */
export interface DashboardWidget extends WidgetSpec {
  /** Series for bar, line and donut widgets. */
  points: Array<{ label: string; value: number }>
  /** Single figure for metric widgets. */
  value?: number
  /** Sample rows for table widgets. */
  rows?: Array<Record<string, unknown>>
  columns?: string[]
  hidden: boolean
  order: number
}

/** Profiled shape of a prospective feed, before anything is saved. */
export interface PreviewResult {
  columns: DatasetColumn[]
  rows: Array<Record<string, unknown>>
  rowCount: number
}
