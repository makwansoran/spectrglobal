/**
 * Merge duplicate company rows (same legal name / cross-listing tickers).
 * Run: node scripts/build-canonical-registry.js && node scripts/merge-canonical-duplicates.js
 */
require("./load-env").loadEnv();

const { getAdminClient, hasSupabaseWrites } = require("../server/supabase-client");
const { upsertCompanySupabase } = require("../server/supabase-store");
const { mergeEuronextIntoProfile } = require("../server/euronext/merge-canonical");
const {
  normalizeCompanyName,
  normalizeTicker,
  pickCanonicalFromRows,
  resolveCanonicalSlug,
} = require("../server/company-canonical");

const PAGE = 500;

function collectTickers(row) {
  const profile = row.profile_json || {};
  const out = new Set();
  if (profile.stock?.ticker) out.add(normalizeTicker(profile.stock.ticker));
  const m = String(row.slug || "").match(/-([a-z0-9]{2,8})$/i);
  if (m) out.add(normalizeTicker(m[1]));
  if (row.slug?.startsWith("us-")) out.add(normalizeTicker(row.slug.slice(3)));
  return [...out].filter(Boolean);
}

async function fetchAllCompanies() {
  const client = getAdminClient();
  const all = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await client
      .from("companies")
      .select("slug,name,legal_name,profile_json,search_terms")
      .order("slug")
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data?.length) break;
    all.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

async function main() {
  if (!hasSupabaseWrites()) throw new Error("SUPABASE_SERVICE_ROLE_KEY required");

  const client = getAdminClient();
  const rows = await fetchAllCompanies();
  console.log(`Loaded ${rows.length} companies`);

  const groups = new Map();
  for (const row of rows) {
    const nameKey = normalizeCompanyName(row.name || row.legal_name);
    if (!nameKey || nameKey.length < 4) continue;
    const list = groups.get(nameKey) || [];
    list.push(row);
    groups.set(nameKey, list);
  }

  let mergedGroups = 0;
  let removed = 0;

  for (const [nameKey, group] of groups) {
    if (group.length < 2) continue;

    const canonicalSlug = pickCanonicalFromRows(group);
    const canonicalRow = group.find((r) => r.slug === canonicalSlug);
    if (!canonicalRow?.profile_json) continue;

    let profile = { ...canonicalRow.profile_json, id: canonicalSlug };
    const terms = new Set(canonicalRow.search_terms || []);
    terms.add(nameKey);
    terms.add(canonicalSlug);

    let changed = false;
    for (const dup of group) {
      if (dup.slug === canonicalSlug) continue;
      const explicit = resolveCanonicalSlug({
        ticker: collectTickers(dup)[0],
        name: dup.name,
        legalName: dup.legal_name,
        slug: dup.slug,
      });
      if (explicit && explicit !== canonicalSlug) continue;

      console.log(`  ${dup.slug} → ${canonicalSlug}`);
      changed = true;

      for (const t of collectTickers(dup)) terms.add(t.toLowerCase());
      terms.add(dup.slug);
      if (dup.profile_json?.euronext) {
        profile = mergeEuronextIntoProfile(profile, {
          ...dup.profile_json.euronext,
          ticker: dup.profile_json.stock?.ticker || collectTickers(dup)[0],
          marketLabel: dup.profile_json.stock?.exchange,
          currency: dup.profile_json.stock?.currency || "NOK",
        });
      }
      if (dup.profile_json?.logoUrl && !profile.logoUrl) profile.logoUrl = dup.profile_json.logoUrl;

      await client.from("euronext_listings").update({ company_slug: canonicalSlug }).eq("company_slug", dup.slug);
      const { error } = await client.from("companies").delete().eq("slug", dup.slug);
      if (error) console.warn(`    delete ${dup.slug}:`, error.message);
      else removed += 1;
    }

    if (changed) {
      mergedGroups += 1;
      await upsertCompanySupabase({
        slug: canonicalSlug,
        profile,
        mapGeojson: null,
        searchTerms: [...terms],
      });
    }
  }

  console.log(`Done. Merged ${mergedGroups} name groups, removed ${removed} duplicate rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
