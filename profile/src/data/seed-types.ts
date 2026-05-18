import type { CompanyProfile } from "../types/company";

/** One row to insert into SQLite + export as data/companies/{slug}.json */
export type CompanySeed = {
  slug: string;
  profile: CompanyProfile;
  mapGeojson?: GeoJSON.GeoJsonObject | null;
  searchTerms: string[];
};
