/**
 * Supabase vessels + planes tables (fleet / aviation data).
 */
const {
  getAdminClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
  requireSupabase,
} = require("./supabase-client");
const { restGet } = require("./supabase-rest");

const VESSEL_SEARCH_SELECT =
  "slug, name, company_slug, vessel_type, meta, initials, search_terms, profile_json";

function vesselTypeLabel(type) {
  if (!type) return "Vessel";
  const t = String(type).toLowerCase();
  if (t === "fso") return "FSO";
  if (t === "fpso") return "FPSO";
  if (t === "lng") return "LNG carrier";
  if (t === "lpg") return "LPG carrier";
  if (t === "vlcc") return "VLCC";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function vesselRowToSearchIndex(row) {
  const profile = row.profile_json || {};
  const typeLabel = vesselTypeLabel(row.vessel_type || profile.vesselType || profile.type);
  const subtitleBits = [typeLabel];
  if (profile.flag) subtitleBits.push(profile.flag);
  if (profile.imo) subtitleBits.push(`IMO ${profile.imo}`);
  return {
    id: row.slug,
    slug: row.slug,
    kind: "vessel",
    name: row.name || profile.name,
    meta: row.meta || "",
    initials: row.initials || (row.name || "V").slice(0, 2).toUpperCase(),
    url: `/vessel/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    companySlug: row.company_slug || profile.companySlug || null,
    vesselType: row.vessel_type || profile.vesselType || profile.type || "vessel",
    subtitle: subtitleBits.filter(Boolean).join(" · "),
  };
}

function vesselRowToProfile(row) {
  if (!row) return null;
  const p = row.profile_json || {};
  const pos = p.position || {};
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name || p.name,
    vesselType: row.vessel_type || p.vesselType || p.type || "vessel",
    typeLabel: vesselTypeLabel(row.vessel_type || p.vesselType || p.type),
    companySlug: row.company_slug || p.companySlug || null,
    imo: p.imo || null,
    mmsi: p.mmsi || null,
    callsign: p.callsign || null,
    flag: p.flag || null,
    dwt: p.dwt || null,
    yearBuilt: p.yearBuilt || null,
    shipyard: p.shipyard || null,
    scrubber: p.scrubber || null,
    lat: p.lat ?? pos.lat ?? null,
    lng: p.lng ?? pos.lng ?? null,
    heading: p.heading ?? null,
    speed: p.speed ?? null,
    route: p.route || null,
    eta: p.eta || null,
    marineTrafficUrl: p.marineTrafficUrl || null,
    meta: row.meta || p.meta || "",
    source: p.source || "supabase",
    raw: p,
  };
}

function vesselToRow(seed) {
  const p = seed.profile || seed;
  return {
    slug: seed.slug || p.id,
    name: p.name || seed.name,
    company_slug: seed.companySlug || p.companySlug || null,
    vessel_type: p.vesselType || p.type || "vessel",
    meta: seed.meta || p.meta || "",
    initials: seed.initials || p.initials || (p.name || "V").slice(0, 2).toUpperCase(),
    search_terms: seed.searchTerms || p.searchTerms || [],
    profile_json: p,
    updated_at: new Date().toISOString(),
  };
}

function planeToRow(seed) {
  const p = seed.profile || seed;
  return {
    slug: seed.slug || p.id,
    name: p.name || seed.name,
    company_slug: seed.companySlug || p.companySlug || null,
    registration: p.registration || p.tailNumber || null,
    meta: seed.meta || p.meta || "",
    initials: seed.initials || p.initials || (p.name || "P").slice(0, 2).toUpperCase(),
    search_terms: seed.searchTerms || p.searchTerms || [],
    profile_json: p,
    updated_at: new Date().toISOString(),
  };
}

async function upsertVesselsBatch(seeds) {
  const rows = seeds.map(vesselToRow);
  const { error } = await getAdminClient().from("vessels").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return rows.length;
}

async function upsertPlanesBatch(seeds) {
  const rows = seeds.map(planeToRow);
  const { error } = await getAdminClient().from("planes").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return rows.length;
}

function rowToVessel(row) {
  const p = row.profile_json || {};
  const pos = p.position || {};
  return {
    id: row.slug,
    slug: row.slug,
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
    source: p.source || "supabase",
    aisSource: p.aisSource || null,
  };
}

function rowToPlane(row) {
  const p = row.profile_json || {};
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name || p.name,
    registration: row.registration || p.registration || null,
    type: p.type || p.aircraftType || "Aircraft",
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    homeBase: p.homeBase || null,
    meta: row.meta || "",
    source: p.source || "supabase",
  };
}

async function listVessels(limit = 500) {
  requireSupabase();
  let query = getAdminClient()
    .from("vessels")
    .select(VESSEL_SEARCH_SELECT)
    .order("name");
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(vesselRowToSearchIndex);
}

async function searchVessels(query, limit = 25) {
  requireSupabase();
  const q = String(query || "").trim().toLowerCase();
  if (!q) return listVessels(limit);

  const safe = q.replace(/[%_,.()]/g, "");
  if (!safe) return [];

  const pattern = `%${safe}%`;
  const client = getAdminClient();
  const seen = new Set();
  const merged = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(row);
    }
  };

  const byText = await client
    .from("vessels")
    .select(VESSEL_SEARCH_SELECT)
    .or(`name.ilike.${pattern},meta.ilike.${pattern},slug.ilike.${pattern}`)
    .order("name")
    .limit(limit);
  if (byText.error) throw byText.error;
  addRows(byText.data);

  if (merged.length < limit) {
    const byTerms = await client
      .from("vessels")
      .select(VESSEL_SEARCH_SELECT)
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (!byTerms.error) addRows(byTerms.data);
  }

  return merged.slice(0, limit).map(vesselRowToSearchIndex);
}

async function getVessel(slug) {
  requireSupabase();
  const { data, error } = await getAdminClient()
    .from("vessels")
    .select(VESSEL_SEARCH_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return vesselRowToProfile(data);
}

async function listVesselsForCompany(companySlug) {
  if (!isSupabaseEnabled() || !companySlug) return [];
  const rows = await restGet("vessels", {
    select: "slug,name,vessel_type,meta,profile_json",
    company_slug: `eq.${companySlug}`,
    limit: "200",
  });
  return (rows || []).map(rowToVessel);
}

async function listPlanesForCompany(companySlug) {
  if (!isSupabaseEnabled() || !companySlug) return [];
  const rows = await restGet("planes", {
    select: "slug,name,registration,meta,profile_json",
    company_slug: `eq.${companySlug}`,
    limit: "120",
  });
  return (rows || []).map(rowToPlane);
}

module.exports = {
  isSupabaseEnabled,
  hasSupabaseWrites,
  upsertVesselsBatch,
  upsertPlanesBatch,
  listVessels,
  searchVessels,
  getVessel,
  listVesselsForCompany,
  listPlanesForCompany,
  vesselToRow,
  planeToRow,
  vesselRowToSearchIndex,
  vesselRowToProfile,
  vesselTypeLabel,
};
