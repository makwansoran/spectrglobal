/**
 * Run full market datafeed locally or in CI (Euronext screeners + Finnhub quotes).
 *
 *   node scripts/sync-datafeed.js
 *   node scripts/sync-datafeed.js --markets oslo,paris
 *   node scripts/sync-datafeed.js --scrape-pages --max 20
 *   node scripts/sync-datafeed.js --sources euronext
 */
const { loadEnv } = require("./load-env");
loadEnv();

const orchestrator = require("../server/datafeed/orchestrator");
const agentBrowser = require("../server/euronext/agent-browser");

function argFlag(name) {
  return process.argv.includes(name);
}

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

async function main() {
  const marketsArg = argValue("--markets", null);
  const sourcesArg = argValue("--sources", "euronext,finnhub");

  console.log("agent-browser:", agentBrowser.isAvailable() ? "yes" : "no (HTTP/CSV only)");
  console.log("markets:", marketsArg || "all Euronext screeners");

  const result = await orchestrator.runDatafeed({
    sources: sourcesArg.split(",").map((s) => s.trim()).filter(Boolean),
    euronextMarkets: marketsArg ? marketsArg.split(",").map((s) => s.trim()) : null,
    scrapePages: argFlag("--scrape-pages"),
    maxPageScrapes: parseInt(argValue("--max", "0"), 10) || 0,
    useAgentBrowser: !argFlag("--no-agent-browser"),
    finnhubQuoteLimit: parseInt(argValue("--finnhub-limit", "150"), 10) || 150,
    includeOptional: argFlag("--include-optional"),
  });

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
