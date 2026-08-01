import type { JSX } from 'react'
import type { TableArtifact } from '../../lib/artifacts'
import { useObjectFocus } from '../../lib/objectFocus'

const ROW_TONE: Record<string, string> = {
  normal: '',
  watch: 'text-signal-amber',
  critical: 'text-signal-red'
}

/** Object list where every row opens its own situation. */
export default function TableArtifactView({ artifact }: { artifact: TableArtifact }): JSX.Element {
  const { open } = useObjectFocus()

  return (
    <section
      className="bevel-panel overflow-hidden bg-white shadow-panel"
      style={{ ['--bevel-cut' as string]: '12px' }}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-edge px-3.5 pb-2 pt-3">
        <h3 className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-dim">
          {artifact.title}
        </h3>
        {artifact.subtitle && (
          <span className="text-[10px] font-mono text-ink-faint">{artifact.subtitle}</span>
        )}
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {artifact.columns.map((c) => (
                <th
                  key={c}
                  className="whitespace-nowrap px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-ink-faint"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {artifact.rows.map((row) => (
              <tr
                key={row.ref.id}
                onClick={() => {
                  if (row.openable === false) return
                  open(row.ref.ref)
                }}
                className={`border-t border-edge-soft transition-colors ${
                  row.openable === false
                    ? 'cursor-default'
                    : 'cursor-pointer hover:bg-spectr-accent/5'
                }`}
              >
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-3 py-1.5 text-[12px] leading-snug ${
                      i === 0
                        ? `font-mono ${ROW_TONE[row.tone ?? 'normal'] || 'text-ink'}`
                        : 'text-ink-dim'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {artifact.rows.length === 0 && (
        <p className="px-3.5 py-3 text-[12px] text-ink-faint">Nothing matched.</p>
      )}
    </section>
  )
}
