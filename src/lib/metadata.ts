import type { Metadata } from "next";
import { site } from "@/lib/site";

export const defaultOgImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${site.name} — Droid and Spectr C2`,
};

export function buildPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
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
