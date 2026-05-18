import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Hero } from "../components/Hero";
import { TabNav } from "../components/TabNav";
import { Section } from "../components/Section";
import { Sidebar } from "../components/sidebar/Sidebar";
import { AboutSection } from "../components/sections/AboutSection";
import { PeopleSection } from "../components/sections/PeopleSection";
import { FinancialsSection } from "../components/sections/FinancialsSection";
import { NewsSection } from "../components/sections/NewsSection";
import { FilingsSection } from "../components/sections/FilingsSection";
import { OwnershipSection } from "../components/sections/OwnershipSection";
import { resolveOwnership } from "../lib/ownership";
import { IndustryMap, hasIndustryMap } from "../components/maps/IndustryMap";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useCompany } from "../hooks/useCompany";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { ChatRoom } from "../components/chat/ChatRoom";

export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, loading, error } = useCompany(companyId);

  const company = data?.profile ?? null;
  const mapGeojson = data?.mapGeojson ?? null;

  const tabs = useMemo(() => {
    if (!company) return [];
    const items: { id: string; label: string }[] = [];
    if (company.about?.trim()) items.push({ id: "overview", label: "Overview" });
    if (company.people.length) items.push({ id: "people", label: "People" });
    if (resolveOwnership(company)) items.push({ id: "ownership", label: "Ownership" });
    if (company.financials.years.length || company.financials.metrics.length) {
      items.push({ id: "financials", label: "Financials" });
    }
    if (company.news.length) {
      items.push({ id: "news", label: "News" });
    }
    if (company.filings.length) items.push({ id: "filings", label: "Filings" });
    if (hasIndustryMap(company.industry)) {
      items.push({ id: "industry", label: company.industryTabLabel });
    }
    items.push({ id: "chat", label: "Chat" });
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

  if (error === "not_found" || (!company && !loading)) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Company not found</h1>
          <p className="mt-2 text-sm text-muted">
            {companyId
              ? `No profile for "${companyId}" in Spectr yet.`
              : "Missing company id in the URL."}
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

  const showAbout = Boolean(company.about?.trim());
  const showPeople = company.people.length > 0;
  const showOwnership = Boolean(resolveOwnership(company));
  const showFinancials =
    company.financials.years.length > 0 || company.financials.metrics.length > 0;
  const showNews = company.news.length > 0;
  const showFilings = company.filings.length > 0;
  const showIndustry = hasIndustryMap(company.industry);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <Hero company={company} />
      <TabNav tabs={tabs} activeId={activeTab} chatTabId="chat" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="border-t border-line">
          {showAbout && (
            <Section id="overview" title="Overview" variant="profile">
              <AboutSection company={company} />
            </Section>
          )}

          {showPeople && (
            <Section id="people" title="People" variant="profile">
              <PeopleSection company={company} />
            </Section>
          )}

          {showOwnership && (
            <Section id="ownership" title="Ownership" variant="profile">
              <OwnershipSection company={company} />
            </Section>
          )}

          {showFinancials && (
            <Section id="financials" title="Financials" variant="profile">
              <FinancialsSection company={company} />
            </Section>
          )}

          {showNews && (
            <Section id="news" title="News" variant="profile">
              <NewsSection company={company} />
            </Section>
          )}

          {showFilings && (
            <Section id="filings" title="Filings" variant="profile">
              <FilingsSection company={company} />
            </Section>
          )}

          <section
            id="chat"
            className="scroll-mt-28 border-b border-line py-12 md:py-14"
          >
            <h2 className="section-title mb-6">Chat</h2>
            <ChatRoom
              roomType="company"
              roomSlug={company.id}
              roomLabel={company.name}
            />
          </section>

          {showIndustry && (
            <Section id="industry" title={company.industryTabLabel} variant="profile">
              <IndustryMap company={company} mapGeojson={mapGeojson} />
            </Section>
          )}
        </div>

        <section className="border-t border-line py-12 md:py-14" aria-label="Company details">
          <h2 className="section-title mb-6">Details</h2>
          <Sidebar company={company} layout="grid" />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
