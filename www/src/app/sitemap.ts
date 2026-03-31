import type { MetadataRoute } from "next";
import { blog, source } from "@/lib/source";

const BASE_URL = "https://rosette.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changeFrequency: "weekly" as const,
  }));

  const blogPosts = blog.getPages().map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(page.data.date),
    changeFrequency: "monthly" as const,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly",
    },
  ];

  return [...staticRoutes, ...docs, ...blogPosts];
}
