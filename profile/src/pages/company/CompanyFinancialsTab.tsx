import { FinancialsSection } from "../../components/sections/FinancialsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useCompanyFinancials } from "../../hooks/useCompanyFinancials";

export function CompanyFinancialsTab() {
  const { company } = useCompanyProfile();
  const { data, loading, error } = useCompanyFinancials(company.id);

  return (
    <ProfileTabPanel>
      {loading && !data ? (
        <p className="text-sm text-muted">Loading financial statements…</p>
      ) : error === "load_failed" ? (
        <p className="text-sm text-muted">Could not load financials. Try again later.</p>
      ) : data?.hasData ? (
        <FinancialsSection payload={data} />
      ) : company.isPublic ? (
        <p className="spectr-card p-6 text-sm text-muted">
          No SEC-reported financial history is available for {company.name} yet. US-listed companies with active
          filings typically show five years of annual and quarterly data here.
        </p>
      ) : (
        <p className="spectr-card p-6 text-sm text-muted">
          Financial statements are available for public companies with market data coverage.
        </p>
      )}
    </ProfileTabPanel>
  );
}
