/**
 * Push curated annual financials from data/seed/companies into Supabase (Oslo / EU listings).
 *
 *   node scripts/backfill-oslo-financials-from-seed.js
 *   node scripts/backfill-oslo-financials-from-seed.js --dry-run
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { getAdminClient } = require("../server/supabase-client");

const SEED_ROOT = path.join(__dirname, "..", "data", "seed", "companies");

function parseArgs() {
  const args = process.argv.slice(2);
  return { dryRun: args.includes("--dry-run") };
}

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkJsonFiles(full, out);
    else if (name.endsWith(".json")) out.push(full);
  }
  return out;
}

function annualFromYears(years) {
  return years.map((y) => ({
    period: String(y.year),
    fiscalYear: y.year,
    periodEnd: `${y.year}-12-31`,
    revenue: y.revenue ?? null,
    grossProfit: null,
    operatingIncome: y.ebitda ?? null,
    netIncome: y.netIncome ?? null,
    operatingCashFlow: null,
    ebitda: y.ebitda ?? null,
  }));
}

async function main() {
  const opts = parseArgs();
  const files = walkJsonFiles(SEED_ROOT);
  let candidates = 0;
  let updated = 0;
  let missing = 0;

  for (const file of files) {
    let seed;
    try {
      seed = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      continue;
    }

    const slug = seed.slug || seed.profile?.id;
    const years = seed.profile?.financials?.years || seed.financials?.years || [];
    if (!slug || !years.length) continue;

    candidates++;
    const financials = {
      years,
      quarters: seed.profile?.financials?.quarters || [],
      annual: annualFromYears(years),
      metrics: seed.profile?.financials?.metrics || [],
      meta: {
        source: "spectr-seed",
        currency: seed.profile?.stock?.currency || "NOK",
        asOf: new Date().toISOString(),
      },
    };

    const { data: row, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!row) {
      missing++;
      continue;
    }

    const profile = row.profile_json || {};
    if ((profile.financials?.quarters?.length ?? 0) >= 4) continue;

    const next = {
      ...profile,
      financials,
      lastUpdated: new Date().toISOString(),
    };

    if (!opts.dryRun) {
      const { error: upErr } = await getAdminClient()
        .from("companies")
        .update({ profile_json: next, updated_at: new Date().toISOString() })
        .eq("slug", slug);
      if (upErr) throw upErr;
    }
    updated++;
    console.log(slug, years.length, "years");
  }

  console.log(`\nDone. ${updated} updated, ${candidates} with seed years, ${missing} slug not in DB.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
