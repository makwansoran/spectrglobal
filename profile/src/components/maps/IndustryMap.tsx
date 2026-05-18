import type { CompanyProfile, IndustryType } from "../../types/company";
import { OilGasMap } from "./OilGasMap";
import { GenericPinsMap } from "./GenericPinsMap";

const INDUSTRY_MAP_TYPES: IndustryType[] = [
  "shipping",
  "oil_gas",
  "aviation",
  "real_estate",
  "energy",
];

export function hasIndustryMap(industry: IndustryType): boolean {
  return INDUSTRY_MAP_TYPES.includes(industry);
}

type Props = {
  company: CompanyProfile;
  mapGeojson?: GeoJSON.GeoJsonObject | null;
};

export function IndustryMap({ company, mapGeojson }: Props) {
  switch (company.industry) {
    case "oil_gas":
      return <OilGasMap company={company} mapGeojson={mapGeojson} />;
    case "shipping":
      return (
        <GenericPinsMap
          company={company}
          title="Live vessel positions"
          hint="Click a vessel for name, route, and ETA"
          pins={[
            { lat: 59.9, lng: 5.7, label: "FSO Asgard", meta: "Route: Bergen → Rotterdam · ETA 22 May" },
            { lat: 61.2, lng: 4.8, label: "MT Nordic Spirit", meta: "Route: Stavanger → Skagen · ETA 19 May" },
            { lat: 58.4, lng: 6.0, label: "MT Hawk", meta: "Route: Mongstad → UKC · ETA 21 May" },
          ]}
        />
      );
    case "aviation":
      return (
        <GenericPinsMap
          company={company}
          title="Route network"
          hint="Hub-and-spoke routes — click for frequency and aircraft"
          routes={[
            { from: [60.2, 11.1], to: [59.9, 10.75], label: "OSL–BGO · 14/wk · B737" },
            { from: [60.2, 11.1], to: [63.45, 10.92], label: "OSL–TRD · 12/wk · B737" },
            { from: [60.2, 11.1], to: [69.68, 18.91], label: "OSL–TOS · 9/wk · B737" },
          ]}
        />
      );
    case "real_estate":
      return (
        <GenericPinsMap
          company={company}
          title="Property portfolio"
          hint="Click a pin for asset name, value, and occupancy"
          pins={[
            { lat: 59.91, lng: 10.75, label: "Barcode Oslo", meta: "Value $420M · Occupancy 96%" },
            { lat: 58.97, lng: 5.73, label: "Forus Park", meta: "Value $180M · Occupancy 91%" },
          ]}
        />
      );
    case "energy":
      return (
        <GenericPinsMap
          company={company}
          title="Power assets"
          hint="Click for capacity, fuel type, and status"
          pins={[
            { lat: 59.0, lng: 5.5, label: "Kårstø CCGT", meta: "860 MW · Gas · Operational" },
            { lat: 66.3, lng: 14.1, label: "Rygene Wind", meta: "220 MW · Wind · Operational" },
          ]}
        />
      );
    default:
      return null;
  }
}
