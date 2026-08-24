import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-shard/static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-shard/listings.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-shard/articles.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
