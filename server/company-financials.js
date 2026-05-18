/**
 * Company financials — SEC reported statements (Finnhub) merged with profile_json.
 */
const { getCompanyRaw } = require("./store");
const { fetchFinancialsForProfile } = require("./reported-financials");

function mergeFinancials(profileBlock, liveBlock) {
  if (!liveBlock) return profileBlock;
  if (!profileBlock?.years?.length && !profileBlock?.quarters?.length) return liveBlock;

  return {
    ...profileBlock,
    ...liveBlock,
    years: liveBlock.years?.length ? liveBlock.years : profileBlock.years || [],
    quarterly: liveBlock.quarterly?.length
      ? liveBlock.quarterly
      : profileBlock.quarters || profileBlock.quarterly || [],
    metrics: liveBlock.metrics?.length ? liveBlock.metrics : profileBlock.metrics || [],
    source: "mixed",
  };
}

async function getCompanyFinancials(slug) {
  const company = await getCompanyRaw(slug);
  if (!company?.profile) return null;

  const profile = company.profile;
  const stored = profile.financials || { years: [], quarters: [], metrics: [] };

  let live = null;
  if (profile.isPublic && profile.stock?.ticker) {
    live = await fetchFinancialsForProfile(profile);
  }

  const merged = mergeFinancials(stored, live);
  const financials = {
    currency: merged.meta?.currency || live?.currency || profile.stock?.currency || "USD",
    source: merged.meta?.source || live?.source || stored.meta?.source,
    symbol: merged.meta?.symbol || live?.symbol || null,
    cik: merged.meta?.cik || live?.cik || null,
    asOf: merged.meta?.asOf || live?.asOf || null,
    years: merged.years || [],
    quarterly: merged.quarterly || [],
    annual: live?.annual?.length ? live.annual : buildAnnualFromYears(merged.years || []),
    metrics: merged.metrics || [],
    meta: merged.meta || live?.meta,
  };

  const hasData =
    financials.years.length > 0 || financials.quarterly.length > 0 || financials.metrics.length > 0;

  return {
    slug,
    isPublic: Boolean(profile.isPublic),
    ticker: profile.stock?.ticker || null,
    companyName: profile.name,
    hasData,
    financials,
  };
}

function buildAnnualFromYears(years) {
  return years.map((y) => ({
    period: String(y.year),
    fiscalYear: y.year,
    periodEnd: `${y.year}-12-31`,
    revenue: y.revenue ?? null,
    grossProfit: null,
    operatingIncome: y.ebitda ?? null,
    netIncome: y.netIncome ?? null,
    operatingCashFlow: null,
    ebitda: y.ebitda ?? null,
  }));
}

/** Shape for profile_json.financials upsert during backfill. */
function financialsForProfileJson(payload) {
  if (!payload) return null;
  return {
    years: payload.years || [],
    quarters: payload.quarterly || [],
    metrics: payload.metrics || [],
    meta: {
      source: payload.source,
      currency: payload.currency,
      symbol: payload.symbol,
      cik: payload.cik,
      asOf: payload.asOf,
    },
  };
}

module.exports = {
  getCompanyFinancials,
  financialsForProfileJson,
  fetchFinancialsForProfile,
};
