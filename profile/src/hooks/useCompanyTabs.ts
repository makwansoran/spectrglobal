import { useMemo } from "react";
import type { CompanyProfile } from "../types/company";
import { hasIndustryMap } from "../components/maps/IndustryMap";
import { resolveOwnership } from "../lib/ownership";

export function useCompanyTabs(company: CompanyProfile | null, mapGeojson: GeoJSON.GeoJsonObject | null) {
  return useMemo(() => {
    if (!company) return [];
    const items: { id: string; label: string }[] = [{ id: "overview", label: "Overview" }];
    if (company.people.length) items.push({ id: "people", label: "People" });
    if (resolveOwnership(company)) items.push({ id: "ownership", label: "Ownership" });
    if (company.financials.years.length || company.financials.metrics.length) {
      items.push({ id: "financials", label: "Financials" });
    }
    if (company.news.length) items.push({ id: "news", label: "News" });
    if (company.filings.length) items.push({ id: "filings", label: "Filings" });
    if (hasIndustryMap(company.industry, mapGeojson)) {
      items.push({ id: "industry", label: company.industryTabLabel });
    }
    items.push({ id: "chat", label: "Chat" });
    return items;
  }, [company, mapGeojson]);
}
