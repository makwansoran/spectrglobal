/**
 * Deterministic simulated AIS-style traffic within a waterway bounding box.
 */

const VESSEL_TYPES = [
  { type: "tanker", weight: 28 },
  { type: "cargo", weight: 22 },
  { type: "container", weight: 20 },
  { type: "lng", weight: 12 },
  { type: "passenger", weight: 8 },
  { type: "general", weight: 10 },
];

const FLAGS = [
  "Panama",
  "Liberia",
  "Marshall Islands",
  "Hong Kong",
  "Singapore",
  "Malta",
  "Bahamas",
  "Greece",
  "Norway",
  "Denmark",
  "Japan",
  "China",
  "South Korea",
  "United Kingdom",
  "United States",
  "Germany",
  "Cyprus",
  "Italy",
];

const NAME_PREFIXES = [
  "Atlantic",
  "Pacific",
  "Nordic",
  "Orient",
  "Global",
  "Maritime",
  "Ocean",
  "Star",
  "Crown",
  "Silver",
  "Golden",
  "Blue",
  "Northern",
  "Southern",
  "Eastern",
  "Western",
];

const NAME_SUFFIXES = [
  "Spirit",
  "Glory",
  "Pioneer",
  "Venture",
  "Horizon",
  "Trader",
  "Carrier",
  "Navigator",
  "Explorer",
  "Champion",
  "Leader",
  "Queen",
  "Prince",
  "Star",
  "Wave",
];

const DESTINATIONS = [
  "Rotterdam",
  "Singapore",
  "Shanghai",
  "Houston",
  "Fujairah",
  "Busan",
  "Antwerp",
  "Ningbo",
  "Qingdao",
  "Jebel Ali",
  "Santos",
  "Suez",
  "Piraeus",
  "Tokyo",
  "Los Angeles",
  "New York",
  "Barcelona",
  "Istanbul",
  "Mumbai",
  "Durban",
];

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(rng, items) {
  const total = items.reduce((s, x) => s + x.weight, 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.type;
  }
  return items[0].type;
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

function interpolateLine(line, t) {
  if (!line?.length) return [0, 0];
  if (line.length === 1) return line[0];
  const segments = line.length - 1;
  const pos = Math.max(0, Math.min(1, t)) * segments;
  const idx = Math.min(Math.floor(pos), segments - 1);
  const frac = pos - idx;
  const [lat0, lng0] = line[idx];
  const [lat1, lng1] = line[idx + 1];
  return [lat0 + (lat1 - lat0) * frac, lng0 + (lng1 - lng0) * frac];
}

function headingFromSegment(line, t) {
  if (!line || line.length < 2) return 90;
  const segments = line.length - 1;
  const pos = Math.max(0, Math.min(1, t)) * segments;
  const idx = Math.min(Math.floor(pos), segments - 1);
  const [lat0, lng0] = line[idx];
  const [lat1, lng1] = line[idx + 1];
  const dLng = lng1 - lng0;
  const dLat = lat1 - lat0;
  const rad = Math.atan2(dLng * Math.cos(((lat0 + lat1) / 2) * (Math.PI / 180)), dLat);
  return ((rad * 180) / Math.PI + 360) % 360;
}

function vesselCountForImportance(importance) {
  const base = { 1: 6, 2: 10, 3: 16, 4: 24, 5: 36 };
  return base[importance] || 16;
}

function generateVesselName(rng) {
  return `${NAME_PREFIXES[Math.floor(rng() * NAME_PREFIXES.length)]} ${NAME_SUFFIXES[Math.floor(rng() * NAME_SUFFIXES.length)]}`;
}

/**
 * @param {object} waterway
 * @param {number} [timeMs] — animation clock (default Date.now())
 */
function simulateVesselsInBounds(waterway, bounds, timeMs) {
  const [south, west, north, east] = bounds;
  const slug = waterway.slug || "waterway";
  const importance = waterway.importance || 3;
  const count = vesselCountForImportance(importance);
  const minuteBucket = Math.floor(timeMs / 60000);
  const rng = mulberry32(hashString(`${slug}:${minuteBucket}`));

  const latSpan = north - south;
  const lngSpan = east - west;
  const padLat = latSpan * 0.1;
  const padLng = lngSpan * 0.1;
  const latMin = south + padLat;
  const latMax = north - padLat;
  const lngMin = west + padLng;
  const lngMax = east - padLng;

  const vessels = [];
  const tAnim = timeMs / 1000;

  for (let i = 0; i < count; i++) {
    const type = pickWeighted(rng, VESSEL_TYPES);
    const speedKnots = 8 + rng() * 14;
    const baseLat = latMin + rng() * (latMax - latMin);
    const baseLng = lngMin + rng() * (lngMax - lngMin);
    const driftLat = Math.sin(tAnim * 0.03 + i * 1.9) * latSpan * 0.04;
    const driftLng = Math.cos(tAnim * 0.025 + i * 2.3) * lngSpan * 0.04;
    const lat = Math.max(latMin, Math.min(latMax, baseLat + driftLat));
    const lng = Math.max(lngMin, Math.min(lngMax, baseLng + driftLng));
    const heading = Math.round(rng() * 360);

    vessels.push({
      id: `${slug}-${i}`,
      name: generateVesselName(rng),
      type,
      flag: FLAGS[Math.floor(rng() * FLAGS.length)],
      speed: Math.round(speedKnots * 10) / 10,
      heading,
      destination: DESTINATIONS[Math.floor(rng() * DESTINATIONS.length)],
      lat,
      lng,
    });
  }

  return vessels;
}

function simulateVesselsOnLine(waterway, line, timeMs) {
  const slug = waterway.slug || "waterway";
  const importance = waterway.importance || 3;
  const count = vesselCountForImportance(importance);
  const minuteBucket = Math.floor(timeMs / 60000);
  const rng = mulberry32(hashString(`${slug}:${minuteBucket}`));

  const vessels = [];
  for (let i = 0; i < count; i++) {
    const type = pickWeighted(rng, VESSEL_TYPES);
    const baseT = rng();
    const speedKnots = 8 + rng() * 14;
    const drift = ((timeMs % 120000) / 120000) * 0.08 * (i % 2 === 0 ? 1 : -1);
    const t = (baseT + drift + i * 0.017) % 1;
    const [lat, lng] = interpolateLine(line, t);
    const lateral = (rng() - 0.5) * 0.04;
    const heading = headingFromSegment(line, t);

    vessels.push({
      id: `${slug}-${i}`,
      name: generateVesselName(rng),
      type,
      flag: FLAGS[Math.floor(rng() * FLAGS.length)],
      speed: Math.round(speedKnots * 10) / 10,
      heading: Math.round(heading),
      destination: DESTINATIONS[Math.floor(rng() * DESTINATIONS.length)],
      lat: lat + lateral,
      lng: lng + lateral * 1.4,
      progress: t,
    });
  }

  return vessels;
}

function simulateVessels(waterway, timeMs = Date.now()) {
  const bounds = normalizeBounds(waterway.bounds);
  if (bounds) return simulateVesselsInBounds(waterway, bounds, timeMs);

  const line = waterway.waterwayLine || waterway.profile_json?.waterwayLine;
  if (!line?.length) return [];

  return simulateVesselsOnLine(waterway, line, timeMs);
}

module.exports = {
  simulateVessels,
  vesselCountForImportance,
  VESSEL_TYPES,
};
