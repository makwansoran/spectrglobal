/**
 * Sync Euronext market screeners → Supabase (+ companies table).
 */

const client = require("./client");
const { getMarket, listMarkets } = require("./markets");
const { parseListingRow, listingToCompanySeed } = require("./parse");
const { mergeEuronextIntoProfile } = require("./merge-canonical");
const store = require("./store");
const agentBrowser = require("./agent-browser");
const {
  upsertCompaniesBatchSupabase,
  upsertCompanySupabase,
  getCompanySupabase,
} = require("../supabase-store");
const { queryLooksLikeTicker, normalizeTicker } = require("../search-rank");
const { resolveCanonicalSlug } = require("../company-canonical");

let syncInFlight = null;

function marketTag(marketKey) {
  if (marketKey === "oslo") return "oslo";
  return marketKey;
}

async function seedFromListing(listing, pageHtml) {
  const canonical = resolveCanonicalSlug({
    ticker: listing.ticker,
    name: listing.name,
    legalName: listing.name,
  });

  if (canonical) {
    const existing = await getCompanySupabase(canonical);
    if (existing?.profile) {
      const profile = mergeEuronextIntoProfile(existing.profile, listing);
      const terms = new Set([
        ...(Array.isArray(existing.profile.searchTerms) ? existing.profile.searchTerms : []),
        listing.ticker.toLowerCase(),
        listing.isin.toLowerCase(),
        "euronext",
        marketTag(listing.marketKey || "oslo"),
      ]);
      return {
        slug: canonical,
        profile: { ...profile, id: canonical },
        mapGeojson: existing.mapGeojson ?? null,
        searchTerms: [...terms],
      };
    }
  }

  return listingToCompanySeed(listing, pageHtml);
}

async function syncMarketDirectory(marketKey, options = {}) {
  const market = getMarket(marketKey);
  if (!market) throw new Error(`Unknown market: ${marketKey}`);

  const useAgentBrowser = options.useAgentBrowser !== false;
  const scrapePages = Boolean(options.scrapePages);
  const maxPageScrapes = options.maxPageScrapes ?? 0;

  const directory = await client.fetchMarketListings(marketKey);
  const parsed =
    directory.format === "csv"
      ? directory.rows
      : directory.rows.map(parseListingRow).filter(Boolean);
  const total = directory.total;

  let marketHtml = null;
  let marketMethod = "http";
  if (useAgentBrowser && agentBrowser.isAvailable()) {
    const scraped = agentBrowser.scrapePageHtml(market.marketUrl, { extraWaitMs: 2000 });
    if (scraped.html) {
      marketHtml = scraped.html;
      marketMethod = "agent-browser";
    }
  }
  if (!marketHtml) {
    marketHtml = await client.fetchHtml(market.marketUrl);
  }

  await store.saveMarketSnapshot({
    marketKey: market.key,
    sourceUrl: market.marketUrl,
    payloadJson: {
      listingCount: parsed.length,
      totalReported: total,
      syncedAt: new Date().toISOString(),
      agentBrowser: agentBrowser.isAvailable(),
    },
    pageHtml: marketHtml,
    scrapeMethod: marketMethod,
  });

  const seeds = [];
  const listings = [];
  let scrapeCount = 0;

  for (const listing of parsed) {
    let pageHtml = null;
    if (scrapePages && scrapeCount < maxPageScrapes) {
      if (agentBrowser.isAvailable()) {
        const scraped = agentBrowser.scrapePageHtml(listing.productUrl, { extraWaitMs: 1500 });
        pageHtml = scraped.html;
        scrapeCount += 1;
      } else {
        pageHtml = await client.fetchHtml(listing.productUrl);
        scrapeCount += 1;
      }
    }

    const seed = await seedFromListing(listing, pageHtml);
    listings.push({
      ...listing,
      companySlug: seed.slug,
      pageHtml,
      pageScrapedAt: pageHtml ? new Date().toISOString() : null,
    });
    seeds.push(seed);
  }

  await store.upsertListings(listings);
  let companiesUpserted = 0;
  if (options.seedCompanies !== false) {
    await upsertCompaniesBatchSupabase(seeds);
    companiesUpserted = seeds.length;
  }

  return {
    ok: true,
    market: market.key,
    listings: listings.length,
    totalReported: total,
    companiesUpserted,
    seedCompanies: options.seedCompanies !== false,
    pageScrapes: scrapeCount,
    agentBrowser: agentBrowser.isAvailable(),
    marketScrapeMethod: marketMethod,
  };
}

/** @deprecated use syncMarketDirectory('oslo') */
async function syncOsloDirectory(options = {}) {
  return syncMarketDirectory("oslo", options);
}

async function syncAllEuronextMarkets(options = {}) {
  const markets = listMarkets({ includeOptional: options.includeOptional });
  const results = [];
  for (const m of markets) {
    results.push(await syncMarketDirectory(m.key, options));
  }
  const listings = results.reduce((n, r) => n + (r.listings || 0), 0);
  return { ok: true, markets: results.length, listings, results };
}

async function syncTickerFromDirectory(ticker, options = {}) {
  const t = normalizeTicker(ticker);
  if (!t) return { ok: false, reason: "empty_ticker" };

  const existing = await store.getListingByTicker(t);
  const staleMs = options.maxAgeMs ?? 6 * 60 * 60 * 1000;
  if (existing?.synced_at) {
    const age = Date.now() - new Date(existing.synced_at).getTime();
    if (age < staleMs && existing.company_slug) {
      return { ok: true, cached: true, slug: existing.company_slug, listing: existing };
    }
  }

  const directory = await client.fetchAllOsloListings();
  const listings =
    directory.format === "csv"
      ? directory.rows
      : directory.rows.map(parseListingRow).filter(Boolean);
  const match = listings.find((r) => r && normalizeTicker(r.ticker) === t);

  if (!match) {
    return { ok: false, reason: "not_found", ticker: t };
  }

  let pageHtml = null;
  if (options.scrapePage !== false) {
    if (agentBrowser.isAvailable()) {
      pageHtml = agentBrowser.scrapePageHtml(match.productUrl).html;
    } else {
      pageHtml = await client.fetchHtml(match.productUrl);
    }
  }

  const seed = await seedFromListing(match, pageHtml);
  const listing = {
    ...match,
    companySlug: seed.slug,
    pageHtml,
    pageScrapedAt: pageHtml ? new Date().toISOString() : null,
  };

  await store.upsertListings([listing]);
  await upsertCompanySupabase(seed);

  return { ok: true, cached: false, slug: seed.slug, listing, seed };
}

async function ensureOsloTickerSynced(query) {
  if (!queryLooksLikeTicker(query)) return null;
  if (syncInFlight) return syncInFlight;
  syncInFlight = syncTickerFromDirectory(query, { scrapePage: true })
    .catch((err) => ({ ok: false, error: err.message }))
    .finally(() => {
      syncInFlight = null;
    });
  return syncInFlight;
}

function listingToSearchResult(row) {
  const slug = row.company_slug || null;
  return {
    id: slug || `euronext-${row.isin}-${row.mic}`,
    kind: "company",
    name: row.name,
    legalName: row.name,
    meta: `${row.ticker} · ${row.market_label || "Oslo Børs"} · Euronext`,
    initials: row.ticker.slice(0, 2),
    url: slug ? `/company/${slug}` : row.product_url,
    terms: [row.ticker.toLowerCase(), row.name.toLowerCase()],
    ticker: row.ticker,
    source: "euronext",
    subtitle: `${row.ticker} · ${row.market_label || "Oslo Børs"}`,
    euronext: {
      isin: row.isin,
      mic: row.mic,
      lastPrice: row.last_price,
      dayChangePct: row.day_change_pct,
      productUrl: row.product_url,
    },
  };
}

async function searchEuronext(query, limit = 10) {
  const rows = await store.searchListings(query, limit);
  return rows.map(listingToSearchResult);
}

module.exports = {
  syncMarketDirectory,
  syncOsloDirectory,
  syncAllEuronextMarkets,
  syncTickerFromDirectory,
  ensureOsloTickerSynced,
  searchEuronext,
  listingToSearchResult,
};
