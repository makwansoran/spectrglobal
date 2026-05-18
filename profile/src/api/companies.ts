import type { CompanyProfile } from "../types/company";

export type CompanyPayload = {
  profile: CompanyProfile;
  mapGeojson: GeoJSON.GeoJsonObject | null;
};

export type CompanySearchItem = {
  id: string;
  kind?: "company" | "commodity" | "waterway";
  name: string;
  legalName: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
  ticker?: string;
  subtitle?: string;
  category?: string;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyIndex(limit = 500): Promise<CompanySearchItem[]> {
  const res = await fetch(`${apiBase}/api/companies?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load companies");
  return res.json();
}

export async function searchCompanyIndex(query: string, limit = 10): Promise<CompanySearchItem[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const res = await fetch(`${apiBase}/api/companies?${params}`);
  if (!res.ok) throw new Error("Failed to search companies");
  return res.json();
}

function normalizeProfile(profile: CompanyProfile | null | undefined): CompanyProfile {
  if (!profile) {
    throw new Error("not_found");
  }
  return {
    ...profile,
    industryTags: profile.industryTags ?? [],
    quickStats: profile.quickStats ?? [],
    people: profile.people ?? [],
    financials: profile.financials ?? { years: [], quarters: [], metrics: [] },
    news: profile.news ?? [],
    filings: profile.filings ?? [],
    keyFacts: profile.keyFacts ?? [],
    competitors: profile.competitors ?? [],
    funding: profile.funding ?? [],
    dataSources: profile.dataSources?.length
      ? profile.dataSources
      : [{ name: "Spectr", url: "https://spectr.no" }],
    esg: profile.esg ?? {
      overall: 0,
      environmental: 0,
      social: 0,
      governance: 0,
      trend: "stable",
    },
    industryTabLabel: profile.industryTabLabel ?? "Overview",
  };
}

export async function fetchCompany(slug: string, signal?: AbortSignal): Promise<CompanyPayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}`, { signal });
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load company");
  }
  const data = await res.json();
  return {
    ...data,
    profile: normalizeProfile(data.profile),
  };
}
