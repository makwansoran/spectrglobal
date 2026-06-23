import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = "https://www.spectr.no";

export function localeAlternates(path = "", locale?: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};

  for (const loc of routing.locales) {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    languages[loc] = `${baseUrl}${prefix}${path}`;
  }

  languages["x-default"] = `${baseUrl}${path}`;

  const activeLocale = locale && routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;

  return {
    canonical: languages[activeLocale],
    languages,
  };
}

export function localizedPath(locale: string, path: string) {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

export const defaultOgImage = {
  url: `${baseUrl}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Spectr — mission-ready aerial systems from Norway",
};

export function buildPageMetadata({
  title,
  description,
  path = "",
  locale,
}: {
  title: string;
  description: string;
  path?: string;
  locale?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: "Spectr",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
    },
  };
}
