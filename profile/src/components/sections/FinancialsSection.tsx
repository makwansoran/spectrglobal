import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CompanyProfile } from "../../types/company";
import { formatMetric, formatPercent } from "../../utils/format";

export function FinancialsSection({ company }: { company: CompanyProfile }) {
  const { years, metrics } = company.financials;
  if (!years.length && !metrics.length) return null;

  const maxRevenue = Math.max(...years.map((y) => y.revenue || 0));
  const inMillions = maxRevenue > 0 && maxRevenue < 1e9;
  const chartData = years
    .filter((y) => y.revenue > 0)
    .map((y) => ({
      year: String(y.year),
      revenue: inMillions ? y.revenue / 1e6 : y.revenue / 1e9,
    }));

  return (
    <div className="space-y-8">
      {years.length > 0 && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label">Revenue (USD, {inMillions ? "millions" : "billions"})</p>
          <div className="h-64 w-full md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: "#5c6b7a", fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#5c6b7a", fontSize: 12 }} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #d8e0ea",
                    borderRadius: 8,
                    fontFamily: "JetBrains Mono",
                    color: "#101820",
                  }}
                  formatter={(v: number) => [
                    inMillions ? `$${v.toFixed(1)}M` : `$${v.toFixed(1)}B`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#1f6feb" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {metrics.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">YoY</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{m.label}</td>
                  <td className="px-4 py-3 font-mono font-medium tabular-nums text-ink">
                    {m.format === "text" && m.display
                      ? m.display
                      : formatMetric(m.value, m.format)}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono text-sm tabular-nums ${
                      m.change === undefined
                        ? "text-muted"
                        : m.change >= 0
                          ? "text-positive"
                          : "text-negative"
                    }`}
                  >
                    {m.change !== undefined ? formatPercent(m.change) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
