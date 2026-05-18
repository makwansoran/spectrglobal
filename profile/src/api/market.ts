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
  currency: string | null;
};

export type CompanyMarketData = {
  symbol: string | null;
  ticker: string | null;
  currency: string;
  quote: MarketQuote | null;
  metrics: MarketMetrics | null;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyMarket(slug: string): Promise<CompanyMarketData | null> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/market`);
  if (res.status === 503) return null;
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load market data");
  return res.json();
}
