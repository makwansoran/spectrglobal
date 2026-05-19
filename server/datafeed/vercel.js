/**
 * Defaults when running on Vercel (serverless cron / API).
 * - No Chrome / agent-browser
 * - Listings + quotes only (company profiles seeded on search for non-Oslo)
 */

function isVercel() {
  return process.env.VERCEL === "1";
}

function isVercelCronRequest(req) {
  return req?.headers?.["x-vercel-cron"] === "1";
}

function defaultsForMarket(marketKey) {
  if (!isVercel()) {
    return { useAgentBrowser: true, seedCompanies: true, scrapePages: false };
  }
  return {
    useAgentBrowser: false,
    scrapePages: false,
    maxPageScrapes: 0,
    // Oslo is our primary market — full company rows; others update listings first.
    seedCompanies: marketKey === "oslo",
  };
}

function defaultsForDatafeedRun() {
  if (!isVercel()) {
    return {
      useAgentBrowser: true,
      scrapePages: false,
      maxPageScrapes: 0,
    };
  }
  return {
    useAgentBrowser: false,
    scrapePages: false,
    maxPageScrapes: 0,
    finnhubQuoteLimit: 60,
  };
}

module.exports = { isVercel, isVercelCronRequest, defaultsForMarket, defaultsForDatafeedRun };
