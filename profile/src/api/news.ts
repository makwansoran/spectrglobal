import type { NewsItem } from "../types/company";

export type CompanyNewsPayload = {
  slug: string;
  news: NewsItem[];
  sources?: {
    profile: number;
    finnhub: number;
  };
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyNews(slug: string, signal?: AbortSignal): Promise<CompanyNewsPayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/news`, { signal });
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("Failed to load news");
  return res.json();
}
