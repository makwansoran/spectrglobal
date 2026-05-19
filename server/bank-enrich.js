/**
 * Bank profile enrichment without Finnhub (except live quote via company-quote).
 * Sources: bank-registry, website scrape, Euronext, SEC EDGAR, IR links.
 */
const { resolveBankSource } = require("./bank-registry");
const { applyBankProfilePatch, isPlaceholderAbout } = require("./bank-companies");
const { clearbitLogo, applyLogoToProfile } = require("./company-logo");
const { fetchWebsiteMeta } = require("./website-meta");
const { fetchLiveQuoteForProfile, applyQuoteToStock } = require("./company-quote");
const { fetchAllFilings, detectRegion } = require("./company-enrich");

async function enrichBankProfile(slug, profile, options = {}) {
  const next = { ...profile };
  const sources = [];
  const curated = resolveBankSource(slug, next);

  if (curated?.website) {
    next.website = curated.website;
    sources.push(curated.source || "registry");
  }
  const companyLabel = next.legalName || next.name;
  const aboutStale =
    !next.about ||
    isPlaceholderAbout(next.about) ||
    /is a banking and financial services group/i.test(next.about);
  if (
    curated?.about &&
    (options.force || aboutStale || curated.source === "registry")
  ) {
    next.about = curated.about;
  }
  if (curated?.headquarters) next.headquarters = curated.headquarters;
  if (curated?.founded) next.founded = curated.founded;
  if (curated?.countryCode) {
    next.countryCode = curated.countryCode;
    next.countryName = curated.countryName || next.countryName;
  }

  const logoDomain = curated?.logoDomain;
  if (logoDomain) {
    const cb = clearbitLogo(logoDomain);
    const finnhubLogo = /finnhub\.io/i.test(next.logoUrl || "");
    if (cb && (options.force || !next.logoUrl || finnhubLogo)) next.logoUrl = cb;
  }

  if (next.website && (options.scrapeMeta !== false)) {
    try {
      const meta = await fetchWebsiteMeta(next.website);
      if (meta?.logoUrl && !next.logoUrl) next.logoUrl = meta.logoUrl;
      if (meta?.description && (options.force || !curated?.about)) {
        if (!next.about || /placeholder|enrich via admin/i.test(next.about)) {
          next.about = meta.description.slice(0, 500);
          sources.push("website-meta");
        }
      }
    } catch {
      /* optional */
    }
  }

  let patched = applyBankProfilePatch(next, { quote: null });
  sources.push("bank-profile");

  if (next.stock?.ticker) {
    try {
      const quote = await fetchLiveQuoteForProfile(patched);
      if (quote?.price) {
        patched = applyBankProfilePatch(patched, { quote });
        sources.push("finnhub-quote");
      }
    } catch {
      /* quote-only Finnhub */
    }
  }

  if (options.filings !== false) {
    const { filings, sources: filingSources } = await fetchAllFilings(patched, {
      force: options.force,
      forceScrape: options.force,
    });
    patched.filings = filings.length ? filings : patched.filings || [];
    sources.push(...filingSources);
  }

  const region = detectRegion(patched);
  patched.enrichment = {
    at: new Date().toISOString(),
    sources: [...new Set(sources)],
    filingCount: patched.filings?.length || 0,
    region,
  };

  if (patched.logoUrl) {
    patched = applyLogoToProfile(patched, patched.logoUrl);
  }

  return { profile: patched, sources, region };
}

module.exports = {
  enrichBankProfile,
};
