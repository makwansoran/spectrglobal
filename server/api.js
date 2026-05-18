const {
  listCompanies,
  searchCompanies,
  getCompany,
  getCompanyRaw,
  listPeople,
  getPerson,
} = require("./store");
const commoditiesStore = require("./commodities-store");
const finnhub = require("./finnhub");

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

async function handleApi(req, res, pathname) {
  try {
    if (pathname === "/api/companies" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await searchCompanies(q, limit));
      } else {
        sendJson(res, 200, await listCompanies({ limit: 500 }));
      }
      return true;
    }

    const marketMatch = pathname.match(/^\/api\/companies\/([^/]+)\/market$/);
    if (marketMatch && req.method === "GET") {
      const slug = decodeURIComponent(marketMatch[1]);
      if (!finnhub.isEnabled()) {
        sendJson(res, 503, { error: "Finnhub is not configured (set FINNHUB_API_KEY in .env)" });
        return true;
      }
      const raw = await getCompanyRaw(slug);
      if (!raw?.profile) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      const market = await finnhub.fetchCompanyMarket(raw.profile);
      sendJson(res, 200, market);
      return true;
    }

    const match = pathname.match(/^\/api\/companies\/([^/]+)$/);
    if (match && req.method === "GET") {
      const slug = decodeURIComponent(match[1]);
      const company = await getCompany(slug);
      if (!company) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      sendJson(res, 200, company);
      return true;
    }

    if (pathname === "/api/commodities" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await commoditiesStore.searchCommodities(q, limit));
      } else {
        sendJson(res, 200, commoditiesStore.loadLocalIndex().slice(0, limit));
      }
      return true;
    }

    const commodityMatch = pathname.match(/^\/api\/commodities\/([^/]+)$/);
    if (commodityMatch && req.method === "GET") {
      const slug = decodeURIComponent(commodityMatch[1]);
      const data = await commoditiesStore.getCommodity(slug);
      if (!data) {
        sendJson(res, 404, { error: "Commodity not found" });
        return true;
      }
      sendJson(res, 200, data);
      return true;
    }

    if (pathname === "/api/people" && req.method === "GET") {
      sendJson(res, 200, await listPeople());
      return true;
    }

    const personMatch = pathname.match(/^\/api\/people\/([^/]+)$/);
    if (personMatch && req.method === "GET") {
      const slug = decodeURIComponent(personMatch[1]);
      const profile = await getPerson(slug);
      if (!profile) {
        sendJson(res, 404, { error: "Person not found" });
        return true;
      }
      sendJson(res, 200, { profile });
      return true;
    }
  } catch (err) {
    console.error("API error:", err);
    sendJson(res, 500, { error: "Internal server error" });
    return true;
  }

  return false;
}

module.exports = { handleApi };
