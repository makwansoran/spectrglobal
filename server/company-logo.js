/**
 * Company logos via Clearbit (domain) — no Finnhub CDN or profile2.
 */
const finnhub = require("./finnhub");

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
  const d = extractDomain(domain) || String(domain || "").replace(/^www\./i, "");
  if (!d || !d.includes(".")) return null;
  return `https://logo.clearbit.com/${d}`;
}

const LEGAL_SUFFIX =
  /\b(inc|corp|corporation|ltd|limited|plc|asa|as|ab|se|ag|sa|nv|co|llc|lp|holdings|group|company)\b\.?/gi;

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

/** Oslo / US symbol suffixes — used only for quote resolution in finnhub.js. */
function logoSymbolCandidates(profile) {
  const stock = profile?.stock || {};
  return finnhub.symbolCandidates(
    stock.ticker,
    stock.exchange,
    profile.countryCode,
    stock.finnhubSymbol
  );
}

/** Logo URL from website or name guess (Clearbit). */
function defaultLogoUrl(profile) {
  if (!profile) return null;
  if (profile.logoUrl) return profile.logoUrl;

  const fromWeb = clearbitLogo(profile.website);
  if (fromWeb) return fromWeb;

  const guessed = guessDomainFromCompanyName(profile.name || profile.legalName);
  return clearbitLogo(guessed);
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

async function resolveCompanyLogoUrl(profile) {
  if (!profile) return null;
  if (profile.logoUrl) return profile.logoUrl;

  const candidates = [
    clearbitLogo(profile.website),
    clearbitLogo(guessDomainFromCompanyName(profile.name || profile.legalName)),
  ].filter(Boolean);

  for (const url of candidates) {
    if (await headExists(url)) return url;
  }

  return defaultLogoUrl(profile);
}

function applyLogoToProfile(profile, logoUrl) {
  if (!profile || !logoUrl) return profile;
  return { ...profile, logoUrl };
}

module.exports = {
  logoSymbolCandidates,
  guessDomainFromCompanyName,
  clearbitLogo,
  defaultLogoUrl,
  resolveCompanyLogoUrl,
  applyLogoToProfile,
};
