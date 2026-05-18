/**
 * Geographic helpers for maritime traffic (corridor filtering, offsets).
 * Coordinates: [lat, lng] throughout.
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Perpendicular offset (km); positive = starboard of heading. */
function offsetFromHeading(lat, lng, headingDeg, distanceKm) {
  const bearing = toRad(headingDeg + 90);
  const cosLat = Math.cos(toRad(lat)) || 1e-6;
  const dLat = (distanceKm / 111.32) * Math.cos(bearing);
  const dLng = (distanceKm / (111.32 * cosLat)) * Math.sin(bearing);
  return [lat + dLat, lng + dLng];
}

function distanceToSegmentKm(lat, lng, a, b) {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const midLat = (lat1 + lat2) / 2;
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(toRad(midLat));

  const px = lng * kmPerDegLng;
  const py = lat * kmPerDegLat;
  const ax = lng1 * kmPerDegLng;
  const ay = lat1 * kmPerDegLat;
  const bx = lng2 * kmPerDegLng;
  const by = lat2 * kmPerDegLat;

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-12) return haversineKm(lat, lng, lat1, lng1);

  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const cLng = cx / kmPerDegLng;
  const cLat = cy / kmPerDegLat;
  return haversineKm(lat, lng, cLat, cLng);
}

function distanceToLineKm(lat, lng, line) {
  if (!line?.length) return Infinity;
  if (line.length === 1) return haversineKm(lat, lng, line[0][0], line[0][1]);
  let min = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const d = distanceToSegmentKm(lat, lng, line[i], line[i + 1]);
    if (d < min) min = d;
  }
  return min;
}

function maxCorridorKm(waterwayType) {
  return waterwayType === "canal" ? 12 : 40;
}

function normalizeBounds(bounds) {
  if (!bounds) return null;
  let b = bounds;
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(b) || b.length !== 4) return null;
  const nums = b.map(Number);
  if (nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

function pointInBounds(lat, lng, bounds) {
  const [south, west, north, east] = bounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

function sanitizeCoords(lat, lng) {
  let la = Number(lat);
  let ln = Number(lng);
  if (Number.isNaN(la) || Number.isNaN(ln)) return null;
  if (Math.abs(la) > 90 && Math.abs(ln) <= 90) {
    const tmp = la;
    la = ln;
    ln = tmp;
  }
  if (Math.abs(la) > 90 || Math.abs(ln) > 180) return null;
  if (Math.abs(la) < 0.01 && Math.abs(ln) < 0.01) return null;
  return { lat: la, lng: ln };
}

function filterVesselsNearWaterway(vessels, line, waterwayType, bounds) {
  const corridorKm = maxCorridorKm(waterwayType);
  const box = normalizeBounds(bounds);
  const useLine = Array.isArray(line) && line.length >= 2;

  return (vessels || [])
    .map((v) => {
      const c = sanitizeCoords(v.lat, v.lng);
      if (!c) return null;
      return { ...v, lat: c.lat, lng: c.lng };
    })
    .filter(Boolean)
    .filter((v) => {
      if (useLine) return distanceToLineKm(v.lat, v.lng, line) <= corridorKm;
      if (box) return pointInBounds(v.lat, v.lng, box);
      return true;
    });
}

module.exports = {
  haversineKm,
  offsetFromHeading,
  distanceToLineKm,
  maxCorridorKm,
  filterVesselsNearWaterway,
  sanitizeCoords,
  pointInBounds,
};
