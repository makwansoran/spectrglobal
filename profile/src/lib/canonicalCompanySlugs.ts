/** Old or duplicate slugs → canonical profile (permanent redirects). */
export const CANONICAL_COMPANY_SLUG_REDIRECTS: Record<string, string> = {
  "equinor-eqnr": "equinor",
  "us-stohf": "equinor",
  "us-akrbf": "aker-bp-asa-akrbp",
  "us-akrby": "aker-bp-asa-akrbp",
};

export function canonicalCompanySlug(slug: string | undefined): string | undefined {
  if (!slug) return slug;
  return CANONICAL_COMPANY_SLUG_REDIRECTS[slug] ?? slug;
}
