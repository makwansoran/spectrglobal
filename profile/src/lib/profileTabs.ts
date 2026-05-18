/** Profile sub-routes under /company/:slug/:tab */
export const COMPANY_TAB_IDS = [
  "overview",
  "people",
  "ownership",
  "financials",
  "news",
  "filings",
  "industry",
  "chat",
] as const;

export type CompanyTabId = (typeof COMPANY_TAB_IDS)[number];

export function companyTabFromPath(pathname: string, entityId: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf(entityId);
  if (idx === -1) return "overview";
  const segment = parts[idx + 1];
  if (!segment || segment === entityId) return "overview";
  return segment;
}

export function profileTabHref(basePath: string, tabId: string): string {
  const base = basePath.replace(/\/$/, "");
  if (!tabId || tabId === "overview") return base || "/";
  return `${base}/${tabId}`;
}
