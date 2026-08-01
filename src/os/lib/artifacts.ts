/**
 * Artifacts are the structured blocks Spectr renders inside a chat reply —
 * the "one box" answers. Every artifact is derived from real platform state, so
 * nothing in them can be invented by the model.
 */

import type { ObjectRef, RiskLevel } from './commandTypes'

export interface TableArtifactRow {
  /** Object ref so the row can open its own detail. */
  ref: ObjectRef
  cells: string[]
  tone?: RiskLevel
  /** When false, row is display-only (e.g. database rows). Default true. */
  openable?: boolean
}

export interface TableArtifact {
  kind: 'table'
  id: string
  title: string
  subtitle?: string
  columns: string[]
  rows: TableArtifactRow[]
}

export interface DecisionArtifact {
  kind: 'decision'
  id: string
  decisionId: string
}

export interface ConfirmArtifact {
  kind: 'confirm'
  id: string
  confirmId: string
}

export type Artifact = TableArtifact | DecisionArtifact | ConfirmArtifact

export function artifactKey(a: Artifact): string {
  return `${a.kind}-${a.id}`
}
