export type MarketQuote = {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  high?: number | null;
  low?: number | null;
  open?: number | null;
  previousClose?: number | null;
  asOf?: string | null;
};

export type RevenueYear = { year: number; revenue: number };

export type MarketMetrics = {
  symbol: string;
  marketCap: number | null;
  peRatio: number | null;
  eps: number | null;
  revenuePerShare: number | null;
  dividendYield: number | null;
  beta: number | null;
  week52High: number | null;
  week52Low: number | null;
  roe?: number | null;
  roa?: number | null;
  currentRatio?: number | null;
  debtEquity?: number | null;
  grossMargin?: number | null;
  operatingMargin?: number | null;
  revenueGrowth3Y?: number | null;
  payoutRatio?: number | null;
  currency: string | null;
  revenueYears?: RevenueYear[];
};

export type FinnhubCompanyProfile = {
  name: string;
  ticker: string | null;
  exchange: string | null;
  ipo: string | null;
  marketCap: number | null;
  sharesOutstanding: number | null;
  weburl: string | null;
  phone: string | null;
  industry: string | null;
  logo: string | null;
  country: string | null;
  currency: string | null;
  employees: number | null;
};

export type FinnhubNewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string | null;
  image: string | null;
};

export type FinnhubRecommendations = {
  period: string | null;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
};

export type FinnhubEarnings = {
  period: string | null;
  year: number | null;
  quarter: number | null;
  actual: number | null;
  estimate: number | null;
  surprise: number | null;
  surprisePercent: number | null;
  date: string | null;
};

export type CompanyMarketData = {
  symbol: string | null;
  ticker: string | null;
  currency: string;
  quote: MarketQuote | null;
  metrics: MarketMetrics | null;
  profile: FinnhubCompanyProfile | null;
  news: FinnhubNewsItem[];
  peers: string[];
  recommendations: FinnhubRecommendations | null;
  earnings: FinnhubEarnings[];
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyMarket(slug: string): Promise<CompanyMarketData | null> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/market`);
  if (res.status === 503) return null;
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load market data");
  return res.json();
}
