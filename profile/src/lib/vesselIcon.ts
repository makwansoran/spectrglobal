import L from "leaflet";
import { vesselColor } from "./vesselTypes";

/** MarineTraffic-style ship silhouette; 0° = north (bow up). */
function shipSvg(fill: string, size: number, heading: number) {
  const h = Math.round(heading) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 32" aria-hidden="true" style="transform:rotate(${h}deg);transform-origin:12px 16px;display:block">
  <path d="M12 1.5 L18.5 26 C18.5 28.5 15 27 12 25.5 C9 27 5.5 28.5 5.5 26 Z" fill="${fill}" stroke="#0f172a" stroke-width="1.25" stroke-linejoin="round"/>
  <path d="M12 6 L12 22" stroke="rgba(15,23,42,0.35)" stroke-width="1" stroke-linecap="round"/>
</svg>`;
}

export function createVesselShipIcon(type: string, heading: number, selected: boolean): L.DivIcon {
  const size = selected ? 30 : 24;
  const fill = vesselColor(type);
  return L.divIcon({
    className: selected ? "vessel-ship-icon vessel-ship-icon--selected" : "vessel-ship-icon",
    html: shipSvg(fill, size, heading),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function isValidVesselPosition(lat: unknown, lng: unknown): boolean {
  const la = Number(lat);
  const ln = Number(lng);
  if (Number.isNaN(la) || Number.isNaN(ln)) return false;
  if (Math.abs(la) > 90 || Math.abs(ln) > 180) return false;
  if (Math.abs(la) < 0.01 && Math.abs(ln) < 0.01) return false;
  return true;
}
