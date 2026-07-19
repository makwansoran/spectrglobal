export const applicationSlugs = [
  "defense",
  "denied-environments",
  "isr",
  "fleet",
  "mission-command",
  "field-ops",
] as const;

export type ApplicationSlug = (typeof applicationSlugs)[number];

/** Four homepage cards — Reflect-style horizontal row. */
export const featuredApplicationSlugs = [
  "defense",
  "denied-environments",
  "fleet",
  "mission-command",
] as const satisfies readonly ApplicationSlug[];

export const applicationCardImages: Record<(typeof featuredApplicationSlugs)[number], string> = {
  defense: "/covertops.png",
  "denied-environments": "/norway-operations.png",
  fleet: "/centurion-fleet-coordination.png",
  "mission-command": "/centurion-laptop-mockup.png",
};

export function isApplicationSlug(value: string): value is ApplicationSlug {
  return (applicationSlugs as readonly string[]).includes(value);
}
