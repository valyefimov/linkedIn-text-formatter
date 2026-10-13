import type { MetadataRoute } from "next";
import { UPDATED, absoluteUrl } from "@/lib/site/site";

const PAGES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: UPDATED,
    changeFrequency,
    priority,
  }));
}
