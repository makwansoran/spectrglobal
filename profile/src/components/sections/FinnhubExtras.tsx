import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CompanyMarketData } from "../../api/market";
import { companyProfilePath } from "../../lib/paths";

function peerSlug(ticker: string) {
  return `us-${ticker.toLowerCase().replace(/[^a-z0-9.-]/g, "")}`;
}

export function FinnhubExtras({ market, includeNews = true }: { market: CompanyMarketData; includeNews?: boolean }) {
  const p = market.profile;
  const years = market.metrics?.revenueYears?.filter((y) => y.revenue > 0) ?? [];
  const chartData = years.map((y) => ({
    year: String(y.year),
    revenue: y.revenue >= 1e9 ? y.revenue / 1e9 : y.revenue / 1e6,
    billions: y.revenue >= 1e9,
  }));
  const inBillions = chartData.length > 0 && chartData[0].billions;

  const rec = market.recommendations;
  const recTotal = rec
    ? rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell
    : 0;

  return (
    <div className="space-y-8">
      {p && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label mb-4">Company (Finnhub)</p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {p.industry && (
              <div>
                <dt className="text-xs text-muted">Industry</dt>
                <dd className="text-sm font-medium text-ink">{p.industry}</dd>
              </div>
            )}
            {p.ipo && (
              <div>
                <dt className="text-xs text-muted">IPO</dt>
                <dd className="text-sm font-medium text-ink">{p.ipo}</dd>
              </div>
            )}
            {p.employees != null && (
              <div>
                <dt className="text-xs text-muted">Employees</dt>
                <dd className="text-sm font-medium text-ink">{p.employees.toLocaleString()}</dd>
              </div>
            )}
            {p.phone && (
              <div>
                <dt className="text-xs text-muted">Phone</dt>
                <dd className="text-sm font-medium text-ink">{p.phone}</dd>
              </div>
            )}
            {p.weburl && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">Website</dt>
                <dd>
                  <a href={p.weburl} className="text-sm font-medium text-accent hover:underline" target="_blank" rel="noreferrer">
                    {p.weburl.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label">Revenue history (Finnhub)</p>
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
                  }}
                  formatter={(v: number) => [
                    inBillions ? `$${v.toFixed(1)}B` : `$${v.toFixed(1)}M`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#1f6feb" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {rec && recTotal > 0 && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label mb-3">Analyst ratings (Finnhub · {rec.period || "latest"})</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              { label: "Strong buy", n: rec.strongBuy, color: "bg-positive/15 text-positive" },
              { label: "Buy", n: rec.buy, color: "bg-positive/10 text-positive" },
              { label: "Hold", n: rec.hold, color: "bg-canvas text-muted" },
              { label: "Sell", n: rec.sell, color: "bg-negative/10 text-negative" },
              { label: "Strong sell", n: rec.strongSell, color: "bg-negative/15 text-negative" },
            ].map((x) => (
              <span key={x.label} className={`rounded px-3 py-1.5 font-mono ${x.color}`}>
                {x.label}: {x.n}
              </span>
            ))}
          </div>
        </div>
      )}

      {market.earnings.length > 0 && (
        <div className="spectr-card overflow-x-auto">
          <p className="section-label border-b border-line px-4 py-3">Earnings (Finnhub)</p>
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Actual</th>
                <th className="px-4 py-3 font-medium">Estimate</th>
                <th className="px-4 py-3 font-medium">Surprise</th>
              </tr>
            </thead>
            <tbody>
              {market.earnings.map((e) => (
                <tr key={e.period || `${e.year}-${e.quarter}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink">{e.period}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">{e.actual ?? "—"}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-muted">{e.estimate ?? "—"}</td>
                  <td
                    className={`px-4 py-3 font-mono tabular-nums ${
                      (e.surprisePercent ?? 0) >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {e.surprisePercent != null ? `${e.surprisePercent.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {market.peers.length > 0 && (
        <div className="spectr-card p-4 md:p-6">
          <p className="section-label mb-3">Peers (Finnhub)</p>
          <div className="flex flex-wrap gap-2">
            {market.peers.slice(0, 12).map((ticker) => (
              <a
                key={ticker}
                href={companyProfilePath(peerSlug(ticker))}
                className="rounded border border-line bg-canvas px-3 py-1 font-mono text-sm text-accent hover:border-accent"
              >
                {ticker}
              </a>
            ))}
          </div>
        </div>
      )}

      {includeNews && market.news.length > 0 && (
        <div>
          <p className="section-label mb-4">News (Finnhub)</p>
          <ul className="space-y-4">
          {market.news.map((item) => (
            <li key={item.id} className="spectr-card p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-medium text-accent">{item.source}</span>
                {item.date && (
                  <>
                    <span>·</span>
                    <time dateTime={item.date}>{item.date}</time>
                  </>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-ink">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              {item.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>}
            </li>
          ))}
          </ul>
        </div>
      )}
    </div>
  );
}
