import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CommodityProfileLayout } from "./pages/commodity/CommodityProfileLayout";
import { CommodityChatTab } from "./pages/commodity/CommodityChatTab";
import { CommodityOverviewTab } from "./pages/commodity/CommodityOverviewTab";
import { CompanyProfileLayout } from "./pages/company/CompanyProfileLayout";
import { CompanyChatTab } from "./pages/company/CompanyChatTab";
import { CompanyFilingsTab } from "./pages/company/CompanyFilingsTab";
import { CompanyFinancialsTab } from "./pages/company/CompanyFinancialsTab";
import { CompanyIndustryTab } from "./pages/company/CompanyIndustryTab";
import { CompanyNewsTab } from "./pages/company/CompanyNewsTab";
import { CompanyOverviewTab } from "./pages/company/CompanyOverviewTab";
import { CompanyOwnershipTab } from "./pages/company/CompanyOwnershipTab";
import { CompanyPeopleTab } from "./pages/company/CompanyPeopleTab";
import { PersonProfilePage } from "./pages/PersonProfilePage";

function getBasename() {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/person")) return "";
    if (window.location.pathname.startsWith("/commodity")) return "/commodity";
  }
  return "/company";
}

export default function App() {
  const basename = getBasename();

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {basename === "" ? (
          <>
            <Route path="/person/:personId" element={<PersonProfilePage />} />
            <Route path="*" element={<Navigate to="/company/equinor" replace />} />
          </>
        ) : basename === "/commodity" ? (
          <>
            <Route path="/" element={<Navigate to="/gold" replace />} />
            <Route path="/:commodityId" element={<CommodityProfileLayout />}>
              <Route index element={<CommodityOverviewTab />} />
              <Route path="chat" element={<CommodityChatTab />} />
              <Route path="*" element={<Navigate to="." replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/gold" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/equinor" replace />} />
            <Route path="/person/:personId" element={<PersonProfilePage />} />
            <Route path="/:companyId" element={<CompanyProfileLayout />}>
              <Route index element={<CompanyOverviewTab />} />
              <Route path="people" element={<CompanyPeopleTab />} />
              <Route path="ownership" element={<CompanyOwnershipTab />} />
              <Route path="financials" element={<CompanyFinancialsTab />} />
              <Route path="news" element={<CompanyNewsTab />} />
              <Route path="filings" element={<CompanyFilingsTab />} />
              <Route path="industry" element={<CompanyIndustryTab />} />
              <Route path="chat" element={<CompanyChatTab />} />
              <Route path="*" element={<Navigate to="." replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/equinor" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
