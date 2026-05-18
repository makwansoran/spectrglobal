import type { DataSource, QuickStat } from "./company";

export type CommodityCategory =
  | "energy"
  | "precious_metals"
  | "base_metals"
  | "grains"
  | "soft_commodities"
  | "livestock"
  | "forestry"
  | "specialty";

export interface CommodityProfile {
  id: string;
  name: string;
  category: CommodityCategory;
  categoryLabel: string;
  exchange: string | null;
  symbol: string | null;
  alternateSymbols: string[];
  logoInitials: string;
  logoUrl?: string;
  industryTags: string[];
  about: string;
  quickStats: QuickStat[];
  keyFacts: { label: string; value: string }[];
  dataSources: DataSource[];
  lastUpdated: string;
}
