import { useMemo } from "react";
import type { CompanyProfile } from "../types/company";
import { hasOilBlocks } from "../components/maps/IndustryMap";
import { resolveOwnership } from "../lib/ownership";

export function useCompanyTabs(company: CompanyProfile | null, mapGeojson: GeoJSON.GeoJsonObject | null) {
  return useMemo(() => {
    if (!company) return [];
    const items: { id: string; label: string }[] = [{ id: "overview", label: "Overview" }];
    if (company.people?.length) items.push({ id: "people", label: "People" });
    if (resolveOwnership(company)) items.push({ id: "ownership", label: "Ownership" });
    if (company.portfolio?.holdingCount) items.push({ id: "investments", label: "Investments" });
    const fin = company.financials;
    if (
      company.isPublic ||
      company.stock?.ticker ||
      fin?.years?.length ||
      fin?.quarters?.length ||
      fin?.annual?.length ||
      fin?.metrics?.length
    ) {
      items.push({ id: "financials", label: "Financials" });
    }
    items.push({ id: "news", label: "News" });
    if (company.isPublic || company.stock?.ticker || (company.filings?.length ?? 0) > 0) {
      items.push({ id: "filings", label: "Filings" });
    }
    const assetIndustries = ["oil_gas", "energy", "shipping", "aviation"];
    const hasAssets =
      hasOilBlocks(company.industry, mapGeojson) ||
      assetIndustries.includes(company.industry) ||
      (company.operatingAssets?.vessels?.length ?? 0) > 0 ||
      (company.operatingAssets?.aircraft?.length ?? 0) > 0;
    if (hasAssets) {
      const label =
        company.industryTabLabel ||
        (company.industry === "shipping"
          ? "Fleet"
          : company.industry === "aviation"
            ? "Aircraft"
            : "Operations");
      items.push({ id: "industry", label });
    }
    items.push({ id: "chat", label: "Chat" });
    return items;
  }, [company, mapGeojson]);
}
