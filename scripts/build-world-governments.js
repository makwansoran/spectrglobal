/**
 * Build all world countries + key officials (Wikidata + REST Countries).
 *
 *   node scripts/build-world-governments.js
 *   node scripts/build-world-governments.js --skip-finance-fallback
 */
const fs = require("fs");
const path = require("path");
const { countrySlug } = require("../server/country-codes");
const { seedToCountryProfile } = require("../server/country-utils");
const { slugifyName } = require("../server/person-utils");
const {
  fetchLeadershipByIso,
  fetchFinanceByIsoBatch,
  fetchFinanceFallback,
  mergeOfficials,
  postProcessCountryOfficials,
  sleep,
} = require("../server/wikidata-officials");

const ROOT = path.resolve(__dirname, "..");
const COUNTRIES_DIR = path.join(ROOT, "data", "countries");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");
const UA = "SpectrGlobal/1.0 (contact@spectr.global)";

const skipFinanceFallback = !process.argv.includes("--finance-fallback");

function allocateSlug(name, office, iso, reserved) {
  const base = `${slugifyName(name)}-${slugifyName(office).slice(0, 24)}-${iso.toLowerCase()}`
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  let slug = base;
  let n = 2;
  while (reserved.has(slug)) {
    slug = `${base}-${n++}`;
  }
  reserved.add(slug);
  return slug;
}

const ISO_URL =
  "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json";

async function fetchIsoCountries() {
  const res = await fetch(ISO_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`ISO list ${res.status}`);
  const list = await res.json();
  return list
    .filter((c) => c["alpha-2"] && c.name)
    .map((c) => ({
      name: c.name,
      iso: c["alpha-2"],
      iso3: c["alpha-3"],
      region: c.region || "",
      subregion: c["sub-region"] || "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchCapitalsByIso() {
  const q = `SELECT ?iso ?capitalLabel WHERE {
    ?country wdt:P297 ?iso .
    ?country wdt:P36 ?capital .
    ?capital rdfs:label ?capitalLabel FILTER(LANG(?capitalLabel)="en")
  }`;
  const { sparql } = require("../server/wikidata-officials");
  const rows = await sparql(q);
  const map = new Map();
  for (const row of rows) map.set(row.iso.value, row.capitalLabel.value);
  return map;
}

function flagUrl(iso) {
  return `https://flagcdn.com/w320/${iso.toLowerCase()}.png`;
}

function countryAbout(c, capital) {
  const bits = [
    capital ? `Capital: ${capital}` : null,
    c.region ? `Region: ${c.region}${c.subregion ? ` (${c.subregion})` : ""}` : null,
  ].filter(Boolean);
  return bits.join(". ") + (bits.length ? "." : "");
}

async function main() {
  console.log("Fetching ISO country list…");
  const rest = await fetchIsoCountries();
  console.log(`  ${rest.length} countries`);

  console.log("Fetching capitals (Wikidata)…");
  let capitalsByIso = new Map();
  try {
    capitalsByIso = await fetchCapitalsByIso();
    console.log(`  ${capitalsByIso.size} capitals`);
  } catch (err) {
    console.warn("  capitals skipped:", err.message);
  }

  fs.mkdirSync(COUNTRIES_DIR, { recursive: true });
  fs.mkdirSync(POLITICIANS_DIR, { recursive: true });

  const isoList = [];
  const metaByIso = new Map();

  for (const c of rest) {
    const iso = c.iso;
    const name = c.name;
    const slug = countrySlug(name, iso);
    const capital = capitalsByIso.get(iso) || "";
    isoList.push(iso);
    metaByIso.set(iso, { slug, name, c });

    const profile = seedToCountryProfile({
      slug,
      name,
      isoCode: iso,
      profile: {
        capital,
        population: null,
        region: c.subregion ? `${c.region} · ${c.subregion}` : c.region || "",
        about: countryAbout(c, capital),
        flagEmoji: "",
        searchTerms: [name.toLowerCase(), iso.toLowerCase(), c.iso3?.toLowerCase(), slug].filter(Boolean),
        dataSources: [
          { name: "ISO 3166", url: "https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes" },
        ],
      },
    });

    profile.flagUrl = flagUrl(iso);

    fs.writeFileSync(
      path.join(COUNTRIES_DIR, `${slug}.json`),
      `${JSON.stringify({ slug, profile, mapGeojson: null }, null, 2)}\n`
    );
  }

  console.log(`Wrote ${rest.length} countries → ${COUNTRIES_DIR}`);

  console.log("\nFetching leadership (Wikidata SPARQL)…");
  const leadership = await fetchLeadershipByIso();
  console.log(`  ${leadership.size} countries with leadership rows`);

  console.log("\nFetching finance ministers (batched SPARQL)…");
  const finance = await fetchFinanceByIsoBatch(isoList, 30);
  console.log(`  ${finance.size} countries with finance rows`);

  const officialsByIso = mergeOfficials(leadership, finance);
  const globalSlugReserved = new Set();
  let polCount = 0;
  let financeFallbacks = 0;

  console.log("\nBuilding politician files…");

  for (const iso of isoList) {
    const meta = metaByIso.get(iso);
    let officials = postProcessCountryOfficials(iso, officialsByIso.get(iso) || []);

    const hasFinance = officials.some((o) => /finance|treasury|exchequer/i.test(o.office));
    if (!hasFinance && !skipFinanceFallback) {
      const fb = await fetchFinanceFallback(meta.name, iso);
      if (fb) {
        officials.push(fb);
        financeFallbacks++;
      }
      await sleep(180);
    }

    const politicians = [];
    for (const o of officials) {
      const slug = allocateSlug(o.name, o.office, iso, globalSlugReserved);
      const now = new Date().toISOString();
      politicians.push({
        office: o.office,
        profile: {
          id: slug,
          slug,
          name: o.name,
          countrySlug: meta.slug,
          countryName: meta.name,
          office: o.office,
          searchTerms: [o.name.toLowerCase(), o.office.toLowerCase(), meta.name.toLowerCase(), iso.toLowerCase()],
          dataSources: [{ name: "Wikidata", url: "https://www.wikidata.org" }],
          lastUpdated: now,
        },
      });
      polCount++;
    }

    fs.writeFileSync(
      path.join(POLITICIANS_DIR, `${meta.slug}.json`),
      `${JSON.stringify({ countrySlug: meta.slug, politicians }, null, 2)}\n`
    );
  }

  console.log(`\nDone.`);
  console.log(`  Countries:   ${rest.length}`);
  console.log(`  Politicians: ${polCount}`);
  console.log(`  Finance fallbacks: ${financeFallbacks}`);
  console.log(`\nNext: npm run db:seed-countries && npm run db:seed-politicians`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
