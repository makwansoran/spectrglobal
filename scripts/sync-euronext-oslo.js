/**
 * Sync all Oslo Børs listings from Euronext Live into Supabase.
 *
 * Uses Euronext JSON gateway (fast). Optionally uses agent-browser for full HTML:
 *   npm install agent-browser && npx agent-browser install
 *
 * Run:
 *   node scripts/sync-euronext-oslo.js
 *   node scripts/sync-euronext-oslo.js --scrape-pages --max 5
 *   node scripts/sync-euronext-oslo.js --ticker EQNR
 */
const { loadEnv } = require("./load-env");
loadEnv();

const sync = require("../server/euronext/sync");
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
  const ticker = argValue("--ticker", null);
  const scrapePages = argFlag("--scrape-pages");
  const maxPageScrapes = parseInt(argValue("--max", "0"), 10) || 0;

  console.log("agent-browser:", agentBrowser.isAvailable() ? "yes" : "no (HTTP fallback)");

  if (ticker) {
    const result = await sync.syncTickerFromDirectory(ticker, { scrapePage: true });
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  }

  const result = await sync.syncOsloDirectory({
    useAgentBrowser: !argFlag("--no-agent-browser"),
    scrapePages,
    maxPageScrapes,
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
