import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = "https://www.spectr.no";

const staticPaths = [
  "",
  "/about",
  "/research",
  "/news",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
];

function localizedUrl(locale: string, path: string) {
  if (locale === routing.defaultLocale) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
