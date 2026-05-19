/**
 * Curated bank metadata (websites, logos, copy) — no Finnhub.
 */
const fs = require("fs");
const path = require("path");

const REGISTRY_PATH = path.join(__dirname, "../data/bank-registry.json");

let cache = null;

function loadRegistry() {
  if (cache) return cache;
  try {
    const raw = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
    const bySlug = new Map();
    const byTicker = new Map();
    for (const row of raw.banks || []) {
      if (row.slug) bySlug.set(row.slug, row);
      if (row.ticker) byTicker.set(String(row.ticker).toUpperCase(), row);
    }
    cache = { bySlug, byTicker, list: raw.banks || [] };
  } catch {
    cache = { bySlug: new Map(), byTicker: new Map(), list: [] };
  }
  return cache;
}

function lookupBankRegistry(slug, profile = {}) {
  const { bySlug, byTicker } = loadRegistry();
  if (slug && bySlug.has(slug)) return bySlug.get(slug);
  const ticker = profile.stock?.ticker;
  if (ticker && byTicker.has(String(ticker).toUpperCase())) return byTicker.get(ticker);
  return null;
}

/** Guess .no site for Oslo-listed banks not in the registry. */
function inferNorwegianBankSite(slug, name) {
  const s = String(slug || "").toLowerCase();
  if (/sparebank-1-/.test(s)) {
    return { website: "https://www.sparebank1.no", logoDomain: "sparebank1.no" };
  }
  const base = s.replace(/-[a-z0-9]{2,6}$/, "");
  if (base.includes("sparebank")) {
    const domain = `${base}.no`.replace(/--/g, "-");
    return { website: `https://www.${domain}`, logoDomain: domain };
  }
  const word = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9æøå\s]/g, " ")
    .split(/\s+/)[0];
  if (word && word.length > 2) {
    return { website: `https://www.${word}bank.no`, logoDomain: `${word}bank.no` };
  }
  return null;
}

function guessUsBankSite(name) {
  const cleaned = String(name || "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\b(inc|corp|corporation|ltd|limited|plc|co|llc|lp|holdings|group|company|the)\b\.?/gi, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim();
  const words = cleaned.split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return null;

  if (words[0].toLowerCase() === "bank" && words[1]?.toLowerCase() === "of" && words[2]) {
    return {
      website: `https://www.${words[2].toLowerCase()}.com`,
      logoDomain: `${words[2].toLowerCase()}.com`,
    };
  }

  const joined = words.join("").toLowerCase();
  if (/bancorp|bankcorp|bankshares/i.test(name)) {
    return { website: `https://www.${joined}.com`, logoDomain: `${joined}.com` };
  }

  const primary = words[0].toLowerCase();
  if (primary.length >= 3) {
    return { website: `https://www.${primary}.com`, logoDomain: `${primary}.com` };
  }
  return null;
}

function resolveBankSource(slug, profile) {
  const curated = lookupBankRegistry(slug, profile);
  if (curated) return { ...curated, source: "registry" };

  const oslo = /oslo/i.test(profile.stock?.exchange || "") || profile.countryCode === "NO";
  if (oslo) {
    const inferred = inferNorwegianBankSite(slug, profile.legalName || profile.name);
    if (inferred) return { ...inferred, source: "inferred-no" };
  }

  if (profile.countryCode === "US" || String(slug || "").startsWith("us-")) {
    const inferred = guessUsBankSite(profile.legalName || profile.name);
    if (inferred) return { ...inferred, source: "inferred-us" };
  }

  return null;
}

module.exports = {
  loadRegistry,
  lookupBankRegistry,
  resolveBankSource,
  inferNorwegianBankSite,
  guessUsBankSite,
};
