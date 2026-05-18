import type { CompanyProfile, IndustryType } from "../../types/company";
import { OilGasMap } from "./OilGasMap";

/** Only show a map when we have real GeoJSON (e.g. licence blocks), not placeholder pins. */
export function hasIndustryMap(
  industry: IndustryType,
  mapGeojson?: GeoJSON.GeoJsonObject | null
): boolean {
  if (industry !== "oil_gas" || !mapGeojson) return false;
  const collection = mapGeojson as GeoJSON.FeatureCollection;
  return Array.isArray(collection.features) && collection.features.length > 0;
}

type Props = {
  company: CompanyProfile;
  mapGeojson?: GeoJSON.GeoJsonObject | null;
};

export function IndustryMap({ company, mapGeojson }: Props) {
  if (!hasIndustryMap(company.industry, mapGeojson)) return null;
  return <OilGasMap company={company} mapGeojson={mapGeojson} />;
}
