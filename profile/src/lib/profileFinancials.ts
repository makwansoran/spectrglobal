import type { CompanyFinancialsPayload } from "../api/financials";
import type { CompanyProfile } from "../types/company";

function annualFromYears(years: CompanyProfile["financials"]["years"]) {
  return years.map((y) => ({
    period: String(y.year),
    fiscalYear: y.year,
    periodEnd: `${y.year}-12-31`,
    revenue: y.revenue ?? null,
    grossProfit: null,
    operatingIncome: y.ebitda ?? null,
    netIncome: y.netIncome ?? null,
    operatingCashFlow: null,
    ebitda: y.ebitda ?? null,
  }));
}

/** Build financials payload from profile_json already loaded on the company page. */
export function financialsFromProfile(company: CompanyProfile): CompanyFinancialsPayload | null {
  const fin = company.financials;
  const years = fin?.years ?? [];
  const quarters = fin?.quarters ?? [];
  const metrics = fin?.metrics ?? [];
  const storedAnnual = (fin as { annual?: CompanyFinancialsPayload["financials"]["annual"] })?.annual;

  const annual = storedAnnual?.length ? storedAnnual : annualFromYears(years);
  const hasData = annual.length > 0 || quarters.length > 0 || metrics.length > 0;
  if (!hasData) return null;

  return {
    slug: company.id,
    isPublic: company.isPublic,
    ticker: company.stock?.ticker ?? null,
    companyName: company.name,
    hasData: true,
    financials: {
      currency: fin.meta?.currency || company.stock?.currency || "USD",
      source: fin.meta?.source,
      annual,
      quarterly: quarters as CompanyFinancialsPayload["financials"]["quarterly"],
      years,
      metrics,
      meta: fin.meta,
    },
  };
}

export function mergeFinancialsPayload(
  fromProfile: CompanyFinancialsPayload | null,
  fromApi: CompanyFinancialsPayload | null
): CompanyFinancialsPayload | null {
  if (!fromProfile && !fromApi) return null;
  if (!fromProfile) return fromApi;
  if (!fromApi?.hasData) return fromProfile;

  const p = fromProfile.financials;
  const a = fromApi.financials;

  const annual = a.annual?.length ? a.annual : p.annual;
  const quarterly = a.quarterly?.length ? a.quarterly : p.quarterly;
  const years = a.years?.length ? a.years : p.years;
  const metrics = a.metrics?.length ? a.metrics : p.metrics;

  return {
    ...fromApi,
    hasData: true,
    financials: {
      ...p,
      ...a,
      annual,
      quarterly,
      years,
      metrics,
    },
  };
}
