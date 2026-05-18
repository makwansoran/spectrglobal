import { Navigate } from "react-router-dom";
import { PeopleSection } from "../../components/sections/PeopleSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyPeopleTab() {
  const { company } = useCompanyProfile();

  if (!company.people.length) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <PeopleSection company={company} />
    </ProfileTabPanel>
  );
}
