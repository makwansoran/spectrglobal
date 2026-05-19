/**
 * Attach live AIS positions to company fleet vessels (by MMSI) via AIS Stream.
 */
const { isEnabled, fetchAisVessels } = require("./aisstream");

function normalizeMmsi(v) {
  const d = String(v || "").replace(/\D/g, "");
  return d.length >= 9 ? d.slice(0, 9) : null;
}

/**
 * @param {Array<{ mmsi?: string, imo?: string, lat?: number, lng?: number }>} vessels
 */
async function attachAisPositions(vessels, options = {}) {
  if (!isEnabled() || !vessels?.length) {
    return { vessels, aisSource: null, matched: 0 };
  }

  const mmsiSet = new Set();
  for (const v of vessels) {
    const m = normalizeMmsi(v.mmsi);
    if (m) mmsiSet.add(m);
  }
  if (!mmsiSet.size) {
    return { vessels, aisSource: null, matched: 0 };
  }

  const bounds = options.bounds || [-85, -180, 85, 180];
  const collectMs = options.collectMs ?? 12000;
  const live = await fetchAisVessels(bounds, {
    collectMs,
    maxVessels: 8000,
  });

  const byMmsi = new Map();
  for (const hit of live || []) {
    const m = normalizeMmsi(hit.mmsi);
    if (m && mmsiSet.has(m)) byMmsi.set(m, hit);
  }

  let matched = 0;
  const merged = vessels.map((v) => {
    const m = normalizeMmsi(v.mmsi);
    const hit = m && byMmsi.get(m);
    if (!hit) return v;
    matched += 1;
    return {
      ...v,
      lat: hit.lat,
      lng: hit.lng,
      heading: hit.heading ?? v.heading,
      speed: hit.speed ?? v.speed,
      destination: hit.destination || v.destination,
      aisSource: "aisstream",
      aisAsOf: new Date().toISOString(),
    };
  });

  return {
    vessels: merged,
    aisSource: matched > 0 ? "aisstream" : null,
    matched,
  };
}

module.exports = { attachAisPositions, normalizeMmsi };
