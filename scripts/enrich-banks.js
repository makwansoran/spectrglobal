/**
 * Enrich bank companies using curated registry + website scrape + EDGAR/Euronext.
 * Finnhub is used only for live stock quotes (via company-quote).
 *
 *   node scripts/enrich-banks.js
 *   node scripts/enrich-banks.js --euronext
 *   node scripts/enrich-banks.js --slug dnb-bank-asa-dnb --force
 *   node scripts/build-bank-registry.js   # refresh data/bank-registry.json
 */
require("./load-env").loadEnv();

const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { isBankCompany } = require("../server/bank-companies");
const { enrichBankProfile } = require("../server/bank-enrich");
const { buildMeta } = require("../server/local-store");
const euronextSync = require("../server/euronext/sync");

const PAGE = 500;
const RATE_MS = 600;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    euronext: args.includes("--euronext"),
    force: args.includes("--force"),
    noScrape: args.includes("--no-scrape"),
    limit: (() => {
      const i = args.indexOf("--limit");
      return i >= 0 ? parseInt(args[i + 1], 10) || 0 : 0;
    })(),
    slug: (() => {
      const i = args.indexOf("--slug");
      return i >= 0 ? args[i + 1] : "";
    })(),
  };
}

function rowPatch(slug, profile, searchTerms) {
  return {
    slug,
    name: profile.name,
    legal_name: profile.legalName,
    meta: buildMeta(profile),
    initials: profile.logoInitials,
    search_terms: searchTerms || [],
    profile_json: { ...profile, lastUpdated: new Date().toISOString() },
    updated_at: new Date().toISOString(),
  };
}

async function scanBankSlugs() {
  const client = getAdminClient();
  const banks = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from("companies")
      .select("slug, name, profile_json, search_terms")
      .order("slug")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data?.length) break;

    for (const row of data) {
      const p = row.profile_json || {};
      if (isBankCompany(row.slug, row.name, p)) {
        banks.push({
          slug: row.slug,
          name: row.name,
          profile: p,
          searchTerms: row.search_terms || [],
        });
      }
    }

    from += PAGE;
    if (data.length < PAGE) break;
  }

  return banks;
}

async function syncEuronextOslo(banks, opts) {
  const oslo = banks.filter(
    (b) => b.profile.countryCode === "NO" || /oslo/i.test(b.profile.stock?.exchange || "")
  );
  if (!oslo.length) return;

  console.log(`\nEuronext sync for ${oslo.length} Oslo banks…`);
  for (const row of oslo) {
    const ticker = row.profile.stock?.ticker;
    if (!ticker) continue;
    if (opts.dryRun) {
      console.log(`  would sync ${ticker}`);
      continue;
    }
    try {
      const result = await euronextSync.syncTickerFromDirectory(ticker, { scrapePage: false });
      console.log(`  ${ticker}: ${result.ok ? "ok" : result.reason || "skip"}`);
    } catch (err) {
      console.warn(`  ${ticker}: ${err.message}`);
    }
    await sleep(250);
  }
}

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const opts = parseArgs();
  let banks = await scanBankSlugs();
  console.log(`Found ${banks.length} bank companies (Finnhub: quotes only)`);

  if (opts.slug) {
    banks = banks.filter((b) => b.slug === opts.slug);
    if (!banks.length) {
      console.error("Bank not found:", opts.slug);
      process.exit(1);
    }
  }
  if (opts.limit) banks = banks.slice(0, opts.limit);

  if (opts.euronext) await syncEuronextOslo(banks, opts);

  let updated = 0;
  let failed = 0;

  console.log(`\nEnriching ${banks.length} banks${opts.dryRun ? " (dry run)" : ""}…\n`);

  for (let i = 0; i < banks.length; i++) {
    const row = banks[i];
    const prefix = `[${i + 1}/${banks.length}] ${row.slug}`;

    try {
      const { profile, sources } = await enrichBankProfile(row.slug, row.profile, {
        force: opts.force,
        scrapeMeta: !opts.noScrape,
      });

      if (!opts.dryRun) {
        await getAdminClient()
          .from("companies")
          .upsert(rowPatch(row.slug, profile, row.searchTerms), { onConflict: "slug" });
      }

      updated++;
      if ((i + 1) % 10 === 0 || i === banks.length - 1) {
        console.log(`${prefix} — ${sources.slice(0, 4).join(", ")}`);
      }
    } catch (err) {
      failed++;
      console.error(`${prefix}: ${err.message}`);
    }

    if (i < banks.length - 1) await sleep(RATE_MS);
  }

  console.log(`\nDone. ${updated} updated, ${failed} failed.`);
  if (opts.dryRun) console.log("(dry run — no writes)");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
