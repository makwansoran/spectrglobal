export type HolderProfile = {
  slug: string;
  name: string;
  orgType: string;
  orgTypeLabel: string;
  isListed: boolean;
  listedTicker?: string;
  listedExchange?: string;
  companySlug?: string;
  website?: string;
  logoDomain?: string;
  about?: string;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchHolder(slug: string): Promise<HolderProfile> {
  const res = await fetch(`${apiBase}/api/holders/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load holder");
  }
  const data = await res.json();
  return data.profile;
}
