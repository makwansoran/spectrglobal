/**
 * Backfill live stock quotes into profile_json.stock (Finnhub /quote).
 *
 *   node scripts/backfill-company-quotes.js --prefix us- --limit 5000
 *   node scripts/backfill-company-quotes.js --slug us-nvda
 *   node scripts/backfill-company-quotes.js --all-prefix --skip-existing
 */
require("./load-env").loadEnv();

const { getAdminClient } = require("../server/supabase-client");
const { fetchLiveQuoteForProfile, applyQuoteToStock } = require("../server/company-quote");
const { isEnabled } = require("../server/finnhub");

const PAGE = 200;
const DELAY_MS = 220;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    limit: Infinity,
    slug: null,
    prefix: "us-",
    dryRun: false,
    skipExisting: false,
    allPrefix: false,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (args[i] === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (args[i] === "--dry-run") opts.dryRun = true;
    else if (args[i] === "--skip-existing") opts.skipExisting = true;
    else if (args[i] === "--all-prefix") opts.allPrefix = true;
  }
  if (opts.allPrefix) opts.prefix = null;
  return opts;
}

function hasFreshQuote(profile, maxAgeMs = 3600_000) {
  const stock = profile?.stock;
  if (!stock?.price || stock.price <= 0) return false;
  if (!stock.quoteAsOf) return false;
  const age = Date.now() - new Date(stock.quoteAsOf).getTime();
  return age >= 0 && age < maxAgeMs;
}

async function fetchPage(offset, prefix) {
  let query = getAdminClient()
    .from("companies")
    .select("slug, profile_json")
    .not("profile_json->stock->>ticker", "is", null)
    .order("slug")
    .range(offset, offset + PAGE - 1);

  if (prefix) query = query.like("slug", `${prefix}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function upsertQuote(slug, profile, stock) {
  const next = {
    ...profile,
    stock,
    lastUpdated: new Date().toISOString(),
  };
  const { error } = await getAdminClient()
    .from("companies")
    .update({ profile_json: next, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) throw error;
}

async function processRow(row, opts) {
  const profile = row.profile_json;
  if (!profile?.stock?.ticker) return "skip";

  if (opts.skipExisting && hasFreshQuote(profile)) return "skip";

  const quote = await fetchLiveQuoteForProfile(profile);
  if (!quote?.price) return "no_quote";

  const stock = applyQuoteToStock(profile.stock, quote);
  if (!opts.dryRun) await upsertQuote(row.slug, profile, stock);
  return "updated";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!isEnabled()) {
    console.error("FINNHUB_API_KEY required");
    process.exit(1);
  }

  const opts = parseArgs();
  let updated = 0;
  let noQuote = 0;
  let skipped = 0;
  let scanned = 0;

  console.log(
    `Quote backfill — prefix=${opts.prefix || "all"}, limit=${opts.limit}, skipExisting=${opts.skipExisting}`
  );

  if (opts.slug) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", opts.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Not found:", opts.slug);
      process.exit(1);
    }
    console.log(opts.slug, await processRow(data, opts));
    return;
  }

  for (let offset = 0; scanned < opts.limit; offset += PAGE) {
    const rows = await fetchPage(offset, opts.prefix);
    if (!rows.length) break;

    for (const row of rows) {
      if (scanned >= opts.limit) break;
      scanned++;
      try {
        const status = await processRow(row, opts);
        if (status === "updated") {
          updated++;
          if (updated % 50 === 0) console.log(`  … ${updated} quotes (${row.slug})`);
        } else if (status === "no_quote") noQuote++;
        else skipped++;
      } catch (err) {
        if (err.status === 429) {
          console.warn("  rate limit — sleep 60s");
          await sleep(60_000);
          scanned--;
          continue;
        }
        console.warn(`  skip ${row.slug}:`, err.message || err);
        skipped++;
      }
      await sleep(DELAY_MS);
    }

    if (rows.length < PAGE) break;
  }

  console.log(`\nDone. ${updated} updated, ${noQuote} no quote, ${skipped} skipped, ${scanned} scanned.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
