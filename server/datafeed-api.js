/**
 * HTTP handlers for /api/datafeed/*
 */

const { authorizeDatafeedSync } = require("./datafeed/auth");
const orchestrator = require("./datafeed/orchestrator");
const euronextSync = require("./euronext/sync");
const agentBrowser = require("./euronext/agent-browser");
const { isVercel, defaultsForDatafeedRun } = require("./datafeed/vercel");

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

function parseSyncOptions(url, body, method) {
  const q = url.searchParams;
  const fromQuery =
    method === "GET"
      ? {
          sources: q.get("sources")?.split(",").filter(Boolean),
          euronextMarkets: q.get("markets") === "oslo-only" ? "oslo-only" : q.get("markets")?.split(","),
          scrapePages: q.get("scrapePages") === "1",
          maxPageScrapes: parseInt(q.get("maxPageScrapes") || "0", 10) || 0,
          finnhubQuoteLimit: parseInt(q.get("finnhubLimit") || "100", 10) || 100,
          useAgentBrowser: q.get("useAgentBrowser") !== "0",
        }
      : {};

  const vercelDefaults = defaultsForDatafeedRun();
  return {
    sources: body.sources || fromQuery.sources || ["euronext", "finnhub"],
    euronextMarkets: body.euronextMarkets || body.markets || fromQuery.euronextMarkets,
    scrapePages: body.scrapePages ?? fromQuery.scrapePages ?? vercelDefaults.scrapePages,
    maxPageScrapes: body.maxPageScrapes ?? fromQuery.maxPageScrapes ?? vercelDefaults.maxPageScrapes ?? 0,
    finnhubQuoteLimit:
      body.finnhubQuoteLimit ?? fromQuery.finnhubQuoteLimit ?? vercelDefaults.finnhubQuoteLimit ?? 100,
    useAgentBrowser:
      body.useAgentBrowser ?? fromQuery.useAgentBrowser ?? vercelDefaults.useAgentBrowser,
  };
}

async function handleDatafeedApi(req, res, pathname, sendJson) {
  if (pathname === "/api/datafeed/status" && req.method === "GET") {
    const status = await orchestrator.getDatafeedStatus();
    sendJson(res, 200, {
      ...status,
      vercel: {
        runtime: isVercel(),
        cronConfigured: Boolean(process.env.CRON_SECRET || process.env.VERCEL === "1"),
        cronHint:
          "Set CRON_SECRET in Vercel → Settings → Environment Variables. Cron hits /api/datafeed/sync automatically.",
      },
    });
    return true;
  }

  if (pathname === "/api/datafeed/sync" && (req.method === "POST" || req.method === "GET")) {
    if (!authorizeDatafeedSync(req)) {
      sendJson(res, 401, {
        error: "Unauthorized",
        hint: "Set CRON_SECRET in Vercel and pass Authorization: Bearer <secret>, or x-spectr-sync-secret",
      });
      return true;
    }

    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const body = req.method === "GET" ? {} : await readJsonBody(req);
    const ticker = body.ticker || url.searchParams.get("ticker");

    if (ticker) {
      const result = await euronextSync.syncTickerFromDirectory(ticker, {
        scrapePage: body.scrapePage !== false,
      });
      sendJson(res, result.ok ? 200 : 404, result);
      return true;
    }

    const options = parseSyncOptions(url, body, req.method);
    const result = await orchestrator.runDatafeed(options);
    sendJson(res, 200, result);
    return true;
  }

  if (pathname === "/api/datafeed/agent" && req.method === "GET") {
    sendJson(res, 200, {
      available: agentBrowser.isAvailable(),
      install: "npm install agent-browser && npx agent-browser install",
      note: "Use GitHub Actions workflow datafeed-sync.yml for scheduled agent-browser scrapes",
    });
    return true;
  }

  return false;
}

module.exports = { handleDatafeedApi };
