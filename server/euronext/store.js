/**
 * Supabase persistence for Euronext listings and market snapshots.
 */

const { getAdminClient, hasSupabaseWrites } = require("../supabase-client");
const { restGet } = require("../supabase-rest");

function listingRow(listing) {
  return {
    isin: listing.isin,
    mic: listing.mic,
    ticker: listing.ticker,
    name: listing.name,
    market_label: listing.marketLabel || "",
    currency: listing.currency || "NOK",
    last_price: listing.lastPrice,
    day_change_pct: listing.dayChangePct,
    last_trade_label: listing.lastTradeLabel || null,
    product_path: listing.productPath,
    product_url: listing.productUrl,
    company_slug: listing.companySlug || null,
    raw_row: listing.rawRow || [],
    page_html: listing.pageHtml || null,
    page_scraped_at: listing.pageScrapedAt || null,
    synced_at: new Date().toISOString(),
  };
}

async function upsertListings(listings) {
  if (!hasSupabaseWrites()) throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  const rows = listings.map(listingRow);
  const { error } = await getAdminClient().from("euronext_listings").upsert(rows, {
    onConflict: "isin,mic",
  });
  if (error) throw error;
  return rows.length;
}

async function getListingByTicker(ticker) {
  const t = String(ticker || "")
    .trim()
    .toUpperCase();
  if (!t) return null;
  const rows = await restGet("euronext_listings", {
    select: "*",
    ticker: `eq.${t}`,
    limit: "5",
  });
  return rows?.[0] || null;
}

async function searchListings(query, limit = 10) {
  const q = String(query || "").trim();
  if (!q) return [];
  const star = `*${q.replace(/[%_,.()\\]/g, "")}*`;
  const [byTicker, byName] = await Promise.all([
    restGet("euronext_listings", {
      select: "isin,mic,ticker,name,market_label,last_price,day_change_pct,product_url,company_slug,synced_at",
      ticker: `ilike.${star}`,
      limit: String(limit),
    }).catch(() => []),
    restGet("euronext_listings", {
      select: "isin,mic,ticker,name,market_label,last_price,day_change_pct,product_url,company_slug,synced_at",
      name: `ilike.${star}`,
      limit: String(limit),
    }).catch(() => []),
  ]);
  const seen = new Set();
  const out = [];
  for (const row of [...(byTicker || []), ...(byName || [])]) {
    const key = `${row.isin}:${row.mic}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

async function saveMarketSnapshot({ marketKey, sourceUrl, payloadJson, pageHtml, scrapeMethod }) {
  if (!hasSupabaseWrites()) throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  const { data, error } = await getAdminClient()
    .from("euronext_market_snapshots")
    .insert({
      market_key: marketKey || "oslo",
      source_url: sourceUrl,
      payload_json: payloadJson || {},
      page_html: pageHtml ? pageHtml.slice(0, 800000) : null,
      scrape_method: scrapeMethod || "http",
    })
    .select("id, scraped_at")
    .single();
  if (error) throw error;
  return data;
}

async function getLatestMarketSnapshot(marketKey = "oslo") {
  const rows = await restGet("euronext_market_snapshots", {
    select: "id,market_key,source_url,payload_json,scraped_at,scrape_method",
    market_key: `eq.${marketKey}`,
    order: "scraped_at.desc",
    limit: "1",
  });
  return rows?.[0] || null;
}

async function updateListingPageHtml(isin, mic, pageHtml) {
  if (!hasSupabaseWrites()) return;
  await getAdminClient()
    .from("euronext_listings")
    .update({
      page_html: pageHtml ? pageHtml.slice(0, 800000) : null,
      page_scraped_at: new Date().toISOString(),
    })
    .eq("isin", isin)
    .eq("mic", mic);
}

module.exports = {
  upsertListings,
  getListingByTicker,
  searchListings,
  saveMarketSnapshot,
  getLatestMarketSnapshot,
  updateListingPageHtml,
};
