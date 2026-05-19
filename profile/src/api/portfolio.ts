export type PortfolioHolding = {
  slug: string;
  name: string;
  region?: string;
  listingCountry?: string;
  incorporationCountry?: string;
  industry?: string;
  marketValueNok?: number;
  marketValueUsd?: number;
  votingPercent?: number;
  ownershipPercent?: number;
};

export type IndustrialPortfolioHolding = {
  slug: string;
  name: string;
  listing: "listed" | "unlisted";
  sector: string;
  category?: string;
  ownershipPercent: number | null;
  ownershipLabel?: string;
  assetShare?: string;
  exchange?: string;
  ticker?: string;
  tagline?: string;
  description?: string;
  chair?: string;
  ceo?: string;
  website?: string;
  logoUrl?: string;
  companySlug?: string;
};

export type PortfolioHoldingsResponse = {
  investorSlug: string;
  kind?: "equity" | "industrial";
  asOf: string;
  listedCount?: number;
  unlistedCount?: number;
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: PortfolioHolding[] | IndustrialPortfolioHolding[];
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchPortfolioHoldings(
  investorSlug: string,
  options: {
    page?: number;
    limit?: number;
    q?: string;
    sort?: "value" | "name" | "ownership" | "country" | "industry";
    order?: "asc" | "desc";
  } = {}
): Promise<PortfolioHoldingsResponse> {
  const params = new URLSearchParams({
    investor: investorSlug,
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 50),
  });
  if (options.q) params.set("q", options.q);
  if (options.sort) params.set("sort", options.sort);
  if (options.order) params.set("order", options.order);

  const res = await fetch(`${apiBase}/api/portfolio/holdings?${params}`);
  if (!res.ok) throw new Error("Failed to load portfolio holdings");
  return res.json();
}
