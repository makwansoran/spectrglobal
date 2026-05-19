import type { CompanyProfile } from "../../types/company";

type EuronextMeta = NonNullable<CompanyProfile["euronext"]>;

function formatNok(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 3,
  }).format(value);
}

function formatPct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function EuronextSection({ euronext }: { euronext: EuronextMeta }) {
  const synced = euronext.syncedAt
    ? new Date(euronext.syncedAt).toLocaleString("nb-NO", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <section className="mt-8 border-t border-line pt-6" aria-labelledby="euronext-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="euronext-heading" className="text-lg font-semibold text-ink">
          Euronext Live
        </h2>
        {synced && <p className="text-xs text-muted">Synced {synced}</p>}
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">ISIN</dt>
          <dd className="mt-0.5 font-mono text-sm text-ink">{euronext.isin}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">MIC</dt>
          <dd className="mt-0.5 font-mono text-sm text-ink">{euronext.mic}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Last price</dt>
          <dd className="mt-0.5 font-mono text-sm text-ink">{formatNok(euronext.lastPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Day change</dt>
          <dd
            className={`mt-0.5 font-mono text-sm font-medium ${
              (euronext.dayChangePct ?? 0) >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {formatPct(euronext.dayChangePct)}
          </dd>
        </div>
        {euronext.lastTradeLabel && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Last trade</dt>
            <dd className="mt-0.5 text-sm text-ink">{euronext.lastTradeLabel}</dd>
          </div>
        )}
      </dl>
      {euronext.productUrl && (
        <p className="mt-4">
          <a
            href={euronext.productUrl}
            className="text-sm font-medium text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Euronext Live
          </a>
        </p>
      )}
    </section>
  );
}
