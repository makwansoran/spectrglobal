import { useMemo } from "react";
import { FinancialsSection } from "../../components/sections/FinancialsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useCompanyFinancials } from "../../hooks/useCompanyFinancials";
import { financialsFromProfile, mergeFinancialsPayload } from "../../lib/profileFinancials";

export function CompanyFinancialsTab() {
  const { company } = useCompanyProfile();
  const { data, loading, error } = useCompanyFinancials(company.id);

  const payload = useMemo(() => {
    const stored = financialsFromProfile(company);
    return mergeFinancialsPayload(stored, data);
  }, [company, data]);

  return (
    <ProfileTabPanel>
      {loading && !payload ? (
        <p className="text-sm text-muted">Loading financial statements…</p>
      ) : error === "load_failed" && !payload ? (
        <p className="text-sm text-muted">Could not load financials. Try again later.</p>
      ) : payload?.hasData ? (
        <FinancialsSection payload={payload} />
      ) : company.isPublic || company.stock?.ticker ? (
        <p className="spectr-card p-6 text-sm text-muted">
          No financial history is available for {company.name} yet. US SEC filers are filled in batches; Oslo and
          European listings use curated annual data where we have it.
        </p>
      ) : (
        <p className="spectr-card p-6 text-sm text-muted">
          Financial statements are shown for listed companies with market data coverage.
        </p>
      )}
    </ProfileTabPanel>
  );
}
