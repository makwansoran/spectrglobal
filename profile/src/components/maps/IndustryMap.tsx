import type { CompanyProfile } from "../../types/company";
import type { CompanyAircraft, CompanyVessel } from "../../types/company";
import { OilGasMap } from "./OilGasMap";
import { ShippingFleetMap } from "./ShippingFleetMap";
import { AviationFleetMap } from "./AviationFleetMap";

export function hasOilBlocks(
  industry: CompanyProfile["industry"],
  mapGeojson?: GeoJSON.GeoJsonObject | null
): boolean {
  if (industry !== "oil_gas" && industry !== "energy") return false;
  const collection = mapGeojson as GeoJSON.FeatureCollection | undefined;
  return Boolean(collection?.features?.length);
}

export function hasIndustryAssets(
  company: CompanyProfile,
  mapGeojson?: GeoJSON.GeoJsonObject | null,
  vessels: CompanyVessel[] = [],
  aircraft: CompanyAircraft[] = []
): boolean {
  if (hasOilBlocks(company.industry, mapGeojson)) return true;
  if (company.industry === "shipping" && vessels.length > 0) return true;
  if (company.industry === "aviation" && aircraft.length > 0) return true;
  if ((company.operatingAssets?.vessels?.length ?? 0) > 0) return true;
  if ((company.operatingAssets?.aircraft?.length ?? 0) > 0) return true;
  return false;
}

/** @deprecated use hasOilBlocks */
export function hasIndustryMap(
  industry: CompanyProfile["industry"],
  mapGeojson?: GeoJSON.GeoJsonObject | null
): boolean {
  return hasOilBlocks(industry, mapGeojson);
}

type Props = {
  company: CompanyProfile;
  mapGeojson?: GeoJSON.GeoJsonObject | null;
  vessels?: CompanyVessel[];
  aircraft?: CompanyAircraft[];
  aisMatched?: number;
};

export function IndustryMap({ company, mapGeojson, vessels = [], aircraft = [], aisMatched }: Props) {
  const center = (company.mapConfig?.center ?? [62, 10]) as [number, number];
  const zoom = company.mapConfig?.zoom ?? 5;

  if (hasOilBlocks(company.industry, mapGeojson)) {
    return <OilGasMap company={company} mapGeojson={mapGeojson!} />;
  }
  if (company.industry === "shipping" && vessels.length > 0) {
    return <ShippingFleetMap vessels={vessels} center={center} zoom={zoom} aisMatched={aisMatched} />;
  }
  if (company.industry === "aviation" && aircraft.length > 0) {
    return <AviationFleetMap aircraft={aircraft} center={center} zoom={zoom} />;
  }
  if (vessels.length > 0) {
    return <ShippingFleetMap vessels={vessels} center={center} zoom={zoom} aisMatched={aisMatched} />;
  }
  if (aircraft.length > 0) {
    return <AviationFleetMap aircraft={aircraft} center={center} zoom={zoom} />;
  }
  return null;
}
