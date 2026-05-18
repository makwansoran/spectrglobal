/**
 * Institutional holder registry (asset managers, banks, sovereign funds).
 */
const fs = require("fs");
const path = require("path");

const REGISTRY_PATH = path.join(__dirname, "..", "data", "institutions.json");

const ORG_TYPE_LABELS = {
  asset_manager: "Asset manager",
  bank: "Bank",
  sovereign_wealth: "Sovereign wealth fund",
  insurance: "Insurance",
  hedge_fund: "Hedge fund",
  conglomerate: "Conglomerate",
  pension: "Pension fund",
  other: "Organization",
};

let registry = null;

function loadRegistry() {
  if (registry) return registry;
  if (!fs.existsSync(REGISTRY_PATH)) {
    registry = [];
    return registry;
  }
  registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  return registry;
}

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findInstitution(name) {
  const n = normalizeName(name);
  if (!n) return null;
  for (const inst of loadRegistry()) {
    if (normalizeName(inst.name) === n) return inst;
    for (const alias of inst.aliases || []) {
      if (normalizeName(alias) === n) return inst;
    }
  }
  // Substring match for noisy SEC / Nasdaq labels (e.g. "Price T Rowe Associates Inc /Md/")
  for (const inst of loadRegistry()) {
    const keys = [inst.name, ...(inst.aliases || [])].map(normalizeName).filter((k) => k.length >= 6);
    for (const key of keys) {
      if (n.includes(key) || key.includes(n)) return inst;
    }
  }
  return null;
}

function getInstitutionBySlug(slug) {
  return loadRegistry().find((i) => i.slug === slug) || null;
}

function enrichShareholder(stake) {
  if (!stake?.name || stake.isOther) return stake;
  const inst = stake.slug ? getInstitutionBySlug(stake.slug) : findInstitution(stake.name);
  if (!inst) {
    return {
      ...stake,
      orgType: stake.orgType || "other",
      orgTypeLabel: stake.orgTypeLabel || ORG_TYPE_LABELS.other,
      isListed: Boolean(stake.isListed),
    };
  }
  return {
    ...stake,
    slug: inst.slug,
    logoDomain: stake.logoDomain || inst.logoDomain,
    orgType: inst.orgType,
    orgTypeLabel: ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other,
    isListed: inst.isListed,
    listedTicker: inst.listedTicker,
    listedExchange: inst.listedExchange,
    companySlug: inst.companySlug || inst.slug,
    website: inst.website,
    institutionAbout: inst.about,
  };
}

function enrichOwnership(ownership) {
  if (!ownership?.shareholders?.length) return ownership;
  return {
    ...ownership,
    shareholders: ownership.shareholders.map((s) =>
      s.name === "Other holders" ? { ...s, isOther: true } : enrichShareholder(s)
    ),
  };
}

module.exports = {
  ORG_TYPE_LABELS,
  loadRegistry,
  findInstitution,
  getInstitutionBySlug,
  enrichShareholder,
  enrichOwnership,
};
