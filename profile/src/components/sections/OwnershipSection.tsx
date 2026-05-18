import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CompanyProfile } from "../../types/company";
import { ShareholderLogo } from "../ShareholderLogo";
import { buildPieSlices, resolveOwnership } from "../../lib/ownership";

type Props = { company: CompanyProfile };

function formatPercent(value: number) {
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}

export function OwnershipSection({ company }: Props) {
  const ownership = resolveOwnership(company);
  if (!ownership?.shareholders.length) return null;

  const slices = buildPieSlices(ownership.shareholders);

  return (
    <div className="space-y-6">
      {(ownership.asOf || ownership.note) && (
        <p className="text-sm text-muted">
          {ownership.asOf && (
            <span className="font-mono text-xs uppercase tracking-wide text-muted">
              As of {ownership.asOf}
            </span>
          )}
          {ownership.asOf && ownership.note ? " · " : null}
          {ownership.note}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="h-64 w-full md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="percent"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="88%"
                paddingAngle={1}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {slices.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name, item) => [
                  formatPercent(value),
                  item?.payload?.name ?? "",
                ]}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #d8e0ea",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {slices.map((slice) => (
            <li
              key={slice.name}
              className="flex items-center gap-3 rounded-lg border border-line bg-canvas/40 px-3 py-2.5"
            >
              <ShareholderLogo stake={slice} color={slice.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{slice.name}</p>
                {slice.detail && !slice.isOther && (
                  <p className="truncate text-xs text-muted">{slice.detail}</p>
                )}
              </div>
              <span
                className="shrink-0 font-mono text-sm font-semibold tabular-nums text-ink"
                style={{ color: slice.color }}
              >
                {formatPercent(slice.percent)}
              </span>
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
