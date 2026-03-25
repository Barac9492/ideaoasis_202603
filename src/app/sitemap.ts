import type { MetadataRoute } from "next";
import { getAllDigestDates, getDigestByDate, getAllWeeklyDates } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({
    url: `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  // About
  entries.push({
    url: `${SITE_URL}/about/`,
    changeFrequency: "monthly",
    priority: 0.3,
  });

  // Idea detail pages
  const dates = getAllDigestDates();
  for (const date of dates) {
    const digest = getDigestByDate(date);
    if (!digest) continue;
    for (const idea of digest.ideas) {
      entries.push({
        url: `${SITE_URL}/idea/${idea.id}/`,
        lastModified: new Date(digest.generated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // Archive pages
  const totalPages = Math.max(1, Math.ceil(dates.length / 20));
  for (let i = 1; i <= totalPages; i++) {
    entries.push({
      url: `${SITE_URL}/archive/${i}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    });
  }

  // Weekly deep-dive pages
  const weeklyDates = getAllWeeklyDates();
  for (const week of weeklyDates) {
    entries.push({
      url: `${SITE_URL}/weekly/${week}/`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
