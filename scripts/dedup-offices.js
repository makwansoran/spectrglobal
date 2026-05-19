/**
 * Collapse semantically equivalent offices so each person appears once per country.
 * Prefers more-specific titles; removes generic Wikidata auto-added titles
 * when a more accurate one is already present.
 *
 *   node scripts/dedup-offices.js
 *   npm run db:seed-politicians
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");

// Office specificity ranking: lower number = more specific/preferred
// If a person has two offices, keep the one with the lower rank.
const OFFICE_RANK = {
  "king": 0,
  "king (as head of state)": 0,
  "queen": 0,
  "emperor": 0,
  "emir": 0,
  "sultan & prime minister": 0,
  "supreme leader": 0,
  "sultan": 0,
  "president": 1,
  "chancellor": 2,
  "premier": 2,
  "taoiseach": 2,
  "cap de govern": 2,
  "minister of state": 2,
  "prime minister": 3,
  "head of state": 10,
  "head of government": 10,
  "prime minister (gnu)": 3,
};

function officeRank(office) {
  const key = (office || "").toLowerCase().trim();
  for (const [k, v] of Object.entries(OFFICE_RANK)) {
    if (key === k || key.startsWith(k + " ")) return v;
  }
  return 5; // default mid-range for other offices
}

// Invalid/garbage entries
const GARBAGE_NAMES = /^(q\d+|https?:\/\/|diriyah|charter|constitution)/i;

function dedup(politicians) {
  // 0. Remove obvious garbage
  politicians = politicians.filter(p => {
    const name = String(p.profile?.name || "");
    return !GARBAGE_NAMES.test(name.trim());
  });

  // 1. Group by normalized person name
  const byName = new Map();
  for (const p of politicians) {
    const name = (p.profile?.name || "").toLowerCase().trim();
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(p);
  }

  // 2. For persons with multiple offices, keep only the most-specific one
  const keepSlugs = new Set();
  const dropSlugs = new Set();
  for (const [, entries] of byName) {
    if (entries.length <= 1) {
      if (entries[0]?.profile?.slug) keepSlugs.add(entries[0].profile.slug);
      continue;
    }
    // Sort by rank ascending (lower rank = more specific = keep)
    entries.sort((a, b) =>
      officeRank(a.office || a.profile?.office) - officeRank(b.office || b.profile?.office)
    );
    keepSlugs.add(entries[0].profile?.slug || "");
    for (let i = 1; i < entries.length; i++) dropSlugs.add(entries[i].profile?.slug || "");
  }

  // 3. Filter and dedupe by exact office name (last defence)
  const seenOffice = new Set();
  const result = [];
  for (const p of politicians) {
    const slug = p.profile?.slug || "";
    if (dropSlugs.has(slug)) continue;
    const office = (p.office || p.profile?.office || "").toLowerCase();
    if (seenOffice.has(office)) continue;
    seenOffice.add(office);
    result.push(p);
  }
  return result;
}

const files = fs.readdirSync(POLITICIANS_DIR).filter(f => f.endsWith(".json"));
let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(POLITICIANS_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const before = (data.politicians || []).length;
  data.politicians = dedup(data.politicians || []);
  const removed = before - data.politicians.length;
  totalRemoved += removed;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

console.log(`Removed ${totalRemoved} duplicate office entries across all countries.`);
console.log("Run: npm run db:seed-politicians");
