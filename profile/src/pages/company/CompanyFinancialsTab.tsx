import { Navigate } from "react-router-dom";
import { FinancialsSection } from "../../components/sections/FinancialsSection";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyFinancialsTab() {
  const { company } = useCompanyProfile();

  const hasFinancials =
    company.financials.years.length > 0 || company.financials.metrics.length > 0;

  if (!hasFinancials) {
    return <Navigate to={`/${company.id}`} replace />;
  }

  return (
    <ProfileTabPanel>
      <FinancialsSection company={company} />
    </ProfileTabPanel>
  );
}
