/**
 * Core Command types — the vocabulary shared by decisions, audit, and artifacts.
 *
 * Deliberately domain-free. An object type is whatever the operator declared,
 * so nothing here assumes any particular shape of the world.
 */

/** Ontology object type code without the `object.` prefix, e.g. `shipment`. */
export type ObjectType = string

export type RiskLevel = 'normal' | 'watch' | 'critical'

export interface ObjectRef {
  type: ObjectType
  /** Stable id, e.g. `shipment:ASN-5521`. */
  id: string
  /** Operator-facing code, e.g. `ASN-5521`. */
  ref: string
  title: string
}

/* --------------------------------------------------------------- decisions */

export type DecisionStatus = 'pending' | 'resolved' | 'expired'

export interface DecisionOption {
  id: string
  label: string
  /** What Spectr will do if this option is chosen. */
  effect: string
  impact: string
  tone: 'neutral' | 'good' | 'risk'
  /** Tool the runtime executes on selection. */
  tool?: string
  args?: Record<string, unknown>
}

export interface DecisionObject {
  id: string
  createdAt: number
  status: DecisionStatus
  question: string
  context: string
  subject: ObjectRef
  urgency: RiskLevel
  /** Option id Spectr recommends. */
  recommendedOptionId: string
  rationale: string
  options: DecisionOption[]
  /** Set once the operator chooses. */
  chosenOptionId?: string
  resolvedAt?: number
  outcome?: string
}

/* ------------------------------------------------------------------- audit */

export type AuditTier = 'auto' | 'decision'

export interface AuditEntry {
  id: string
  at: number
  actor: string
  tool: string
  tier: AuditTier
  summary: string
  subjectRef?: string
  ok: boolean
  detail?: string
}
