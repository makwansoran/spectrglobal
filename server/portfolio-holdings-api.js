/**
 * GET /api/portfolio/holdings — paginated NBIM holdings index.
 */
const fs = require("fs");
const path = require("path");

const HOLDINGS_BY_INVESTOR = {
  "norges-bank": path.join(__dirname, "..", "data", "norges-bank", "holdings-20251231.json"),
  "aker-asa-aker": path.join(__dirname, "..", "data", "aker-asa", "holdings.json"),
};

const cache = new Map();

function loadHoldings(investorSlug) {
  const key = investorSlug || "norges-bank";
  if (cache.has(key)) return cache.get(key);
  const filePath = HOLDINGS_BY_INVESTOR[key];
  if (!filePath || !fs.existsSync(filePath)) return null;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  cache.set(key, data);
  return data;
}

function parseSort(sort, kind) {
  if (sort === "name") return "name";
  if (sort === "ownership") return "ownershipPercent";
  if (kind === "industrial") {
    if (sort === "industry") return "sector";
    return "ownershipPercent";
  }
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
  const data = loadHoldings(investor);
  const sortKey = parseSort(String(url.searchParams.get("sort") || "value"), data?.kind);
  const order = url.searchParams.get("order") === "asc" ? 1 : -1;
  if (!data || data.investorSlug !== investor) {
    return { status: 404, body: { error: "Portfolio holdings file not found", investor } };
  }

  let rows = data.holdings || [];

  if (data.kind === "industrial") {
    if (q) {
      rows = rows.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.slug.includes(q) ||
          (h.sector && h.sector.toLowerCase().includes(q)) ||
          (h.listing && h.listing.toLowerCase().includes(q)) ||
          (h.ticker && h.ticker.toLowerCase().includes(q))
      );
    }
    const industrialSort = sortKey === "ownershipPercent" ? "ownershipPercent" : sortKey === "name" ? "name" : "ownershipPercent";
    rows = [...rows].sort((a, b) => {
      const av = a[industrialSort];
      const bv = b[industrialSort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * order;
      return String(av ?? "").localeCompare(String(bv ?? "")) * order;
    });
  } else {
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
  }

  const total = rows.length;
  const start = (page - 1) * limit;
  const items = rows.slice(start, start + limit);

  return {
    status: 200,
    headers: { "Cache-Control": "public, max-age=300" },
    body: {
      investorSlug: data.investorSlug,
      kind: data.kind || "equity",
      asOf: data.asOf,
      listedCount: data.listedCount,
      unlistedCount: data.unlistedCount,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
      items,
    },
  };
}

module.exports = { handlePortfolioHoldings };
