import { companySeeds } from "./registry";
import type { CompanyProfile } from "../types/company";

export { companySeeds } from "./registry";
export { equinorBlocksGeoJSON, equinorProfile, equinorSeed } from "./equinor";

export const companies: Record<string, CompanyProfile> = Object.fromEntries(
  companySeeds.map((s) => [s.slug, s.profile])
);

export function getCompany(id: string) {
  return companies[id] ?? null;
}
