/**
 * Site-wide market news (landing + newsroom) via Finnhub market news API.
 */
const finnhub = require("./finnhub");

async function getSiteNews({ limit = 20 } = {}) {
  const cap = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 50);

  if (!finnhub.isEnabled()) {
    return {
      news: [],
      source: "unavailable",
      message: "Market news requires FINNHUB_API_KEY.",
    };
  }

  const news = await finnhub.fetchMarketNewsFeed({ limit: cap });
  return {
    news,
    source: "finnhub",
    count: news.length,
  };
}

module.exports = { getSiteNews };
