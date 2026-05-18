export interface PersonAffiliation {
  companySlug: string;
  companyName: string;
  title: string;
}

export interface PersonProfile {
  id: string;
  slug: string;
  name: string;
  photoUrl?: string;
  bio?: string;
  currentTitle?: string;
  currentCompanySlug?: string;
  currentCompanyName?: string;
  affiliations: PersonAffiliation[];
  dataSources: { name: string; url?: string }[];
  lastUpdated: string;
}

export type PersonSearchItem = {
  id: string;
  name: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
};
