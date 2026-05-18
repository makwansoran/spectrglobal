import type { CompanyProfile } from "../types/company";

export type CompanyPayload = {
  profile: CompanyProfile;
  mapGeojson: GeoJSON.GeoJsonObject | null;
};

export type CompanySearchItem = {
  id: string;
  name: string;
  legalName: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
  ticker?: string;
  subtitle?: string;
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

export async function fetchCompany(slug: string): Promise<CompanyPayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load company");
  }
  return res.json();
}
