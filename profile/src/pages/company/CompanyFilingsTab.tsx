import { Navigate } from "react-router-dom";
import { FilingsSection } from "../../components/sections/FilingsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyFilingsTab() {
  const { company } = useCompanyProfile();

  if (!company.filings.length) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <FilingsSection company={company} />
    </ProfileTabPanel>
  );
}
