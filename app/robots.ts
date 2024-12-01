import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/home/",
      disallow: [
        "/",
        "/administration/",
        "/hom/datenschutz/",
        "/home/impressum/",
      ],
    },
    sitemap: "https://www.psychotherapie-seliger.de/sitemap.xml",
  };
}
