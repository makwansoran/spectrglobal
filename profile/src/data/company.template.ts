/**
 * COPY this file to e.g. shell.ts, fill in data, then register in registry.ts.
 *
 * Steps:
 * 1. Duplicate → profile/src/data/your-company.ts
 * 2. Set profile.id and slug to the URL slug (e.g. "shell" → /company/shell)
 * 3. Export yourCompanySeed (see bottom)
 * 4. Add import + entry in profile/src/data/registry.ts
 * 5. Run from repo root: npm run db:seed
 * 6. Rebuild profile if needed: npm run build:profile
 */
import type { CompanyProfile } from "../types/company";
import type { CompanySeed } from "./seed-types";

export const exampleProfile: CompanyProfile = {
  id: "your-slug",
  name: "Company Name",
  legalName: "Company Name AS",
  logoInitials: "CN",
  countryCode: "NO",
  countryName: "Norway",
  founded: 2000,
  headquarters: "Oslo, Norway",
  industryTags: ["Industry tag"],
  isPublic: true,
  industry: "energy",
  industryTabLabel: "Assets",
  about: "Short company description.",
  quickStats: [
    { label: "Employees", value: 1000, format: "number" },
    { label: "Revenue", value: 1_000_000_000, format: "currency" },
  ],
  people: [],
  financials: { years: [], metrics: [] },
  news: [],
  filings: [],
  keyFacts: [{ label: "Legal form", value: "AS" }],
  competitors: [],
  funding: [],
  esg: { overall: 50, environmental: 50, social: 50, governance: 50, trend: "stable" },
  dataSources: [{ name: "Company disclosures" }],
  lastUpdated: new Date().toISOString(),
  mapConfig: { center: [10, 62], zoom: 5 },
};

export const exampleSeed: CompanySeed = {
  slug: "your-slug",
  profile: exampleProfile,
  mapGeojson: null,
  searchTerms: ["company name", "ticker", "alias"],
};
