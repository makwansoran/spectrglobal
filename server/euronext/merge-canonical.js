/**
 * Merge Euronext listing fields into an existing curated company profile.
 */
const { resolveCanonicalSlug } = require("../company-canonical");

function mergeEuronextIntoProfile(profile, listing) {
  const base = { ...profile };
  const now = new Date().toISOString();
  const euronext = {
    isin: listing.isin,
    mic: listing.mic,
    productPath: listing.productPath,
    productUrl: listing.productUrl,
    lastPrice: listing.lastPrice,
    dayChangePct: listing.dayChangePct,
    lastTradeLabel: listing.lastTradeLabel,
    syncedAt: now,
  };

  const stock = { ...(base.stock || {}) };
  if (listing.ticker) stock.ticker = listing.ticker;
  if (listing.marketLabel) stock.exchange = listing.marketLabel;
  if (listing.lastPrice != null) stock.price = listing.lastPrice;
  if (listing.dayChangePct != null) stock.changePercent = listing.dayChangePct;
  if (listing.currency) stock.currency = listing.currency;

  return {
    ...base,
    stock,
    euronext,
    lastUpdated: now,
  };
}

function shouldSkipNewCompanySeed(listing) {
  return Boolean(
    resolveCanonicalSlug({
      ticker: listing.ticker,
      name: listing.name,
      legalName: listing.name,
    })
  );
}

module.exports = {
  mergeEuronextIntoProfile,
  shouldSkipNewCompanySeed,
};
