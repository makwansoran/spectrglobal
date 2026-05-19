/**
 * Scrape fleet / aircraft / field names from company IR and fleet pages (fetch + regex).
 */

const { fetchText } = require("./company-scrape");
const { geojsonForOperator, extractFieldNamesFromText, FIELDS } = require("./norway-oil-fields");

const FLEET_PATHS = ["/fleet", "/our-fleet", "/vessels", "/ships", "/shipping", "/operations/fleet", "/en/fleet"];
const AVIATION_PATHS = ["/fleet", "/our-fleet", "/aircraft", "/flota", "/about/fleet"];

const VESSEL_RE =
  /\b(?:MV|M\/V|MT|STS|HMS|SS)\s+([A-Z][A-Za-z0-9.'\-\s]{2,42})\b|(?:vessel|ship)\s*[:\-–]\s*([A-Z][A-Za-z0-9.'\-\s]{2,42})/g;

const AIRCRAFT_RE =
  /\b([A-Z]{1,2}-[A-Z]{3,4})\b|\b(Boeing|Airbus|Embraer)\s+(\d{3}(?:-\d{2,3})?)\b/gi;

const DWT_RE = /(\d{2,3}[,.]?\d{0,3})\s*DWT/i;

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseVesselsFromHtml(html, companySlug) {
  const seen = new Set();
  const out = [];
  let m;
  const text = String(html || "").replace(/<[^>]+>/g, " ");

  while ((m = VESSEL_RE.exec(text)) && out.length < 60) {
    const name = (m[1] || m[2] || "").trim().replace(/\s+/g, " ");
    if (name.length < 3 || name.length > 48) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const dwt = DWT_RE.exec(text.slice(Math.max(0, m.index - 80), m.index + 120));
    out.push({
      id: `${companySlug}-v-${slugify(name)}`,
      slug: `${companySlug}-${slugify(name)}`,
      name,
      type: /lng|gas/i.test(name) ? "lng" : /tank/i.test(name) ? "tanker" : /bulk|cargo/i.test(name) ? "cargo" : "general",
      dwt: dwt ? dwt[1].replace(/,/g, "") : null,
      flag: null,
      imo: null,
      lat: null,
      lng: null,
      source: "company-ir",
    });
  }

  return out;
}

function parseAircraftFromHtml(html, companySlug) {
  const seen = new Set();
  const out = [];
  const text = String(html || "").replace(/<[^>]+>/g, " ");

  let m;
  while ((m = AIRCRAFT_RE.exec(text)) && out.length < 80) {
    let label;
    let registration = null;
    if (m[1] && /^[A-Z]{1,2}-[A-Z]{3,4}$/.test(m[1])) {
      registration = m[1];
      label = registration;
    } else if (m[2] && m[3]) {
      label = `${m[2]} ${m[3]}`.trim();
    } else continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: `${companySlug}-a-${slugify(label)}`,
      slug: `${companySlug}-${slugify(label)}`,
      name: label,
      registration,
      type: label,
      lat: null,
      lng: null,
      homeBase: null,
      source: "company-ir",
    });
  }

  return out;
}

async function tryPaths(baseUrl, paths) {
  let base = baseUrl.replace(/\/$/, "");
  for (const p of paths) {
    try {
      const html = await fetchText(`${base}${p}`);
      if (html && html.length > 500) return html;
    } catch {
      /* next */
    }
  }
  try {
    const home = await fetchText(base);
    if (home?.length > 500) return home;
  } catch {
    /* */
  }
  return "";
}

async function scrapeVesselsFromWebsite(website, companySlug) {
  const html = await tryPaths(website, FLEET_PATHS);
  if (!html) return [];
  return parseVesselsFromHtml(html, companySlug);
}

async function scrapeAircraftFromWebsite(website, companySlug) {
  const html = await tryPaths(website, AVIATION_PATHS);
  if (!html) return [];
  return parseAircraftFromHtml(html, companySlug);
}

function oilGeojsonFromHtml(html, companyName) {
  extractFieldNamesFromText(html);
  return geojsonForOperator(companyName);
}

function oilGeojsonForCompany(companyName, countryCode) {
  if (String(countryCode || "").toUpperCase() === "NO" || /oil|gas|energy|petroleum/i.test(companyName)) {
    return geojsonForOperator(companyName);
  }
  return null;
}

module.exports = {
  parseVesselsFromHtml,
  parseAircraftFromHtml,
  scrapeVesselsFromWebsite,
  scrapeAircraftFromWebsite,
  oilGeojsonFromHtml,
  oilGeojsonForCompany,
};
