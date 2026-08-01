/**
 * Risk gate. Auto-tier tools run immediately; decision-tier tools are converted
 * into a Decision for the operator and only execute once a human picks an
 * option. Everything that runs is audited.
 */

import { recordAudit } from '../audit'
import type { DecisionObject } from '../commandTypes'
import { raiseDecision, resolveDecision } from '../decisions'
import { TOOL_BY_NAME, type ToolContext, type ToolResult } from './registry'

export interface ExecutedTool extends ToolResult {
  tool: string
  tier: 'auto' | 'decision'
  /** True when the risk gate parked the call instead of running it. */
  parked: boolean
  durationMs: number
}

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ToolContext
): Promise<ExecutedTool> {
  const started = Date.now()
  const def = TOOL_BY_NAME[name]

  if (!def) {
    return {
      tool: name,
      tier: 'auto',
      parked: false,
      ok: false,
      data: { error: 'unknown_tool', available: Object.keys(TOOL_BY_NAME) },
      summary: `Unknown tool ${name}`,
      durationMs: 0
    }
  }

  // Decision tier never mutates on the model's say-so.
  if (def.tier === 'decision') {
    const parked = await parkForOperator(name, args, ctx)
    return { ...parked, durationMs: Date.now() - started }
  }

  try {
    const result = await def.run(args, ctx)
    recordAudit({
      actor: ctx.actor,
      tool: name,
      tier: 'auto',
      summary: result.summary,
      subjectRef: typeof args.ref === 'string' ? args.ref : undefined,
      ok: result.ok
    })
    return {
      ...result,
      tool: name,
      tier: 'auto',
      parked: false,
      durationMs: Date.now() - started
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tool failed'
    recordAudit({ actor: ctx.actor, tool: name, tier: 'auto', summary: message, ok: false })
    return {
      tool: name,
      tier: 'auto',
      parked: false,
      ok: false,
      data: { error: message },
      summary: message,
      durationMs: Date.now() - started
    }
  }
}

/** Turn a high-impact tool call into a decision the operator must approve. */
async function parkForOperator(
  name: string,
  args: Record<string, unknown>,
  ctx: ToolContext
): Promise<Omit<ExecutedTool, 'durationMs'>> {
  const def = TOOL_BY_NAME[name]
  const ref = typeof args.ref === 'string' ? args.ref : ''
  const reason = typeof args.reason === 'string' ? args.reason : ''

  const label = `${def.step(args)}`
  const decision = raiseDecision({
    question: `${label}?`,
    context: reason || def.description,
    subject: {
      type: 'dataset',
      id: ref ? `ref:${ref}` : 'unknown',
      ref: ref || '—',
      title: ref || 'Platform action'
    },
    urgency: 'watch',
    rationale: `Spectr wants to ${label.toLowerCase()}. This changes platform state, so it needs your call.`,
    recommendedOptionId: 'opt-approve',
    options: [
      {
        id: 'opt-approve',
        label: 'Approve',
        effect: label,
        impact: 'Spectr executes immediately and reports back.',
        tone: 'risk',
        tool: name,
        args
      },
      {
        id: 'opt-decline',
        label: 'Do not do it',
        effect: 'Leave things as they are',
        impact: 'Nothing changes; the underlying problem stays open.',
        tone: 'neutral'
      }
    ]
  })

  recordAudit({
    actor: ctx.actor,
    tool: name,
    tier: 'decision',
    summary: `Awaiting operator: ${label}`,
    subjectRef: ref || undefined,
    ok: true
  })

  return {
    tool: name,
    tier: 'decision',
    parked: true,
    ok: true,
    data: {
      status: 'awaiting_operator',
      decisionId: decision.id,
      note: 'This action is parked in the Decision Queue. Tell the operator you need their call and what you recommend. Do not claim it is done.'
    },
    summary: `Awaiting operator approval: ${label}`,
    decisionId: decision.id,
    artifacts: [{ kind: 'decision', id: decision.id, decisionId: decision.id }]
  }
}

/** Operator picked an option — resolve the decision and run its branch. */
export async function applyDecision(
  decision: DecisionObject,
  optionId: string
): Promise<ExecutedTool | null> {
  const option = decision.options.find((o) => o.id === optionId)
  if (!option) return null

  if (!option.tool) {
    resolveDecision(decision.id, optionId, option.effect)
    recordAudit({
      actor: 'Operator',
      tool: 'decision',
      tier: 'decision',
      summary: `${decision.question} → ${option.label}`,
      subjectRef: decision.subject.ref,
      ok: true
    })
    return null
  }

  const def = TOOL_BY_NAME[option.tool]
  if (!def) {
    resolveDecision(decision.id, optionId, `Unknown action ${option.tool}`)
    return null
  }

  const started = Date.now()
  const ctx: ToolContext = { actor: 'Operator-approved' }
  let result: ToolResult
  try {
    result = await def.run(option.args ?? {}, ctx)
  } catch (err) {
    result = {
      ok: false,
      data: { error: err instanceof Error ? err.message : 'failed' },
      summary: 'Action failed'
    }
  }

  resolveDecision(decision.id, optionId, result.summary)
  recordAudit({
    actor: 'Operator-approved',
    tool: option.tool,
    tier: 'decision',
    summary: result.summary,
    subjectRef: decision.subject.ref,
    ok: result.ok
  })

  return {
    ...result,
    tool: option.tool,
    tier: 'decision',
    parked: false,
    durationMs: Date.now() - started
  }
}
