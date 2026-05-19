/**
 * Bundled fleet data (data/seed/fleets/{companySlug}.json) when Supabase has no vessels yet.
 */
const fs = require("fs");
const path = require("path");

const FLEETS_DIR = path.join(__dirname, "..", "data", "seed", "fleets");

function rowToVessel(row) {
  const p = row.profile || row;
  const pos = p.position || {};
  return {
    id: row.slug || p.id,
    slug: row.slug || p.id,
    name: row.name || p.name,
    type: row.vessel_type || p.type || p.vesselType || "general",
    imo: p.imo || null,
    mmsi: p.mmsi || null,
    dwt: p.dwt || null,
    flag: p.flag || null,
    lat: p.lat ?? pos.lat ?? null,
    lng: p.lng ?? pos.lng ?? null,
    heading: p.heading ?? null,
    speed: p.speed ?? null,
    marineTrafficUrl: p.marineTrafficUrl || null,
    meta: row.meta || p.meta || "",
    source: p.source || "fleet-seed",
    aisSource: p.aisSource || null,
  };
}

function loadFleetSeed(companySlug) {
  if (!companySlug) return [];
  const file = path.join(FLEETS_DIR, `${companySlug}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    const seeds = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(seeds)) return [];
    return seeds.map(rowToVessel);
  } catch (err) {
    console.warn("[fleet-seed]", companySlug, err.message);
    return [];
  }
}

module.exports = { loadFleetSeed, rowToVessel };
