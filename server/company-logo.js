/**
 * Resolve official company logo URLs (Finnhub CDN, Finnhub profile2, Clearbit by domain).
 */
const finnhub = require("./finnhub");

const FINNHUB_LOGO_BASE =
  "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo";

function finnhubStaticLogo(symbol) {
  const s = String(symbol || "")
    .trim()
    .toUpperCase();
  if (!s) return null;
  return `${FINNHUB_LOGO_BASE}/${encodeURIComponent(s)}.png`;
}

function extractDomain(webUrl) {
  if (!webUrl) return null;
  try {
    const host = new URL(webUrl.startsWith("http") ? webUrl : `https://${webUrl}`).hostname;
    return host.replace(/^www\./i, "") || null;
  } catch {
    return null;
  }
}

function clearbitLogo(domain) {
  const d = extractDomain(domain);
  if (!d) return null;
  return `https://logo.clearbit.com/${d}`;
}

function logoSymbolCandidates(profile) {
  const stock = profile?.stock || {};
  const fromFinnhub = profile?.finnhub?.symbol || profile?.finnhub?.finnhubSymbol;
  const candidates = finnhub.symbolCandidates(
    stock.ticker,
    stock.exchange,
    profile.countryCode,
    stock.finnhubSymbol || fromFinnhub
  );

  const slug = profile?.id || profile?.slug;
  if (slug?.startsWith("us-")) {
    const t = slug.slice(3).toUpperCase();
    if (t && !candidates.includes(t)) candidates.unshift(t);
  }

  return [...new Set(candidates.filter(Boolean))];
}

/** Fast logo URL without network (Finnhub static + Clearbit from known website). */
function defaultLogoUrl(profile) {
  if (!profile) return null;
  if (profile.logoUrl) return profile.logoUrl;
  if (profile.finnhub?.logo) return profile.finnhub.logo;

  for (const sym of logoSymbolCandidates(profile)) {
    const url = finnhubStaticLogo(sym);
    if (url) return url;
  }

  const web = profile.website || profile.finnhub?.weburl;
  return clearbitLogo(web);
}

async function headExists(url, timeoutMs = 4000) {
  if (!url) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Verify candidates; optionally call Finnhub profile2 for logo field. */
async function resolveCompanyLogoUrl(profile, { useFinnhubApi = true } = {}) {
  if (!profile) return null;
  if (profile.logoUrl) return profile.logoUrl;

  for (const sym of logoSymbolCandidates(profile)) {
    const url = finnhubStaticLogo(sym);
    if (url && (await headExists(url))) return url;
  }

  if (useFinnhubApi && finnhub.isEnabled()) {
    for (const sym of logoSymbolCandidates(profile)) {
      const raw = await finnhub.fetchStockProfile(sym);
      if (raw?.logo && (await headExists(raw.logo))) return raw.logo;
    }
  }

  const clearbit = clearbitLogo(profile.website || profile.finnhub?.weburl);
  if (clearbit && (await headExists(clearbit))) return clearbit;

  return defaultLogoUrl(profile);
}

function applyLogoToProfile(profile, logoUrl) {
  if (!profile || !logoUrl) return profile;
  return { ...profile, logoUrl };
}

module.exports = {
  FINNHUB_LOGO_BASE,
  finnhubStaticLogo,
  logoSymbolCandidates,
  defaultLogoUrl,
  resolveCompanyLogoUrl,
  applyLogoToProfile,
};
