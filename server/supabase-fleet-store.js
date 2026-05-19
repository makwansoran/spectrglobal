/**
 * Supabase vessels + planes tables (fleet / aviation data).
 */
const {
  getAdminClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");
const { restGet } = require("./supabase-rest");

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
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name || p.name,
    type: row.vessel_type || p.type || p.vesselType || "general",
    imo: p.imo || null,
    dwt: p.dwt || null,
    flag: p.flag || null,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    meta: row.meta || "",
    source: p.source || "supabase",
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

async function listVesselsForCompany(companySlug) {
  if (!isSupabaseEnabled() || !companySlug) return [];
  const rows = await restGet("vessels", {
    select: "slug,name,vessel_type,meta,profile_json",
    company_slug: `eq.${companySlug}`,
    limit: "120",
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
  listVesselsForCompany,
  listPlanesForCompany,
  vesselToRow,
  planeToRow,
};
