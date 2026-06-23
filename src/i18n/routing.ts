import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "no"],
  defaultLocale: "no",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
