import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CompanyProfilePage } from "./pages/CompanyProfilePage";
import { CommodityProfilePage } from "./pages/CommodityProfilePage";
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
            <Route path="/:commodityId" element={<CommodityProfilePage />} />
            <Route path="*" element={<Navigate to="/gold" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/equinor" replace />} />
            <Route path="/person/:personId" element={<PersonProfilePage />} />
            <Route path="/:companyId" element={<CompanyProfilePage />} />
            <Route path="*" element={<Navigate to="/equinor" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
