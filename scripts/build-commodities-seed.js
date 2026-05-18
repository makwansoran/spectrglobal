/**
 * Build data/seed/commodities.json from canonical commodity definitions.
 * Run: node scripts/build-commodities-seed.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "data", "seed", "commodities.json");

function slugify(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function initials(name, symbol) {
  const words = String(name).replace(/[^a-zA-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (symbol && String(symbol).length >= 2) return String(symbol).slice(0, 2).toUpperCase();
  return (words[0] || "CM").slice(0, 2).toUpperCase();
}

function buildMeta(categoryLabel, exchange, symbol) {
  const parts = [categoryLabel];
  if (exchange) parts.push(exchange);
  if (symbol) parts.push(symbol);
  return parts.join(" · ");
}

function buildSearchTerms(name, symbol, altSymbols, exchange, categoryLabel) {
  const terms = new Set();
  for (const t of [name, symbol, exchange, categoryLabel, ...(altSymbols || [])]) {
    if (t) terms.add(String(t).toLowerCase());
  }
  const slug = slugify(name);
  terms.add(slug);
  if (symbol) terms.add(String(symbol).toLowerCase());
  return [...terms];
}

function item({ name, category, categoryLabel, exchange, symbol, altSymbols, about }) {
  const slug = slugify(name);
  const sym = symbol || null;
  const profile = {
    id: slug,
    name,
    category,
    categoryLabel,
    exchange: exchange || null,
    symbol: sym,
    alternateSymbols: altSymbols || [],
    about:
      about ||
      `${name} is traded on ${exchange || "global markets"}${sym ? ` (symbol ${sym})` : ""}. Category: ${categoryLabel}.`,
    dataSources: [{ name: "Exchange contract specs", url: null }],
    lastUpdated: new Date().toISOString(),
  };

  return {
    slug,
    searchTerms: buildSearchTerms(name, sym, altSymbols, exchange, categoryLabel),
    profile,
    meta: buildMeta(categoryLabel, exchange, sym),
    initials: initials(name, sym),
  };
}

const CATEGORIES = [
  {
    category: "energy",
    categoryLabel: "Energy",
    items: [
      { name: "WTI Crude Oil", exchange: "NYMEX / ICE", symbol: "CL", altSymbols: ["WTIB"] },
      { name: "Brent Crude Oil", exchange: "ICE", symbol: null },
      { name: "Natural Gas", exchange: "NYMEX", symbol: "NG" },
      { name: "Natural Gas (UK)", exchange: "ICE", symbol: "NBP" },
      { name: "Heating Oil", exchange: "NYMEX", symbol: "HO" },
      { name: "RBOB Gasoline", exchange: "NYMEX", symbol: "RB" },
      { name: "Gulf Coast Gasoline", exchange: "NYMEX", symbol: "LR" },
      { name: "Propane", exchange: "NYMEX", symbol: "PN" },
      { name: "Ethanol", exchange: "CBOT", symbol: "ZE" },
      { name: "Purified Terephthalic Acid (PTA)", exchange: "ZCE", symbol: "TA" },
    ],
  },
  {
    category: "precious_metals",
    categoryLabel: "Precious Metals",
    items: [
      { name: "Gold", exchange: "COMEX", symbol: "GC" },
      { name: "Silver", exchange: "COMEX", symbol: "SI" },
      { name: "Platinum", exchange: "NYMEX", symbol: "PL" },
      { name: "Palladium", exchange: "NYMEX", symbol: "PA" },
    ],
  },
  {
    category: "base_metals",
    categoryLabel: "Base / Industrial Metals",
    items: [
      { name: "Copper", exchange: "LME / COMEX", symbol: null },
      { name: "Aluminium", exchange: "LME", symbol: null },
      { name: "Aluminium Alloy", exchange: "LME", symbol: null },
      { name: "Zinc", exchange: "LME", symbol: null },
      { name: "Lead", exchange: "LME", symbol: null },
      { name: "Nickel", exchange: "LME", symbol: null },
      { name: "Tin", exchange: "LME", symbol: null },
      { name: "Cobalt", exchange: "LME", symbol: null },
      { name: "Molybdenum", exchange: "LME", symbol: null },
    ],
  },
  {
    category: "grains",
    categoryLabel: "Grains & Oilseeds",
    items: [
      { name: "Corn", exchange: "CBOT / Euronext / DCE", symbol: "ZC", altSymbols: ["EMA"] },
      { name: "Wheat", exchange: "CBOT / Euronext", symbol: "ZW", altSymbols: ["EBM"] },
      { name: "UK Feed Wheat", exchange: "ICE", symbol: "TS" },
      { name: "Soybeans", exchange: "CBOT / DCE", symbol: "ZS" },
      { name: "Soybean Meal", exchange: "CBOT / DCE", symbol: "ZM" },
      { name: "Soybean Oil", exchange: "CBOT / DCE", symbol: "ZL" },
      { name: "Oats", exchange: "CBOT", symbol: "ZO" },
      { name: "Rough Rice", exchange: "CBOT", symbol: "ZR" },
      { name: "Rapeseed", exchange: "Euronext", symbol: "ECO" },
      { name: "Adzuki Bean", exchange: "OSE", symbol: null },
    ],
  },
  {
    category: "soft_commodities",
    categoryLabel: "Soft Commodities",
    items: [
      { name: "Coffee C (Arabica)", exchange: "ICE", symbol: "KC" },
      { name: "Robusta Coffee", exchange: "ICE", symbol: null },
      { name: "Cocoa", exchange: "ICE", symbol: "CC" },
      { name: "Sugar No. 11 (Raw)", exchange: "ICE", symbol: "SB" },
      { name: "Sugar No. 14 (Domestic)", exchange: "ICE", symbol: "SE" },
      { name: "Cotton No. 2", exchange: "ICE", symbol: "CT" },
      { name: "Frozen OJ (FCOJ)", exchange: "ICE", symbol: "FCOJ-A" },
    ],
  },
  {
    category: "livestock",
    categoryLabel: "Livestock & Dairy",
    items: [
      { name: "Live Cattle", exchange: "CME", symbol: "LE" },
      { name: "Feeder Cattle", exchange: "CME", symbol: "GF" },
      { name: "Lean Hogs", exchange: "CME", symbol: "HE" },
      { name: "Class III Milk", exchange: "CME", symbol: "DC" },
      { name: "Cash-Settled Butter", exchange: "CME", symbol: "CB" },
      { name: "Non-fat Dry Milk", exchange: "CME", symbol: "GNF" },
      { name: "Whole Milk Powder", exchange: "SGX", symbol: "WMP" },
      { name: "Skim Milk Powder", exchange: "SGX", symbol: "SMP" },
    ],
  },
  {
    category: "forestry",
    categoryLabel: "Forestry & Fiber",
    items: [
      { name: "Random Length Lumber", exchange: "CME", symbol: "LBS" },
      { name: "Hardwood Pulp", exchange: "CME", symbol: "HWP" },
      { name: "Softwood Pulp", exchange: "CME", symbol: "WP" },
    ],
  },
  {
    category: "specialty",
    categoryLabel: "Other / Specialty",
    items: [
      { name: "Palm Oil", exchange: "Bursa Malaysia", symbol: null },
      { name: "Rubber", exchange: "Osaka Exchange", symbol: null },
      { name: "Wool", exchange: "ASX", symbol: null },
      { name: "Amber", exchange: "Saint Petersburg Bourse", symbol: null },
    ],
  },
];

const seeds = [];
for (const group of CATEGORIES) {
  for (const row of group.items) {
    seeds.push(
      item({
        ...row,
        category: group.category,
        categoryLabel: group.categoryLabel,
      })
    );
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(seeds, null, 2));
console.log(`Wrote ${seeds.length} commodities → ${OUT}`);
