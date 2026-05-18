import type { CompanyProfile, OwnershipBreakdown, ShareholderStake } from "../types/company";
import { enrichShareholderStake } from "./institutions";

const SHAREHOLDER_LOGO_DOMAINS: Record<string, string> = {
  "Vanguard Group": "vanguard.com",
  BlackRock: "blackrock.com",
  "State Street": "statestreet.com",
  "JPMorgan Chase": "jpmorganchase.com",
  "Geode Capital": "geodecapital.com",
  "Fidelity (FMR LLC)": "fidelity.com",
  Fidelity: "fidelity.com",
  "Berkshire Hathaway": "berkshirehathaway.com",
  "Morgan Stanley": "morganstanley.com",
  "T. Rowe Price": "troweprice.com",
  "Norges Bank": "nbim.no",
  "Schlumberger (SLB)": "slb.com",
  Schlumberger: "slb.com",
  "Skybound Entertainment": "skybound.com",
  Microsoft: "microsoft.com",
  "Alphabet (Google)": "google.com",
  Amazon: "amazon.com",
  "Meta Platforms": "meta.com",
  "Samsung Electronics": "samsung.com",
};

const PIE_COLORS = [
  "#1f6feb",
  "#6366f1",
  "#8b5cf6",
  "#0d8050",
  "#bf7326",
  "#c23030",
  "#64748b",
  "#0891b2",
  "#db2777",
  "#ca8a04",
  "#4f46e5",
  "#059669",
  "#94a3b8",
];

export function pieColor(index: number) {
  return PIE_COLORS[index % PIE_COLORS.length];
}

export function shareholderLogoUrl(stake: ShareholderStake): string | null {
  if (stake.logoUrl) return stake.logoUrl;
  const domain =
    stake.logoDomain ||
    SHAREHOLDER_LOGO_DOMAINS[stake.name] ||
    guessDomainFromName(stake.name);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

function guessDomainFromName(name: string): string | null {
  const cleaned = name
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/&/g, "and")
    .trim();
  const first = cleaned.split(/\s+/)[0];
  if (!first || first.length < 3) return null;
  return `${first.toLowerCase()}.com`;
}

function parsePercent(text: string): number | null {
  const m = String(text).match(/([\d.]+)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

function parseShareholderFact(label: string, value: string): ShareholderStake | null {
  const fromLabel = label.replace(/^Shareholder:\s*/i, "").trim();
  const percent = parsePercent(value);
  if (!fromLabel || percent == null) return null;
  const detail = value.replace(/^[\d.]+\s*%\s*[·•-]?\s*/i, "").trim() || undefined;
  return {
    name: fromLabel,
    percent,
    detail: detail !== fromLabel ? detail : undefined,
  };
}

function parseMainShareholder(value: string): ShareholderStake | null {
  const percent = parsePercent(value);
  if (percent == null) return null;
  const name = value.split(/[—–-]/)[0]?.trim() || value;
  return { name, percent };
}

/** Build ownership from legacy keyFacts rows (Shareholder:, Main shareholder, etc.). */
export function parseOwnershipFromKeyFacts(
  keyFacts: { label: string; value: string }[]
): OwnershipBreakdown | null {
  const shareholders: ShareholderStake[] = [];

  for (const fact of keyFacts) {
    if (/^Shareholder:/i.test(fact.label)) {
      const row = parseShareholderFact(fact.label, fact.value);
      if (row) shareholders.push(row);
    } else if (/^Main shareholder/i.test(fact.label)) {
      const row = parseMainShareholder(fact.value);
      if (row) shareholders.push(row);
    } else if (/^Shareholder$/i.test(fact.label.trim())) {
      const row = parseShareholderFact(`Shareholder: ${fact.value}`, fact.value);
      if (row) shareholders.push(row);
    }
  }

  if (!shareholders.length) return null;

  shareholders.sort((a, b) => b.percent - a.percent);
  return { shareholders };
}

function enrichBreakdown(ownership: OwnershipBreakdown): OwnershipBreakdown {
  return {
    ...ownership,
    shareholders: ownership.shareholders.map((s) =>
      s.name === "Other holders" ? { ...s, isOther: true } : enrichShareholderStake(s)
    ),
  };
}

export function resolveOwnership(company: CompanyProfile): OwnershipBreakdown | null {
  if (company.ownership?.shareholders?.length) {
    return enrichBreakdown(company.ownership);
  }
  const fromFacts = parseOwnershipFromKeyFacts(company.keyFacts ?? []);
  return fromFacts ? enrichBreakdown(fromFacts) : null;
}

export type PieSlice = ShareholderStake & {
  color: string;
  isOther?: boolean;
};

export function buildPieSlices(shareholders: ShareholderStake[], maxSlices = 10): PieSlice[] {
  const top = [...shareholders]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, maxSlices);

  const sum = top.reduce((acc, s) => acc + s.percent, 0);
  const otherPercent = Math.round((100 - sum) * 100) / 100;

  const slices: PieSlice[] = top.map((s, i) => ({
    ...s,
    color: pieColor(i),
  }));

  if (otherPercent > 0.15) {
    slices.push({
      name: "Other holders",
      percent: otherPercent,
      color: pieColor(slices.length),
      isOther: true,
    });
  }

  return slices;
}

export function holderMetaLine(stake: ShareholderStake): string {
  const parts: string[] = [];
  if (stake.orgTypeLabel) parts.push(stake.orgTypeLabel);
  if (stake.isListed && stake.listedTicker) {
    parts.push(stake.listedExchange ? `Listed · ${stake.listedExchange}: ${stake.listedTicker}` : `Listed · ${stake.listedTicker}`);
  } else if (stake.isListed === false) {
    parts.push("Private");
  }
  return parts.join(" · ");
}

export function shareholderInitials(name: string) {
  const words = name.replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
