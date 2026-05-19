export type VesselProfile = {
  id: string;
  slug: string;
  name: string;
  vesselType: string;
  typeLabel: string;
  companySlug: string | null;
  imo: string | null;
  mmsi: string | null;
  callsign: string | null;
  flag: string | null;
  dwt: string | number | null;
  yearBuilt: number | null;
  shipyard: string | null;
  scrubber: string | null;
  lat: number | null;
  lng: number | null;
  heading: number | null;
  speed: number | null;
  route: string | null;
  eta: string | null;
  marineTrafficUrl: string | null;
  meta: string;
  source: string;
  raw?: Record<string, unknown>;
};

export type VesselSearchItem = {
  id: string;
  slug: string;
  kind: "vessel";
  name: string;
  meta: string;
  initials: string;
  url: string;
  terms: string[];
  companySlug: string | null;
  vesselType: string;
  subtitle?: string;
};

export type VesselPayload = {
  profile: VesselProfile;
  company: { slug: string; name: string } | null;
};
