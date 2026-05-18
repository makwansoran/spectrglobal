/** Top-level person profile URL (served by the same SPA as /company/*). */
export function personProfilePath(personSlug: string) {
  return `/person/${personSlug}`;
}

/** Company profile URL. */
export function companyProfilePath(companySlug: string) {
  return `/company/${companySlug}`;
}
