/**
 * Build data/aker-asa/holdings.json from scraped akerasa.com/investment page.
 * Run: node scripts/parse-aker-investments.js  (requires tmp-aker-investment.html)
 *      node scripts/build-aker-holdings.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SLUG_BY_NAME = {
  "Aker BP": "aker-bp-asa-akrbp",
  "Aker Solutions": "aker-solutions-asa-akso",
  "Aker BioMarine": "aker-biomarine-asa-akbm",
  Akastor: "akastor-asa-akast",
};

function parseOwnership(s) {
  const m = String(s || "").match(/([\d.]+)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

function parseTicker(s) {
  const t = String(s || "").trim();
  if (!t) return { exchange: "", ticker: "" };
  const parts = t.split(",").map((p) => p.trim());
  if (parts.length >= 2) return { exchange: parts[0], ticker: parts[parts.length - 1] };
  return { exchange: "", ticker: t };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function main() {
  const htmlPath = path.join(__dirname, "../tmp-aker-investment.html");
  if (!fs.existsSync(htmlPath)) {
    console.error("Missing tmp-aker-investment.html — fetch https://www.akerasa.com/investment first.");
    process.exit(1);
  }
  const raw = execSync(`node "${path.join(__dirname, "parse-aker-investments.js")}"`, {
    encoding: "utf8",
  });
  const { listed, unlisted } = JSON.parse(raw);
  const all = [...listed, ...unlisted];

  const holdings = all.map((item) => {
    const name = item.name.trim();
    const { exchange, ticker } = parseTicker(item.ticker);
    let logoUrl = item.logoUrl;
    if (!logoUrl && name === "Aker Qrill Company") {
      logoUrl =
        "https://www.akerasa.com/~/media/Images/A/aker-corp/templates/custom-board-of-directors/black-images/Aker%20Qrill%20CB.png";
    }
    return {
      slug: SLUG_BY_NAME[name] || `aker-holding-${slugify(name)}`,
      name,
      listing: item.listing,
      sector: item.sector || item.category,
      category: item.category || undefined,
      ownershipPercent: parseOwnership(item.ownership),
      ownershipLabel: item.ownership,
      assetShare: item.assetShare || undefined,
      exchange: exchange || undefined,
      ticker: ticker || undefined,
      tagline: item.tagline || undefined,
      description: item.description || undefined,
      chair: item.chair || undefined,
      ceo: item.ceo || undefined,
      website: item.website?.trim() || undefined,
      logoUrl: logoUrl || undefined,
      companySlug: SLUG_BY_NAME[name] || undefined,
    };
  });

  const out = {
    investorSlug: "aker-asa-aker",
    kind: "industrial",
    asOf: "Q1 2026",
    source: "https://www.akerasa.com/investment",
    listedCount: listed.length,
    unlistedCount: unlisted.length,
    holdings,
  };

  const outDir = path.join(__dirname, "../data/aker-asa");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "holdings.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${holdings.length} holdings to ${outPath}`);
}

main();
