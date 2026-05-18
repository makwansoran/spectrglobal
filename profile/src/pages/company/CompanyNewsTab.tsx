import { FinnhubNews } from "../../components/sections/FinnhubNews";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useCompanyNews } from "../../hooks/useCompanyNews";

export function CompanyNewsTab() {
  const { company } = useCompanyProfile();
  const { data, loading, error } = useCompanyNews(company.id);

  const items = data?.news ?? [];

  return (
    <ProfileTabPanel>
      <p className="section-label mb-4">News</p>

      {loading && items.length === 0 ? (
        <p className="text-sm text-muted">Loading news…</p>
      ) : error === "load_failed" ? (
        <p className="text-sm text-muted">Could not load news right now. Try again later.</p>
      ) : items.length === 0 ? (
        <p className="spectr-card p-6 text-sm text-muted">
          No recent news for {company.name}. Headlines appear here when we have coverage from Spectr or market
          data providers.
        </p>
      ) : (
        <FinnhubNews items={items} />
      )}
    </ProfileTabPanel>
  );
}
