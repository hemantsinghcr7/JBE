import type { MetadataRoute } from "next";

const BASE_URL = "https://jbe-one.vercel.app";

// Update BASE_URL when the custom domain (jbhawanienterprises.in) goes live.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
