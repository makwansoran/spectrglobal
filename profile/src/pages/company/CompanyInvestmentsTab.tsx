import { Navigate } from "react-router-dom";
import { PortfolioInvestmentsSection } from "../../components/sections/PortfolioInvestmentsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyInvestmentsTab() {
  const { company } = useCompanyProfile();

  if (!company.portfolio?.holdingCount) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <PortfolioInvestmentsSection investorSlug={company.id} portfolio={company.portfolio} />
    </ProfileTabPanel>
  );
}
