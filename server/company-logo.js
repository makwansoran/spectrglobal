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

const LEGAL_SUFFIX =
  /\b(inc|corp|corporation|ltd|limited|plc|asa|as|ab|se|ag|sa|nv|co|llc|lp|holdings|group|company)\b\.?/gi;

/** Guess corporate website domain from company name (Clearbit fallback). */
function guessDomainFromCompanyName(name) {
  const cleaned = String(name || "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\/[^/]+$/g, " ")
    .replace(LEGAL_SUFFIX, " ")
    .replace(/[^a-zA-Z0-9\s&]/g, " ")
    .trim();
  const words = cleaned.split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return null;

  if (words.length >= 2 && words[0].toLowerCase() === "the") {
    return `${words[1].toLowerCase()}.com`;
  }
  if (words.length >= 2 && words[0].toLowerCase() === "bank" && words[1].toLowerCase() === "of" && words[2]) {
    return `${words[2].toLowerCase()}.com`;
  }

  const primary = words[0].toLowerCase();
  if (primary.length < 3) return null;
  return `${primary}.com`;
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
  const fromWeb = clearbitLogo(web);
  if (fromWeb) return fromWeb;

  const guessed = guessDomainFromCompanyName(profile.name || profile.legalName);
  return clearbitLogo(guessed);
}

/** Match Finnhub search hit to company name (loose). */
function nameMatchesHit(companyName, hit) {
  const a = String(companyName || "")
    .toLowerCase()
    .replace(LEGAL_SUFFIX, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const b = String(hit.description || hit.displaySymbol || "")
    .toLowerCase()
    .replace(LEGAL_SUFFIX, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const aWords = a.split(/\s+/).filter((w) => w.length > 2);
  const bWords = new Set(b.split(/\s+/).filter((w) => w.length > 2));
  const overlap = aWords.filter((w) => bWords.has(w)).length;
  return overlap >= Math.min(2, aWords.length);
}

/** Resolve logo via Finnhub symbol search on company name (for holdings without tickers). */
async function resolveLogoViaNameSearch(profile) {
  if (!finnhub.isEnabled()) return null;
  const query = String(profile.name || profile.legalName || "").trim();
  if (query.length < 3) return null;

  const hits = await finnhub.searchSymbols(query);
  const preferred = hits.filter((h) => {
    const t = String(h.type || "").toLowerCase();
    return !t || t.includes("stock") || t === "adr" || t === "common stock";
  });

  for (const hit of preferred.length ? preferred : hits.slice(0, 8)) {
    if (!nameMatchesHit(query, hit)) continue;
    const sym = hit.symbol || hit.displaySymbol;
    const staticUrl = finnhubStaticLogo(sym);
    if (staticUrl && (await headExists(staticUrl))) return staticUrl;
  }
  return null;
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
      try {
        const raw = await finnhub.fetchStockProfile(sym);
        if (raw?.logo && (await headExists(raw.logo))) return raw.logo;
      } catch {
        /* profile2 premium — static CDN only */
      }
    }
  }

  const clearbit = clearbitLogo(profile.website || profile.finnhub?.weburl);
  if (clearbit && (await headExists(clearbit))) return clearbit;

  const guessed = clearbitLogo(guessDomainFromCompanyName(profile.name || profile.legalName));
  if (guessed && (await headExists(guessed))) return guessed;

  const fromSearch = await resolveLogoViaNameSearch(profile);
  if (fromSearch) return fromSearch;

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
  guessDomainFromCompanyName,
  clearbitLogo,
  defaultLogoUrl,
  resolveLogoViaNameSearch,
  resolveCompanyLogoUrl,
  applyLogoToProfile,
};
