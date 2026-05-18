/**
 * Enrich profile_json.ownership.shareholders with institution metadata (type, listed, slug).
 *   node scripts/enrich-ownership-holders.js
 *   node scripts/enrich-ownership-holders.js --slug apple-inc-aapl
 */
require("./load-env").loadEnv();

const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { enrichOwnership } = require("../server/institutions");
const { buildMeta } = require("../server/local-store");

const PAGE = 200;

async function patchCompany(row) {
  const profile = row.profile_json || {};
  const ownership = profile.ownership || null;
  const fromKeyFacts = !ownership?.shareholders?.length;
  if (!ownership?.shareholders?.length) return { updated: false, fromKeyFacts };

  const nextOwnership = enrichOwnership(ownership);
  if (JSON.stringify(nextOwnership) === JSON.stringify(ownership)) return { updated: false, fromKeyFacts };

  const nextProfile = { ...profile, ownership: nextOwnership };
  const patch = {
    slug: row.slug,
    name: nextProfile.name,
    legal_name: nextProfile.legalName,
    meta: buildMeta(nextProfile),
    initials: nextProfile.logoInitials,
    search_terms: nextProfile.searchTerms || profile.searchTerms || [],
    profile_json: nextProfile,
    updated_at: new Date().toISOString(),
  };

  const { error } = await getAdminClient().from("companies").upsert(patch, { onConflict: "slug" });
  if (error) throw error;
  return { updated: true, fromKeyFacts };
}

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const slugArg = process.argv.includes("--slug")
    ? process.argv[process.argv.indexOf("--slug") + 1]
    : null;

  if (slugArg) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", slugArg)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Not found:", slugArg);
      process.exit(1);
    }
    const r = await patchCompany(data);
    console.log(r.updated ? `Updated ${slugArg}` : `No ownership to enrich for ${slugArg}`);
    return;
  }

  let from = 0;
  let scanned = 0;
  let updated = 0;

  while (true) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .order("slug")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data?.length) break;

    for (const row of data) {
      scanned++;
      const r = await patchCompany(row);
      if (r.updated) {
        updated++;
        if (updated <= 5 || updated % 100 === 0) console.log(`  enriched ${row.slug}`);
      }
    }

    console.log(`… ${scanned} scanned, ${updated} enriched`);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  console.log(`\nDone. ${updated} companies with enriched ownership (${scanned} scanned).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
