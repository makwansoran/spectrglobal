import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  useMap,
  Rectangle,
} from "react-leaflet";
import type { LatLngBoundsExpression, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchWaterwayVessels } from "../../api/waterways";
import { VESSEL_TYPE_COLORS, VESSEL_TYPE_LABELS, vesselColor } from "../../lib/vesselTypes";
import type { SimulatedVessel, WaterwayProfile } from "../../types/waterway";

const DARK_TILE =
  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

const waterwayStyle: PathOptions = {
  color: "#38bdf8",
  weight: 5,
  opacity: 0.95,
  lineCap: "round",
  lineJoin: "round",
};

const waterwayGlowStyle: PathOptions = {
  color: "#0ea5e9",
  weight: 12,
  opacity: 0.25,
  lineCap: "round",
  lineJoin: "round",
};

function FitWaterwayBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 });
    const t = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [map, bounds]);
  return null;
}

function MinimapInset({
  bounds,
  center,
}: {
  bounds: LatLngBoundsExpression;
  center: [number, number];
}) {
  const rectBounds = bounds as [[number, number], [number, number]];

  return (
    <div className="maritime-minimap" aria-hidden>
      <MapContainer
        center={center}
        zoom={4}
        className="maritime-minimap-map"
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer url={DARK_TILE} />
        <Rectangle
          bounds={rectBounds}
          pathOptions={{ color: "#38bdf8", weight: 2, fillColor: "#38bdf8", fillOpacity: 0.12 }}
        />
      </MapContainer>
    </div>
  );
}

type Props = {
  waterway: WaterwayProfile;
};

export function MaritimeTrafficMap({ waterway }: Props) {
  const [ready, setReady] = useState(false);
  const [vessels, setVessels] = useState<SimulatedVessel[]>([]);
  const [selected, setSelected] = useState<SimulatedVessel | null>(null);
  const startRef = useRef(Date.now());

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

  const linePositions = useMemo(() => {
    return (waterway.waterwayLine || []).map(([lat, lng]) => [lat, lng] as [number, number]);
  }, [waterway.waterwayLine]);

  const refreshVessels = useCallback(async () => {
    try {
      const data = await fetchWaterwayVessels(waterway.id);
      setVessels(data.vessels);
      startRef.current = Date.now();
    } catch {
      /* keep last positions */
    }
  }, [waterway.id]);

  useEffect(() => {
    setReady(true);
    refreshVessels();
    const interval = window.setInterval(refreshVessels, 15000);
    return () => window.clearInterval(interval);
  }, [refreshVessels]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
    return () => window.clearTimeout(t);
  }, [ready]);

  const typeLabel = waterway.waterwayType === "canal" ? "Canal" : "Strait";

  if (!ready) {
    return (
      <div className="maritime-map-loading">
        Initializing maritime traffic display…
      </div>
    );
  }

  return (
    <div className="maritime-map-wrap">
      <MapContainer
        center={center}
        zoom={8}
        className="maritime-map"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer url={DARK_TILE} attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <FitWaterwayBounds bounds={bounds} />
        {linePositions.length > 1 && (
          <>
            <Polyline positions={linePositions} pathOptions={waterwayGlowStyle} />
            <Polyline positions={linePositions} pathOptions={waterwayStyle} />
          </>
        )}
        {vessels.map((v) => (
          <CircleMarker
            key={v.id}
            center={[v.lat, v.lng]}
            radius={selected?.id === v.id ? 7 : 5}
            pathOptions={{
              color: "#0f172a",
              weight: 1.5,
              fillColor: vesselColor(v.type),
              fillOpacity: selected?.id === v.id ? 1 : 0.92,
            }}
            eventHandlers={{
              click: () => setSelected(v),
            }}
          />
        ))}
      </MapContainer>

      <MinimapInset bounds={bounds} center={center} />

      <header className="maritime-hud maritime-hud-top">
        <div className="maritime-hud-title">
          <span className="maritime-hud-type">{typeLabel}</span>
          <h1>{waterway.name}</h1>
          <p className="maritime-hud-region">{waterway.regionLabel}</p>
        </div>
        <div className="maritime-hud-stats">
          <span>{vessels.length} vessels tracked</span>
          <span className="maritime-hud-dot">·</span>
          <span>Simulated AIS</span>
        </div>
      </header>

      <aside className="maritime-legend" aria-label="Vessel types">
        <p className="maritime-legend-title">Vessel types</p>
        <ul>
          {(Object.keys(VESSEL_TYPE_COLORS) as Array<keyof typeof VESSEL_TYPE_COLORS>).map((type) => (
            <li key={type}>
              <span className="maritime-legend-swatch" style={{ background: VESSEL_TYPE_COLORS[type] }} />
              {VESSEL_TYPE_LABELS[type]}
            </li>
          ))}
        </ul>
      </aside>

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
