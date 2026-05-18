import type { QuickStat } from "../types/company";
import { formatCurrency, formatNumber } from "../utils/format";

function formatStatValue(stat: QuickStat) {
  if (stat.format === "currency" && typeof stat.value === "number") {
    return formatCurrency(stat.value);
  }
  if (typeof stat.value === "number") {
    return formatNumber(stat.value);
  }
  return stat.value;
}

type Props = {
  stats: QuickStat[];
};

/** Inline hero metrics — no card boxes; items sit in one horizontal row. */
export function QuickStatsRow({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <dl className="mt-8 flex flex-wrap items-start gap-y-4 border-t border-line pt-6 lg:flex-nowrap">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`min-w-[5.5rem] shrink-0 pr-8 sm:pr-10 ${
            index < stats.length - 1 ? "border-r border-line" : ""
          }`}
        >
          <dt className="section-label mb-0.5 whitespace-nowrap">{stat.label}</dt>
          <dd className="font-mono text-base font-semibold tabular-nums text-ink sm:text-lg">
            {formatStatValue(stat)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
