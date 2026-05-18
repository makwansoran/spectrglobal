export type PortfolioHolding = {
  slug: string;
  name: string;
  region: string;
  listingCountry: string;
  incorporationCountry: string;
  industry: string;
  marketValueNok: number;
  marketValueUsd: number;
  votingPercent: number;
  ownershipPercent: number;
};

export type PortfolioHoldingsResponse = {
  investorSlug: string;
  asOf: string;
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: PortfolioHolding[];
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
