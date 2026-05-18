import type { CompanyFinancialsPayload } from "../api/financials";

function escapeCsv(value: string | number | null | undefined) {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function periodsToCsvRows(
  rows: CompanyFinancialsPayload["financials"]["annual"],
  currency: string
) {
  const header = [
    "period",
    "period_end",
    "form",
    "revenue",
    "gross_profit",
    "operating_income",
    "net_income",
    "operating_cash_flow",
    "currency",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.period,
        row.periodEnd,
        row.form,
        row.revenue,
        row.grossProfit,
        row.operatingIncome,
        row.netIncome,
        row.operatingCashFlow ?? "",
        currency,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function buildFinancialsCsv(payload: CompanyFinancialsPayload) {
  const { financials, companyName, ticker, slug } = payload;
  const currency = financials.currency || financials.meta?.currency || "USD";
  const parts = [
    `# ${companyName} (${ticker || slug}) — financials export`,
    `# Source: ${financials.meta?.source || financials.source || "Spectr"}`,
    `# As of: ${financials.meta?.asOf || financials.asOf || new Date().toISOString()}`,
    "",
    "## Annual",
    periodsToCsvRows(financials.annual, currency),
    "",
    "## Quarterly",
    periodsToCsvRows(financials.quarterly, currency),
  ];
  return parts.join("\n");
}

export function downloadFinancialsCsv(payload: CompanyFinancialsPayload) {
  const csv = buildFinancialsCsv(payload);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${payload.slug}-financials.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadFinancialsJson(payload: CompanyFinancialsPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${payload.slug}-financials.json`;
  a.click();
  URL.revokeObjectURL(url);
}
