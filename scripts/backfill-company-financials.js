/**
 * Backfill 5-year SEC financials into profile_json (US and any symbol with SEC filings).
 *
 *   node scripts/backfill-company-financials.js --prefix us- --limit 5000
 *   node scripts/backfill-company-financials.js --slug us-msft
 *   node scripts/backfill-company-financials.js --prefix us- --skip-existing
 */
require("./load-env").loadEnv();

const { getAdminClient } = require("../server/supabase-client");
const { fetchFinancialsForProfile, financialsForProfileJson } = require("../server/company-financials");
const { isEnabled } = require("../server/finnhub");

const PAGE = 150;
const DELAY_MS = 450;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    limit: Infinity,
    slug: null,
    prefix: "us-",
    dryRun: false,
    skipExisting: false,
    force: false,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (args[i] === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (args[i] === "--dry-run") opts.dryRun = true;
    else if (args[i] === "--skip-existing") opts.skipExisting = true;
    else if (args[i] === "--force") opts.force = true;
    else if (args[i] === "--all-prefix") opts.prefix = null;
  }
  return opts;
}

function profileHasFinancials(profile) {
  const f = profile?.financials;
  if (!f) return false;
  if (f.meta?.source === "finnhub-reported" && (f.quarters?.length || f.annual?.length)) return true;
  return (f.quarters?.length ?? 0) >= 4;
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

async function upsertFinancials(slug, profile, financials) {
  const next = {
    ...profile,
    isPublic: profile.isPublic !== false,
    financials,
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

  if (opts.skipExisting && !opts.force && profileHasFinancials(profile)) return "skip";

  const live = await fetchFinancialsForProfile(profile);
  if (!live?.quarterly?.length && !live?.years?.length) return "no_data";

  const block = financialsForProfileJson(live);
  if (!block) return "no_data";

  if (!opts.dryRun) {
    await upsertFinancials(row.slug, profile, block);
  }
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
  let noData = 0;
  let skipped = 0;
  let scanned = 0;

  console.log(
    `Financials backfill — prefix=${opts.prefix || "all"}, limit=${opts.limit}, skipExisting=${opts.skipExisting}`
  );

  if (opts.slug) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", opts.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Company not found:", opts.slug);
      process.exit(1);
    }
    const status = await processRow(data, opts);
    console.log(opts.slug, status);
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
          if (updated % 25 === 0) console.log(`  … ${updated} updated (${row.slug})`);
        } else if (status === "no_data") noData++;
        else skipped++;
      } catch (err) {
        if (err.status === 429) {
          console.warn("  rate limit — sleeping 60s");
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

  console.log(`\nDone. ${updated} updated, ${noData} no SEC data, ${skipped} skipped, ${scanned} scanned.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
