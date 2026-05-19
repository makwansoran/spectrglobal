import { Navigate } from "react-router-dom";
import { IndustrialInvestmentsSection } from "../../components/sections/IndustrialInvestmentsSection";
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
      {company.portfolio.kind === "industrial" ? (
        <IndustrialInvestmentsSection investorSlug={company.id} portfolio={company.portfolio} />
      ) : (
        <PortfolioInvestmentsSection investorSlug={company.id} portfolio={company.portfolio} />
      )}
    </ProfileTabPanel>
  );
}
