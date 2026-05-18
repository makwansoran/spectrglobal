/**
 * Import NBIM equity holdings (eq_20251231.xlsx) into public.companies
 * and attach portfolio index to norges-bank.
 *
 *   node scripts/import-nbim-equity-holdings.js "c:/Users/makwa/Downloads/eq_20251231.xlsx"
 *   node scripts/import-nbim-equity-holdings.js --dry-run
 *   node scripts/import-nbim-equity-holdings.js --limit 100
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { rowToHolding, holdingToCompanySeed, formatNok, formatUsd } = require("../server/nbim-holdings");
const { normalizeCompanyProfile } = require("../server/normalize-profile");
const { buildMeta } = require("../server/local-store");
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { upsertCompaniesBatchSupabase } = require("../server/supabase-store");

const AS_OF = "2025-12-31";
const DEFAULT_XLSX = path.join("C:", "Users", "makwa", "Downloads", "eq_20251231.xlsx");
const OUT_DIR = path.join(__dirname, "../data/norges-bank");
const HOLDINGS_FILE = path.join(OUT_DIR, "holdings-20251231.json");
const CHUNK = 40;

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const limit = process.argv.includes("--limit")
    ? parseInt(process.argv[process.argv.indexOf("--limit") + 1], 10) || 0
    : 0;
  const fileArg = process.argv.find((a) => a.endsWith(".xlsx") || a.endsWith(".xls"));
  return {
    dryRun,
    limit,
    xlsxPath: fileArg ? path.resolve(fileArg) : DEFAULT_XLSX,
  };
}

function readRows(xlsxPath) {
  if (!fs.existsSync(xlsxPath)) {
    throw new Error(`File not found: ${xlsxPath}`);
  }
  const wb = XLSX.readFile(xlsxPath);
  const sheet = wb.Sheets["Holdings Report"] || wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

async function updateNorgesBankProfile(holdings, dryRun) {
  const totalNok = holdings.reduce((s, h) => s + h.marketValueNok, 0);
  const totalUsd = holdings.reduce((s, h) => s + h.marketValueUsd, 0);

  const portfolio = {
    asOf: AS_OF,
    holdingCount: holdings.length,
    totalMarketValueNok: totalNok,
    totalMarketValueUsd: totalUsd,
    source: "NBIM equity holdings report (eq_20251231.xlsx)",
    regions: [...new Set(holdings.map((h) => h.region).filter(Boolean))].sort(),
  };

  if (dryRun) {
    console.log("Would update norges-bank portfolio:", portfolio);
    return;
  }

  const { data, error } = await getAdminClient()
    .from("companies")
    .select("slug, profile_json, search_terms")
    .eq("slug", "norges-bank")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("norges-bank company row missing — run institution SQL import first");

  const profile = normalizeCompanyProfile({
    ...data.profile_json,
    about:
      "Norges Bank Investment Management (NBIM) manages the Government Pension Fund Global, one of the world's largest sovereign wealth funds. The fund invests globally in listed equities, fixed income, real estate, and renewable energy infrastructure.",
    portfolio,
    lastUpdated: new Date().toISOString(),
    quickStats: [
      { label: "Equity holdings", value: String(holdings.length), format: "text" },
      { label: "Portfolio value (USD)", value: formatUsd(totalUsd), format: "text" },
      { label: "Portfolio value (NOK)", value: formatNok(totalNok), format: "text" },
      { label: "As of", value: AS_OF, format: "text" },
    ],
  });

  const { error: upErr } = await getAdminClient()
    .from("companies")
    .update({
      profile_json: profile,
      meta: buildMeta(profile),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "norges-bank");
  if (upErr) throw upErr;
  console.log(`Updated norges-bank profile (${holdings.length} holdings).`);
}

async function main() {
  const { dryRun, limit, xlsxPath } = parseArgs();

  if (!dryRun && (!isSupabaseEnabled() || !hasSupabaseWrites())) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  console.log(`Reading ${xlsxPath}…`);
  let rows = readRows(xlsxPath);
  if (limit > 0) rows = rows.slice(0, limit);

  const holdings = rows.map(rowToHolding);
  const slugSet = new Set();
  for (const h of holdings) {
    if (slugSet.has(h.slug)) {
      console.warn("Duplicate slug:", h.slug, h.name);
    }
    slugSet.add(h.slug);
  }

  console.log(`Parsed ${holdings.length} equity holdings.`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const indexPayload = {
    investorSlug: "norges-bank",
    asOf: AS_OF,
    count: holdings.length,
    holdings: holdings.map((h) => ({
      slug: h.slug,
      name: h.name,
      region: h.region,
      listingCountry: h.listingCountry,
      incorporationCountry: h.incorporationCountry,
      industry: h.industry,
      marketValueNok: h.marketValueNok,
      marketValueUsd: h.marketValueUsd,
      votingPercent: h.votingPercent,
      ownershipPercent: h.ownershipPercent,
    })),
  };

  if (!dryRun) {
    fs.writeFileSync(HOLDINGS_FILE, JSON.stringify(indexPayload));
    console.log(`Wrote ${HOLDINGS_FILE} (${(fs.statSync(HOLDINGS_FILE).size / 1e6).toFixed(2)} MB)`);
  }

  const seeds = holdings.map((h) => holdingToCompanySeed(h, AS_OF));

  if (dryRun) {
    console.log("Sample seeds:");
    seeds.slice(0, 3).forEach((s) => console.log(`  ${s.slug} — ${s.profile.name}`));
    await updateNorgesBankProfile(holdings, true);
    return;
  }

  console.log(`Upserting ${seeds.length} companies to Supabase (chunks of ${CHUNK})…`);
  for (let i = 0; i < seeds.length; i += CHUNK) {
    const chunk = seeds.slice(i, i + CHUNK);
    await upsertCompaniesBatchSupabase(chunk, CHUNK);
    if (i === 0 || (i + CHUNK) % 400 === 0 || i + CHUNK >= seeds.length) {
      console.log(`  … ${Math.min(i + CHUNK, seeds.length)} / ${seeds.length}`);
    }
  }

  await updateNorgesBankProfile(holdings, false);
  console.log("\nDone. View portfolio: https://spectr.no/company/norges-bank/investments");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
