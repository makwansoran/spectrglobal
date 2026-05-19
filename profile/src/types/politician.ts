export interface PoliticianProfile {
  id: string;
  slug: string;
  name: string;
  countrySlug: string;
  countryName?: string;
  office?: string;
  party?: string;
  photoUrl?: string;
  bio?: string;
  termStart?: string;
  termEnd?: string;
  searchTerms?: string[];
  dataSources: { name: string; url?: string }[];
  lastUpdated: string;
}

export type PoliticianSearchItem = {
  id: string;
  kind: "politician";
  name: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
  countrySlug?: string;
  subtitle?: string | null;
};
