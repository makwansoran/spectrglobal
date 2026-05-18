/**
 * Parse Oslo Børs company list → data/seed/oslo-listed.json
 * Run: node scripts/build-oslo-listed.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const RAW = path.join(ROOT, "data", "raw", "oslo-bors.txt");
const OUT = path.join(ROOT, "data", "seed", "oslo-listed.json");

function slugify(legalName, ticker) {
  const base = legalName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base}-${ticker.toLowerCase()}`.replace(/-+/g, "-");
}

function initials(legalName, ticker) {
  const words = legalName.replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (ticker.length >= 2) return ticker.slice(0, 2).toUpperCase();
  return (words[0] || "CO").slice(0, 2).toUpperCase();
}

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const m = trimmed.match(/^\d+\.\s+(.+?)\s+\(([A-Za-z0-9]+)\)\s*$/);
  if (!m) {
    console.warn("Skip (bad line):", trimmed);
    return null;
  }
  const legalName = m[1].trim();
  const ticker = m[2].trim();
  if (/^equinor\s+asa$/i.test(legalName)) return null;
  const slug = slugify(legalName, ticker);
  const name = legalName;
  const ini = initials(legalName, ticker);

  const profile = {
    id: slug,
    name,
    legalName,
    logoInitials: ini,
    countryCode: "NO",
    countryName: "Norway",
    founded: 1900,
    headquarters: "Norway",
    industryTags: ["Oslo Børs"],
    isPublic: true,
    stock: {
      ticker,
      exchange: "Oslo Børs",
      price: 0,
      change: 0,
      changePercent: 0,
      currency: "NOK",
    },
    industry: "energy",
    industryTabLabel: "Overview",
    about: `${legalName} is listed on Oslo Børs (ticker ${ticker}). Profile data is a placeholder; enrich via admin or imports.`,
    quickStats: [],
    people: [],
    financials: { years: [], metrics: [] },
    news: [],
    filings: [],
    keyFacts: [{ label: "Listing", value: "Oslo Børs" }],
    competitors: [],
    funding: [],
    esg: { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    dataSources: [{ name: "Oslo Børs", url: "https://www.oslobors.no" }],
    lastUpdated: new Date().toISOString(),
  };

  const terms = [
    name.toLowerCase(),
    legalName.toLowerCase(),
    ticker.toLowerCase(),
    slug,
    ...legalName.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
  ];

  return {
    slug,
    profile,
    mapGeojson: null,
    searchTerms: [...new Set(terms)],
  };
}

function main() {
  const text = fs.readFileSync(RAW, "utf8");
  const seeds = [];
  const slugs = new Set();

  for (const line of text.split(/\r?\n/)) {
    const seed = parseLine(line);
    if (!seed) continue;
    if (slugs.has(seed.slug)) {
      seed.slug = `${seed.slug}-${seed.profile.stock.ticker.toLowerCase()}`;
      seed.profile.id = seed.slug;
    }
    slugs.add(seed.slug);
    seeds.push(seed);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(seeds, null, 0));
  console.log(`Wrote ${seeds.length} companies → ${OUT}`);
}

main();
