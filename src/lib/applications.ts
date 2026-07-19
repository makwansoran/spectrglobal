export const applicationSlugs = [
  "defense",
  "denied-environments",
  "isr",
  "fleet",
  "mission-command",
  "field-ops",
] as const;

export type ApplicationSlug = (typeof applicationSlugs)[number];

export function isApplicationSlug(value: string): value is ApplicationSlug {
  return (applicationSlugs as readonly string[]).includes(value);
}
