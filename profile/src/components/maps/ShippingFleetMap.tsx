import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CompanyVessel } from "../../types/company";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";
import { VESSEL_TYPE_LABELS, vesselColor } from "../../lib/vesselTypes";
import { VesselShipMarker } from "./VesselShipMarker";
import type { SimulatedVessel } from "../../types/waterway";

const FLEET_PANEL_HEIGHT = "min(480px, calc(100vh - 14rem))";

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

  const liveCount = vessels.filter((v) => v.aisSource && v.lat != null).length;

  const selectVessel = (v: CompanyVessel) => {
    setSelected(toSimulated(v));
  };

  if (!ready) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted"
        style={{ height: FLEET_PANEL_HEIGHT }}
      >
        Loading fleet map…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {liveCount > 0 ? (
        <p className="text-sm text-muted">
          {liveCount} of {vessels.length} vessels with live AIS
          {aisMatched != null ? ` (${aisMatched} on this refresh)` : ""}.
        </p>
      ) : null}

      <div
        className="flex flex-col gap-4 md:flex-row md:items-stretch"
        style={{ minHeight: FLEET_PANEL_HEIGHT }}
      >
        {vessels.length > 0 ? (
          <div
            className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-white md:w-[min(100%,22rem)] lg:w-80"
            style={{ maxHeight: FLEET_PANEL_HEIGHT }}
          >
            <div className="shrink-0 border-b border-line bg-canvas px-3 py-2.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Fleet · {vessels.length} vessels
              </p>
            </div>
            <ul
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              role="listbox"
              aria-label="Fleet vessels"
            >
              {vessels.map((v) => {
                const isSelected = selected?.id === v.id;
                const typeLabel =
                  VESSEL_TYPE_LABELS[v.type as keyof typeof VESSEL_TYPE_LABELS] || v.type;
                return (
                  <li key={v.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => selectVessel(v)}
                      className={`w-full border-b border-line px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-canvas/80 ${
                        isSelected ? "bg-canvas ring-1 ring-inset ring-accent/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background: vesselColor(v.aisSource ? v.type : "general"),
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-ink">
                            {v.marineTrafficUrl ? (
                              <a
                                href={v.marineTrafficUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {v.name}
                              </a>
                            ) : (
                              v.name
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {typeLabel}
                            {v.dwt ? ` · ${v.dwt} DWT` : ""}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-muted">
                            {[v.imo, v.mmsi].filter(Boolean).join(" · ") || "—"}
                            {v.aisSource ? (
                              <span className="ml-1.5 font-sans text-emerald-700">· Live</span>
                            ) : null}
                          </span>
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div
          className="min-h-[280px] min-w-0 flex-1 overflow-hidden rounded-xl border border-line"
          style={{ height: FLEET_PANEL_HEIGHT }}
        >
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
      </div>
    </div>
  );
}

