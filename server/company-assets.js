/**
 * Company operating assets: oil blocks (GeoJSON), vessels, aircraft.
 */

const { getCompanyRaw } = require("./store");
const fleet = require("./supabase-fleet-store");
const {
  scrapeVesselsFromWebsite,
  scrapeAircraftFromWebsite,
  oilGeojsonForCompany,
} = require("./company-assets-scrape");

const COUNTRY_CENTER = {
  NO: [62, 10],
  US: [39, -98],
  GB: [54, -2],
  DE: [51, 10],
  FR: [46, 2],
  NL: [52, 5],
  BM: [32.3, -64.75],
  SG: [1.35, 103.8],
};

function companyWebsite(profile) {
  return (
    profile.website ||
    profile.finnhub?.weburl ||
    profile.stock?.weburl ||
    null
  );
}

function mapCenter(profile) {
  if (profile.mapConfig?.center) {
    const c = profile.mapConfig.center;
    return [c[0], c[1]];
  }
  const cc = COUNTRY_CENTER[String(profile.countryCode || "").toUpperCase()];
  return cc || [30, 0];
}

function spreadPositions(items, center) {
  const [lat0, lng0] = center;
  const n = items.length || 1;
  const radius = Math.min(8, 1.2 + n * 0.15);
  return items.map((item, i) => {
    if (item.lat != null && item.lng != null && !Number.isNaN(item.lat)) return item;
    const angle = (2 * Math.PI * i) / n;
    return {
      ...item,
      lat: lat0 + radius * 0.35 * Math.cos(angle),
      lng: lng0 + radius * Math.sin(angle),
    };
  });
}

function mergeAssets(profile, dbVessels, dbPlanes, profileAssets) {
  const vessels = [...(profileAssets?.vessels || profile.operatingAssets?.vessels || [])];
  const aircraft = [...(profileAssets?.aircraft || profile.operatingAssets?.aircraft || [])];
  const seenV = new Set(vessels.map((v) => v.name?.toLowerCase()));
  const seenA = new Set(aircraft.map((a) => a.name?.toLowerCase()));

  for (const v of dbVessels) {
    const k = v.name?.toLowerCase();
    if (!k || seenV.has(k)) continue;
    seenV.add(k);
    vessels.push(v);
  }
  for (const a of dbPlanes) {
    const k = a.name?.toLowerCase();
    if (!k || seenA.has(k)) continue;
    seenA.add(k);
    aircraft.push(a);
  }

  return { vessels, aircraft };
}

async function getCompanyAssets(slug) {
  const row = await getCompanyRaw(slug);
  if (!row?.profile) return null;

  const profile = row.profile;
  const [dbVessels, dbPlanes] = await Promise.all([
    fleet.listVesselsForCompany(slug).catch(() => []),
    fleet.listPlanesForCompany(slug).catch(() => []),
  ]);

  const merged = mergeAssets(profile, dbVessels, dbPlanes, profile.operatingAssets);
  const center = mapCenter(profile);

  let vessels = spreadPositions(merged.vessels, center);
  let aisMeta = { aisSource: null, aisMatched: 0 };
  if (vessels.length > 0 && vessels.some((v) => v.mmsi)) {
    try {
      const { attachAisPositions } = require("./company-fleet-ais");
      const ais = await attachAisPositions(vessels, {
        collectMs: vessels.length > 40 ? 14000 : 10000,
      });
      vessels = ais.vessels;
      aisMeta = { aisSource: ais.aisSource, aisMatched: ais.matched };
    } catch (err) {
      console.warn("[assets] AIS:", err.message);
    }
  }

  let mapGeojson = row.mapGeojson || null;
  if (
    !mapGeojson?.features?.length &&
    (profile.industry === "oil_gas" || profile.industry === "energy")
  ) {
    mapGeojson = oilGeojsonForCompany(profile.name, profile.countryCode);
  }

  return {
    industry: profile.industry,
    mapGeojson,
    vessels,
    aircraft: spreadPositions(merged.aircraft, center),
    vesselCount: vessels.length,
    aircraftCount: merged.aircraft.length,
    hasBlocks: Boolean(row.mapGeojson && row.mapGeojson.features?.length),
    sources: profile.operatingAssets?.sources || [],
    ...aisMeta,
  };
}

function vesselSeeds(slug, vessels) {
  return vessels.map((v) => ({
    slug: v.slug || `${slug}-${v.id}`,
    companySlug: slug,
    name: v.name,
    profile: {
      ...v,
      id: v.id,
      name: v.name,
      companySlug: slug,
    },
    meta: v.dwt ? `${v.dwt} DWT` : v.type || "",
    searchTerms: [v.name, slug],
  }));
}

function planeSeeds(slug, aircraft) {
  return aircraft.map((a) => ({
    slug: a.slug || `${slug}-${a.id}`,
    companySlug: slug,
    name: a.name,
    profile: {
      ...a,
      id: a.id,
      name: a.name,
      companySlug: slug,
    },
    meta: a.registration || a.type || "",
    searchTerms: [a.name, a.registration, slug].filter(Boolean),
  }));
}

/**
 * Discover fleet / blocks from IR site and known field DB; persist to Supabase.
 */
async function enrichCompanyAssets(slug, profile, options = {}) {
  const industry = profile.industry || "technology";
  const website = companyWebsite(profile);
  const sources = [];
  let mapGeojson = null;
  let vessels = [];
  let aircraft = [];

  if (industry === "oil_gas" || industry === "energy") {
    mapGeojson = oilGeojsonForCompany(profile.name, profile.countryCode);
    if (mapGeojson?.features?.length) sources.push("norway-fields");
  }

  if (website) {
    if (industry === "shipping" || /ship|marine|tanker|bulk|vessel/i.test(profile.about || "")) {
      const scraped = await scrapeVesselsFromWebsite(website, slug).catch(() => []);
      if (scraped.length) {
        vessels = scraped;
        sources.push("company-ir-fleet");
      }
    }
    if (
      industry === "aviation" ||
      /airline|aircraft|aviation|fly/i.test(`${profile.about} ${profile.name}`)
    ) {
      const scraped = await scrapeAircraftFromWebsite(website, slug).catch(() => []);
      if (scraped.length) {
        aircraft = scraped;
        sources.push("company-ir-aircraft");
      }
    }
    if ((industry === "oil_gas" || industry === "energy") && !mapGeojson?.features?.length) {
      const gj = oilGeojsonForCompany(profile.name, profile.countryCode);
      if (gj?.features?.length) {
        mapGeojson = gj;
        sources.push("norway-fields");
      }
    }
  }

  if (vessels.length && fleet.hasSupabaseWrites()) {
    await fleet.upsertVesselsBatch(vesselSeeds(slug, vessels)).catch((e) => {
      console.warn("vessel upsert:", e.message);
    });
  }
  if (aircraft.length && fleet.hasSupabaseWrites()) {
    await fleet.upsertPlanesBatch(planeSeeds(slug, aircraft)).catch((e) => {
      console.warn("plane upsert:", e.message);
    });
  }

  profile.operatingAssets = {
    ...(profile.operatingAssets || {}),
    vessels: vessels.length ? vessels : profile.operatingAssets?.vessels,
    aircraft: aircraft.length ? aircraft : profile.operatingAssets?.aircraft,
    sources: [...new Set([...(profile.operatingAssets?.sources || []), ...sources])],
    at: new Date().toISOString(),
  };

  return { profile, mapGeojson, sources, vesselCount: vessels.length, aircraftCount: aircraft.length };
}

module.exports = {
  getCompanyAssets,
  enrichCompanyAssets,
  mapCenter,
  spreadPositions,
};
