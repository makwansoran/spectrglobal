/**
 * Add finance ministers to data/politicians/*.json via Wikidata search API.
 *   node scripts/enrich-finance-ministers.js
 */
const fs = require("fs");
const path = require("path");
const { slugifyName } = require("../server/person-utils");
const { fetchFinanceFallback, sleep } = require("../server/wikidata-officials");

const ROOT = path.resolve(__dirname, "..");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");
const COUNTRIES_DIR = path.join(ROOT, "data", "countries");

function allocateSlug(name, office, iso, reserved) {
  const base = `${slugifyName(name)}-${slugifyName(office).slice(0, 24)}-${iso.toLowerCase()}`
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  let slug = base;
  let n = 2;
  while (reserved.has(slug)) slug = `${base}-${n++}`;
  reserved.add(slug);
  return slug;
}

async function main() {
  const globalReserved = new Set();
  let added = 0;
  const files = fs.readdirSync(POLITICIANS_DIR).filter((f) => f.endsWith(".json"));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(POLITICIANS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const countrySlug = data.countrySlug;
    const countryFile = path.join(COUNTRIES_DIR, `${countrySlug}.json`);
    if (!fs.existsSync(countryFile)) continue;

    const country = JSON.parse(fs.readFileSync(countryFile, "utf8"));
    const iso = country.profile?.isoCode;
    const countryName = country.profile?.name;

    for (const p of data.politicians || []) {
      if (p.profile?.slug) globalReserved.add(p.profile.slug);
    }

    const hasFinance = (data.politicians || []).some((p) =>
      /finance|treasury|exchequer/i.test(p.office || p.profile?.office || "")
    );
    if (hasFinance || !iso) continue;

    const fb = await fetchFinanceFallback(countryName, iso);
    await sleep(220);
    if (!fb) continue;

    const slug = allocateSlug(fb.name, fb.office, iso, globalReserved);
    const now = new Date().toISOString();
    data.politicians.push({
      office: fb.office,
      profile: {
        id: slug,
        slug,
        name: fb.name,
        countrySlug,
        countryName,
        office: fb.office,
        searchTerms: [fb.name.toLowerCase(), fb.office.toLowerCase()],
        dataSources: [{ name: "Wikidata", url: "https://www.wikidata.org" }],
        lastUpdated: now,
      },
    });
    added++;
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);

    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${files.length}…`);
  }

  console.log(`Added ${added} finance ministers. Run: npm run db:seed-politicians`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
