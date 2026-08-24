import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo/landing";
import { buildSitemapUrlSet } from "@/lib/sitemap/xml";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const articles = await db.article.findMany({
    where: { status: "published", publishedAt: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: 10000,
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return buildSitemapUrlSet(
    articles.map((article) => ({
      url: `${siteUrl}/tin-tuc/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  );
}
