import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl, getSitemapSeoEntries } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [seoEntries, listings] = await Promise.all([
    getSitemapSeoEntries(),
    db.listing.findMany({
      where: { status: "published" },
      orderBy: { updatedAt: "desc" },
      take: 5000,
      select: {
        publicId: true,
        updatedAt: true,
      },
    }),
  ]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/tin-dang`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/trang-sitemap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...seoEntries,
    ...listings.map((listing) => ({
      url: `${siteUrl}/tin-dang/${listing.publicId}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
