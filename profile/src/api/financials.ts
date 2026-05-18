import type { FinancialMetric, FinancialYear } from "../types/company";

export type FinancialPeriod = {
  period: string;
  fiscalYear: number;
  fiscalQuarter?: number;
  periodEnd: string;
  form?: string | null;
  filedDate?: string | null;
  revenue: number | null;
  grossProfit: number | null;
  operatingIncome: number | null;
  netIncome: number | null;
  operatingCashFlow?: number | null;
  ebitda?: number | null;
};

export type CompanyFinancialsBlock = {
  currency: string;
  source?: string;
  symbol?: string | null;
  cik?: string | null;
  asOf?: string;
  annual: FinancialPeriod[];
  quarterly: FinancialPeriod[];
  years: FinancialYear[];
  metrics: FinancialMetric[];
  meta?: {
    source?: string;
    currency?: string;
    asOf?: string;
    symbol?: string;
    cik?: string;
  };
};

export type CompanyFinancialsPayload = {
  slug: string;
  isPublic: boolean;
  ticker: string | null;
  companyName: string;
  hasData: boolean;
  financials: CompanyFinancialsBlock;
};

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchCompanyFinancials(
  slug: string,
  signal?: AbortSignal
): Promise<CompanyFinancialsPayload> {
  const res = await fetch(`${apiBase}/api/companies/${encodeURIComponent(slug)}/financials`, { signal });
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("Failed to load financials");
  return res.json();
}
