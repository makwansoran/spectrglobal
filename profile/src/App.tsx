import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CommodityProfileLayout } from "./pages/commodity/CommodityProfileLayout";
import { CommodityChatTab } from "./pages/commodity/CommodityChatTab";
import { CommodityOverviewTab } from "./pages/commodity/CommodityOverviewTab";
import { CompanyProfileLayout } from "./pages/company/CompanyProfileLayout";
import { CompanyChatTab } from "./pages/company/CompanyChatTab";
import { CompanyFilingsTab } from "./pages/company/CompanyFilingsTab";
import { CompanyFinancialsTab } from "./pages/company/CompanyFinancialsTab";
import { CompanyInvestmentsTab } from "./pages/company/CompanyInvestmentsTab";
import { CompanyIndustryTab } from "./pages/company/CompanyIndustryTab";
import { CompanyNewsTab } from "./pages/company/CompanyNewsTab";
import { CompanyOverviewTab } from "./pages/company/CompanyOverviewTab";
import { CompanyOwnershipTab } from "./pages/company/CompanyOwnershipTab";
import { CompanyPeopleTab } from "./pages/company/CompanyPeopleTab";
import { HolderProfilePage } from "./pages/HolderProfilePage";
import { PersonProfilePage } from "./pages/PersonProfilePage";
import { CountryProfilePage } from "./pages/CountryProfilePage";
import { PoliticianProfilePage } from "./pages/PoliticianProfilePage";
import { VesselProfilePage } from "./pages/VesselProfilePage";
import { WaterwayProfilePage } from "./pages/waterway/WaterwayProfilePage";

function getBasename() {
  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (
      p.startsWith("/person") ||
      p.startsWith("/country") ||
      p.startsWith("/politician") ||
      p.startsWith("/vessel")
    ) {
      return "";
    }
    if (p.startsWith("/waterway")) return "/waterway";
    if (p.startsWith("/commodity")) return "/commodity";
  }
  return "/company";
}

export default function App() {
  const basename = getBasename();

  useEffect(() => {
    document.title = "Spectr";
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <Analytics />
      <Routes>
        {basename === "" ? (
          <>
            <Route path="/person/:personId" element={<PersonProfilePage />} />
            <Route path="/country/:countryId" element={<CountryProfilePage />} />
            <Route path="/politician/:politicianId" element={<PoliticianProfilePage />} />
            <Route path="/vessel/:vesselId" element={<VesselProfilePage />} />
            <Route path="*" element={<Navigate to="/company/equinor" replace />} />
          </>
        ) : basename === "/waterway" ? (
          <>
            <Route path="/" element={<Navigate to="/strait-of-hormuz" replace />} />
            <Route path="/:waterwayId" element={<WaterwayProfilePage />} />
            <Route path="*" element={<Navigate to="/strait-of-hormuz" replace />} />
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
            <Route path="/country/:countryId" element={<CountryProfilePage />} />
            <Route path="/politician/:politicianId" element={<PoliticianProfilePage />} />
            <Route path="/vessel/:vesselId" element={<VesselProfilePage />} />
            <Route path="/holder/:holderSlug" element={<HolderProfilePage />} />
            <Route path="/:companyId" element={<CompanyProfileLayout />}>
              <Route index element={<CompanyOverviewTab />} />
              <Route path="people" element={<CompanyPeopleTab />} />
              <Route path="ownership" element={<CompanyOwnershipTab />} />
              <Route path="investments" element={<CompanyInvestmentsTab />} />
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
