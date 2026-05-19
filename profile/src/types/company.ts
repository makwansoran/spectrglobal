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

export interface FinancialQuarter {
  period: string;
  fiscalYear: number;
  fiscalQuarter?: number;
  periodEnd: string;
  revenue?: number | null;
  operatingIncome?: number | null;
  netIncome?: number | null;
  form?: string | null;
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
  url?: string | null;
  source?: string;
}

export interface CompanyEnrichment {
  at?: string;
  sources?: string[];
  filingCount?: number;
}

export interface CompanyVessel {
  id: string;
  slug?: string;
  name: string;
  type: string;
  imo?: string | null;
  mmsi?: string | null;
  dwt?: string | null;
  flag?: string | null;
  lat?: number | null;
  lng?: number | null;
  heading?: number | null;
  speed?: number | null;
  marineTrafficUrl?: string | null;
  meta?: string;
  source?: string;
  aisSource?: string | null;
}

export interface CompanyAircraft {
  id: string;
  slug?: string;
  name: string;
  registration?: string | null;
  type: string;
  lat?: number | null;
  lng?: number | null;
  homeBase?: string | null;
  meta?: string;
  source?: string;
}

export interface OperatingAssets {
  vessels?: CompanyVessel[];
  aircraft?: CompanyAircraft[];
  sources?: string[];
  at?: string;
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
  /** ISO timestamp when price was last fetched from Finnhub. */
  quoteAsOf?: string;
}

export interface OilBlockProperties {
  name: string;
  license: string;
  operator: string;
  partners: string;
  status?: string;
}

export type InstitutionOrgType =
  | "asset_manager"
  | "bank"
  | "sovereign_wealth"
  | "insurance"
  | "hedge_fund"
  | "conglomerate"
  | "pension"
  | "other";

export interface ShareholderStake {
  name: string;
  percent: number;
  detail?: string;
  logoUrl?: string;
  logoDomain?: string;
  /** Link to /company/holder/:slug */
  slug?: string;
  orgType?: InstitutionOrgType;
  orgTypeLabel?: string;
  isListed?: boolean;
  listedTicker?: string;
  listedExchange?: string;
  /** Spectr company profile when the holder is a listed company */
  companySlug?: string;
  website?: string;
  isOther?: boolean;
}

export interface OwnershipBreakdown {
  asOf?: string;
  note?: string;
  shareholders: ShareholderStake[];
}

export interface PortfolioSummary {
  asOf?: string;
  holdingCount?: number;
  listedCount?: number;
  unlistedCount?: number;
  totalMarketValueNok?: number;
  totalMarketValueUsd?: number;
  source?: string;
  regions?: string[];
  /** equity = NBIM-style market-value book; industrial = active ownership stakes */
  kind?: "equity" | "industrial";
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
    quarters?: FinancialQuarter[];
    annual?: FinancialQuarter[];
    metrics: FinancialMetric[];
    meta?: {
      source?: string;
      currency?: string;
      asOf?: string;
      symbol?: string;
      cik?: string;
    };
  };
  news: NewsItem[];
  filings: Filing[];
  keyFacts: { label: string; value: string }[];
  ownership?: OwnershipBreakdown;
  /** NBIM / sovereign fund equity book (summary only; rows served via API). */
  portfolio?: PortfolioSummary;
  competitors: Competitor[];
  funding: FundingEvent[];
  esg: ESGScore;
  dataSources: DataSource[];
  enrichment?: CompanyEnrichment;
  operatingAssets?: OperatingAssets;
  /** Corporate / IR website used for filing discovery when APIs have no data. */
  website?: string;
  /** Cached Finnhub profile2 fields merged during enrichment. */
  finnhub?: {
    weburl?: string;
    country?: string;
  };
  /** Live Oslo listing data synced from Euronext. */
  euronext?: {
    isin: string;
    mic: string;
    productPath?: string;
    productUrl?: string;
    lastPrice?: number | null;
    dayChangePct?: number | null;
    lastTradeLabel?: string | null;
    syncedAt?: string;
  };
  lastUpdated: string;
  mapConfig?: {
    center: [number, number];
    zoom: number;
  };
}
