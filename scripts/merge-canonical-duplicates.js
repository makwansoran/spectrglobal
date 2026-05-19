/**
 * Merge duplicate company rows into canonical profiles (e.g. equinor-eqnr → equinor).
 * Run: node scripts/merge-canonical-duplicates.js
 */
require("./load-env").loadEnv();

const { getAdminClient, hasSupabaseWrites } = require("../server/supabase-client");
const { getCompanySupabase, upsertCompanySupabase } = require("../server/supabase-store");
const { mergeEuronextIntoProfile } = require("../server/euronext/merge-canonical");
const { resolveCanonicalSlug, isDuplicateOfCanonical } = require("../server/company-canonical");
const { restGet } = require("../server/supabase-rest");

const DUPLICATES_TO_REMOVE = ["equinor-eqnr"];

async function main() {
  if (!hasSupabaseWrites()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  }

  const client = getAdminClient();
  const rows = await restGet("companies", {
    select: "slug,name,legal_name,profile_json",
    name: "ilike.*equinor*",
    limit: "20",
  });

  const canonicalSlug = "equinor";
  const canonical = await getCompanySupabase(canonicalSlug);
  if (!canonical?.profile) {
    throw new Error(`Canonical profile ${canonicalSlug} not found`);
  }

  let profile = { ...canonical.profile };

  for (const row of rows || []) {
    if (row.slug === canonicalSlug) continue;
    const dup = isDuplicateOfCanonical(row.slug, {
      ticker: row.profile_json?.stock?.ticker,
      name: row.name,
      legalName: row.legal_name,
    });
    if (!dup && !DUPLICATES_TO_REMOVE.includes(row.slug)) continue;

    console.log(`Merging ${row.slug} → ${canonicalSlug}`);
    if (row.profile_json?.euronext) {
      profile = mergeEuronextIntoProfile(profile, {
        isin: row.profile_json.euronext.isin,
        mic: row.profile_json.euronext.mic,
        productPath: row.profile_json.euronext.productPath,
        productUrl: row.profile_json.euronext.productUrl,
        lastPrice: row.profile_json.euronext.lastPrice,
        dayChangePct: row.profile_json.euronext.dayChangePct,
        lastTradeLabel: row.profile_json.euronext.lastTradeLabel,
        ticker: row.profile_json.stock?.ticker || "EQNR",
        marketLabel: row.profile_json.stock?.exchange,
        currency: row.profile_json.stock?.currency || "NOK",
      });
    }

    await client.from("euronext_listings").update({ company_slug: canonicalSlug }).eq("company_slug", row.slug);
    const { error } = await client.from("companies").delete().eq("slug", row.slug);
    if (error) console.warn(`  delete ${row.slug}:`, error.message);
    else console.log(`  removed ${row.slug}`);
  }

  await upsertCompanySupabase({
    slug: canonicalSlug,
    profile: { ...profile, id: canonicalSlug },
    mapGeojson: canonical.mapGeojson,
    searchTerms: [
      "equinor",
      "equinor asa",
      "eqnr",
      "stohf",
      "oslo",
      "euronext",
      "no0010096985",
    ],
  });

  console.log(`Updated ${canonicalSlug} with merged Euronext data.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
