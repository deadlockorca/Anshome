import { db } from "@/lib/db";
import { buildListingDetailPath } from "@/lib/listing-url";
import { getSiteUrl } from "@/lib/seo/landing";
import { buildSitemapUrlSet } from "@/lib/sitemap/xml";

export const dynamic = "force-dynamic";

const LISTINGS_PER_SHARD = 5000;

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const listings = await db.listing.findMany({
    where: { status: "published" },
    orderBy: { updatedAt: "desc" },
    take: LISTINGS_PER_SHARD,
    select: {
      publicId: true,
      slug: true,
      updatedAt: true,
    },
  });

  return buildSitemapUrlSet(
    listings.map((listing) => ({
      url: `${siteUrl}${buildListingDetailPath(listing)}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  );
}
