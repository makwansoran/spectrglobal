import { createContext, useContext } from "react";
import type { CompanyProfile } from "../types/company";

export type CompanyProfileContextValue = {
  company: CompanyProfile;
  mapGeojson: GeoJSON.GeoJsonObject | null;
};

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(null);

export function CompanyProfileProvider({
  value,
  children,
}: {
  value: CompanyProfileContextValue;
  children: React.ReactNode;
}) {
  return <CompanyProfileContext.Provider value={value}>{children}</CompanyProfileContext.Provider>;
}

export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileContext);
  if (!ctx) throw new Error("useCompanyProfile must be used within CompanyProfileLayout");
  return ctx;
}
