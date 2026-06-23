import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en;
}

export function pickOptional<T>(value: Partial<Localized<T>> | undefined, locale: Locale, fallback: T): T {
  if (!value) return fallback;
  return value[locale] ?? value.en ?? fallback;
}
