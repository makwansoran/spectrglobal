import { AboutSection } from "../../components/sections/AboutSection";
import { NewsSection } from "../../components/sections/NewsSection";
import { FilingsSection } from "../../components/sections/FilingsSection";
import { IndustryMap, hasIndustryMap } from "../../components/maps/IndustryMap";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyOverviewTab() {
  const { company, mapGeojson } = useCompanyProfile();

  return (
    <>
      {company.about?.trim() ? (
        <ProfileTabPanel title="Overview">
          <AboutSection company={company} />
        </ProfileTabPanel>
      ) : (
        <ProfileTabPanel title="Overview" description="Company summary and key details.">
          <p className="text-sm text-muted">No overview text is available for this company yet.</p>
        </ProfileTabPanel>
      )}

      {company.news.length > 0 && (
        <ProfileTabPanel title="News">
          <NewsSection company={company} />
        </ProfileTabPanel>
      )}

      {company.filings.length > 0 && (
        <ProfileTabPanel title="Filings">
          <FilingsSection company={company} />
        </ProfileTabPanel>
      )}

      {hasIndustryMap(company.industry, mapGeojson) && (
        <ProfileTabPanel title={company.industryTabLabel}>
          <IndustryMap company={company} mapGeojson={mapGeojson} />
        </ProfileTabPanel>
      )}

      <ProfileTabPanel title="Details">
        <Sidebar company={company} layout="grid" />
      </ProfileTabPanel>
    </>
  );
}
