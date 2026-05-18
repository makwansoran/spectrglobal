import type { SimulatedVessel, WaterwayProfile } from "../types/waterway";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export type WaterwaySearchItem = {
  id: string;
  kind: "waterway";
  name: string;
  meta: string;
  initials: string;
  url: string;
  subtitle?: string;
};

export async function fetchWaterway(slug: string, signal?: AbortSignal): Promise<{ profile: WaterwayProfile }> {
  const res = await fetch(`${apiBase}/api/waterways/${encodeURIComponent(slug)}`, { signal });
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load waterway");
  }
  return res.json();
}

export type WaterwayVesselsPayload = {
  vessels: SimulatedVessel[];
  generatedAt: string;
  source?: "aisstream" | "simulated";
  live?: boolean;
};

export async function fetchWaterwayVessels(
  slug: string,
  signal?: AbortSignal
): Promise<WaterwayVesselsPayload> {
  const t = Date.now();
  const res = await fetch(`${apiBase}/api/waterways/${encodeURIComponent(slug)}/vessels?t=${t}`, {
    signal,
  });
  if (!res.ok) throw new Error("Failed to load vessel traffic");
  return res.json();
}
