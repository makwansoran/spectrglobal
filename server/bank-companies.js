/**
 * Detect bank companies and apply curated profile fields (no Finnhub profile data).
 */
const PLACEHOLDER_ABOUT = /placeholder|enrich via admin/i;

const BANK_NAME =
  /sparebank|bank\s+asa|bank\s+plc|bankshares|bankcorp|banking|bancorp|bancshares|commercial\s+bank|investment\s+bank|savings\s+bank/i;
const BANK_EXCLUDE = /blood\s+bank|food\s+bank|riverbank|sandbank|data\s+bank|snowboard|&\s*banks?\b/i;

function isBankCompany(slug, name, profile = {}) {
  const n = String(name || "").toLowerCase();
  const s = String(slug || "").toLowerCase();
  if (s.startsWith("nb-")) return false;
  if (profile?.institution?.orgType === "bank") return true;
  if (BANK_EXCLUDE.test(n)) return false;
  if (BANK_NAME.test(n) || (/\bbank\b/.test(n) && /\b(financial|bancorp|holdings|corp|inc|asa|plc|ltd)\b/i.test(n))) {
    return true;
  }
  if (/sparebank|-bank-/.test(s) && !s.startsWith("nb-")) return true;
  const tags = (profile.industryTags || []).join(" ").toLowerCase();
  if (/\bbank\b/.test(tags) && !tags.includes("blood")) return true;
  return false;
}

function isPlaceholderAbout(about) {
  return PLACEHOLDER_ABOUT.test(String(about || ""));
}

function profileNamesAlign(companyName, otherName) {
  const a = String(companyName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const b = String(otherName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!a || !b) return true;
  return a.includes(b.slice(0, Math.min(8, b.length))) || b.includes(a.slice(0, Math.min(8, a.length)));
}

/** Industry/tags/about fixes; optional live quote from company-quote only. */
function applyBankProfilePatch(profile, options = {}) {
  const next = { ...profile };
  const quote = options.quote || null;

  if (
    (next.countryCode === "NO" || /oslo/i.test(next.stock?.exchange || "")) &&
    next.stock?.ticker &&
    !String(next.stock.finnhubSymbol || "").includes(".")
  ) {
    next.stock = { ...next.stock, finnhubSymbol: `${next.stock.ticker}.OL` };
  }

  const companyLabel = next.legalName || next.name;

  next.industry = "finance";
  next.industryTabLabel = next.industryTabLabel || "Overview";

  const tagSet = new Set(next.industryTags || []);
  tagSet.add("Bank");
  if (next.stock?.exchange) tagSet.add(next.stock.exchange);
  next.industryTags = [...tagSet].filter(Boolean);

  if (/oslo/i.test(next.stock?.exchange || "")) {
    next.countryCode = "NO";
    next.countryName = "Norway";
  }

  const ticker = next.stock?.ticker;
  const exchange = next.stock?.exchange;
  if (
    isPlaceholderAbout(next.about) ||
    (next.about && !profileNamesAlign(next.about, companyLabel))
  ) {
    const listing = ticker && exchange ? ` (${exchange}, ${ticker})` : ticker ? ` (${ticker})` : "";
    next.about = `${companyLabel} is a banking and financial services group${listing}.`;
  }

  if (quote && next.stock) {
    next.stock = {
      ...next.stock,
      price: quote.price ?? quote.c ?? next.stock.price,
      change: quote.change ?? quote.d ?? next.stock.change,
      changePercent: quote.changePercent ?? quote.dp ?? next.stock.changePercent,
      finnhubSymbol: quote.symbol || next.stock.finnhubSymbol,
      quoteAsOf: quote.asOf || new Date().toISOString(),
    };
  }

  return next;
}

module.exports = {
  isBankCompany,
  isPlaceholderAbout,
  profileNamesAlign,
  applyBankProfilePatch,
};
