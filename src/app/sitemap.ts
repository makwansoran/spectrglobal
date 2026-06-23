import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { articles } from "@/lib/articles";
import { docPages } from "@/lib/docs";
import { products } from "@/lib/objects";
import { newsroomCards } from "@/lib/newsroom";
import { securityPrinciples } from "@/lib/security-principles";

const baseUrl = "https://www.spectr.no";

const staticPaths = [
  "",
  "/about",
  "/careers",
  "/contact",
  "/documentation",
  "/investor",
  "/newsroom",
  "/privacy",
  "/products",
  "/security",
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

    for (const product of products) {
      entries.push({ url: localizedUrl(locale, `/products/${product.slug}`), lastModified: new Date() });
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

    for (const doc of docPages) {
      entries.push({ url: localizedUrl(locale, `/documentation/${doc.slug}`), lastModified: new Date() });
    }

    for (const principle of securityPrinciples) {
      entries.push({ url: localizedUrl(locale, `/security/${principle.slug}`), lastModified: new Date() });
    }
  }

  return entries;
}
