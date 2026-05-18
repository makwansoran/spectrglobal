import type { MarketMetrics } from "../../api/market";
import { formatNumber } from "../../utils/format";

function fmtBillion(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}B`;
  return `${n.toFixed(1)}M`;
}

export function FinnhubMetrics({ metrics }: { metrics: MarketMetrics }) {
  const rows: { label: string; value: string }[] = [
    { label: "Market cap", value: fmtBillion(metrics.marketCap) },
    { label: "P/E (TTM)", value: metrics.peRatio != null ? metrics.peRatio.toFixed(2) : "—" },
    { label: "EPS (TTM)", value: metrics.eps != null ? metrics.eps.toFixed(2) : "—" },
    { label: "Dividend yield", value: metrics.dividendYield != null ? `${metrics.dividendYield.toFixed(2)}%` : "—" },
    { label: "Beta", value: metrics.beta != null ? formatNumber(metrics.beta) : "—" },
    {
      label: "52-week range",
      value:
        metrics.week52Low != null && metrics.week52High != null
          ? `${metrics.week52Low.toFixed(2)} – ${metrics.week52High.toFixed(2)}`
          : "—",
    },
  ].filter((r) => r.value !== "—");

  if (!rows.length) return null;

  return (
    <div className="spectr-card overflow-x-auto">
      <p className="section-label border-b border-line px-4 py-3">Market data (Finnhub)</p>
      <table className="w-full min-w-[20rem] text-left text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0">
              <td className="px-4 py-3 text-muted">{r.label}</td>
              <td className="px-4 py-3 font-mono font-medium tabular-nums text-ink">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
