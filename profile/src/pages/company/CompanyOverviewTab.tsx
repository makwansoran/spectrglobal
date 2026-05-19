import { AboutSection } from "../../components/sections/AboutSection";
import { EuronextSection } from "../../components/sections/EuronextSection";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyOverviewTab() {
  const { company } = useCompanyProfile();

  return (
    <ProfileTabPanel>
      {company.about?.trim() ? (
        <AboutSection company={company} />
      ) : (
        <p className="text-sm text-muted">No overview text is available for this company yet.</p>
      )}
      {company.euronext?.isin && <EuronextSection euronext={company.euronext} />}
      <div className="mt-6 border-t border-line pt-5">
        <p className="section-label">Details</p>
        <Sidebar company={company} layout="grid" />
      </div>
    </ProfileTabPanel>
  );
}
