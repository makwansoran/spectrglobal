import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CompanyVessel } from "../../types/company";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";
import { VESSEL_TYPE_LABELS, vesselColor } from "../../lib/vesselTypes";
import { VesselShipMarker } from "./VesselShipMarker";
import type { SimulatedVessel } from "../../types/waterway";

function FitFleetBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    const t = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [map, bounds]);
  return null;
}

function toSimulated(v: CompanyVessel): SimulatedVessel {
  return {
    id: v.id,
    name: v.name,
    type: v.type || "general",
    flag: v.flag || "—",
    speed: typeof v.speed === "number" ? v.speed : 0,
    heading: typeof v.heading === "number" ? v.heading : 0,
    destination: v.meta || "",
    lat: v.lat ?? 0,
    lng: v.lng ?? 0,
    progress: 0,
  };
}

type Props = {
  vessels: CompanyVessel[];
  center?: [number, number];
  zoom?: number;
  aisMatched?: number;
};

export function ShippingFleetMap({ vessels, center = [62, 10], zoom = 4, aisMatched }: Props) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<SimulatedVessel | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const positioned = useMemo(
    () => vessels.filter((v) => v.lat != null && v.lng != null && !Number.isNaN(v.lat)),
    [vessels]
  );

  const bounds = useMemo((): LatLngBoundsExpression | null => {
    if (!positioned.length) return null;
    let south = 90;
    let north = -90;
    let west = 180;
    let east = -180;
    for (const v of positioned) {
      south = Math.min(south, v.lat!);
      north = Math.max(north, v.lat!);
      west = Math.min(west, v.lng!);
      east = Math.max(east, v.lng!);
    }
    return [
      [south, west],
      [north, east],
    ];
  }, [positioned]);

  if (!ready) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted">
        Loading fleet map…
      </div>
    );
  }

  const liveCount = vessels.filter((v) => v.aisSource && v.lat != null).length;

  return (
    <div className="space-y-4">
      {liveCount > 0 ? (
        <p className="text-sm text-muted">
          {liveCount} of {vessels.length} vessels with live AIS
          {aisMatched != null ? ` (${aisMatched} on this refresh)` : ""}.
        </p>
      ) : null}
      <motionPlaceholder className="h-[420px] overflow-hidden rounded-xl border border-line md:h-[480px]">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
          {bounds ? <FitFleetBounds bounds={bounds} /> : null}
          {positioned.map((v) => (
            <VesselShipMarker
              key={v.id}
              vessel={toSimulated(v)}
              selected={selected?.id === v.id}
              onSelect={setSelected}
            />
          ))}
        </MapContainer>
      </div>

      {vessels.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Vessel</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">IMO / MMSI</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">AIS</th>
              </tr>
            </thead>
            <tbody>
              {vessels.map((v) => (
                <tr key={v.id} className="border-b border-line last:border-0 hover:bg-canvas/80">
                  <td className="px-4 py-3 font-medium text-ink">
                    <span
                      className="mr-2 inline-block h-2 w-2 rounded-full"
                      style={{ background: vesselColor(v.aisSource ? v.type : "general") }}
                    />
                    {v.marineTrafficUrl ? (
                      <a
                        href={v.marineTrafficUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {v.name}
                      </a>
                    ) : (
                      v.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {VESSEL_TYPE_LABELS[v.type as keyof typeof VESSEL_TYPE_LABELS] || v.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {[v.imo, v.mmsi].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{v.dwt ? `${v.dwt} DWT` : "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {v.aisSource ? (
                      <span className="text-emerald-700">Live</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
