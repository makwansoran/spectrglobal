import type { CompanyAircraft, CompanyVessel } from "../types/company";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export type CompanyAssetsPayload = {
  industry: string;
  mapGeojson: GeoJSON.GeoJsonObject | null;
  vessels: CompanyVessel[];
  aircraft: CompanyAircraft[];
  vesselCount: number;
  aircraftCount: number;
  hasBlocks: boolean;
  sources: string[];
};

export async function fetchCompanyAssets(
  slug: string,
  signal?: AbortSignal
): Promise<CompanyAssetsPayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/assets`, { signal });
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load assets");
  }
  return res.json();
}
