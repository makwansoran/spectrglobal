import { useEffect, useMemo, useState } from "react";
import { fetchPortfolioHoldings, type IndustrialPortfolioHolding } from "../../api/portfolio";
import { companyProfilePath } from "../../lib/paths";

type PortfolioMeta = {
  asOf?: string;
  holdingCount?: number;
  listedCount?: number;
  unlistedCount?: number;
  source?: string;
};

type ListingFilter = "all" | "listed" | "unlisted";

type Props = {
  investorSlug: string;
  portfolio?: PortfolioMeta;
};

function HoldingCard({ holding }: { holding: IndustrialPortfolioHolding }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const profileHref = holding.companySlug ? companyProfilePath(holding.companySlug) : null;

  return (
    <article className="spectr-card flex h-full flex-col overflow-hidden">
      <div className="flex items-start gap-3 border-b border-line bg-canvas/60 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-2">
          {holding.logoUrl && !logoFailed ? (
            <img
              src={holding.logoUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-lg font-semibold text-muted">{holding.name.slice(0, 2)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{holding.sector}</p>
          {profileHref ? (
            <a
              href={profileHref}
              className="mt-0.5 block font-display text-lg font-semibold text-ink underline-offset-2 hover:text-accent hover:underline"
            >
              {holding.name}
            </a>
          ) : (
            <h3 className="mt-0.5 font-display text-lg font-semibold text-ink">{holding.name}</h3>
          )}
          {holding.tagline && <p className="mt-1 text-sm text-muted">{holding.tagline}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-line bg-line text-sm">
        <div className="bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Aker ownership</p>
          <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-ink">
            {holding.ownershipLabel ?? (holding.ownershipPercent != null ? `${holding.ownershipPercent}%` : "—")}
          </p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Share of Aker assets</p>
          <p className="mt-0.5 font-mono text-sm tabular-nums text-ink">{holding.assetShare || "—"}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {(holding.ticker || holding.exchange) && (
          <p className="text-xs text-muted">
            <span className="font-semibold text-ink">{holding.listing === "listed" ? "Listed" : "Unlisted"}</span>
            {holding.exchange || holding.ticker ? (
              <>
                {" · "}
                {[holding.exchange, holding.ticker].filter(Boolean).join(", ")}
              </>
            ) : null}
          </p>
        )}
        {holding.description && (
          <p className="text-sm leading-relaxed text-muted">{holding.description}</p>
        )}
        <dl className="mt-auto grid gap-2 text-xs text-muted sm:grid-cols-2">
          {holding.chair && (
            <div>
              <dt className="font-semibold uppercase tracking-wide">Chair</dt>
              <dd className="text-ink">{holding.chair}</dd>
            </div>
          )}
          {holding.ceo && holding.ceo !== "-" && (
            <div>
              <dt className="font-semibold uppercase tracking-wide">CEO</dt>
              <dd className="text-ink">{holding.ceo}</dd>
            </div>
          )}
        </dl>
        {holding.website && (
          <a
            href={holding.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent hover:underline"
          >
            {holding.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}
      </div>
    </article>
  );
}

export function IndustrialInvestmentsSection({ investorSlug, portfolio }: Props) {
  const [listing, setListing] = useState<ListingFilter>("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [items, setItems] = useState<IndustrialPortfolioHolding[]>([]);
  const [asOf, setAsOf] = useState(portfolio?.asOf ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPortfolioHoldings(investorSlug, { page: 1, limit: 100, q: debouncedQ, sort: "ownership", order: "desc" })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items as IndustrialPortfolioHolding[]);
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
  }, [investorSlug, debouncedQ]);

  const filtered = useMemo(() => {
    if (listing === "all") return items;
    return items.filter((h) => h.listing === listing);
  }, [items, listing]);

  const listedCount = portfolio?.listedCount ?? items.filter((h) => h.listing === "listed").length;
  const unlistedCount = portfolio?.unlistedCount ?? items.filter((h) => h.listing === "unlisted").length;

  return (
    <div className="space-y-4">
      <div>
        <p className="section-label">Investment portfolio</p>
        <p className="mt-1 text-sm text-muted">
          {listedCount} listed · {unlistedCount} unlisted
          {asOf ? ` · As of ${asOf}` : ""}
          {portfolio?.source ? " · Source: akerasa.com" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist">
          {(
            [
              ["all", `All (${items.length})`],
              ["listed", `Listed (${listedCount})`],
              ["unlisted", `Unlisted (${unlistedCount})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={listing === id}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                listing === id
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
              }`}
              onClick={() => setListing(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search holdings…"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm sm:w-64"
        />
      </div>

      {error && <p className="text-sm text-negative">{error}</p>}

      {loading ? (
        <p className="py-12 text-center text-sm text-muted">Loading portfolio…</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">No holdings match your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((holding) => (
            <HoldingCard key={holding.slug} holding={holding} />
          ))}
        </div>
      )}
    </div>
  );
}
