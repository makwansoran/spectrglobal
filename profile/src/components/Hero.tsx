import type { CompanyProfile } from "../types/company";
import { useMarketData } from "../hooks/useMarketData";
import { QuickStatsRow } from "./QuickStatsRow";
import { countryFlag, formatCurrency, formatPercent } from "../utils/format";

type Props = { company: CompanyProfile };

export function Hero({ company }: Props) {
  const { data: market, loading: marketLoading } = useMarketData(company.id, Boolean(company.stock?.ticker));

  const liveQuote = market?.quote;
  const currency = market?.currency || company.stock?.currency || "NOK";

  const stock = company.stock
    ? {
        ...company.stock,
        price:
          liveQuote?.price != null && liveQuote.price > 0 ? liveQuote.price : company.stock.price,
        change: liveQuote?.change ?? company.stock.change,
        changePercent: liveQuote?.changePercent ?? company.stock.changePercent,
        currency,
      }
    : undefined;

  const showQuote =
    stock &&
    stock.price != null &&
    stock.price > 0 &&
    stock.change != null &&
    stock.changePercent != null;
  const stockUp = stock && (stock.change ?? 0) >= 0;

  return (
    <header className="relative border-b border-line bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(183, 148, 246, 0.14), transparent 70%), radial-gradient(ellipse 40% 35% at 80% 40%, rgba(147, 197, 253, 0.12), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4 md:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas font-display text-xl font-bold text-ink md:h-20 md:w-20 md:text-2xl">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt="" className="h-full w-full rounded-lg object-cover" />
              ) : (
                company.logoInitials
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{company.name}</h1>
                <span className="text-2xl" title={company.countryName}>
                  {countryFlag(company.countryCode)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{company.legalName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span>Founded {company.founded}</span>
                <span>·</span>
                <span>{company.headquarters}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {company.industryTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-line bg-white px-2.5 py-0.5 text-xs font-medium text-ink"
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`rounded px-2.5 py-0.5 font-mono text-xs font-medium ${
                    company.isPublic
                      ? "border border-accent/30 bg-accent/10 text-accent"
                      : "border border-line bg-canvas text-muted"
                  }`}
                >
                  {company.isPublic ? "Public" : "Private"}
                </span>
                {stock && (
                  <span className="rounded border border-line bg-canvas px-2.5 py-0.5 font-mono text-xs text-muted">
                    {stock.ticker} · {stock.exchange}
                  </span>
                )}
              </div>
              {marketLoading && company.stock?.ticker && !showQuote && (
                <p className="mt-3 font-mono text-xs text-muted">Loading live quote…</p>
              )}
              {showQuote && stock && (
                <div className="mt-3 flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
                    {formatCurrency(stock.price!, stock.currency)}
                  </span>
                  <span
                    className={`font-mono text-sm font-medium tabular-nums ${stockUp ? "text-positive" : "text-negative"}`}
                  >
                    {stockUp ? "+" : ""}
                    {stock.change!.toFixed(2)} ({formatPercent(stock.changePercent!)})
                  </span>
                  {liveQuote?.asOf && (
                    <span className="w-full font-mono text-xs text-muted">
                      Live · Finnhub · {market?.symbol}
                    </span>
                  )}
                  {liveQuote?.open != null && liveQuote.high != null && liveQuote.low != null && (
                    <span className="w-full font-mono text-xs text-muted">
                      Open {liveQuote.open.toFixed(2)} · High {liveQuote.high.toFixed(2)} · Low{" "}
                      {liveQuote.low.toFixed(2)}
                      {liveQuote.previousClose != null && ` · Prev ${liveQuote.previousClose.toFixed(2)}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            <button type="button" className="btn-primary">
              Follow
            </button>
            <button type="button" className="btn-ghost">
              Export
            </button>
            <button type="button" className="btn-ghost">
              Share
            </button>
          </div>
        </div>

        <QuickStatsRow stats={company.quickStats} />
      </div>
    </header>
  );
}
