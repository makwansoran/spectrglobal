export type WaterwayProfile = {
  id: string;
  name: string;
  waterwayType: "strait" | "canal";
  regionLabel: string;
  meta: string;
  importance: number;
  bounds: [number, number, number, number];
  center: [number, number];
  waterwayGeojson: GeoJSON.Feature | GeoJSON.FeatureCollection;
  waterwayLine: [number, number][];
  lengthKm?: number;
  connects?: string[];
  countries?: string[];
  description?: string;
};

export type SimulatedVessel = {
  id: string;
  mmsi?: string;
  name: string;
  type: string;
  flag: string;
  speed: number;
  heading: number;
  destination: string;
  lat: number;
  lng: number;
  progress: number;
};
