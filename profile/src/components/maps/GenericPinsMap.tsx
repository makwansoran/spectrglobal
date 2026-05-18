import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { CompanyProfile } from "../../types/company";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";

type Pin = { lat: number; lng: number; label: string; meta: string };
type Route = { from: [number, number]; to: [number, number]; label: string };

type Props = {
  company: CompanyProfile;
  title: string;
  hint: string;
  pins?: Pin[];
  routes?: Route[];
};

function MapResizer({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    setTimeout(() => map.invalidateSize(), 100);
  }, [map, center, zoom]);
  return null;
}

export function GenericPinsMap({ company, title, hint, pins = [], routes = [] }: Props) {
  const [ready, setReady] = useState(false);
  const center = (company.mapConfig?.center ?? [60, 10]) as [number, number];
  const zoom = company.mapConfig?.zoom ?? 5;

  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted">
        Loading map…
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-ink">{title}</p>
      <p className="mb-2 text-xs text-muted">{hint}</p>
      <div className="h-[420px] overflow-hidden rounded-xl border border-line md:h-[480px]">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
          <MapResizer center={center} zoom={zoom} />
          {pins.map((p) => (
            <CircleMarker
              key={p.label}
              center={[p.lat, p.lng]}
              radius={8}
              pathOptions={{ color: "#1f6feb", fillColor: "#3b82f6", fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <p className="map-popup-title">{p.label}</p>
                <p className="map-popup-row">{p.meta}</p>
              </Popup>
            </CircleMarker>
          ))}
          {routes.map((r) => (
            <Polyline
              key={r.label}
              positions={[r.from, r.to]}
              pathOptions={{ color: "#0d8050", weight: 2, opacity: 0.8 }}
            >
              <Popup>
                <p className="map-popup-row">{r.label}</p>
              </Popup>
            </Polyline>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
