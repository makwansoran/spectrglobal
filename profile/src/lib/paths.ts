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
