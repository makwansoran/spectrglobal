import institutions from "../../../data/institutions.json";
import type { InstitutionOrgType, ShareholderStake } from "../types/company";

type Institution = (typeof institutions)[number];

const ORG_TYPE_LABELS: Record<string, string> = {
  asset_manager: "Asset manager",
  bank: "Bank",
  sovereign_wealth: "Sovereign wealth fund",
  insurance: "Insurance",
  hedge_fund: "Hedge fund",
  conglomerate: "Conglomerate",
  pension: "Pension fund",
  other: "Organization",
};

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findInstitution(name: string): Institution | null {
  const n = normalizeName(name);
  if (!n) return null;
  for (const inst of institutions) {
    if (normalizeName(inst.name) === n) return inst;
    for (const alias of inst.aliases || []) {
      if (normalizeName(alias) === n) return inst;
    }
  }
  return null;
}

export function enrichShareholderStake(stake: ShareholderStake): ShareholderStake {
  if (!stake.name || stake.isOther) return stake;
  if (stake.slug && stake.orgTypeLabel) {
    if (stake.companySlug) return stake;
    const bySlug = institutions.find((i) => i.slug === stake.slug);
    if (bySlug) {
      return { ...stake, companySlug: bySlug.companySlug || bySlug.slug };
    }
    return stake;
  }

  const inst = stake.slug
    ? institutions.find((i) => i.slug === stake.slug) ?? null
    : findInstitution(stake.name);
  if (!inst) {
    return {
      ...stake,
      orgType: stake.orgType || "other",
      orgTypeLabel: stake.orgTypeLabel || ORG_TYPE_LABELS.other,
      isListed: stake.isListed ?? false,
    };
  }

  return {
    ...stake,
    slug: inst.slug,
    logoDomain: stake.logoDomain || inst.logoDomain,
    orgType: inst.orgType as InstitutionOrgType,
    orgTypeLabel: ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other,
    isListed: inst.isListed,
    listedTicker: inst.listedTicker,
    listedExchange: inst.listedExchange,
    companySlug: inst.companySlug || inst.slug,
    website: inst.website,
  };
}
