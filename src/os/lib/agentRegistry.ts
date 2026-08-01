export interface AgentDefinition {
  id: string
  name: string
  job: string
  domain: string
  siteTypes: Array<'logistics' | 'waste' | 'both'>
}

export interface AgentDomain {
  id: string
  title: string
  agents: AgentDefinition[]
}

/** Visual traits for each agent characteristic domain. */
export const DOMAIN_META: Record<string, { color: string; soft: string; hint: string }> = {
  'work-creation': {
    color: '#d97706',
    soft: '#fef3c7',
    hint: 'Human & robot work'
  },
  orchestration: {
    color: '#7c3aed',
    soft: '#ede9fe',
    hint: 'Routing & control'
  },
  perception: {
    color: '#2563eb',
    soft: '#dbeafe',
    hint: 'Sensors & world state'
  },
  'logistics-ops': {
    color: '#0f766e',
    soft: '#ccfbf1',
    hint: 'Warehouse flow'
  },
  'waste-ops': {
    color: '#15803d',
    soft: '#dcfce7',
    hint: 'Facility material ops'
  },
  'fleet-safety': {
    color: '#dc2626',
    soft: '#fee2e2',
    hint: 'Fleet & floor safety'
  },
  'master-data': {
    color: '#4f46e5',
    soft: '#e0e7ff',
    hint: 'SKU & material master'
  },
  'compliance-docs': {
    color: '#b45309',
    soft: '#ffedd5',
    hint: 'Docs & compliance'
  },
  commercial: {
    color: '#db2777',
    soft: '#fce7f3',
    hint: 'Customer & billing'
  },
  integration: {
    color: '#475569',
    soft: '#e2e8f0',
    hint: 'Connectors & adapters'
  }
}

export function domainMeta(id: string): { color: string; soft: string; hint: string } {
  return (
    DOMAIN_META[id] ?? {
      color: '#5b6470',
      soft: '#edeff2',
      hint: 'Agent domain'
    }
  )
}

/** Empty until agents are defined on the Model. */
export const AGENT_REGISTRY: AgentDomain[] = []

export function findAgent(id: string): AgentDefinition | undefined {
  for (const domain of AGENT_REGISTRY) {
    const hit = domain.agents.find((a) => a.id === id)
    if (hit) return hit
  }
  return undefined
}

/** Resolve a model node code to a registry agent (supports bare id or `agent.<id>`). */
export function findAgentByCode(code: string): AgentDefinition | undefined {
  if (!code || code === 'ai-agent') return undefined
  const bare = code.startsWith('agent.') ? code.slice('agent.'.length) : code
  return findAgent(bare)
}

export function agentCode(id: string): string {
  return `agent.${id}`
}
