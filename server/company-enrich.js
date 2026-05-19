/**
 * Multi-country company enrichment: SEC EDGAR, Finnhub, Euronext, UK registry links, IR scrape.
 * Env: FINNHUB_API_KEY (market/news/filings); SUPABASE_URL + service key for persist via upsertCompany.
 */

const { fetchEdgarFilings } = require("./sec-edgar");
const {
  isEnabled: finnhubEnabled,
  fetchSecFilingsForProfile,
  fetchCompanyNewsForProfile,
  fetchCompanyMarket,
} = require("./finnhub");
const { fetchFinancialsForProfile } = require("./reported-financials");
const { fetchEuronextFilingsForProfile } = require("./euronext/filings");
const { fetchIrFilingsFromWebsite } = require("./company-scrape");
const { getCompanyRaw, upsertCompany } = require("./store");

const ENRICH_STALE_MS = 12 * 60 * 60 * 1000;
const enriching = new Map();

function filingKey(f) {
  return `${(f.type || "").toUpperCase()}|${f.date || ""}|${(f.title || "").slice(0, 80)}`;
}

function mergeFilings(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const f of list || []) {
      const k = filingKey(f);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(f);
    }
  }
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function profileIrUrl(profile) {
  return (
    profile.website ||
    profile.finnhub?.weburl ||
    profile.stock?.weburl ||
    null
  );
}

/** Region bucket for source ordering (countryCode / exchange / Euronext). */
function detectRegion(profile) {
  const cc = String(profile.countryCode || profile.finnhub?.country || "").toUpperCase();
  const ex = String(profile.stock?.exchange || "").toLowerCase();

  if (cc === "US" || ex.includes("nasdaq") || ex.includes("nyse") || ex.includes("amex")) {
    return "US";
  }
  if (
    cc === "NO" ||
    profile.euronext?.productUrl ||
    ex.includes("oslo") ||
    ex.includes("euronext")
  ) {
    return "EU_NO";
  }
  if (cc === "GB" || ex.includes("london") || ex.includes("lse")) {
    return "UK";
  }
  const euCc = new Set([
    "DE",
    "FR",
    "NL",
    "BE",
    "IE",
    "PT",
    "ES",
    "IT",
    "FI",
    "SE",
    "DK",
    "AT",
    "LU",
  ]);
  if (euCc.has(cc) || ex.includes("euronext") || ex.includes("xetra") || ex.includes("paris")) {
    return "EU";
  }
  return "GENERIC";
}

function ukRegistryLinks(profile) {
  const name = encodeURIComponent(profile.legalName || profile.name || "");
  const ticker = profile.stock?.ticker ? encodeURIComponent(profile.stock.ticker) : "";
  const out = [];
  if (name) {
    out.push({
      name: "Companies House",
      url: `https://find-and-update.company-information.service.gov.uk/search?q=${name}`,
    });
  }
  if (ticker) {
    out.push({
      name: "London Stock Exchange",
      url: `https://www.londonstockexchange.com/search?query=${ticker}`,
    });
  }
  return out;
}

function buildDataSources(profile, sources, region) {
  const base = profile.dataSources?.length
    ? profile.dataSources
    : [{ name: "Spectr", url: "https://spectr.no" }];
  const names = new Set(base.map((d) => d.name));
  const extra = [];

  if (sources.includes("sec-edgar") && !names.has("SEC EDGAR")) {
    extra.push({ name: "SEC EDGAR", url: "https://www.sec.gov/edgar/search/" });
  }
  if (sources.some((s) => s.startsWith("finnhub")) && !names.has("Finnhub")) {
    extra.push({ name: "Finnhub", url: "https://finnhub.io" });
  }
  if (sources.includes("euronext") && !names.has("Euronext Live")) {
    extra.push({
      name: "Euronext Live",
      url: profile.euronext?.productUrl || "https://live.euronext.com",
    });
  }
  if (sources.includes("company-ir") && !names.has("Company IR")) {
    const ir = profileIrUrl(profile);
    if (ir) extra.push({ name: "Company IR", url: ir });
  }
  if (region === "UK") {
    for (const link of ukRegistryLinks(profile)) {
      if (!names.has(link.name)) {
        extra.push(link);
        names.add(link.name);
      }
    }
  }
  if (profile.stock?.ticker && !names.has("Yahoo Finance")) {
    extra.push({
      name: "Yahoo Finance",
      url: `https://finance.yahoo.com/quote/${encodeURIComponent(profile.stock.ticker)}`,
    });
  }
  return [...base, ...extra];
}

function needsEnrichment(profile) {
  const hasTicker = Boolean(profile?.stock?.ticker);
  const hasWebsite = Boolean(profileIrUrl(profile));
  if (!hasTicker && !hasWebsite) return false;

  const at = profile.enrichment?.at;
  if (!at) return true;
  const age = Date.now() - new Date(at).getTime();
  if (age > ENRICH_STALE_MS) return true;
  if (!(profile.filings?.length > 0)) return true;

  const isPublic = profile.isPublic !== false;
  if (isPublic && hasTicker) {
    const metrics = profile.financials?.metrics;
    const years = profile.financials?.years;
    if (!metrics?.length && !years?.length) return true;
  }
  return false;
}

async function fetchAllFilings(profile, options = {}) {
  const region = detectRegion(profile);
  const sources = [];
  const tasks = [];
  const ticker = profile.stock?.ticker;
  const forceScrape = Boolean(options.forceScrape || options.force);

  if (region === "US" && ticker) {
    tasks.push(
      fetchEdgarFilings(ticker, 120)
        .then((rows) => {
          if (rows.length) sources.push("sec-edgar");
          return rows;
        })
        .catch((err) => {
          console.warn("SEC EDGAR:", err.message);
          return [];
        })
    );
  }

  if ((region === "EU_NO" || region === "EU") && profile.euronext?.productUrl) {
    tasks.push(
      fetchEuronextFilingsForProfile(profile).then((rows) => {
        if (rows.length) sources.push("euronext");
        return rows;
      })
    );
  }

  if (finnhubEnabled() && ticker && (region === "US" || region === "UK" || region === "GENERIC")) {
    tasks.push(
      fetchSecFilingsForProfile(profile, 10).then((rows) => {
        if (rows.length) sources.push("finnhub-sec");
        return rows;
      })
    );
  }

  if (finnhubEnabled() && ticker && region === "EU_NO") {
    tasks.push(
      fetchSecFilingsForProfile(profile, 8).then((rows) => {
        if (rows.length) sources.push("finnhub-sec");
        return rows;
      })
    );
  }

  const parts = await Promise.all(tasks);
  let filings = mergeFilings(...parts);

  const irUrl = profileIrUrl(profile);
  const runScrape =
    irUrl && (forceScrape || filings.length === 0);

  if (runScrape) {
    try {
      const scraped = await fetchIrFilingsFromWebsite(
        irUrl,
        profile.name || profile.legalName
      );
      if (scraped.length) {
        sources.push("company-ir");
        filings = mergeFilings(filings, scraped);
      }
    } catch (err) {
      console.warn("IR scrape:", err.message);
    }
  }

  if (region === "UK" && filings.length === 0 && ticker) {
    filings = [
      {
        id: `uk-lse-${ticker}`,
        title: `${profile.name || ticker} — LSE search`,
        type: "Registry link",
        date: "",
        jurisdiction: "United Kingdom",
        url: `https://www.londonstockexchange.com/search?query=${encodeURIComponent(ticker)}`,
        source: "uk-lse",
      },
    ];
    sources.push("uk-lse");
  }

  return { filings, sources: [...new Set(sources)], region };
}

/**
 * Fetch market, news, financials, filings; merge into profile and save.
 */
async function enrichCompany(slug, options = {}) {
  const force = Boolean(options.force);
  const key = String(slug);

  if (enriching.has(key)) return enriching.get(key);

  const run = (async () => {
    const row = await getCompanyRaw(slug);
    if (!row?.profile) return { ok: false, reason: "not_found" };

    const profile = { ...row.profile };
    const hasTicker = Boolean(profile.stock?.ticker);
    const hasWebsite = Boolean(profileIrUrl(profile));

    if (!hasTicker && !hasWebsite) {
      return { ok: false, reason: "no_ticker_or_website" };
    }
    if (!force && !needsEnrichment(profile)) {
      return {
        ok: true,
        skipped: true,
        filings: profile.filings?.length || 0,
        sources: profile.enrichment?.sources || [],
      };
    }

    const sources = [];
    const region = detectRegion(profile);

    const { filings, sources: filingSources } = await fetchAllFilings(profile, {
      force,
      forceScrape: force,
    });
    sources.push(...filingSources);

    if (finnhubEnabled() && hasTicker) {
      const [market, news, financials] = await Promise.all([
        fetchCompanyMarket(profile).catch(() => null),
        fetchCompanyNewsForProfile(profile).catch(() => []),
        fetchFinancialsForProfile(profile).catch(() => null),
      ]);

      if (market?.quote || market?.profile) sources.push("finnhub");
      if (market?.profile?.weburl && !profile.website) {
        profile.website = market.profile.weburl;
        profile.finnhub = { ...(profile.finnhub || {}), weburl: market.profile.weburl };
      }
      if (market?.profile?.country && !profile.countryCode) {
        profile.countryCode = market.profile.country;
      }
      if (news?.length) {
        profile.news = mergeNews(profile.news, news);
        sources.push("finnhub-news");
      }
      if (financials?.metrics?.length) {
        profile.financials = financials;
        sources.push("finnhub-financials");
      }
      if (market?.quote && profile.stock) {
        profile.stock = {
          ...profile.stock,
          price: market.quote.c ?? market.quote.pc ?? profile.stock.price,
          change: market.quote.d ?? profile.stock.change,
          changePercent: market.quote.dp ?? profile.stock.changePercent,
        };
      }
    }

    profile.filings = filings.length ? filings : profile.filings || [];
    profile.dataSources = buildDataSources(profile, sources, region);
    profile.enrichment = {
      at: new Date().toISOString(),
      sources: [...new Set(sources)],
      filingCount: profile.filings.length,
      region,
    };

    await persistEnrichedProfile(slug, profile, row.mapGeojson);

    return {
      ok: true,
      filings: profile.filings.length,
      sources: profile.enrichment.sources,
      region,
    };
  })().finally(() => {
    enriching.delete(key);
  });

  enriching.set(key, run);
  return run;
}

function mergeNews(existing, incoming) {
  const seen = new Set((existing || []).map((n) => n.id || n.url || n.title));
  const out = [...(existing || [])];
  for (const n of incoming || []) {
    const k = n.id || n.url || n.title;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(n);
  }
  return out.slice(0, 25);
}

async function persistEnrichedProfile(slug, profile, mapGeojson) {
  try {
    const terms = [
      profile.name,
      profile.legalName,
      profile.stock?.ticker,
      profile.stock?.exchange,
    ].filter(Boolean);
    await upsertCompany({
      slug,
      profile: { ...profile, lastUpdated: new Date().toISOString() },
      mapGeojson: mapGeojson ?? null,
      searchTerms: [...new Set(terms.map((t) => String(t).toLowerCase()))],
    });
  } catch (err) {
    console.warn("enrich persist:", err.message);
  }
}

/** Non-blocking enrich after profile load. */
function enrichCompanyIfStale(slug) {
  return enrichCompany(slug, { force: false }).catch((err) => {
    console.warn("enrichIfStale:", slug, err.message);
    return null;
  });
}

module.exports = {
  enrichCompany,
  enrichCompanyIfStale,
  fetchAllFilings,
  needsEnrichment,
  mergeFilings,
  detectRegion,
  profileIrUrl,
};
