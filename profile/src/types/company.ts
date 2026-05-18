export type IndustryType =
  | "shipping"
  | "oil_gas"
  | "aviation"
  | "real_estate"
  | "energy"
  | "technology"
  | "finance"
  | "construction"
  | "cleantech"
  | "biotech"
  | "mining"
  | "aquaculture";

export interface QuickStat {
  label: string;
  value: number | string;
  format?: "currency" | "number" | "text";
}

export interface Person {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
  bio?: string;
  /** Link to standalone person profile in /api/people */
  personSlug?: string;
}

export interface FinancialYear {
  year: number;
  revenue: number;
  ebitda: number;
  netIncome: number;
}

export interface FinancialMetric {
  label: string;
  value: number;
  format: "currency" | "percent" | "number" | "ratio" | "text";
  change?: number;
  display?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url?: string;
}

export interface Filing {
  id: string;
  title: string;
  type: string;
  date: string;
  jurisdiction: string;
}

export interface Competitor {
  name: string;
  country: string;
  similarity?: number;
}

export interface FundingEvent {
  id: string;
  date: string;
  type: string;
  amount?: number;
  counterparty?: string;
  description: string;
}

export interface ESGScore {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  trend: "up" | "down" | "stable";
}

export interface DataSource {
  name: string;
  url?: string;
}

export interface StockQuote {
  ticker: string;
  exchange: string;
  price: number | null;
  change?: number | null;
  changePercent?: number | null;
  currency: string;
  /** Finnhub symbol for live quotes (e.g. US ticker for dual-listed names). */
  finnhubSymbol?: string;
}

export interface OilBlockProperties {
  name: string;
  license: string;
  operator: string;
  partners: string;
  status?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  legalName: string;
  logoUrl?: string;
  logoInitials: string;
  countryCode: string;
  countryName: string;
  founded: number;
  headquarters: string;
  industryTags: string[];
  isPublic: boolean;
  stock?: StockQuote;
  industry: IndustryType;
  industryTabLabel: string;
  about: string;
  quickStats: QuickStat[];
  people: Person[];
  financials: {
    years: FinancialYear[];
    metrics: FinancialMetric[];
  };
  news: NewsItem[];
  filings: Filing[];
  keyFacts: { label: string; value: string }[];
  competitors: Competitor[];
  funding: FundingEvent[];
  esg: ESGScore;
  dataSources: DataSource[];
  lastUpdated: string;
  mapConfig?: {
    center: [number, number];
    zoom: number;
  };
}
