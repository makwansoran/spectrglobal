const { getCompanyRaw } = require("./store");
const { fetchAllFilings, enrichCompany, profileIrUrl } = require("./company-enrich");

async function getCompanyFilings(slug, options = {}) {
  const row = await getCompanyRaw(slug);
  if (!row?.profile) return null;

  const profile = row.profile;
  const hasTicker = Boolean(profile.stock?.ticker);
  const hasWebsite = Boolean(profileIrUrl(profile));

  if (!hasTicker && !hasWebsite) {
    return { filings: profile.filings || [], sources: [], enriched: false };
  }

  let filings = profile.filings || [];
  let sources = profile.enrichment?.sources || [];

  if (options.refresh || filings.length === 0) {
    const result = await enrichCompany(slug, { force: Boolean(options.refresh) });
    if (result?.ok && !result.skipped) {
      const fresh = await getCompanyRaw(slug);
      filings = fresh?.profile?.filings || filings;
      sources = fresh?.profile?.enrichment?.sources || sources;
    } else if (filings.length === 0) {
      const fetched = await fetchAllFilings(profile, {
        force: Boolean(options.refresh),
        forceScrape: Boolean(options.refresh),
      });
      filings = fetched.filings;
      sources = fetched.sources;
    }
  }

  return {
    filings,
    sources,
    enriched: Boolean(profile.enrichment?.at),
    enrichment: profile.enrichment || null,
  };
}

module.exports = { getCompanyFilings };
