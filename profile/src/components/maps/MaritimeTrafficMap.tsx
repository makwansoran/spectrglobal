import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchWaterwayVessels } from "../../api/waterways";
import { VESSEL_TYPE_LABELS } from "../../lib/vesselTypes";
import type { SimulatedVessel, WaterwayProfile } from "../../types/waterway";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";
import { VesselShipMarker } from "./VesselShipMarker";

function FitWaterwayBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 });
    const t = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [map, bounds]);
  return null;
}

type Props = {
  waterway: WaterwayProfile;
};

export function MaritimeTrafficMap({ waterway }: Props) {
  const [mapReady, setMapReady] = useState(false);
  const [vessels, setVessels] = useState<SimulatedVessel[]>([]);
  const [trafficSource, setTrafficSource] = useState<"aisstream" | "simulated">("simulated");
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SimulatedVessel | null>(null);

  const bounds = useMemo((): LatLngBoundsExpression => {
    const [south, west, north, east] = waterway.bounds;
    return [
      [south, west],
      [north, east],
    ];
  }, [waterway.bounds]);

  const center = useMemo((): [number, number] => {
    const c = waterway.center;
    return [c[0], c[1]];
  }, [waterway.center]);

  const refreshVessels = useCallback(async () => {
    setTrafficLoading(true);
    setTrafficError(null);
    try {
      const data = await fetchWaterwayVessels(waterway.id);
      const list = Array.isArray(data.vessels) ? data.vessels : [];
      setVessels(list);
      setTrafficSource(data.source === "aisstream" ? "aisstream" : "simulated");
      if (!list.length) {
        setTrafficError("No vessel positions returned. Check API keys and try again.");
      }
    } catch {
      setTrafficError("Could not load vessel traffic.");
    } finally {
      setTrafficLoading(false);
      setMapReady(true);
    }
  }, [waterway.id]);

  useEffect(() => {
    refreshVessels();
    const intervalMs = trafficSource === "aisstream" ? 25_000 : 15_000;
    const interval = window.setInterval(refreshVessels, intervalMs);
    return () => window.clearInterval(interval);
  }, [refreshVessels, trafficSource]);

  useEffect(() => {
    if (!mapReady) return;
    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
    return () => window.clearTimeout(t);
  }, [mapReady]);

  const typeLabel = waterway.waterwayType === "canal" ? "Canal" : "Strait";

  if (!mapReady && trafficLoading) {
    return (
      <div className="maritime-map-loading">
        Loading vessel traffic…
      </div>
    );
  }

  return (
    <div className="maritime-map-wrap">
      <MapContainer
        center={center}
        zoom={8}
        className="maritime-map"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <FitWaterwayBounds bounds={bounds} />
        {vessels.map((v) => (
          <VesselShipMarker
            key={v.id}
            vessel={v}
            selected={selected?.id === v.id}
            onSelect={setSelected}
          />
        ))}
      </MapContainer>

      {trafficLoading && (
        <div className="maritime-traffic-loading" aria-live="polite">
          Updating traffic…
        </div>
      )}

      <header className="maritime-hud maritime-hud-top">
        <div className="maritime-hud-title">
          <span className="maritime-hud-type">{typeLabel}</span>
          <h1>{waterway.name}</h1>
          <p className="maritime-hud-region">{waterway.regionLabel}</p>
        </div>
        <div className="maritime-hud-stats">
          <span>{vessels.length} vessels tracked</span>
          <span className="maritime-hud-dot">·</span>
          <span>
            {trafficLoading
              ? "Loading…"
              : trafficSource === "aisstream"
                ? "Live AIS (AIS Stream)"
                : "Simulated AIS"}
          </span>
        </div>
      </header>

      {trafficError && !trafficLoading && (
        <div className="maritime-traffic-error" role="alert">
          <p>{trafficError}</p>
          <button type="button" className="maritime-traffic-retry" onClick={() => refreshVessels()}>
            Retry
          </button>
        </div>
      )}

      {selected && (
        <aside className="maritime-vessel-panel" role="dialog" aria-label="Vessel details">
          <button type="button" className="maritime-vessel-close" onClick={() => setSelected(null)} aria-label="Close">
            ×
          </button>
          <p className="maritime-vessel-name">{selected.name}</p>
          <dl className="maritime-vessel-meta">
            <div>
              <dt>Type</dt>
              <dd>{VESSEL_TYPE_LABELS[selected.type as keyof typeof VESSEL_TYPE_LABELS] ?? selected.type}</dd>
            </div>
            <div>
              <dt>Flag</dt>
              <dd>{selected.flag}</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{selected.speed} kn</dd>
            </div>
            <div>
              <dt>Heading</dt>
              <dd>{selected.heading}°</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>{selected.destination}</dd>
            </div>
          </dl>
        </aside>
      )}

      {waterway.description && (
        <footer className="maritime-hud maritime-hud-bottom">
          <p>{waterway.description}</p>
        </footer>
      )}
    </div>
  );
}
