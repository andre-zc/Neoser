import type { MetadataRoute } from "next";
import { services } from "@/lib/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://neoser.pe";

const COURSE_SLUGS = [
  "prep-parto",
  "diplomado-parto",
  "rebozo-cert",
  "taller-lactancia",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((s) => ({
      url: `${SITE_URL}/servicios/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/cursos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...COURSE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/cursos/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
