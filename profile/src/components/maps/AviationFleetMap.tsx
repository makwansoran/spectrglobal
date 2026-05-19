import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CompanyAircraft } from "../../types/company";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 6 });
    const t = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [map, bounds]);
  return null;
}

type Props = {
  aircraft: CompanyAircraft[];
  center?: [number, number];
  zoom?: number;
};

export function AviationFleetMap({ aircraft, center = [60, 10], zoom = 4 }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const positioned = useMemo(
    () => aircraft.filter((a) => a.lat != null && a.lng != null && !Number.isNaN(a.lat)),
    [aircraft]
  );

  const bounds = useMemo((): LatLngBoundsExpression | null => {
    if (!positioned.length) return null;
    let south = 90;
    let north = -90;
    let west = 180;
    let east = -180;
    for (const a of positioned) {
      south = Math.min(south, a.lat!);
      north = Math.max(north, a.lat!);
      west = Math.min(west, a.lng!);
      east = Math.max(east, a.lng!);
    }
    return [
      [south, west],
      [north, east],
    ];
  }, [positioned]);

  if (!ready) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted">
        Loading aircraft map…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[360px] overflow-hidden rounded-xl border border-line md:h-[420px]">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
          {bounds ? <FitBounds bounds={bounds} /> : null}
          {positioned.map((a) => (
            <CircleMarker
              key={a.id}
              center={[a.lat!, a.lng!]}
              radius={8}
              pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <strong>{a.name}</strong>
                {a.registration ? <div className="text-xs">{a.registration}</div> : null}
                {a.type ? <div className="text-xs">{a.type}</div> : null}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {aircraft.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[24rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Aircraft</th>
                <th className="px-4 py-3 font-medium">Registration</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {aircraft.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0 hover:bg-canvas/80">
                  <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                  <td className="px-4 py-3 font-mono text-muted">{a.registration || "—"}</td>
                  <td className="px-4 py-3 text-muted">{a.type || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
