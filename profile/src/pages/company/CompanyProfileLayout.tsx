import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { Hero } from "../../components/Hero";
import { TabNav } from "../../components/TabNav";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { ProfileLoading } from "../../components/ProfileLoading";
import { CompanyProfileProvider } from "../../context/CompanyProfileContext";
import { useCompany } from "../../hooks/useCompany";
import { useCompanyTabs } from "../../hooks/useCompanyTabs";
import { companyTabFromPath } from "../../lib/profileTabs";

export function CompanyProfileLayout() {
  const { companyId } = useParams<{ companyId: string }>();
  const location = useLocation();
  const { data, loading, error } = useCompany(companyId);

  const company = data?.profile ?? null;
  const mapGeojson = data?.mapGeojson ?? null;
  const tabs = useCompanyTabs(company, mapGeojson);
  const tabIds = useMemo(() => new Set(tabs.map((t) => t.id)), [tabs]);

  const activeTab = companyId ? companyTabFromPath(location.pathname, companyId) : "overview";
  const basePath = companyId ? `/${companyId}` : "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <ProfileLoading />
      </div>
    );
  }

  if (error === "not_found" || (!company && !loading)) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Company not found</h1>
          <p className="mt-2 text-sm text-muted">
            {companyId ? `No profile for "${companyId}" in Spectr yet.` : "Missing company id in the URL."}
          </p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </div>
    );
  }

  if (error === "load_failed" || !company) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not load profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </div>
    );
  }

  if (activeTab !== "overview" && !tabIds.has(activeTab)) {
    return <Navigate to={basePath} replace />;
  }

  return (
    <CompanyProfileProvider value={{ company, mapGeojson }}>
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <Hero company={company} />
        <TabNav tabs={tabs} activeId={activeTab} basePath={basePath} chatTabId="chat" />
        <main className="mx-auto max-w-7xl px-4 md:px-6">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </CompanyProfileProvider>
  );
}
