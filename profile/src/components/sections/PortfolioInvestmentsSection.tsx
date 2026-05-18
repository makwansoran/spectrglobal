import { useEffect, useState } from "react";
import { fetchPortfolioHoldings, type PortfolioHolding } from "../../api/portfolio";
import { companyProfilePath } from "../../lib/paths";

type PortfolioMeta = {
  asOf?: string;
  holdingCount?: number;
  totalMarketValueUsd?: number;
  source?: string;
};

function formatUsd(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

type Props = {
  investorSlug: string;
  portfolio?: PortfolioMeta;
};

export function PortfolioInvestmentsSection({ investorSlug, portfolio }: Props) {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"value" | "name" | "ownership" | "country" | "industry">("value");
  const [items, setItems] = useState<PortfolioHolding[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [asOf, setAsOf] = useState(portfolio?.asOf ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPortfolioHoldings(investorSlug, { page, limit: 50, q: debouncedQ, sort, order: "desc" })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
        setPages(data.pages);
        setAsOf(data.asOf);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load investments.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [investorSlug, page, debouncedQ, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">Equity investments</p>
          <p className="mt-1 text-sm text-muted">
            {portfolio?.holdingCount?.toLocaleString("en-US") ?? total.toLocaleString("en-US")} companies
            {asOf ? ` · As of ${asOf}` : ""}
            {portfolio?.totalMarketValueUsd
              ? ` · Total ${formatUsd(portfolio.totalMarketValueUsd)} (USD)`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, country, industry…"
            className="w-full min-w-[200px] rounded-md border border-line bg-white px-3 py-2 text-sm sm:w-64"
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as typeof sort);
              setPage(1);
            }}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm"
          >
            <option value="value">Sort: Market value</option>
            <option value="name">Sort: Name</option>
            <option value="ownership">Sort: Ownership %</option>
            <option value="country">Sort: Country</option>
            <option value="industry">Sort: Industry</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-negative">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading investments…</p>
      ) : (
        <>
          <p className="text-xs text-muted">
            Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total.toLocaleString("en-US")}
            {debouncedQ ? ` matching “${debouncedQ}”` : ""}
          </p>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-canvas text-xs font-semibold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Country</th>
                  <th className="px-3 py-2">Industry</th>
                  <th className="px-3 py-2 text-right">Ownership</th>
                  <th className="px-3 py-2 text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((row) => (
                  <tr key={row.slug} className="hover:bg-canvas/80">
                    <td className="max-w-[220px] px-3 py-2">
                      <a
                        href={companyProfilePath(row.slug)}
                        className="font-medium text-ink underline-offset-2 hover:text-accent hover:underline"
                      >
                        {row.name}
                      </a>
                      <p className="truncate text-[11px] text-muted">{row.region}</p>
                    </td>
                    <td className="px-3 py-2 text-muted">{row.listingCountry}</td>
                    <td className="max-w-[140px] truncate px-3 py-2 text-muted">{row.industry}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {row.ownershipPercent.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {formatUsd(row.marketValueUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                className="btn-ghost text-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="font-mono text-xs text-muted">
                Page {page} / {pages}
              </span>
              <button
                type="button"
                className="btn-ghost text-sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
