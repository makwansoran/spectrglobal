import type { CountryProfile, CountrySearchItem } from "../types/country";
import type { PoliticianProfile } from "../types/politician";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCountriesIndex(limit = 300): Promise<CountrySearchItem[]> {
  const res = await fetch(`${apiBase}/api/countries?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load countries");
  return res.json();
}

export async function fetchCountry(slug: string): Promise<{
  profile: CountryProfile;
  mapGeojson: unknown;
}> {
  const res = await fetch(`${apiBase}/api/countries/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load country");
  }
  return res.json();
}

export type CountryPoliticianSummary = {
  slug: string;
  name: string;
  office: string;
  party?: string;
  photoUrl?: string;
  bio?: string;
};

export async function fetchCountryPoliticians(countrySlug: string): Promise<CountryPoliticianSummary[]> {
  const res = await fetch(`${apiBase}/api/countries/${encodeURIComponent(countrySlug)}/politicians`);
  if (!res.ok) throw new Error("Failed to load politicians");
  const data = await res.json();
  return data.politicians || [];
}

export type { PoliticianProfile };
