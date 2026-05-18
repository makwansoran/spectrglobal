import type { StockQuote } from "../types/company";

export type CompanyQuotePayload = {
  slug: string;
  ticker: string | null;
  stock: StockQuote & { quoteAsOf?: string };
  source: string;
  asOf: string | null;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyQuote(slug: string, signal?: AbortSignal): Promise<CompanyQuotePayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/quote`, { signal });
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("Failed to load quote");
  return res.json();
}
