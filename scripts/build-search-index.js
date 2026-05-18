/**
 * Build data/company-search-index.json from seed JSON files (for Vercel fallback search).
 */
const fs = require("fs");
const path = require("path");
const { seedToIndexItem } = require("../server/search-index");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "data", "company-search-index.json");

const DIRS = [
  path.join(ROOT, "data", "seed", "companies"),
  path.join(ROOT, "data", "seed", "companies", "batch"),
];

function collect() {
  const bySlug = new Map();
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const seed = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const item = seedToIndexItem(seed);
      if (item) bySlug.set(item.id, item);
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const rows = collect();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(rows));
console.log(`Wrote ${rows.length} companies → ${OUT}`);
