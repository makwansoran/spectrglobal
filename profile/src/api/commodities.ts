import type { CommodityProfile } from "../types/commodity";

export type CommodityPayload = {
  profile: CommodityProfile;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCommodity(slug: string): Promise<CommodityPayload> {
  const res = await fetch(`${apiBase}/api/commodities/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load commodity");
  }
  const data = await res.json();
  return { profile: normalizeCommodityProfile(data.profile) };
}

function normalizeCommodityProfile(raw: CommodityProfile): CommodityProfile {
  const ini =
    raw.logoInitials ||
    (raw.symbol && raw.symbol.length >= 2 ? raw.symbol.slice(0, 2).toUpperCase() : raw.name.slice(0, 2).toUpperCase());

  return {
    ...raw,
    logoInitials: ini,
    industryTags: raw.industryTags?.length ? raw.industryTags : [raw.categoryLabel],
    quickStats: raw.quickStats?.length
      ? raw.quickStats
      : [
          { label: "Category", value: raw.categoryLabel, format: "text" },
          ...(raw.exchange ? [{ label: "Exchange", value: raw.exchange, format: "text" as const }] : []),
          ...(raw.symbol ? [{ label: "Symbol", value: raw.symbol, format: "text" as const }] : []),
        ],
    keyFacts: raw.keyFacts?.length
      ? raw.keyFacts
      : [
          { label: "Category", value: raw.categoryLabel },
          ...(raw.exchange ? [{ label: "Exchange", value: raw.exchange }] : []),
          ...(raw.symbol ? [{ label: "Contract symbol", value: raw.symbol }] : []),
        ],
    dataSources: raw.dataSources?.length ? raw.dataSources : [{ name: "Exchange contract specs" }],
  };
}
