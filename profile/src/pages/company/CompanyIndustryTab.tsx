import { Navigate } from "react-router-dom";
import { IndustryMap, hasIndustryMap } from "../../components/maps/IndustryMap";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyIndustryTab() {
  const { company, mapGeojson } = useCompanyProfile();

  if (!hasIndustryMap(company.industry, mapGeojson)) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <IndustryMap company={company} mapGeojson={mapGeojson} />
    </ProfileTabPanel>
  );
}
