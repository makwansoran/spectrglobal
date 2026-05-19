/**
 * Yahoo Finance scraper (public quoteSummary API + chart endpoint).
 * No API key required. Uses crumb + cookies obtained from fc.yahoo.com.
 *
 * Pulls: profile, executives, financials, holders, insider transactions,
 * analyst recommendations, earnings, ESG, key stats — everything Yahoo exposes.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const CRUMB_TTL_MS = 60 * 60 * 1000;
const MIN_INTERVAL_MS = 150;

let session = null;
let lastFetchAt = 0;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function throttle() {
  const wait = MIN_INTERVAL_MS - (Date.now() - lastFetchAt);
  if (wait > 0) await sleep(wait);
  lastFetchAt = Date.now();
}

async function refreshSession() {
  const r1 = await fetch("https://fc.yahoo.com", {
    headers: { "User-Agent": UA, Accept: "*/*" },
    redirect: "manual",
  });
  const raw = typeof r1.headers.getSetCookie === "function"
    ? r1.headers.getSetCookie()
    : (r1.headers.get("set-cookie") || "").split(/,(?=\s*\w+=)/);
  const cookie = raw.map((c) => c.split(";")[0].trim()).filter(Boolean).join("; ");
  if (!cookie) throw new Error("yahoo: no cookie from fc.yahoo.com");

  const r2 = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": UA, Cookie: cookie },
  });
  const crumb = (await r2.text()).trim();
  if (!crumb || crumb.length > 32 || /<html|<!DOCTYPE/i.test(crumb)) {
    throw new Error(`yahoo: bad crumb '${crumb.slice(0, 40)}'`);
  }
  session = { cookie, crumb, at: Date.now() };
  return session;
}

async function getSession() {
  if (session && Date.now() - session.at < CRUMB_TTL_MS) return session;
  return refreshSession();
}

async function yahooJson(url, { retries = 2 } = {}) {
  await throttle();
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const s = await getSession();
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}crumb=${encodeURIComponent(s.crumb)}`, {
      headers: { "User-Agent": UA, Cookie: s.cookie, Accept: "application/json" },
    });
    if (res.status === 401 || res.status === 403) {
      session = null;
      lastErr = new Error(`yahoo ${res.status}`);
      await sleep(500 * (attempt + 1));
      continue;
    }
    if (res.status === 429) {
      lastErr = new Error("yahoo 429");
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (res.status === 404) return null;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`yahoo ${res.status}: ${body.slice(0, 120)}`);
    }
    return res.json();
  }
  throw lastErr || new Error("yahoo: max retries");
}

/** Map a profile to Yahoo's symbol format. */
function yahooSymbol(profile) {
  const t = String(profile?.stock?.ticker || profile?.ticker || "").trim().toUpperCase();
  if (!t) return null;

  // Already qualified
  if (t.includes(".") || t.includes("-")) return t;

  const ex = String(profile?.stock?.exchange || profile?.exchange || "").toLowerCase();
  const cc = String(profile?.countryCode || profile?.country_code || "").toUpperCase();

  if (cc === "NO" || ex.includes("oslo")) return `${t}.OL`;
  if (cc === "GB" || ex.includes("london") || ex === "lse") return `${t}.L`;
  if (cc === "SE" || ex.includes("stockholm")) return `${t}.ST`;
  if (cc === "DK" || ex.includes("copenhagen")) return `${t}.CO`;
  if (cc === "FI" || ex.includes("helsinki")) return `${t}.HE`;
  if (cc === "DE" || ex.includes("xetra") || ex.includes("frankfurt")) return `${t}.DE`;
  if (cc === "FR" || ex.includes("paris") || ex.includes("euronext paris")) return `${t}.PA`;
  if (cc === "NL" || ex.includes("amsterdam")) return `${t}.AS`;
  if (cc === "CH" || ex.includes("swiss") || ex.includes("zurich")) return `${t}.SW`;
  if (cc === "IT" || ex.includes("milan")) return `${t}.MI`;
  if (cc === "ES" || ex.includes("madrid")) return `${t}.MC`;
  if (cc === "BE" || ex.includes("brussels")) return `${t}.BR`;
  if (cc === "AT" || ex.includes("vienna")) return `${t}.VI`;
  if (cc === "JP" || ex.includes("tokyo")) return `${t}.T`;
  if (cc === "HK" || ex.includes("hong kong")) return `${t}.HK`;
  if (cc === "CN" || ex.includes("shanghai")) return `${t}.SS`;
  if (cc === "CA" || ex.includes("toronto") || ex.includes("tsx")) return `${t}.TO`;
  if (cc === "AU" || ex.includes("australian") || ex === "asx") return `${t}.AX`;
  if (cc === "IN" || ex.includes("national stock exchange") || ex.includes("nse")) return `${t}.NS`;
  if (cc === "BR" || ex.includes("sao paulo") || ex.includes("b3")) return `${t}.SA`;

  return t;
}

const ALL_MODULES = [
  "assetProfile",
  "summaryProfile",
  "summaryDetail",
  "defaultKeyStatistics",
  "financialData",
  "price",
  "quoteType",
  "recommendationTrend",
  "upgradeDowngradeHistory",
  "earnings",
  "earningsHistory",
  "earningsTrend",
  "calendarEvents",
  "balanceSheetHistory",
  "balanceSheetHistoryQuarterly",
  "cashflowStatementHistory",
  "cashflowStatementHistoryQuarterly",
  "incomeStatementHistory",
  "incomeStatementHistoryQuarterly",
  "majorHoldersBreakdown",
  "institutionOwnership",
  "fundOwnership",
  "insiderHolders",
  "insiderTransactions",
  "netSharePurchaseActivity",
  "esgScores",
];

const QUICK_MODULES = [
  "assetProfile",
  "summaryDetail",
  "defaultKeyStatistics",
  "financialData",
  "price",
  "quoteType",
  "majorHoldersBreakdown",
  "institutionOwnership",
  "fundOwnership",
];

async function fetchQuoteSummary(symbol, modules = QUICK_MODULES) {
  const sym = String(symbol || "").trim().toUpperCase();
  if (!sym) return null;
  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(sym)}?modules=${modules.join(",")}`;
  const json = await yahooJson(url);
  if (!json) return null;
  const result = json?.quoteSummary?.result?.[0];
  if (!result) return null;
  return result;
}

async function fetchFullProfile(symbol) {
  return fetchQuoteSummary(symbol, ALL_MODULES);
}

/** Search Yahoo for a name → returns candidate tickers. */
async function searchSymbol(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`;
  try {
    const j = await yahooJson(url);
    return j?.quotes || [];
  } catch {
    return [];
  }
}

/** Extract a normalized "Bloomberg-style" snapshot from a Yahoo quoteSummary result. */
function normalizeYahoo(result) {
  if (!result) return null;
  const ap = result.assetProfile || {};
  const sp = result.summaryProfile || {};
  const sd = result.summaryDetail || {};
  const ks = result.defaultKeyStatistics || {};
  const fd = result.financialData || {};
  const price = result.price || {};
  const qt = result.quoteType || {};

  const officers = (ap.companyOfficers || []).map((o) => ({
    name: o.name || null,
    title: o.title || null,
    age: o.age ?? null,
    yearBorn: o.yearBorn ?? null,
    totalPay: o.totalPay?.raw ?? null,
    fiscalYear: o.fiscalYear ?? null,
  }));

  const institutions = (result.institutionOwnership?.ownershipList || []).map((h) => ({
    name: h.organization || null,
    pctHeld: h.pctHeld?.raw ?? null,
    position: h.position?.raw ?? null,
    value: h.value?.raw ?? null,
    reportDate: h.reportDate?.fmt || null,
  }));
  const funds = (result.fundOwnership?.ownershipList || []).map((h) => ({
    name: h.organization || null,
    pctHeld: h.pctHeld?.raw ?? null,
    position: h.position?.raw ?? null,
    value: h.value?.raw ?? null,
    reportDate: h.reportDate?.fmt || null,
  }));
  const insiders = (result.insiderHolders?.holders || []).map((h) => ({
    name: h.name || null,
    relation: h.relation || null,
    latestTransDate: h.latestTransDate?.fmt || null,
    positionDirect: h.positionDirect?.raw ?? null,
    positionDirectValue: h.positionDirectValue?.raw ?? null,
  }));
  const majorBreakdown = result.majorHoldersBreakdown || {};

  const recommendation = {
    rating: fd.recommendationKey || null,
    mean: fd.recommendationMean?.raw ?? null,
    targetMean: fd.targetMeanPrice?.raw ?? null,
    targetHigh: fd.targetHighPrice?.raw ?? null,
    targetLow: fd.targetLowPrice?.raw ?? null,
    targetMedian: fd.targetMedianPrice?.raw ?? null,
    numberOfAnalysts: fd.numberOfAnalystOpinions?.raw ?? null,
    trend: (result.recommendationTrend?.trend || []).map((t) => ({
      period: t.period,
      strongBuy: t.strongBuy,
      buy: t.buy,
      hold: t.hold,
      sell: t.sell,
      strongSell: t.strongSell,
    })),
  };

  const earnings = result.earnings?.financialsChart || null;
  const incomeAnnual = (result.incomeStatementHistory?.incomeStatementHistory || []).map((y) => ({
    endDate: y.endDate?.fmt || null,
    totalRevenue: y.totalRevenue?.raw ?? null,
    grossProfit: y.grossProfit?.raw ?? null,
    operatingIncome: y.operatingIncome?.raw ?? null,
    netIncome: y.netIncome?.raw ?? null,
    ebit: y.ebit?.raw ?? null,
  }));
  const incomeQuarterly = (result.incomeStatementHistoryQuarterly?.incomeStatementHistory || []).map((q) => ({
    endDate: q.endDate?.fmt || null,
    totalRevenue: q.totalRevenue?.raw ?? null,
    netIncome: q.netIncome?.raw ?? null,
  }));
  const balanceAnnual = (result.balanceSheetHistory?.balanceSheetStatements || []).map((b) => ({
    endDate: b.endDate?.fmt || null,
    totalAssets: b.totalAssets?.raw ?? null,
    totalLiab: b.totalLiab?.raw ?? null,
    totalStockholderEquity: b.totalStockholderEquity?.raw ?? null,
    cash: b.cash?.raw ?? null,
  }));
  const cashAnnual = (result.cashflowStatementHistory?.cashflowStatements || []).map((c) => ({
    endDate: c.endDate?.fmt || null,
    operatingCashflow: c.totalCashFromOperatingActivities?.raw ?? null,
    investingCashflow: c.totalCashflowsFromInvestingActivities?.raw ?? null,
    financingCashflow: c.totalCashFromFinancingActivities?.raw ?? null,
    capex: c.capitalExpenditures?.raw ?? null,
  }));

  const esg = result.esgScores
    ? {
        total: result.esgScores.totalEsg?.raw ?? null,
        environment: result.esgScores.environmentScore?.raw ?? null,
        social: result.esgScores.socialScore?.raw ?? null,
        governance: result.esgScores.governanceScore?.raw ?? null,
        peerCount: result.esgScores.peerCount ?? null,
        rating: result.esgScores.ratingYear ?? null,
      }
    : null;

  return {
    symbol: qt.symbol || price.symbol || null,
    shortName: price.shortName || qt.shortName || null,
    longName: price.longName || qt.longName || null,
    exchange: price.exchangeName || qt.fullExchangeName || qt.exchange || null,
    currency: price.currency || sd.currency || null,
    quoteType: qt.quoteType || null,

    profile: {
      address: [ap.address1, ap.city, ap.state, ap.zip].filter(Boolean).join(", "),
      country: ap.country || sp.country || null,
      phone: ap.phone || sp.phone || null,
      website: ap.website || sp.website || null,
      industry: ap.industry || sp.industry || null,
      industryKey: ap.industryKey || null,
      sector: ap.sector || sp.sector || null,
      sectorKey: ap.sectorKey || null,
      employees: ap.fullTimeEmployees ?? sp.fullTimeEmployees ?? null,
      summary: ap.longBusinessSummary || sp.longBusinessSummary || null,
    },

    executives: officers,

    keyStats: {
      marketCap: price.marketCap?.raw ?? sd.marketCap?.raw ?? null,
      enterpriseValue: ks.enterpriseValue?.raw ?? null,
      trailingPE: sd.trailingPE?.raw ?? null,
      forwardPE: sd.forwardPE?.raw ?? null,
      priceToBook: ks.priceToBook?.raw ?? null,
      profitMargins: ks.profitMargins?.raw ?? null,
      beta: ks.beta?.raw ?? null,
      sharesOutstanding: ks.sharesOutstanding?.raw ?? null,
      floatShares: ks.floatShares?.raw ?? null,
      heldPercentInsiders: ks.heldPercentInsiders?.raw ?? null,
      heldPercentInstitutions: ks.heldPercentInstitutions?.raw ?? null,
      dividendYield: sd.dividendYield?.raw ?? null,
      dividendRate: sd.dividendRate?.raw ?? null,
      payoutRatio: sd.payoutRatio?.raw ?? null,
      fiftyTwoWeekHigh: sd.fiftyTwoWeekHigh?.raw ?? null,
      fiftyTwoWeekLow: sd.fiftyTwoWeekLow?.raw ?? null,
    },

    financials: {
      totalRevenue: fd.totalRevenue?.raw ?? null,
      revenueGrowth: fd.revenueGrowth?.raw ?? null,
      grossMargins: fd.grossMargins?.raw ?? null,
      operatingMargins: fd.operatingMargins?.raw ?? null,
      ebitda: fd.ebitda?.raw ?? null,
      totalCash: fd.totalCash?.raw ?? null,
      totalDebt: fd.totalDebt?.raw ?? null,
      debtToEquity: fd.debtToEquity?.raw ?? null,
      freeCashflow: fd.freeCashflow?.raw ?? null,
      currentPrice: fd.currentPrice?.raw ?? null,
      income: { annual: incomeAnnual, quarterly: incomeQuarterly },
      balance: { annual: balanceAnnual },
      cashflow: { annual: cashAnnual },
      earnings,
    },

    ownership: {
      insiderPct: majorBreakdown.insidersPercentHeld?.raw ?? null,
      institutionPct: majorBreakdown.institutionsPercentHeld?.raw ?? null,
      institutionFloatPct: majorBreakdown.institutionsFloatPercentHeld?.raw ?? null,
      institutionCount: majorBreakdown.institutionsCount?.raw ?? null,
      topInstitutions: institutions,
      topFunds: funds,
      insiders,
    },

    analyst: recommendation,
    esg,
  };
}

module.exports = {
  yahooSymbol,
  fetchQuoteSummary,
  fetchFullProfile,
  searchSymbol,
  normalizeYahoo,
  ALL_MODULES,
  QUICK_MODULES,
};
