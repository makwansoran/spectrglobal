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
const { hasSupabaseWrites, getSupabaseUrlSafe } = require("../server/supabase-client");

function argFlag(name) {
  return process.argv.includes(name);
}

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

function ensureSupabaseConfigured() {
  if (hasSupabaseWrites()) return;
  const url = getSupabaseUrlSafe();
  console.error(
    "Supabase writes are not configured.\n" +
      "Set SUPABASE_URL (https://YOUR_PROJECT.supabase.co) and SUPABASE_SERVICE_ROLE_KEY.\n" +
      (url ? `URL host looks set; missing or invalid service role key.` : `SUPABASE_URL is missing or invalid.`)
  );
  process.exit(1);
}

async function main() {
  ensureSupabaseConfigured();

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
  if (!result.ok) {
    const euronext = result.sources?.euronext;
    if (euronext?.results?.length) {
      for (const r of euronext.results) {
        if (!r.ok) console.error(`[euronext:${r.market}] ${r.error || "failed"}`);
      }
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
