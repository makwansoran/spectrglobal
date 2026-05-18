/**
 * Backfill 5-year SEC financials into profile_json for US public companies.
 *
 *   node scripts/backfill-company-financials.js --limit 100
 *   node scripts/backfill-company-financials.js --slug apple-inc-aapl
 *   node scripts/backfill-company-financials.js --prefix us- --limit 500
 */
require("./load-env").loadEnv();

const { getAdminClient } = require("../server/supabase-client");
const { fetchFinancialsForProfile, financialsForProfileJson } = require("../server/company-financials");
const { isEnabled } = require("../server/finnhub");

const PAGE = 200;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { limit: Infinity, slug: null, prefix: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (args[i] === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (args[i] === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

async function fetchPage(offset, prefix) {
  let query = getAdminClient()
    .from("companies")
    .select("slug, profile_json")
    .eq("profile_json->>isPublic", "true")
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
  if (!profile?.isPublic || !profile?.stock?.ticker) return "skip";

  const live = await fetchFinancialsForProfile(profile);
  if (!live?.quarterly?.length && !live?.years?.length) return "no_data";

  const block = financialsForProfileJson(live);
  if (!block) return "no_data";

  if (!opts.dryRun) {
    await upsertFinancials(row.slug, profile, block);
  }
  return "updated";
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
          if (updated % 10 === 0) console.log(`  … ${updated} updated (${row.slug})`);
        } else if (status === "no_data") noData++;
        else skipped++;
      } catch (err) {
        console.warn(`  skip ${row.slug}:`, err.message || err);
        skipped++;
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    if (rows.length < PAGE) break;
  }

  console.log(`\nDone. ${updated} updated, ${noData} no SEC data, ${skipped} skipped, ${scanned} scanned.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
