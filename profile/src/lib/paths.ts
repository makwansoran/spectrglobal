import type { CompanySearchItem } from "../api/companies";

/** Top-level person profile URL (served by the same SPA as /company/*). */
export function personProfilePath(personSlug: string) {
  return `/person/${personSlug}`;
}

/** Company profile URL (overview tab). */
export function companyProfilePath(companySlug: string, tab?: string) {
  const base = `/company/${companySlug}`;
  if (!tab || tab === "overview") return base;
  return `${base}/${tab}`;
}

/** Institutional holder profile (under /company basename). */
export function holderProfilePath(holderSlug: string) {
  return `/holder/${holderSlug}`;
}

/** Absolute app path for unified search results (works from any SPA basename). */
export function searchResultHref(item: Pick<CompanySearchItem, "id" | "kind" | "url">): string {
  if (item.url?.startsWith("/")) return item.url;
  if (item.kind === "waterway") return `/waterway/${item.id}`;
  if (item.kind === "commodity") return `/commodity/${item.id}`;
  if (item.kind === "person") return `/person/${item.id}`;
  return `/company/${item.id}`;
}
