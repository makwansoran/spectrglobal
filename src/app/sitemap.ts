import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { articles } from "@/lib/articles";
import { newsroomCards } from "@/lib/newsroom";

const baseUrl = "https://www.spectr.no";

const staticPaths = [
  "",
  "/about",
  "/autonomous-engine",
  "/centurion",
  "/careers",
  "/contact",
  "/newsroom",
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

    for (const card of newsroomCards) {
      entries.push({ url: localizedUrl(locale, `/newsroom/${card.slug}`), lastModified: new Date() });
    }

    for (const article of articles) {
      entries.push({
        url: localizedUrl(locale, `/newsroom/${article.category}/${article.slug}`),
        lastModified: new Date(article.date),
      });
    }
  }

  return entries;
}
