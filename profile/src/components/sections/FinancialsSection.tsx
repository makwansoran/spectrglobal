import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CompanyFinancialsPayload } from "../../api/financials";
import { downloadFinancialsCsv, downloadFinancialsJson } from "../../lib/financialsExport";
import { formatMetric, formatPercent } from "../../utils/format";

type Props = {
  payload: CompanyFinancialsPayload;
};

function formatMoney(value: number | null | undefined, _currency: string) {
  if (value == null) return "—";
  return formatMetric(value, "currency");
}

export function FinancialsSection({ payload }: Props) {
  const { financials, companyName } = payload;
  const [view, setView] = useState<"annual" | "quarterly">("annual");
  const currency = financials.currency || "USD";

  const annualChart = useMemo(() => {
    const years = [...financials.annual].sort((a, b) => a.fiscalYear - b.fiscalYear);
    const maxRev = Math.max(...years.map((y) => y.revenue || 0), 0);
    const inMillions = maxRev > 0 && maxRev < 1e9;
    return {
      inMillions,
      data: years
        .filter((y) => (y.revenue ?? 0) > 0)
        .map((y) => ({
          year: String(y.fiscalYear),
          revenue: inMillions ? (y.revenue ?? 0) / 1e6 : (y.revenue ?? 0) / 1e9,
        })),
    };
  }, [financials.annual]);

  const tableRows = view === "annual" ? financials.annual : financials.quarterly;
  const sourceLabel =
    financials.meta?.source === "finnhub-reported" || financials.source === "finnhub-reported"
      ? "SEC filings via Finnhub (as reported)"
      : financials.meta?.source || financials.source || "Spectr";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Financials</p>
          <p className="mt-1 text-sm text-muted">
            Up to five years of annual and quarterly statements for {companyName}. Figures are as reported;{" "}
            {sourceLabel}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost text-sm" onClick={() => downloadFinancialsCsv(payload)}>
            Download CSV
          </button>
          <button type="button" className="btn-ghost text-sm" onClick={() => downloadFinancialsJson(payload)}>
            Download JSON
          </button>
        </div>
      </div>

      {annualChart.data.length > 0 && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label">
            Revenue ({currency}, {annualChart.inMillions ? "millions" : "billions"}) — annual
          </p>
          <div className="h-64 w-full md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualChart.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                    annualChart.inMillions ? `${v.toFixed(1)}M` : `${v.toFixed(1)}B`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#1f6feb" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            view === "annual" ? "border-accent bg-accent/10 text-accent" : "border-line text-muted"
          }`}
          onClick={() => setView("annual")}
        >
          Annual
        </button>
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            view === "quarterly" ? "border-accent bg-accent/10 text-accent" : "border-line text-muted"
          }`}
          onClick={() => setView("quarterly")}
        >
          Quarterly
        </button>
      </div>

      {tableRows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">End date</th>
                <th className="px-4 py-3 font-medium">Form</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
                <th className="px-4 py-3 font-medium">Operating income</th>
                <th className="px-4 py-3 font-medium">Net income</th>
                <th className="px-4 py-3 font-medium">Op. cash flow</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.period + row.periodEnd} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink">{row.period}</td>
                  <td className="px-4 py-3 text-muted">{row.periodEnd}</td>
                  <td className="px-4 py-3 text-muted">{row.form || "—"}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">{formatMoney(row.revenue, currency)}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {formatMoney(row.operatingIncome, currency)}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">{formatMoney(row.netIncome, currency)}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {formatMoney(row.operatingCashFlow ?? null, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="spectr-card p-6 text-sm text-muted">No {view} statement data available for this company.</p>
      )}

      {financials.metrics.length > 0 && (
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
              {financials.metrics.map((m) => (
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
