import { Navigate } from "react-router-dom";
import { NewsSection } from "../../components/sections/NewsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyNewsTab() {
  const { company } = useCompanyProfile();

  if (!company.news.length) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <NewsSection company={company} />
    </ProfileTabPanel>
  );
}
