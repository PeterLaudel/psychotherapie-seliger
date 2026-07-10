import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.psychotherapie-seliger.de/home",
      lastModified: new Date("2026-07-10"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
