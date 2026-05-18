export type VesselType = "tanker" | "cargo" | "container" | "passenger" | "lng" | "general";

export const VESSEL_TYPE_COLORS: Record<VesselType, string> = {
  tanker: "#f59e0b",
  cargo: "#22c55e",
  container: "#3b82f6",
  passenger: "#a78bfa",
  lng: "#06b6d4",
  general: "#94a3b8",
};

export const VESSEL_TYPE_LABELS: Record<VesselType, string> = {
  tanker: "Tanker",
  cargo: "Bulk / cargo",
  container: "Container",
  passenger: "Passenger",
  lng: "LNG / gas",
  general: "General",
};

export function vesselColor(type: string): string {
  return VESSEL_TYPE_COLORS[type as VesselType] ?? VESSEL_TYPE_COLORS.general;
}
