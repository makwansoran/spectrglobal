import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Hero } from "../components/Hero";
import { TabNav } from "../components/TabNav";
import { Section } from "../components/Section";
import { Sidebar } from "../components/sidebar/Sidebar";
import { AboutSection } from "../components/sections/AboutSection";
import { PeopleSection } from "../components/sections/PeopleSection";
import { FinancialsSection } from "../components/sections/FinancialsSection";
import { NewsSection } from "../components/sections/NewsSection";
import { FilingsSection } from "../components/sections/FilingsSection";
import { IndustryMap, hasIndustryMap } from "../components/maps/IndustryMap";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useCompany } from "../hooks/useCompany";
import { useMarketData } from "../hooks/useMarketData";
import { FinnhubMetrics } from "../components/sections/FinnhubMetrics";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";

export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, loading, error } = useCompany(companyId);

  const company = data?.profile ?? null;
  const mapGeojson = data?.mapGeojson ?? null;
  const { data: market } = useMarketData(companyId, Boolean(company?.stock?.ticker));

  const tabs = useMemo(() => {
    if (!company) return [];
    const items: { id: string; label: string }[] = [];
    if (company.about?.trim()) items.push({ id: "overview", label: "Overview" });
    if (company.people.length) items.push({ id: "people", label: "People" });
    if (company.financials.years.length || company.financials.metrics.length) {
      items.push({ id: "financials", label: "Financials" });
    }
    if (company.news.length) items.push({ id: "news", label: "News" });
    if (company.filings.length) items.push({ id: "filings", label: "Filings" });
    if (hasIndustryMap(company.industry)) {
      items.push({ id: "industry", label: company.industryTabLabel });
    }
    return items;
  }, [company]);

  const activeTab = useScrollSpy(
    tabs.map((t) => t.id),
    110
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <ProfileLoading />
      </div>
    );
  }

  if (error === "not_found" || !company) {
    return <Navigate to="/equinor" replace />;
  }

  const showAbout = Boolean(company.about?.trim());
  const showPeople = company.people.length > 0;
  const showFinancials =
    company.financials.years.length > 0 || company.financials.metrics.length > 0;
  const showNews = company.news.length > 0;
  const showFilings = company.filings.length > 0;
  const showIndustry = hasIndustryMap(company.industry);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <Hero company={company} />
      <TabNav tabs={tabs} activeId={activeTab} />

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
          <div className="min-w-0 space-y-14 lg:w-[70%] lg:flex-[7]">
            {showAbout && (
              <Section id="overview" title="About">
                <AboutSection company={company} />
              </Section>
            )}

            {showPeople && (
              <Section id="people" title="People">
                <PeopleSection company={company} />
              </Section>
            )}

            {showFinancials && (
              <Section id="financials" title="Financials">
                <div className="space-y-8">
                  <FinancialsSection company={company} />
                  {market?.metrics && <FinnhubMetrics metrics={market.metrics} />}
                </div>
              </Section>
            )}

            {showNews && (
              <Section id="news" title="News">
                <NewsSection company={company} />
              </Section>
            )}

            {showFilings && (
              <Section id="filings" title="Filings">
                <FilingsSection company={company} />
              </Section>
            )}
          </div>

          <aside className="lg:w-[30%] lg:flex-[3]">
            <Sidebar company={company} />
          </aside>
        </div>

        {showIndustry && (
          <div className="mt-14 w-full">
            <Section id="industry" title={company.industryTabLabel}>
              <IndustryMap company={company} mapGeojson={mapGeojson} />
            </Section>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
