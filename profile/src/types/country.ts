export interface CountryProfile {
  id: string;
  slug: string;
  name: string;
  isoCode: string;
  region?: string;
  capital?: string;
  population?: number | null;
  governmentType?: string;
  about?: string;
  flagEmoji?: string;
  flagUrl?: string;
  coatOfArmsUrl?: string;
  logoInitials?: string;
  searchTerms?: string[];
  dataSources: { name: string; url?: string }[];
  lastUpdated: string;
}

export type CountrySearchItem = {
  id: string;
  kind: "country";
  name: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
  isoCode?: string;
  subtitle?: string | null;
};
