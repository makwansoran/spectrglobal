import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const paths = [
  "",
  "/platforms/spectr-os",
  "/about",
  "/careers",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
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
