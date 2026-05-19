import { FilingsSection } from "../../components/sections/FilingsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useCompanyFilings } from "../../hooks/useCompanyFilings";

function sourceLabel(s: string): string {
  if (s === "sec-edgar") return "SEC EDGAR";
  if (s.startsWith("finnhub")) return "Finnhub";
  if (s === "euronext") return "Euronext";
  if (s === "company-ir") return "Company IR";
  if (s === "uk-lse") return "LSE";
  return s;
}

export function CompanyFilingsTab() {
  const { company } = useCompanyProfile();
  const hasTicker = Boolean(company.stock?.ticker);
  const hasWebsite = Boolean(company.website || company.finnhub?.weburl);
  const canLoadFilings = hasTicker || hasWebsite;
  const { filings, sources, loading, error, reload } = useCompanyFilings(company.id, canLoadFilings);

  const displayFilings = filings.length ? filings : company.filings;

  const sourceLabels = [...new Set(sources.map(sourceLabel))];

  return (
    <ProfileTabPanel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Regulatory filings</h2>
          <p className="mt-1 text-sm text-muted">
            Global sources: SEC EDGAR and Finnhub (US and listed symbols), Euronext for Nordic/EU
            listings, UK registry links, plus automated investor-relations link extraction when
            official APIs have no filings.
            {sourceLabels.length ? ` Active: ${sourceLabels.join(", ")}.` : ""}
          </p>
        </div>
        {canLoadFilings ? (
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-canvas disabled:opacity-50"
            disabled={loading}
            onClick={reload}
          >
            {loading ? "Refreshing…" : "Refresh filings"}
          </button>
        ) : null}
      </div>

      {loading && !displayFilings.length ? (
        <p className="text-sm text-muted">Fetching filings from configured sources…</p>
      ) : null}

      {error && !displayFilings.length ? (
        <p className="text-sm text-muted">Could not load filings. Try refresh.</p>
      ) : null}

      {!canLoadFilings ? (
        <p className="text-sm text-muted">
          No ticker or company website on file. Link a stock symbol or website to enable filing
          discovery.
        </p>
      ) : null}

      {displayFilings.length > 0 ? (
        <FilingsSection company={{ ...company, filings: displayFilings }} />
      ) : !loading && canLoadFilings ? (
        <p className="text-sm text-muted">
          No filings found yet. Use refresh to run enrichment (including IR scrape when APIs return
          nothing).
        </p>
      ) : null}
    </ProfileTabPanel>
  );
}
