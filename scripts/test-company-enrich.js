/**
 * Smoke tests for company enrichment modules.
 * Usage: node scripts/test-company-enrich.js
 */
require("./load-env").loadEnv();

const { fetchEdgarFilings } = require("../server/sec-edgar");
const { fetchIrFilingsFromWebsite } = require("../server/company-scrape");
const { enrichCompany } = require("../server/company-enrich");

async function testSecEdgar() {
  const rows = await fetchEdgarFilings("AAPL", 5);
  if (!rows.length) throw new Error("SEC EDGAR returned no filings for AAPL");
  console.log("OK sec-edgar AAPL:", rows.length, "filings, first:", rows[0].type);
}

async function testIrScrape() {
  const rows = await fetchIrFilingsFromWebsite(
    "https://www.equinor.com",
    "Equinor"
  );
  console.log("IR scrape equinor.com:", rows.length, "links");
  if (!rows.length) console.warn("WARN: no IR links (network or page structure)");
  else console.log("  sample:", rows[0].title?.slice(0, 60));
}

async function testEnrichSlug() {
  const slug = process.env.TEST_ENRICH_SLUG;
  if (!slug) {
    console.log("SKIP enrichCompany (set TEST_ENRICH_SLUG to run)");
    return;
  }
  const result = await enrichCompany(slug, { force: true });
  console.log("enrichCompany", slug, result);
}

async function main() {
  await testSecEdgar();
  await testIrScrape();
  await testEnrichSlug();
  console.log("All enrichment smoke tests finished.");
}

main().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
