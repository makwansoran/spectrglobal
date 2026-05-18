/**
 * Ensure profile_json has arrays/objects the profile UI expects (avoids render crashes).
 */
function normalizeCompanyProfile(profile) {
  if (!profile || typeof profile !== "object") return profile;

  const financials = profile.financials && typeof profile.financials === "object"
    ? profile.financials
    : { years: [], metrics: [] };

  return {
    ...profile,
    industryTags: Array.isArray(profile.industryTags) ? profile.industryTags : [],
    quickStats: Array.isArray(profile.quickStats) ? profile.quickStats : [],
    people: Array.isArray(profile.people) ? profile.people : [],
    financials: {
      years: Array.isArray(financials.years) ? financials.years : [],
      metrics: Array.isArray(financials.metrics) ? financials.metrics : [],
    },
    news: Array.isArray(profile.news) ? profile.news : [],
    filings: Array.isArray(profile.filings) ? profile.filings : [],
    keyFacts: Array.isArray(profile.keyFacts) ? profile.keyFacts : [],
    competitors: Array.isArray(profile.competitors) ? profile.competitors : [],
    funding: Array.isArray(profile.funding) ? profile.funding : [],
    dataSources: Array.isArray(profile.dataSources) && profile.dataSources.length
      ? profile.dataSources
      : [{ name: "Spectr", url: "https://spectr.no" }],
    esg: profile.esg && typeof profile.esg === "object"
      ? profile.esg
      : { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    industryTabLabel: profile.industryTabLabel || "Overview",
  };
}

module.exports = { normalizeCompanyProfile };
