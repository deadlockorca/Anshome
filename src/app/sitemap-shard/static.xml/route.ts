import { getSiteUrl, getSitemapSeoEntries } from "@/lib/seo/landing";
import { buildSitemapUrlSet } from "@/lib/sitemap/xml";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const seoEntries = await getSitemapSeoEntries();

  return buildSitemapUrlSet([
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/tin-tuc`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/trang-sitemap`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...seoEntries,
  ]);
}
