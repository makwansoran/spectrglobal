/**
 * Backfill top institutional holders from Nasdaq for US-listed companies.
 *
 *   node scripts/backfill-ownership-nasdaq.js --limit 100
 *   node scripts/backfill-ownership-nasdaq.js --slug us-nvda
 *   node scripts/backfill-ownership-nasdaq.js --force --limit 50
 */
require("./load-env").loadEnv();

const { fetchNasdaqInstitutionalHoldings } = require("../server/nasdaq-ownership");
const { enrichOwnership } = require("../server/institutions");
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { buildMeta } = require("../server/local-store");

const RATE_MS = 450;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function tickerFromProfile(profile, slug) {
  const stock = profile?.stock;
  if (stock?.ticker) return String(stock.ticker).toUpperCase();
  if (slug?.startsWith("us-")) return slug.slice(3).toUpperCase();
  return null;
}

async function applyOwnership(row, ownership) {
  const profile = row.profile_json || {};
  const nextProfile = {
    ...profile,
    ownership: enrichOwnership(ownership),
  };
  const patch = {
    slug: row.slug,
    name: nextProfile.name,
    legal_name: nextProfile.legalName,
    meta: buildMeta(nextProfile),
    initials: nextProfile.logoInitials,
    search_terms: profile.searchTerms || nextProfile.searchTerms || [],
    profile_json: nextProfile,
    updated_at: new Date().toISOString(),
  };
  const { error } = await getAdminClient().from("companies").upsert(patch, { onConflict: "slug" });
  if (error) throw error;
}

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const limit = process.argv.includes("--limit")
    ? parseInt(process.argv[process.argv.indexOf("--limit") + 1], 10) || 0
    : 0;
  const slugArg = process.argv.includes("--slug")
    ? process.argv[process.argv.indexOf("--slug") + 1]
    : null;
  const force = process.argv.includes("--force");

  const candidates = [];

  if (slugArg) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", slugArg)
      .maybeSingle();
    if (error) throw error;
    if (data) candidates.push(data);
  } else {
    const PAGE = 200;
    let from = 0;
    while (candidates.length < (limit || Infinity)) {
      const { data: rows, error } = await getAdminClient()
        .from("companies")
        .select("slug, profile_json")
        .like("slug", "us-%")
        .order("slug")
        .range(from, from + PAGE - 1);
      if (error) throw error;
      if (!rows?.length) break;

      for (const row of rows) {
        const p = row.profile_json;
        if (!p?.isPublic) continue;
        if (!force && p?.ownership?.shareholders?.length) continue;
        if (!tickerFromProfile(p, row.slug)) continue;
        candidates.push(row);
        if (limit > 0 && candidates.length >= limit) break;
      }

      if (limit > 0 && candidates.length >= limit) break;
      if (rows.length < PAGE) break;
      from += PAGE;
    }
  }

  console.log(`Nasdaq ownership backfill for ${candidates.length} companies…`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    const sym = tickerFromProfile(row.profile_json, row.slug);
    if (i > 0) await sleep(RATE_MS);

    try {
      const ownership = await fetchNasdaqInstitutionalHoldings(sym);
      if (!ownership?.shareholders?.length) {
        fail++;
        continue;
      }
      await applyOwnership(row, ownership);
      ok++;
      if (ok <= 5 || ok % 50 === 0) {
        console.log(`  ${row.slug} (${sym}): ${ownership.shareholders.length} holders`);
      }
    } catch (err) {
      fail++;
      if (fail <= 3) console.warn(`  ${row.slug}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${ok} updated, ${fail} skipped/failed.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
