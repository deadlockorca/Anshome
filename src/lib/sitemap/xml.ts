export function buildSitemapUrlSet(entries: Array<{ url: string; lastModified?: Date; changeFrequency?: string; priority?: number }>): Response {
  const items = entries
    .map((entry) => {
      const lastModified = entry.lastModified?.toISOString();
      const changeFrequency = entry.changeFrequency;
      const priority = entry.priority != null ? entry.priority.toFixed(1) : undefined;

      return [
        "    <url>",
        `      <loc>${xmlEscape(entry.url)}</loc>`,
        ...(lastModified ? [`      <lastmod>${lastModified}</lastmod>`] : []),
        ...(changeFrequency ? [`      <changefreq>${changeFrequency}</changefreq>`] : []),
        ...(priority ? [`      <priority>${priority}</priority>`] : []),
        "    </url>",
      ].join("\n");
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}