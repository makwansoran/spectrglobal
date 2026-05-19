import type { VesselPayload, VesselSearchItem } from "../types/vessel";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchVesselsIndex(limit = 200): Promise<VesselSearchItem[]> {
  const res = await fetch(`${apiBase}/api/vessels?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load vessels");
  return res.json();
}

export async function searchVesselsApi(query: string, limit = 25): Promise<VesselSearchItem[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const res = await fetch(`${apiBase}/api/vessels?${params}`);
  if (!res.ok) throw new Error("Failed to search vessels");
  return res.json();
}

export async function fetchVessel(slug: string, signal?: AbortSignal): Promise<VesselPayload> {
  const res = await fetch(`${apiBase}/api/vessels/${encodeURIComponent(slug)}`, { signal });
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load vessel");
  }
  return res.json();
}
