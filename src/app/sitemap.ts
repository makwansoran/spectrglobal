import type { MetadataRoute } from "next";
import { hubPaths } from "@/lib/hubs";
import { site } from "@/lib/site";
import { getIndustrySlugs } from "@/lib/use-cases";

const paths = [
  "",
  "/platforms/spectr-os",
  "/about",
  "/careers",
  "/careers/open-positions",
  "/careers/getting-hired",
  "/careers/students",
  "/careers/life",
  "/careers/apply",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
  "/bootcamp",
  "/waitlist",
  ...hubPaths,
  ...getIndustrySlugs().map((slug) => `/use-cases/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
