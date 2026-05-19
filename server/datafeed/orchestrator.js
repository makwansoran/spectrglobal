/**
 * Multi-source market datafeed orchestrator.
 * Euronext screeners (CSV) + Finnhub quote refresh + optional agent-browser on workers.
 */

const { listMarkets } = require("../euronext/markets");
const euronextSync = require("../euronext/sync");
const agentBrowser = require("../euronext/agent-browser");
const { refreshFinnhubQuotes } = require("./sources/finnhub-quotes");
const runLog = require("./run-log");
const { isVercel, defaultsForMarket, defaultsForDatafeedRun } = require("./vercel");

async function syncEuronextMarkets(marketKeys, options = {}) {
  const all = listMarkets({ includeOptional: options.includeOptional });
  const keys = marketKeys?.length ? marketKeys : all.map((m) => m.key);
  const results = [];

  for (const key of keys) {
    const run = await runLog.startRun(`euronext:${key}`, { market: key });
    const marketOpts = { ...defaultsForMarket(key), ...options };
    try {
      const result = await euronextSync.syncMarketDirectory(key, marketOpts);
      await runLog.finishRun(run.id, { status: "success", stats: result });
      results.push({ market: key, ...result });
    } catch (err) {
      await runLog.finishRun(run.id, {
        status: "error",
        errorMessage: err.message,
        stats: {},
      });
      results.push({ market: key, ok: false, error: err.message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  return {
    ok: ok === results.length,
    markets: results.length,
    marketsOk: ok,
    results,
  };
}

async function runDatafeed(options = {}) {
  const sources = options.sources || ["euronext", "finnhub"];
  const startedAt = new Date().toISOString();
  const out = { ok: true, startedAt, sources: {} };

  const vercelDefaults = defaultsForDatafeedRun();
  const euronextOpts = {
    ...vercelDefaults,
    useAgentBrowser: options.useAgentBrowser ?? vercelDefaults.useAgentBrowser,
    scrapePages: options.scrapePages ?? vercelDefaults.scrapePages,
    maxPageScrapes: options.maxPageScrapes ?? vercelDefaults.maxPageScrapes ?? 0,
    includeOptional: Boolean(options.includeOptional),
  };

  if (sources.includes("euronext")) {
    const run = await runLog.startRun("euronext:all", {
      markets: options.euronextMarkets || "all",
      scrapePages: euronextOpts.scrapePages,
    });
    try {
      const marketKeys =
        options.euronextMarkets === "oslo-only"
          ? ["oslo"]
          : Array.isArray(options.euronextMarkets)
            ? options.euronextMarkets
            : null;
      const euronext = await syncEuronextMarkets(marketKeys, euronextOpts);
      out.sources.euronext = euronext;
      await runLog.finishRun(run.id, { status: euronext.ok ? "success" : "partial", stats: euronext });
      if (!euronext.ok) out.ok = false;
    } catch (err) {
      await runLog.finishRun(run.id, { status: "error", errorMessage: err.message });
      out.sources.euronext = { ok: false, error: err.message };
      out.ok = false;
    }
  }

  if (sources.includes("finnhub")) {
    const run = await runLog.startRun("finnhub:quotes", { limit: options.finnhubQuoteLimit });
    try {
      const finnhub = await refreshFinnhubQuotes({
        limit: options.finnhubQuoteLimit ?? 100,
        prefix: options.finnhubPrefix ?? "us-",
      });
      out.sources.finnhub = finnhub;
      await runLog.finishRun(run.id, { status: finnhub.ok ? "success" : "skipped", stats: finnhub });
    } catch (err) {
      await runLog.finishRun(run.id, { status: "error", errorMessage: err.message });
      out.sources.finnhub = { ok: false, error: err.message };
    }
  }

  out.finishedAt = new Date().toISOString();
  out.agentBrowser = agentBrowser.isAvailable();
  out.runtime = process.env.VERCEL ? "vercel" : "node";
  return out;
}

async function getDatafeedStatus() {
  const [runs, listings, latestOslo] = await Promise.all([
    runLog.getRecentRuns(15),
    runLog.getListingCounts(),
    require("../euronext/store").getLatestMarketSnapshot("oslo"),
  ]);

  const lastSuccess = runs.find((r) => r.status === "success" || r.status === "partial");
  const lastError = runs.find((r) => r.status === "error");
  const snapshotAgeMs = latestOslo?.scraped_at
    ? Date.now() - new Date(latestOslo.scraped_at).getTime()
    : Infinity;
  const snapshotFresh = snapshotAgeMs < 24 * 60 * 60 * 1000;

  return {
    alive: Boolean(lastSuccess) || snapshotFresh,
    agentBrowser: agentBrowser.isAvailable(),
    runtime: process.env.VERCEL ? "vercel" : "node",
    hosting: isVercel()
      ? "vercel-cron (HTTP/CSV screeners — no local machine required)"
      : "node",
    note: isVercel()
      ? "Runs on Vercel Cron: Euronext CSV + Finnhub API. agent-browser needs a worker with Chrome (not Vercel)."
      : agentBrowser.isAvailable()
        ? "agent-browser available on this host"
        : "Install agent-browser for full HTML scrapes",
    listings,
    lastSuccess: lastSuccess
      ? { source: lastSuccess.source, at: lastSuccess.started_at, stats: lastSuccess.stats }
      : null,
    lastError: lastError
      ? { source: lastError.source, at: lastError.started_at, message: lastError.error_message }
      : null,
    osloSnapshot: latestOslo
      ? { scrapedAt: latestOslo.scraped_at, method: latestOslo.scrape_method }
      : null,
    recentRuns: runs,
    markets: listMarkets().map((m) => ({ key: m.key, url: m.marketUrl })),
    cronPath: "/api/datafeed/sync",
  };
}

module.exports = { runDatafeed, syncEuronextMarkets, getDatafeedStatus };
