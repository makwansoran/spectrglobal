/**
 * Live stock quotes via Finnhub /quote.
 */
const { getCompanyRaw } = require("./store");
const finnhub = require("./finnhub");

function applyQuoteToStock(stock, quote) {
  if (!stock) return stock;
  if (!quote || quote.price == null || quote.price <= 0) return stock;

  return {
    ...stock,
    price: quote.price,
    change: quote.change ?? stock.change ?? null,
    changePercent: quote.changePercent ?? stock.changePercent ?? null,
    finnhubSymbol: quote.symbol || stock.finnhubSymbol,
    quoteAsOf: quote.asOf || new Date().toISOString(),
  };
}

async function fetchLiveQuoteForProfile(profile) {
  if (!profile?.stock?.ticker || !finnhub.isEnabled()) return null;

  const quote = await finnhub.fetchQuoteWithFallback(
    profile.stock.ticker,
    profile.stock.exchange,
    profile.countryCode,
    profile.stock.finnhubSymbol || null
  );

  if (!quote?.price) return null;
  return quote;
}

async function getCompanyQuote(slug) {
  const company = await getCompanyRaw(slug);
  if (!company?.profile) return null;

  const profile = company.profile;
  const stored = profile.stock || null;
  const live = await fetchLiveQuoteForProfile(profile);

  if (!stored && !live) return null;

  const stock = applyQuoteToStock(stored, live);

  return {
    slug,
    ticker: stock?.ticker || null,
    stock,
    quote: live,
    source: live ? "finnhub" : "profile",
    asOf: live?.asOf || stock?.quoteAsOf || null,
  };
}

/** Persist-friendly stock block for profile_json. */
function stockWithQuote(profile) {
  const live = null; // caller passes quote from fetchLiveQuoteForProfile
  return profile.stock;
}

module.exports = {
  applyQuoteToStock,
  fetchLiveQuoteForProfile,
  getCompanyQuote,
  stockWithQuote,
};
