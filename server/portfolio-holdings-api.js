/**
 * GET /api/portfolio/holdings — paginated NBIM holdings index.
 */
const fs = require("fs");
const path = require("path");

const HOLDINGS_PATH = path.join(__dirname, "..", "data", "norges-bank", "holdings-20251231.json");

let cache = null;

function loadHoldings() {
  if (cache) return cache;
  if (!fs.existsSync(HOLDINGS_PATH)) return null;
  cache = JSON.parse(fs.readFileSync(HOLDINGS_PATH, "utf8"));
  return cache;
}

function parseSort(sort) {
  if (sort === "name") return "name";
  if (sort === "ownership") return "ownershipPercent";
  if (sort === "country") return "listingCountry";
  if (sort === "industry") return "industry";
  return "marketValueUsd";
}

function handlePortfolioHoldings(req, url) {
  if (req.method !== "GET") return { status: 405, body: { error: "Method not allowed" } };

  const investor = String(url.searchParams.get("investor") || "norges-bank").trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get("limit") || "50", 10) || 50));
  const q = String(url.searchParams.get("q") || "")
    .trim()
    .toLowerCase();
  const sortKey = parseSort(String(url.searchParams.get("sort") || "value"));
  const order = url.searchParams.get("order") === "asc" ? 1 : -1;

  const data = loadHoldings();
  if (!data || data.investorSlug !== investor) {
    return { status: 404, body: { error: "Portfolio holdings file not found", investor } };
  }

  let rows = data.holdings || [];

  if (q) {
    rows = rows.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.slug.includes(q) ||
        h.listingCountry.toLowerCase().includes(q) ||
        h.industry.toLowerCase().includes(q) ||
        (h.region && h.region.toLowerCase().includes(q))
    );
  }

  rows = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * order;
    return String(av).localeCompare(String(bv)) * order;
  });

  const total = rows.length;
  const start = (page - 1) * limit;
  const items = rows.slice(start, start + limit);

  return {
    status: 200,
    headers: { "Cache-Control": "public, max-age=300" },
    body: {
      investorSlug: data.investorSlug,
      asOf: data.asOf,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
      items,
    },
  };
}

module.exports = { handlePortfolioHoldings };
