/**
 * Refresh live quotes for companies via Finnhub (batched, time-capped).
 */

const { getAdminClient, hasSupabaseWrites } = require("../../supabase-client");
const { fetchLiveQuoteForProfile, applyQuoteToStock } = require("../../company-quote");
const { isEnabled } = require("../../finnhub");

const DELAY_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function refreshFinnhubQuotes(options = {}) {
  if (!isEnabled()) {
    return { ok: false, skipped: true, reason: "FINNHUB_API_KEY not set" };
  }
  if (!hasSupabaseWrites()) {
    return { ok: false, skipped: true, reason: "SUPABASE_SERVICE_ROLE_KEY required" };
  }

  const limit = Math.min(options.limit ?? 120, 500);
  const maxAgeMs = options.maxAgeMs ?? 6 * 60 * 60 * 1000;
  const prefix = options.prefix ?? null;

  let query = getAdminClient()
    .from("companies")
    .select("slug, profile_json")
    .not("profile_json->stock->>ticker", "is", null)
    .limit(limit);

  if (prefix) query = query.like("slug", `${prefix}%`);

  const { data: rows, error } = await query;
  if (error) throw error;

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows || []) {
    const profile = row.profile_json;
    const stock = profile?.stock;
    if (stock?.quoteAsOf) {
      const age = Date.now() - new Date(stock.quoteAsOf).getTime();
      if (age >= 0 && age < maxAgeMs && stock.price > 0) {
        skipped += 1;
        continue;
      }
    }

    try {
      const quote = await fetchLiveQuoteForProfile(profile);
      if (!quote) {
        skipped += 1;
        continue;
      }
      const next = applyQuoteToStock(profile, quote);
      const { error: upErr } = await getAdminClient()
        .from("companies")
        .update({ profile_json: next, updated_at: new Date().toISOString() })
        .eq("slug", row.slug);
      if (upErr) throw upErr;
      updated += 1;
    } catch (err) {
      failed += 1;
      console.warn(`[datafeed:finnhub] ${row.slug}:`, err.message);
    }

    await sleep(DELAY_MS);
  }

  return { ok: true, scanned: (rows || []).length, updated, skipped, failed };
}

module.exports = { refreshFinnhubQuotes };
