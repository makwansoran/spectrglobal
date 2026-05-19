/**
 * Add finance ministers via direct Wikidata entity API (no SPARQL — fast).
 * For each country missing a finance minister, searches Wikidata for the
 * position entity, then reads P1308 (current officeholder) directly.
 *
 *   node scripts/add-finance-ministers.js
 */
require("./load-env").loadEnv();
const fs = require("fs");
const path = require("path");
const { slugifyName } = require("../server/person-utils");

const ROOT = path.resolve(__dirname, "..");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");
const COUNTRIES_DIR = path.join(ROOT, "data", "countries");
const UA = "SpectrGlobal/1.0 (contact@spectr.global)";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function wdSearch(query) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&limit=5&format=json`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json();
  return d.search || [];
}

async function wdClaims(qid) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims|labels&languages=en&format=json`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json();
  return d.entities?.[qid] || null;
}

async function wdLabel(qid) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=en&format=json`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json();
  return d.entities?.[qid]?.labels?.en?.value || null;
}

function normalizeOffice(label) {
  if (/exchequer/i.test(label)) return "Chancellor of the Exchequer";
  if (/treasury/i.test(label)) return "Secretary of the Treasury";
  if (/economy/i.test(label) && /minister/i.test(label)) return "Minister of Economy";
  return "Minister of Finance";
}

function allocateSlug(name, office, iso, reserved) {
  const base = `${slugifyName(name)}-${slugifyName(office).slice(0, 20)}-${iso.toLowerCase()}`
    .replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  let slug = base, n = 2;
  while (reserved.has(slug)) slug = `${base}-${n++}`;
  reserved.add(slug);
  return slug;
}

const SKIP = /constitution|declaration|act of|treaty|government of|parliament|^Q\d+$/i;

async function findFinanceMinister(countryName, iso) {
  const queries = iso === "GB"
    ? ["Chancellor of the Exchequer"]
    : iso === "US"
      ? ["United States Secretary of the Treasury"]
      : [
          `Minister of Finance of ${countryName}`,
          `Minister of Finance (${countryName})`,
          `Ministry of Finance (${countryName})`,
          `${countryName} Minister of Finance`,
        ];

  for (const q of queries) {
    let results;
    try { results = await wdSearch(q); } catch { continue; }
    for (const hit of results) {
      if (!/finance|treasury|exchequer|economy/i.test(hit.label + " " + (hit.description || ""))) continue;
      if (/ministry|department|government/i.test(hit.label)) {
        // it's a ministry entity — try P1308 (current officeholder)
        const entity = await wdClaims(hit.id).catch(() => null);
        if (!entity) continue;
        const holderQid = entity.claims?.P1308?.[0]?.mainsnak?.datavalue?.value?.id;
        if (!holderQid) continue;
        const name = await wdLabel(holderQid).catch(() => null);
        if (!name || SKIP.test(name)) continue;
        return { name, office: normalizeOffice(hit.label), label: hit.label };
      }
      if (/position|office|minister/i.test(hit.label + " " + (hit.description || ""))) {
        // it's a position entity — try P1308
        const entity = await wdClaims(hit.id).catch(() => null);
        if (!entity) continue;
        const holderQid = entity.claims?.P1308?.[0]?.mainsnak?.datavalue?.value?.id;
        if (!holderQid) continue;
        const name = await wdLabel(holderQid).catch(() => null);
        if (!name || SKIP.test(name)) continue;
        return { name, office: normalizeOffice(hit.label), label: hit.label };
      }
    }
    await sleep(100);
  }
  return null;
}

async function main() {
  const globalReserved = new Set();
  const files = fs.readdirSync(POLITICIANS_DIR).filter(f => f.endsWith(".json"));
  let added = 0, checked = 0;

  for (const file of files) {
    const filePath = path.join(POLITICIANS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const countrySlug = data.countrySlug;

    for (const p of data.politicians || []) {
      if (p.profile?.slug) globalReserved.add(p.profile.slug);
    }

    const hasFinance = (data.politicians || []).some(p =>
      /finance|treasury|exchequer/i.test(p.office || p.profile?.office || "")
    );
    if (hasFinance) continue;

    const countryFile = path.join(COUNTRIES_DIR, `${countrySlug}.json`);
    if (!fs.existsSync(countryFile)) continue;
    const country = JSON.parse(fs.readFileSync(countryFile, "utf8"));
    const iso = country.profile?.isoCode;
    const countryName = country.profile?.name;
    if (!iso || !countryName) continue;

    checked++;
    const fm = await findFinanceMinister(countryName, iso);
    await sleep(120);

    if (!fm) continue;

    const slug = allocateSlug(fm.name, fm.office, iso, globalReserved);
    data.politicians.push({
      office: fm.office,
      profile: {
        id: slug, slug,
        name: fm.name,
        countrySlug, countryName,
        office: fm.office,
        searchTerms: [fm.name.toLowerCase(), fm.office.toLowerCase(), countryName.toLowerCase(), iso.toLowerCase()],
        dataSources: [{ name: "Wikidata", url: "https://www.wikidata.org" }],
        lastUpdated: new Date().toISOString(),
      },
    });
    added++;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    if (added % 10 === 0) console.log(`  ${added} added (${checked} checked)…`);
  }

  console.log(`\nDone. Added ${added} finance ministers across ${checked} countries checked.`);
  console.log("Run: npm run db:seed-politicians");
}

main().catch(err => { console.error(err.message); process.exit(1); });
