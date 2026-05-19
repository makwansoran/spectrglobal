import type { PoliticianProfile, PoliticianSearchItem } from "../types/politician";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchPoliticiansIndex(): Promise<PoliticianSearchItem[]> {
  const res = await fetch(`${apiBase}/api/politicians`);
  if (!res.ok) throw new Error("Failed to load politicians");
  return res.json();
}

export async function fetchPolitician(slug: string): Promise<PoliticianProfile> {
  const res = await fetch(`${apiBase}/api/politicians/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load politician");
  }
  const data = await res.json();
  return data.profile;
}
