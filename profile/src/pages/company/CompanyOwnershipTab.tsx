import { Navigate } from "react-router-dom";
import { OwnershipSection } from "../../components/sections/OwnershipSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { resolveOwnership } from "../../lib/ownership";

export function CompanyOwnershipTab() {
  const { company } = useCompanyProfile();

  if (!resolveOwnership(company)) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <OwnershipSection company={company} />
    </ProfileTabPanel>
  );
}
