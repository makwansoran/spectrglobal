/**
 * Rename Berkshire slug us-brk.b → us-brk-b (dots break some routers/caches).
 */
require("./load-env").loadEnv();

const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { normalizeCompanyProfile } = require("../server/normalize-profile");
const { buildMeta } = require("../server/local-store");

const OLD = "us-brk.b";
const NEW = "us-brk-b";

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const { data: oldRow, error } = await getAdminClient()
    .from("companies")
    .select("*")
    .eq("slug", OLD)
    .maybeSingle();
  if (error) throw error;

  if (!oldRow) {
    const { data: exists } = await getAdminClient().from("companies").select("slug").eq("slug", NEW).maybeSingle();
    console.log(exists ? `${NEW} already exists` : `No ${OLD} row to migrate`);
    return;
  }

  const profile = normalizeCompanyProfile({
    ...oldRow.profile_json,
    id: NEW,
    stock: oldRow.profile_json?.stock
      ? { ...oldRow.profile_json.stock, finnhubSymbol: "BRK.B" }
      : { ticker: "BRK.B", exchange: "NYSE", currency: "USD", finnhubSymbol: "BRK.B" },
  });

  const terms = Array.isArray(oldRow.search_terms) ? [...oldRow.search_terms] : [];
  if (!terms.includes(NEW)) terms.push(NEW);
  terms.push("us-brk.b", "BRK.B", "berkshire-hathaway");

  const row = {
    slug: NEW,
    name: oldRow.name || profile.name,
    legal_name: profile.legalName,
    meta: buildMeta(profile),
    initials: profile.logoInitials,
    search_terms: [...new Set(terms)],
    profile_json: profile,
    map_geojson: oldRow.map_geojson,
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await getAdminClient().from("companies").upsert(row, { onConflict: "slug" });
  if (upErr) throw upErr;

  const { error: delErr } = await getAdminClient().from("companies").delete().eq("slug", OLD);
  if (delErr) throw delErr;

  console.log(`Migrated ${OLD} → ${NEW}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
