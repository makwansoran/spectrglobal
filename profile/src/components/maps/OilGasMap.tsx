import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, Path, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CompanyProfile } from "../../types/company";
import { OSM_ATTRIBUTION, OSM_TILE_URL } from "../../lib/mapTiles";

type BlockProps = {
  name: string;
  license: string;
  operator: string;
  partners: string;
  status?: string;
};

const blockStyle: PathOptions = {
  color: "#60a5fa",
  weight: 2,
  fillColor: "#3b82f6",
  fillOpacity: 0.35,
};

const blockStyleHover: PathOptions = {
  ...blockStyle,
  fillOpacity: 0.55,
  weight: 3,
};

function MapResizer({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    setTimeout(() => map.invalidateSize(), 100);
  }, [map, center, zoom]);
  return null;
}

function blockPopup(props: BlockProps) {
  const status = props.status
    ? `<p class="map-popup-row"><strong>Status:</strong> ${props.status}</p>`
    : "";
  return [
    `<p class="map-popup-title">${props.name}</p>`,
    `<p class="map-popup-row"><strong>License:</strong> ${props.license}</p>`,
    `<p class="map-popup-row"><strong>Operator:</strong> ${props.operator}</p>`,
    `<p class="map-popup-row"><strong>Partners:</strong> ${props.partners}</p>`,
    status,
  ].join("");
}

type Props = {
  company: CompanyProfile;
  mapGeojson?: GeoJSON.GeoJsonObject | null;
};

export function OilGasMap({ company, mapGeojson }: Props) {
  const [ready, setReady] = useState(false);
  const center = (company.mapConfig?.center ?? [5.5, 61.2]) as [number, number];
  const zoom = company.mapConfig?.zoom ?? 5;

  useEffect(() => {
    setReady(true);
  }, []);

  const blocks = mapGeojson;

  if (!ready) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted">
        Loading map…
      </div>
    );
  }

  if (!blocks) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-canvas text-sm text-muted">
        Map data not available.
      </div>
    );
  }

  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-line md:h-[480px]">
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <MapResizer center={center} zoom={zoom} />
        <GeoJSON
          data={blocks as GeoJSON.GeoJsonObject}
          style={() => blockStyle}
          onEachFeature={(feature, layer: Layer) => {
            const p = feature.properties as BlockProps;
            layer.bindPopup(blockPopup(p));
            layer.on({
              mouseover: (e) => {
                (e.target as Path).setStyle(blockStyleHover);
              },
              mouseout: (e) => {
                (e.target as Path).setStyle(blockStyle);
              },
            });
          }}
        />
      </MapContainer>
    </div>
  );
}
