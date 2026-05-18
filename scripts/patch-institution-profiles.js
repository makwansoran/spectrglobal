/**
 * Fix institution company rows missing dataSources / quickStats (prevents profile crash).
 *   node scripts/patch-institution-profiles.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { normalizeCompanyProfile } = require("../server/normalize-profile");
const { buildMeta } = require("../server/local-store");

const REGISTRY = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/institutions.json"), "utf8")
);

const SLUGS = [
  ...new Set(
    REGISTRY.flatMap((i) => [i.companySlug, i.slug, i.isListed && i.listedTicker ? `us-${i.listedTicker.toLowerCase()}` : null].filter(Boolean))
  ),
];

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  for (const slug of SLUGS) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json, search_terms")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.log(`  skip (missing): ${slug}`);
      continue;
    }

    const profile = normalizeCompanyProfile(data.profile_json);
    const { error: upErr } = await getAdminClient()
      .from("companies")
      .update({
        profile_json: profile,
        meta: buildMeta(profile),
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);
    if (upErr) throw upErr;
    console.log(`  patched ${slug}`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
