const {
  listCompanies,
  searchUnified,
  searchPeople,
  getCompany,
  storageMode,
} = require("./store");
const { getCompanyNews } = require("./company-news");
const { getCompanyFinancials } = require("./company-financials");
const { getCompanyQuote } = require("./company-quote");
const { getCompanyFilings } = require("./company-filings");
const { enrichCompany } = require("./company-enrich");
const { getCompanyAssets } = require("./company-assets");
const commoditiesStore = require("./commodities-store");
const waterwaysStore = require("./waterways-store");
const { banks, investmentBanks, ventureCapital } = require("./catalog-stores");
const countriesStore = require("./supabase-countries-store");
const politiciansStore = require("./supabase-politicians-store");
const chatStore = require("./chat-store");
const { isSupabaseEnabled, getSupabaseUrl } = require("./supabase-client");
const { getInstitutionBySlug, ORG_TYPE_LABELS } = require("./institutions");
const { handlePortfolioHoldings } = require("./portfolio-holdings-api");
const { handleEuronextApi } = require("./euronext-api");
const { handleDatafeedApi } = require("./datafeed-api");
const { handleAuthApi } = require("./auth-api");
const { handleAdminApi } = require("./admin-api");
const { getSiteNews } = require("./site-news");

function sendJson(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Spectr-Storage": storageMode(),
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

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

function supabaseRequired(res) {
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, {
      error: "Supabase is not configured. Set SUPABASE_URL and keys in .env, then run supabase/schema.sql",
    });
    return false;
  }
  return true;
}

async function handleCatalogList(req, res, store) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const q = url.searchParams.get("q") || "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
  if (q.trim()) {
    sendJson(res, 200, await store.search(q, limit));
  } else {
    sendJson(res, 200, await store.list(limit));
  }
}

async function handleCatalogGet(res, store, slug) {
  const data = await store.get(slug);
  if (!data) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }
  sendJson(res, 200, data);
}

async function handleApi(req, res, pathname) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (pathname.startsWith("/api/auth")) {
      const handled = await handleAuthApi(req, res, pathname, { sendJson, readJsonBody });
      if (handled) return true;
    }

    if (pathname.startsWith("/api/admin")) {
      const handled = await handleAdminApi(req, res, pathname, { sendJson, readJsonBody });
      if (handled) return true;
    }

    if (pathname === "/api/news" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const limit = url.searchParams.get("limit") || "20";
      const data = await getSiteNews({ limit });
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=120" });
      return true;
    }

    if (pathname.startsWith("/api/datafeed")) {
      if (!supabaseRequired(res)) return true;
      const handled = await handleDatafeedApi(req, res, pathname, sendJson);
      if (handled) return true;
    }

    if (pathname.startsWith("/api/euronext")) {
      if (!supabaseRequired(res)) return true;
      const handled = await handleEuronextApi(req, res, pathname, sendJson);
      if (handled) return true;
    }

    if (!supabaseRequired(res)) return true;

    if (pathname === "/api/companies" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        let results = [];
        try {
          results = await searchUnified(q, limit);
        } catch (err) {
          console.error("[searchUnified]", err.message);
          sendJson(res, 500, { error: "Search failed", message: err.message });
          return true;
        }
        sendJson(res, 200, results, { "X-Spectr-Source": "supabase:unified" });
      } else {
        sendJson(res, 200, await listCompanies({ limit }), { "X-Spectr-Source": "supabase:companies" });
      }
      return true;
    }

    const marketMatch = pathname.match(/^\/api\/companies\/([^/]+)\/market$/);
    if (marketMatch && req.method === "GET") {
      const slug = decodeURIComponent(marketMatch[1]);
      const data = await getCompanyQuote(slug);
      if (!data?.stock) {
        sendJson(res, 404, { error: "No quote available" });
        return true;
      }
      const { stock, quote, asOf } = data;
      sendJson(
        res,
        200,
        {
          symbol: quote?.symbol || stock.finnhubSymbol || stock.ticker,
          ticker: stock.ticker,
          currency: stock.currency || "USD",
          quote: quote || {
            symbol: stock.ticker,
            price: stock.price,
            change: stock.change ?? null,
            changePercent: stock.changePercent ?? null,
            asOf: asOf || stock.quoteAsOf || null,
          },
          news: [],
          peers: [],
          metrics: null,
          profile: null,
          recommendations: null,
          earnings: [],
        },
        { "Cache-Control": "public, max-age=60" }
      );
      return true;
    }

    const newsMatch = pathname.match(/^\/api\/companies\/([^/]+)\/news$/);
    if (newsMatch && req.method === "GET") {
      const slug = decodeURIComponent(newsMatch[1]);
      const data = await getCompanyNews(slug);
      if (!data) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=300" });
      return true;
    }

    const assetsMatch = pathname.match(/^\/api\/companies\/([^/]+)\/assets$/);
    if (assetsMatch && req.method === "GET") {
      const slug = decodeURIComponent(assetsMatch[1]);
      const data = await getCompanyAssets(slug);
      if (!data) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=300" });
      return true;
    }

    const filingsMatch = pathname.match(/^\/api\/companies\/([^/]+)\/filings$/);
    if (filingsMatch && req.method === "GET") {
      const slug = decodeURIComponent(filingsMatch[1]);
      const refresh = reqUrl.searchParams.get("refresh") === "1";
      const data = await getCompanyFilings(slug, { refresh });
      if (!data) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=300" });
      return true;
    }

    const enrichMatch = pathname.match(/^\/api\/companies\/([^/]+)\/enrich$/);
    if (enrichMatch && (req.method === "POST" || req.method === "GET")) {
      const slug = decodeURIComponent(enrichMatch[1]);
      const force = reqUrl.searchParams.get("force") === "1";
      const result = await enrichCompany(slug, { force });
      sendJson(res, 200, result, { "Cache-Control": "no-store" });
      return true;
    }

    const financialsMatch = pathname.match(/^\/api\/companies\/([^/]+)\/financials$/);
    if (financialsMatch && req.method === "GET") {
      const slug = decodeURIComponent(financialsMatch[1]);
      const data = await getCompanyFinancials(slug);
      if (!data) {
        sendJson(res, 404, { error: "Company not found" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=3600" });
      return true;
    }

    const quoteMatch = pathname.match(/^\/api\/companies\/([^/]+)\/quote$/);
    if (quoteMatch && req.method === "GET") {
      const slug = decodeURIComponent(quoteMatch[1]);
      const data = await getCompanyQuote(slug);
      if (!data?.stock) {
        sendJson(res, 404, { error: "No quote available" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=60" });
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
      await handleCatalogList(req, res, commoditiesStore);
      return true;
    }

    const commodityMatch = pathname.match(/^\/api\/commodities\/([^/]+)$/);
    if (commodityMatch && req.method === "GET") {
      await handleCatalogGet(res, commoditiesStore, decodeURIComponent(commodityMatch[1]));
      return true;
    }

    if (pathname === "/api/waterways" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await waterwaysStore.searchWaterways(q, limit));
      } else {
        sendJson(res, 200, await waterwaysStore.listWaterways(limit));
      }
      return true;
    }

    const waterwayVesselsMatch = pathname.match(/^\/api\/waterways\/([^/]+)\/vessels$/);
    if (waterwayVesselsMatch && req.method === "GET") {
      const slug = decodeURIComponent(waterwayVesselsMatch[1]);
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const t = parseInt(url.searchParams.get("t") || String(Date.now()), 10);
      const fast = url.searchParams.get("fast") === "1";
      const data = await waterwaysStore.getWaterwayVessels(slug, t, { skipAis: fast });
      if (!data) {
        sendJson(res, 404, { error: "Waterway not found" });
        return true;
      }
      const cacheSec = data.source === "aisstream" ? 15 : 30;
      sendJson(res, 200, data, { "Cache-Control": `public, max-age=${cacheSec}` });
      return true;
    }

    const waterwayMatch = pathname.match(/^\/api\/waterways\/([^/]+)$/);
    if (waterwayMatch && req.method === "GET") {
      const slug = decodeURIComponent(waterwayMatch[1]);
      const data = await waterwaysStore.getWaterway(slug);
      if (!data) {
        sendJson(res, 404, { error: "Waterway not found" });
        return true;
      }
      sendJson(res, 200, data, { "Cache-Control": "public, max-age=3600" });
      return true;
    }

    if (pathname === "/api/banks" && req.method === "GET") {
      await handleCatalogList(req, res, banks);
      return true;
    }
    const bankMatch = pathname.match(/^\/api\/banks\/([^/]+)$/);
    if (bankMatch && req.method === "GET") {
      await handleCatalogGet(res, banks, decodeURIComponent(bankMatch[1]));
      return true;
    }

    if (pathname === "/api/investment-banks" && req.method === "GET") {
      await handleCatalogList(req, res, investmentBanks);
      return true;
    }
    const ibMatch = pathname.match(/^\/api\/investment-banks\/([^/]+)$/);
    if (ibMatch && req.method === "GET") {
      await handleCatalogGet(res, investmentBanks, decodeURIComponent(ibMatch[1]));
      return true;
    }

    if (pathname === "/api/venture-capital" && req.method === "GET") {
      await handleCatalogList(req, res, ventureCapital);
      return true;
    }
    const vcMatch = pathname.match(/^\/api\/venture-capital\/([^/]+)$/);
    if (vcMatch && req.method === "GET") {
      await handleCatalogGet(res, ventureCapital, decodeURIComponent(vcMatch[1]));
      return true;
    }

    if (pathname === "/api/countries" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await countriesStore.searchCountries(q, limit));
      } else {
        sendJson(res, 200, await countriesStore.listCountries(limit));
      }
      return true;
    }

    const countryPoliticiansMatch = pathname.match(/^\/api\/countries\/([^/]+)\/politicians$/);
    if (countryPoliticiansMatch && req.method === "GET") {
      const slug = decodeURIComponent(countryPoliticiansMatch[1]);
      const politicians = await politiciansStore.getPoliticiansForCountry(slug);
      sendJson(res, 200, { countrySlug: slug, politicians });
      return true;
    }

    const countryMatch = pathname.match(/^\/api\/countries\/([^/]+)$/);
    if (countryMatch && req.method === "GET") {
      const slug = decodeURIComponent(countryMatch[1]);
      const data = await countriesStore.getCountry(slug);
      if (!data) {
        sendJson(res, 404, { error: "Country not found" });
        return true;
      }
      sendJson(res, 200, data);
      return true;
    }

    if (pathname === "/api/politicians" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const q = url.searchParams.get("q") || "";
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await politiciansStore.searchPoliticians(q, limit));
      } else {
        sendJson(res, 200, await politiciansStore.listPoliticians());
      }
      return true;
    }

    const politicianMatch = pathname.match(/^\/api\/politicians\/([^/]+)$/);
    if (politicianMatch && req.method === "GET") {
      const slug = decodeURIComponent(politicianMatch[1]);
      const profile = await politiciansStore.getPolitician(slug);
      if (!profile) {
        sendJson(res, 404, { error: "Politician not found" });
        return true;
      }
      sendJson(res, 200, { profile });
      return true;
    }

    if (pathname === "/api/people" && req.method === "GET") {
      const { listPeople } = require("./store");
      const q = reqUrl.searchParams.get("q") || "";
      const limit = Math.min(parseInt(reqUrl.searchParams.get("limit") || "25", 10) || 25, 50);
      if (q.trim()) {
        sendJson(res, 200, await searchPeople(q, limit));
      } else {
        sendJson(res, 200, await listPeople());
      }
      return true;
    }

    const personMatch = pathname.match(/^\/api\/people\/([^/]+)$/);
    if (personMatch && req.method === "GET") {
      const { getPerson } = require("./store");
      const slug = decodeURIComponent(personMatch[1]);
      const profile = await getPerson(slug);
      if (!profile) {
        sendJson(res, 404, { error: "Person not found" });
        return true;
      }
      sendJson(res, 200, { profile });
      return true;
    }

    if (pathname === "/api/vessels" && req.method === "GET") {
      const fleet = require("./supabase-fleet-store");
      const q = reqUrl.searchParams.get("q") || "";
      const limit = Math.min(parseInt(reqUrl.searchParams.get("limit") || "25", 10) || 25, 100);
      if (q.trim()) {
        sendJson(res, 200, await fleet.searchVessels(q, limit));
      } else {
        sendJson(res, 200, await fleet.listVessels(limit));
      }
      return true;
    }

    const vesselMatch = pathname.match(/^\/api\/vessels\/([^/]+)$/);
    if (vesselMatch && req.method === "GET") {
      const fleet = require("./supabase-fleet-store");
      const slug = decodeURIComponent(vesselMatch[1]);
      const profile = await fleet.getVessel(slug);
      if (!profile) {
        sendJson(res, 404, { error: "Vessel not found" });
        return true;
      }
      let company = null;
      if (profile.companySlug) {
        try {
          const c = await getCompany(profile.companySlug);
          if (c?.profile) {
            company = { slug: profile.companySlug, name: c.profile.name };
          }
        } catch {
          /* optional */
        }
      }
      sendJson(res, 200, { profile, company }, { "Cache-Control": "public, max-age=600" });
      return true;
    }

    if (pathname === "/api/portfolio/holdings" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const result = handlePortfolioHoldings(req, url);
      sendJson(res, result.status, result.body, result.headers || {});
      return true;
    }

    const holderMatch = pathname.match(/^\/api\/holders\/([^/]+)$/);
    if (holderMatch && req.method === "GET") {
      const slug = decodeURIComponent(holderMatch[1]);
      const inst = getInstitutionBySlug(slug);
      if (!inst) {
        sendJson(res, 404, { error: "Institution not found", slug });
        return true;
      }
      sendJson(
        res,
        200,
        {
          profile: {
            ...inst,
            orgTypeLabel: ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other,
          },
        },
        { "Cache-Control": "public, max-age=3600" }
      );
      return true;
    }

    if (pathname === "/api/status" && req.method === "GET") {
      let supabaseHost = null;
      let supabaseUrlError = null;
      try {
        const u = getSupabaseUrl();
        supabaseHost = u ? new URL(u).hostname : null;
      } catch (err) {
        supabaseUrlError = err.message;
        try {
          supabaseHost = process.env.SUPABASE_URL
            ? new URL(process.env.SUPABASE_URL).hostname
            : null;
        } catch {
          supabaseHost = null;
        }
      }
      sendJson(res, 200, {
        storage: storageMode(),
        supabase: isSupabaseEnabled(),
        supabaseHost,
        supabaseUrlError,
        vercel: Boolean(process.env.VERCEL),
        hint: "Company search reads public.companies via Supabase REST.",
      });
      return true;
    }

    if (pathname === "/api/chat") {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const roomType = String(url.searchParams.get("roomType") || "").trim();
      const roomSlug = String(url.searchParams.get("roomSlug") || "").trim();

      if (!roomType || !roomSlug) {
        sendJson(res, 400, { error: "roomType and roomSlug are required" });
        return true;
      }
      if (roomType !== "company" && roomType !== "commodity") {
        sendJson(res, 400, { error: "roomType must be company or commodity" });
        return true;
      }

      if (req.method === "GET") {
        const limit = url.searchParams.get("limit") || "50";
        const messages = await chatStore.listMessages(roomType, roomSlug, limit);
        sendJson(res, 200, { messages, realtime: true });
        return true;
      }

      if (req.method === "POST") {
        const payload = await readJsonBody(req);
        try {
          const message = await chatStore.postMessage(roomType, roomSlug, {
            authorId: payload?.authorId,
            authorName: payload?.authorName,
            body: payload?.body,
          });
          sendJson(res, 201, { message, realtime: true });
        } catch (err) {
          const msg = err.message || "Chat error";
          const code = /empty|too long|Invalid|Missing/i.test(msg) ? 400 : 500;
          sendJson(res, code, { error: msg });
        }
        return true;
      }

      sendJson(res, 405, { error: "Method not allowed" });
      return true;
    }
  } catch (err) {
    console.error("API error:", err);
    sendJson(res, 500, { error: err.message || "Internal server error" });
    return true;
  }

  return false;
}

module.exports = { handleApi };
