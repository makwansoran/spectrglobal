import { useCallback, useEffect, useState, type JSX } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  getDataApi,
  tableNameFromCode,
  type DataTable
} from '../../lib/dataApi'

/**
 * Live local-table editor — used from Metaphysics dataset preview for db.table feeds.
 */
export default function DatabaseTablePanel({
  code,
  tableName: tableNameProp
}: {
  code?: string
  tableName?: string
}): JSX.Element {
  const tableName = tableNameProp ?? (code ? tableNameFromCode(code) : null)
  const [table, setTable] = useState<DataTable | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    if (!tableName) {
      setTable(null)
      return
    }
    try {
      const t = await getDataApi().getTable(tableName)
      setTable(t)
      setError(null)
      if (t) {
        const empty: Record<string, string> = {}
        for (const c of t.columns) {
          if (c.name === 'id') continue
          empty[c.name] = ''
        }
        setDraft(empty)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [tableName])

  useEffect(() => {
    void reload()
  }, [reload])

  if (!tableName) {
    return (
      <p className="text-[12px] text-ink-faint">
        This data node is not a local table. Preview its dataset from Metaphysics.
      </p>
    )
  }

  if (error) {
    return <p className="text-[12px] text-signal-red">{error}</p>
  }

  if (!table) {
    return <p className="text-[12px] text-ink-faint">Loading {tableName}…</p>
  }

  const editableCols = table.columns.filter((c) => c.name !== 'id')

  const addRow = async (): Promise<void> => {
    setBusy(true)
    try {
      const values: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(draft)) {
        if (v.trim() !== '') values[k] = v.trim()
      }
      await getDataApi().insertRow({ table: tableName, values })
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const removeRow = async (id: string): Promise<void> => {
    setBusy(true)
    try {
      await getDataApi().deleteRow({ table: tableName, id })
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Table · {table.name}
        </div>
        <p className="mt-1 text-[12px] text-ink-dim">
          {table.rows.length} row{table.rows.length === 1 ? '' : 's'} · columns:{' '}
          {table.columns.map((c) => c.name).join(', ')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-edge">
        <table className="min-w-full text-left text-[12px]">
          <thead className="bg-base-700/80 text-ink-faint">
            <tr>
              {table.columns.map((c) => (
                <th key={c.name} className="px-2 py-1.5 font-mono font-normal">
                  {c.name}
                </th>
              ))}
              <th className="w-8 px-2 py-1.5" />
            </tr>
          </thead>
          <tbody>
            {table.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.columns.length + 1}
                  className="px-2 py-3 text-ink-faint"
                >
                  No rows yet. Add one below, or ask Command chat.
                </td>
              </tr>
            ) : (
              table.rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-edge">
                  {table.columns.map((c) => (
                    <td key={c.name} className="max-w-[140px] truncate px-2 py-1.5 text-ink">
                      {row[c.name] == null ? '—' : String(row[c.name])}
                    </td>
                  ))}
                  <td className="px-1 py-1">
                    <button
                      type="button"
                      title="Delete row"
                      disabled={busy}
                      onClick={() => void removeRow(String(row.id))}
                      className="text-ink-faint hover:text-signal-red"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 rounded-md border border-edge bg-base-700/40 p-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint">
          Add row
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {editableCols.map((c) => (
            <label key={c.name} className="block">
              <span className="text-[11px] text-ink-dim">{c.name}</span>
              <input
                value={draft[c.name] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [c.name]: e.target.value }))}
                className="mt-0.5 w-full bg-base-700 px-2 py-1.5 text-sm text-ink outline-none"
                placeholder={c.name}
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void addRow()}
          className="bevel bevel-sm bevel-primary inline-flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add row
        </button>
      </div>
    </div>
  )
}
