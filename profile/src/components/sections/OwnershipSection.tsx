import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CompanyProfile } from "../../types/company";
import { ShareholderLogo } from "../ShareholderLogo";
import { buildPieSlices, holderMetaLine, resolveOwnership } from "../../lib/ownership";
import { holderProfilePath } from "../../lib/paths";

type Props = { company: CompanyProfile };

function formatPercent(value: number) {
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}

export function OwnershipSection({ company }: Props) {
  const ownership = resolveOwnership(company);
  if (!ownership?.shareholders.length) return null;

  const slices = buildPieSlices(ownership.shareholders);

  return (
    <div className="space-y-4">
      {(ownership.asOf || ownership.note) && (
        <p className="text-xs text-muted">
          {ownership.asOf && <span className="font-mono uppercase tracking-wide">As of {ownership.asOf}</span>}
          {ownership.asOf && ownership.note ? " · " : null}
          {ownership.note}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="h-52 w-full md:h-60">
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

        <ul className="divide-y divide-line">
          {slices.map((slice) => {
            const meta = holderMetaLine(slice);
            const canLink = Boolean(slice.slug && !slice.isOther);

            return (
              <li key={slice.slug || slice.name} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                <ShareholderLogo stake={slice} size="sm" color={slice.color} />
                <div className="min-w-0 flex-1">
                  {canLink ? (
                    <Link
                      to={holderProfilePath(slice.slug!)}
                      className="block truncate text-left text-sm font-medium text-ink underline-offset-2 hover:text-accent hover:underline"
                    >
                      {slice.name}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-medium text-ink">{slice.name}</p>
                  )}
                  {meta && <p className="truncate text-[11px] text-muted">{meta}</p>}
                  {slice.detail && !slice.isOther && (
                    <p className="truncate text-xs text-muted">{slice.detail}</p>
                  )}
                </div>
                <span
                  className="shrink-0 font-mono text-xs font-semibold tabular-nums"
                  style={{ color: slice.color }}
                >
                  {formatPercent(slice.percent)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
