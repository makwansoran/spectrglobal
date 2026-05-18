/**
 * Build company seeds from NBIM equity holdings report rows.
 */
const { buildMeta } = require("./local-store");
const { countryNameToCode, countryCodeToName } = require("./country-codes");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36);
}

function initials(name) {
  const words = String(name || "")
    .replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return String(name || "??").slice(0, 2).toUpperCase();
}

function mapGicsIndustry(industry) {
  const i = String(industry || "").toLowerCase();
  if (i.includes("financial") || i.includes("bank")) return "finance";
  if (i.includes("energy") || i.includes("utility")) return "energy";
  if (i.includes("real estate")) return "real_estate";
  if (i.includes("health")) return "biotech";
  if (i.includes("material") || i.includes("mining")) return "mining";
  if (i.includes("industrial") || i.includes("transport")) return "shipping";
  if (i.includes("tech") || i.includes("communication")) return "technology";
  return "finance";
}

function formatNok(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v >= 1e12) return `NOK ${(v / 1e12).toFixed(2)}B`;
  if (v >= 1e9) return `NOK ${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `NOK ${(v / 1e6).toFixed(0)}M`;
  return `NOK ${Math.round(v).toLocaleString("en-US")}`;
}

function formatUsd(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}B`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

function holdingSlug(name, listingCountry) {
  const cc = countryNameToCode(listingCountry).toLowerCase();
  const base = slugify(name);
  return `nb-${base}-${cc}`.slice(0, 48);
}

function rowToHolding(row) {
  const name = String(row.Name || "").trim();
  const listingCountry = String(row.Country || "").trim();
  const incorporationCountry = String(row["Incorporation Country"] || listingCountry).trim();
  const slug = holdingSlug(name, listingCountry);

  return {
    slug,
    name,
    region: String(row.Region || "").trim(),
    listingCountry,
    incorporationCountry,
    industry: String(row.Industry || "").trim(),
    marketValueNok: Number(row["Market Value(NOK)"]) || 0,
    marketValueUsd: Number(row["Market Value(USD)"]) || 0,
    votingPercent: Number(row.Voting) || 0,
    ownershipPercent: Number(row.Ownership) || 0,
  };
}

function holdingToCompanySeed(holding, asOf = "2025-12-31") {
  const countryCode = countryNameToCode(holding.listingCountry);
  const countryName = holding.listingCountry || countryCodeToName(countryCode);
  const industryLabel = holding.industry || "Equity";
  const mappedIndustry = mapGicsIndustry(holding.industry);

  const profile = {
    id: holding.slug,
    name: holding.name,
    legalName: holding.name,
    logoInitials: initials(holding.name),
    countryCode: countryCode.length === 2 ? countryCode : "XX",
    countryName,
    founded: 1900,
    headquarters: `${countryName}${holding.region ? ` · ${holding.region}` : ""}`,
    industryTags: [industryLabel, "Equity holding", "NBIM portfolio"],
    isPublic: true,
    industry: mappedIndustry,
    industryTabLabel: "Overview",
    about: `${holding.name} is a public equity position in the Government Pension Fund Global portfolio managed by Norges Bank Investment Management (NBIM), as of ${asOf}. The company is listed in ${countryName}${holding.incorporationCountry && holding.incorporationCountry !== holding.listingCountry ? ` and incorporated in ${holding.incorporationCountry}` : ""}. Industry classification: ${industryLabel}.`,
    quickStats: [
      { label: "NBIM ownership", value: `${holding.ownershipPercent}%`, format: "text" },
      { label: "Market value (USD)", value: formatUsd(holding.marketValueUsd), format: "text" },
      { label: "Listing country", value: countryName, format: "text" },
    ],
    people: [],
    financials: {
      years: [],
      metrics: [
        {
          label: "NBIM market value (NOK)",
          value: 0,
          format: "text",
          display: formatNok(holding.marketValueNok),
        },
        {
          label: "NBIM market value (USD)",
          value: 0,
          format: "text",
          display: formatUsd(holding.marketValueUsd),
        },
      ],
    },
    news: [],
    filings: [],
    keyFacts: [
      { label: "Portfolio holder", value: "Norges Bank Investment Management" },
      { label: "Region", value: holding.region || "—" },
      { label: "Industry", value: industryLabel },
      { label: "Ownership", value: `${holding.ownershipPercent}%` },
      { label: "Voting", value: `${holding.votingPercent}%` },
      { label: "As of", value: asOf },
    ],
    competitors: [],
    funding: [],
    esg: { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    dataSources: [
      { name: "NBIM holdings report", url: "https://www.nbim.no" },
      { name: "Norges Bank", url: "https://www.norges-bank.no" },
    ],
    lastUpdated: new Date().toISOString(),
    nbimHolding: {
      asOf,
      investorSlug: "norges-bank",
      region: holding.region,
      listingCountry: holding.listingCountry,
      incorporationCountry: holding.incorporationCountry,
      industry: holding.industry,
      marketValueNok: holding.marketValueNok,
      marketValueUsd: holding.marketValueUsd,
      votingPercent: holding.votingPercent,
      ownershipPercent: holding.ownershipPercent,
    },
  };

  const searchTerms = [
    holding.slug,
    holding.name,
    holding.listingCountry,
    holding.incorporationCountry,
    holding.industry,
    "nbim",
    "norges bank",
  ].filter(Boolean);

  return {
    slug: holding.slug,
    searchTerms: [...new Set(searchTerms)],
    mapGeojson: null,
    profile,
    meta: buildMeta(profile),
  };
}

module.exports = {
  slugify,
  holdingSlug,
  rowToHolding,
  holdingToCompanySeed,
  formatNok,
  formatUsd,
};
