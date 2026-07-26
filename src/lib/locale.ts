/**
 * The site is English-only. These helpers remain so that content authored as
 * `{ en: "..." }` records keeps working if additional languages return later.
 */
export type Localized<T = string> = { en: T } & Partial<Record<string, T>>;

export function pick<T>(value: Localized<T>): T {
  return value.en;
}
