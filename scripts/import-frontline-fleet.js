/**
 * Import Frontline PLC fleet from Excel → Supabase vessels + company profile.
 * Usage: node scripts/import-frontline-fleet.js [path-to-xlsx]
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const fleet = require("../server/supabase-fleet-store");
const { getCompanyRaw, upsertCompany } = require("../server/store");

const COMPANY_SLUG = "frontline-plc-fro";
const DEFAULT_XLSX = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "Frontline_PLC_Fleet_2026.xlsx"
);

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function vesselTypeFromLabel(type) {
  const t = String(type || "").toUpperCase();
  if (t.includes("VLCC") || t.includes("LR2") || t.includes("LR1") || t.includes("AFRAMAX")) return "tanker";
  if (t.includes("SUEZ")) return "tanker";
  if (t.includes("LNG")) return "lng";
  return "tanker";
}

function cleanImo(raw) {
  const s = String(raw || "").trim();
  const m = s.match(/\d{7}/);
  return m ? m[0] : null;
}

function cleanMmsi(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(0, 9) : null;
}

function parseFleetSheet(filePath) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets["Frontline Fleet"] || wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  const vessels = [];

  for (const row of rows) {
    const section = String(row["Frontline PLC — Complete Fleet List (May 2026)"] || "");
    const name = String(row.__EMPTY || "").trim();
    if (!name || name === "Vessel Name") continue;
    if (/^⚓|vessels\)/i.test(section)) continue;

    const type = String(row.__EMPTY_1 || "Tanker").trim();
    const flag = String(row.__EMPTY_3 || row.__EMPTY_2 || "").trim();
    const yearBuilt = row.__EMPTY_4 || null;
    const dwt = String(row.__EMPTY_5 || "").replace(/,/g, "").trim();
    const shipyard = String(row.__EMPTY_6 || "").trim();
    const scrubber = String(row.__EMPTY_7 || "").trim();
    const imo = cleanImo(row.__EMPTY_8);
    const mmsi = cleanMmsi(row.__EMPTY_9);
    const callsign = String(row.__EMPTY_10 || "").trim();
    const marineTrafficUrl = String(row.__EMPTY_11 || "").trim();

    const slug = `${COMPANY_SLUG}-${slugify(name)}`;
    const metaParts = [
      type,
      dwt ? `${dwt} DWT` : null,
      flag || null,
      yearBuilt ? `Built ${yearBuilt}` : null,
      scrubber ? `Scrubber: ${scrubber}` : null,
    ].filter(Boolean);

    vessels.push({
      slug,
      companySlug: COMPANY_SLUG,
      name,
      searchTerms: [name.toLowerCase(), COMPANY_SLUG, "frontline", "fro", imo, mmsi].filter(Boolean),
      meta: metaParts.join(" · "),
      profile: {
        id: slug,
        name,
        companySlug: COMPANY_SLUG,
        type: vesselTypeFromLabel(type),
        vesselType: vesselTypeFromLabel(type),
        imo,
        mmsi,
        callsign: callsign && callsign !== "TBA" ? callsign : null,
        flag,
        dwt,
        yearBuilt,
        shipyard,
        scrubber,
        marineTrafficUrl: marineTrafficUrl.startsWith("http") ? marineTrafficUrl : null,
        lat: null,
        lng: null,
        source: "frontline-fleet-2026",
      },
    });
  }

  return vessels;
}

async function updateCompanyProfile(vesselCount, withMmsi) {
  const row = await getCompanyRaw(COMPANY_SLUG);
  if (!row?.profile) {
    throw new Error(`Company ${COMPANY_SLUG} not found in Supabase — seed Oslo listing first.`);
  }

  const profile = {
    ...row.profile,
    id: COMPANY_SLUG,
    industry: "shipping",
    industryTabLabel: "Fleet",
    about:
      row.profile.about && row.profile.about.length > 80
        ? row.profile.about
        : "Frontline plc is one of the world's largest tanker companies, operating VLCCs and Suezmax vessels. Fleet data sourced from Frontline's May 2026 fleet list with live AIS positions when available.",
    mapConfig: { center: [25, 55], zoom: 3 },
    quickStats: [
      { label: "Fleet size", value: vesselCount, format: "number" },
      { label: "AIS tracked", value: withMmsi, format: "number" },
      { label: "Segment", value: "VLCC & Suezmax", format: "text" },
      ...(row.profile.quickStats || []).filter((s) => !/fleet/i.test(s.label)),
    ].slice(0, 8),
    operatingAssets: {
      vessels: [],
      sources: ["frontline-fleet-2026"],
      at: new Date().toISOString(),
      fleetDocument: "Frontline_PLC_Fleet_2026.xlsx",
    },
    dataSources: [
      ...(row.profile.dataSources || []).filter((d) => d.name !== "Frontline fleet list"),
      { name: "Frontline fleet list", url: "https://www.frontline.bm" },
      { name: "MarineTraffic", url: "https://www.marinetraffic.com" },
    ],
    lastUpdated: new Date().toISOString(),
  };

  await upsertCompany({
    slug: COMPANY_SLUG,
    profile,
    mapGeojson: row.mapGeojson ?? null,
    searchTerms: [
      "frontline",
      "frontline plc",
      "fro",
      "tanker",
      "vlcc",
      COMPANY_SLUG,
      ...(row.profile.stock?.ticker ? [row.profile.stock.ticker.toLowerCase()] : []),
    ],
  });
}

async function main() {
  const xlsxPath = process.argv[2] || DEFAULT_XLSX;
  if (!fs.existsSync(xlsxPath)) {
    console.error("File not found:", xlsxPath);
    process.exit(1);
  }
  if (!fleet.hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const vessels = parseFleetSheet(xlsxPath);
  const withMmsi = vessels.filter((v) => v.profile.mmsi).length;
  console.log(`Parsed ${vessels.length} vessels (${withMmsi} with MMSI) from ${xlsxPath}`);

  const outJson = path.join(__dirname, "..", "data", "seed", "fleets", "frontline-plc-fro.json");
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(vessels, null, 2));

  const n = await fleet.upsertVesselsBatch(vessels);
  console.log(`Upserted ${n} vessels → company_slug=${COMPANY_SLUG}`);

  await updateCompanyProfile(vessels.length, withMmsi);
  console.log(`Updated company profile ${COMPANY_SLUG} (industry=shipping, Fleet tab)`);
  console.log(`Seed saved: ${outJson}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
