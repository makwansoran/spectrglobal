/**
 * Maps each tool onto the specialist agent that owns it. The orchestrator uses
 * this to attribute work, so the step tree reads like a real agent org rather
 * than a flat list of function calls.
 */

export const TOOL_AGENT: Record<string, string> = {
  list_tables: 'Data Steward Agent',
  query_table: 'Data Steward Agent',
  find_employee: 'Data Steward Agent',
  create_table: 'Data Steward Agent',
  insert_row: 'Data Steward Agent',
  insert_rows: 'Data Steward Agent',
  import_table: 'Ingestion Agent',
  update_row: 'Data Steward Agent',
  delete_row: 'Data Steward Agent',
  dedupe_table: 'Data Quality Agent',
  drop_table: 'Data Quality Agent',
  add_employee: 'Data Steward Agent',
  ask_confirm: 'Orchestrator Agent'
}

export function agentFor(tool: string): string {
  return TOOL_AGENT[tool] ?? 'Orchestrator Agent'
}
