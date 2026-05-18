/**
 * Fetch top institutional holders from Finnhub for US-listed companies missing ownership.
 * Requires FINNHUB_API_KEY (premium ownership endpoint on some plans).
 *
 *   node scripts/backfill-ownership-finnhub.js --limit 50
 *   node scripts/backfill-ownership-finnhub.js --slug us-nvda
 */
require("./load-env").loadEnv();

const finnhub = require("../server/finnhub");
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const { enrichOwnership } = require("../server/institutions");
const { buildMeta } = require("../server/local-store");

const RATE_MS = 1200;
const PAGE = 150;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseFinnhubOwnership(payload) {
  const rows = payload?.ownership || payload?.data || [];
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => {
      const name = row.name || row.investor || row.holder || "";
      const percent = Number(row.share ?? row.percent ?? row.value ?? 0);
      if (!name || !percent || percent <= 0) return null;
      const shares = row.shareHeld ?? row.shares ?? row.numberOfShares;
      const value = row.value ?? row.marketValue;
      let detail;
      if (shares && value) detail = `~${formatShares(shares)} · ~$${formatBillions(value)}`;
      else if (shares) detail = `~${formatShares(shares)} shares`;
      return { name: String(name).trim(), percent: Math.round(percent * 100) / 100, detail };
    })
    .filter(Boolean)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 12);
}

function formatShares(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  return String(Math.round(v));
}

function formatBillions(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  if (v >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  return String(Math.round(v));
}

function finnhubSymbolFromProfile(profile, slug) {
  const stock = profile?.stock;
  if (stock?.finnhubSymbol) return stock.finnhubSymbol;
  if (stock?.ticker) return stock.ticker.toUpperCase();
  if (slug?.startsWith("us-")) return slug.slice(3).toUpperCase();
  return null;
}

async function applyOwnership(row, shareholders) {
  if (!shareholders.length) return false;
  const profile = row.profile_json || {};
  const ownership = enrichOwnership({
    asOf: new Date().toISOString().slice(0, 7),
    note: "Top institutional holders via Finnhub.",
    shareholders,
  });
  const nextProfile = { ...profile, ownership };
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
  return true;
}

async function main() {
  if (!finnhub.isEnabled()) {
    console.error("Set FINNHUB_API_KEY in .env");
    process.exit(1);
  }
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

  let query = getAdminClient().from("companies").select("slug, profile_json").order("slug");
  if (slugArg) query = query.eq("slug", slugArg);
  else query = query.like("slug", "us-%");

  const { data: rows, error } = await query;
  if (error) throw error;

  let candidates = (rows || []).filter((r) => {
    const p = r.profile_json;
    if (p?.ownership?.shareholders?.length) return false;
    return Boolean(finnhubSymbolFromProfile(p, r.slug));
  });

  if (limit > 0) candidates = candidates.slice(0, limit);
  console.log(`Fetching ownership for ${candidates.length} companies…`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    const sym = finnhubSymbolFromProfile(row.profile_json, row.slug);
    if (i > 0) await sleep(RATE_MS);

    try {
      const raw = await finnhub.fetchInstitutionalOwnership(sym);
      const shareholders = parseFinnhubOwnership(raw);
      if (!shareholders.length) {
        fail++;
        continue;
      }
      await applyOwnership(row, shareholders);
      ok++;
      console.log(`  ${row.slug} (${sym}): ${shareholders.length} holders`);
    } catch (err) {
      fail++;
      if (i < 3) console.warn(`  ${row.slug}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${ok} updated, ${fail} skipped/failed.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
