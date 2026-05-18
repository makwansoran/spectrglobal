/**
 * Import US-listed companies from Finnhub into companies table.
 *
 *   node scripts/import-finnhub-us.js              # fetch + import all US symbols
 *   node scripts/import-finnhub-us.js --limit 200  # test batch
 *   node scripts/import-finnhub-us.js --enrich       # also fetch profile2 (slow, rate-limited)
 *   node scripts/import-finnhub-us.js --link-oslo    # attach US tickers to existing Oslo profiles
 *
 * Requires FINNHUB_API_KEY in .env
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const finnhub = require("../server/finnhub");
const { symbolToSeed, filterUsSymbols, usCompanySlug } = require("../server/finnhub-import");
const store = require("../server/store");
const supabase = require("../server/supabase-store");
const local = require("../server/local-store");

const ROOT = path.resolve(__dirname, "..");
const SYMBOL_CACHE = path.join(ROOT, "data", "seed", "finnhub-us-symbols.json");
const RATE_MS = 1100;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { limit: 0, enrich: false, linkOslo: false, fetchOnly: false };
  for (const a of args) {
    if (a === "--enrich") opts.enrich = true;
    else if (a === "--link-oslo") opts.linkOslo = true;
    else if (a === "--fetch-only") opts.fetchOnly = true;
    else if (a.startsWith("--limit")) {
      const n = a.includes("=") ? a.split("=")[1] : args[args.indexOf(a) + 1];
      opts.limit = parseInt(n, 10) || 0;
    }
  }
  return opts;
}

async function loadSymbols() {
  if (fs.existsSync(SYMBOL_CACHE)) {
    console.log(`Using cached symbols: ${SYMBOL_CACHE}`);
    return JSON.parse(fs.readFileSync(SYMBOL_CACHE, "utf8"));
  }
  console.log("Fetching US symbols from Finnhub…");
  const symbols = await finnhub.fetchUsStockSymbols();
  fs.mkdirSync(path.dirname(SYMBOL_CACHE), { recursive: true });
  fs.writeFileSync(SYMBOL_CACHE, JSON.stringify(symbols));
  console.log(`Cached ${symbols.length} symbols → ${SYMBOL_CACHE}`);
  return symbols;
}

function collectOsloTickerMap() {
  const map = new Map();
  const dirs = [
    path.join(ROOT, "data", "seed", "companies"),
    path.join(ROOT, "data", "seed", "companies", "batch"),
    path.join(ROOT, "data", "companies"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      let data;
      try {
        data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      } catch {
        continue;
      }
      const slug = data.slug || data.profile?.id;
      const ticker = data.profile?.stock?.ticker;
      if (!slug || slug.startsWith("us-") || !ticker) continue;
      map.set(String(ticker).toUpperCase(), slug);
    }
  }
  return map;
}

async function linkOsloUsTickers() {
  console.log("\nLinking US Finnhub tickers to existing Oslo companies…");
  const rows = await store.listCompanies();
  let linked = 0;

  for (const row of rows) {
    if (row.id.startsWith("us-")) continue;
    const raw = await store.getCompanyRaw(row.id);
    if (!raw?.profile?.stock?.ticker) continue;

    const ticker = raw.profile.stock.ticker.toUpperCase();
    await sleep(RATE_MS);
    const p2 = await finnhub.fetchStockProfile(ticker);
    if (!p2?.ticker) continue;

    const usSymbol = p2.ticker.includes(".") ? ticker : p2.ticker.replace(/\.OL$/i, "") || ticker;
    const finnhubSymbol = p2.ticker.includes(".OL") ? ticker : usSymbol;

    raw.profile.stock = {
      ...raw.profile.stock,
      finnhubSymbol: finnhubSymbol === `${ticker}.OL` ? usSymbol : finnhubSymbol,
    };
    if (p2.logo && !raw.profile.logoUrl) raw.profile.logoUrl = p2.logo;
    if (p2.name && raw.profile.name.length < p2.name.length) raw.profile.name = p2.name;

    await store.saveCompanySeed({
      slug: row.id,
      profile: raw.profile,
      mapGeojson: raw.mapGeojson,
      searchTerms: [...new Set([...(raw.profile.searchTerms || row.terms), usSymbol.toLowerCase(), "finnhub"])],
    });
    linked++;
    if (linked <= 5 || linked % 25 === 0) console.log(`  linked ${linked}: ${row.id} → ${finnhubSymbol}`);
  }
  console.log(`Linked ${linked} Oslo/Nordic profiles with US Finnhub symbols.`);
}

async function main() {
  if (!finnhub.isEnabled()) {
    console.error("Set FINNHUB_API_KEY in .env first.");
    process.exit(1);
  }

  const opts = parseArgs();

  if (opts.linkOslo) {
    await linkOsloUsTickers();
    return;
  }

  let symbols = await loadSymbols();
  symbols = filterUsSymbols(symbols);
  console.log(`Importing ${symbols.length} US securities (after type filter)…`);

  if (opts.limit > 0) symbols = symbols.slice(0, opts.limit);

  if (opts.fetchOnly) return;

  const tickerMap = collectOsloTickerMap();
  const seeds = [];
  let skipped = 0;

  for (let i = 0; i < symbols.length; i++) {
    const item = symbols[i];
    const ticker = item.symbol.toUpperCase();

    if (tickerMap.has(ticker) && !tickerMap.get(ticker).startsWith("us-")) {
      skipped++;
      continue;
    }

    let profile2 = null;
    if (opts.enrich) {
      if (i > 0 && opts.enrich) await sleep(RATE_MS);
      profile2 = await finnhub.fetchStockProfile(ticker);
    }

    const seed = symbolToSeed(item, profile2);
    if (seed) seeds.push(seed);

    if ((i + 1) % 500 === 0) console.log(`  prepared ${i + 1}/${symbols.length}…`);
  }

  console.log(`Prepared ${seeds.length} US seeds (skipped ${skipped} already on Oslo list).`);

  if (!seeds.length) return;

  if (supabase.isSupabaseEnabled()) {
    console.log("Uploading to Supabase in batches…");
    const chunkSize = 80;
    for (let i = 0; i < seeds.length; i += chunkSize) {
      const chunk = seeds.slice(i, i + chunkSize);
      await supabase.upsertCompaniesBatchSupabase(chunk, chunkSize);
      for (const seed of chunk) local.upsertCompanyLocal(seed);
      console.log(`  uploaded ${Math.min(i + chunkSize, seeds.length)}/${seeds.length}`);
    }
  } else {
    let n = 0;
    for (const seed of seeds) {
      await store.upsertCompany(seed);
      n++;
      if (n % 100 === 0) console.log(`  local ${n}/${seeds.length}`);
    }
  }

  console.log("\nDone. Search on the site uses /api/companies?q=…");
  console.log("Example: http://127.0.0.1:3000/company/us-aapl");
  console.log("\nTip: run with --link-oslo to add US tickers to your Oslo Børs profiles for live quotes.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
