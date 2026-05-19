/**
 * HTTP handlers for /api/euronext/*
 */

const sync = require("./euronext/sync");
const store = require("./euronext/store");
const client = require("./euronext/client");
const agentBrowser = require("./euronext/agent-browser");
const { authorizeDatafeedSync } = require("./datafeed/auth");
const orchestrator = require("./datafeed/orchestrator");

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (chunk) => {
      buf += chunk;
    });
    req.on("end", () => {
      try {
        resolve(buf ? JSON.parse(buf) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

async function handleEuronextApi(req, res, pathname, sendJson) {
  if (pathname === "/api/euronext/status" && req.method === "GET") {
    const latest = await store.getLatestMarketSnapshot("oslo");
    sendJson(res, 200, {
      agentBrowser: agentBrowser.isAvailable(),
      osloMarketUrl: client.OSLO_MARKET_URL,
      lastSnapshot: latest
        ? { id: latest.id, scrapedAt: latest.scraped_at, method: latest.scrape_method }
        : null,
    });
    return true;
  }

  if (pathname === "/api/euronext/oslo" && req.method === "GET") {
    const latest = await store.getLatestMarketSnapshot("oslo");
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const listings = await store.searchListings(url.searchParams.get("q") || "", 50);
    sendJson(res, 200, {
      market: {
        url: client.OSLO_MARKET_URL,
        snapshot: latest,
      },
      listings,
    });
    return true;
  }

  const searchMatch = pathname.match(/^\/api\/euronext\/search$/);
  if (searchMatch && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const q = url.searchParams.get("q") || "";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "15", 10) || 15, 30);
    let results = await sync.searchEuronext(q, limit);

    if (q.trim() && results.length === 0) {
      await sync.ensureOsloTickerSynced(q);
      results = await sync.searchEuronext(q, limit);
    }

    sendJson(res, 200, { query: q, results });
    return true;
  }

  const instrumentMatch = pathname.match(/^\/api\/euronext\/instrument\/([^/]+)$/);
  if (instrumentMatch && req.method === "GET") {
    const raw = decodeURIComponent(instrumentMatch[1]);
    const dash = raw.lastIndexOf("-");
    const isin = dash > 0 ? raw.slice(0, dash) : raw;
    const mic = dash > 0 ? raw.slice(dash + 1) : "XOSL";
    const rows = await require("./supabase-rest").restGet("euronext_listings", {
      select: "*",
      isin: `eq.${isin}`,
      mic: `eq.${mic || "XOSL"}`,
      limit: "1",
    });
    if (!rows?.[0]) {
      sendJson(res, 404, { error: "Instrument not found" });
      return true;
    }
    sendJson(res, 200, rows[0]);
    return true;
  }

  if (pathname === "/api/euronext/sync" && (req.method === "POST" || req.method === "GET")) {
    if (!authorizeDatafeedSync(req)) {
      sendJson(res, 401, { error: "Unauthorized" });
      return true;
    }

    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const body =
      req.method === "GET"
        ? {
            ticker: url.searchParams.get("ticker"),
            scrapePages: url.searchParams.get("scrapePages") === "1",
            maxPageScrapes: parseInt(url.searchParams.get("maxPageScrapes") || "0", 10) || 0,
            markets: url.searchParams.get("markets"),
          }
        : await readJsonBody(req);

    const ticker = body.ticker || body.symbol;
    if (ticker) {
      const result = await sync.syncTickerFromDirectory(ticker, {
        scrapePage: body.scrapePage !== false,
      });
      sendJson(res, result.ok ? 200 : 404, result);
      return true;
    }

    const marketKeys = body.markets ? String(body.markets).split(",") : ["oslo"];
    if (marketKeys.length === 1) {
      const result = await sync.syncMarketDirectory(marketKeys[0], {
        useAgentBrowser: body.useAgentBrowser !== false,
        scrapePages: Boolean(body.scrapePages),
        maxPageScrapes: body.maxPageScrapes ?? 0,
      });
      sendJson(res, 200, result);
      return true;
    }

    const result = await orchestrator.runDatafeed({
      sources: ["euronext"],
      euronextMarkets: marketKeys,
      scrapePages: Boolean(body.scrapePages),
      maxPageScrapes: body.maxPageScrapes ?? 0,
      useAgentBrowser: body.useAgentBrowser !== false,
    });
    sendJson(res, 200, result);
    return true;
  }

  return false;
}

module.exports = { handleEuronextApi };
