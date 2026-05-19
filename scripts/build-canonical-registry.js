/**
 * Build data/canonical-registry.json from curated Oslo seeds.
 * Run: node scripts/build-canonical-registry.js
 */
const fs = require("fs");
const path = require("path");
const { normalizeCompanyName, normalizeTicker } = require("../server/company-canonical");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "data", "canonical-registry.json");

const SEED_DIRS = [
  path.join(ROOT, "data", "seed", "companies"),
  path.join(ROOT, "data", "seed", "companies", "batch"),
  path.join(ROOT, "data", "companies"),
];

const byName = {};
const byTicker = {};

function addEntry(slug, name, ticker) {
  if (!slug || slug.startsWith("us-")) return;
  const n = normalizeCompanyName(name);
  if (n && !byName[n]) byName[n] = slug;
  const t = normalizeTicker(ticker);
  if (t && !byTicker[t]) byTicker[t] = slug;
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch {
      continue;
    }
    const slug = data.slug || data.profile?.id;
    const name = data.profile?.name || data.profile?.legalName;
    const ticker = data.profile?.stock?.ticker;
    addEntry(slug, name, ticker);
  }
}

for (const dir of SEED_DIRS) scanDir(dir);

// Curated profiles not only in data/seed
addEntry("equinor", "Equinor ASA", "EQNR");
addEntry("aker-bp-asa-akrbp", "Aker BP ASA", "AKRBP");

const registry = { byName, byTicker, builtAt: new Date().toISOString() };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(registry, null, 2));
console.log(`Wrote ${OUT} (${Object.keys(byName).length} names, ${Object.keys(byTicker).length} tickers)`);
