import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { publishDueScheduledArticles } from "@/lib/articles/publish";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/seo/landing";
import { ArticleViewTracker } from "@/components/articles/article-view-tracker";

export const dynamic = "force-dynamic";

const articleDetailInclude = {
  coverMedia: {
    select: {
      publicUrl: true,
    },
  },
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  author: {
    include: {
      profile: {
        select: {
          displayName: true,
        },
      },
    },
  },
} satisfies Prisma.ArticleInclude;

const relatedArticleInclude = {
  coverMedia: {
    select: {
      publicUrl: true,
    },
  },
} satisfies Prisma.ArticleInclude;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await publishDueScheduledArticles();
  const { slug } = await params;
  const article = await db.article.findFirst({
    where: { slug, status: "published", publishedAt: { not: null } },
    select: {
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      noindex: true,
      coverMedia: { select: { publicUrl: true } },
    },
  });

  if (!article) {
    return {
      title: "Không tìm thấy bài viết | Anshome",
    };
  }

  const title = article.seoTitle ?? `${article.title} | Anshome`;
  const description = article.seoDescription ?? article.excerpt ?? undefined;
  const canonical = article.canonicalUrl ?? `${getSiteUrl()}/tin-tuc/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: article.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: article.coverMedia?.publicUrl ? [article.coverMedia.publicUrl] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  await publishDueScheduledArticles();
  const { slug } = await params;
  const article = await db.article.findFirst({
    where: { slug, status: "published", publishedAt: { not: null } },
    include: articleDetailInclude,
  });

  if (!article) {
    notFound();
  }

  const [relatedArticles, latestArticles] = await Promise.all([
    db.article.findMany({
      where: {
        status: "published",
        publishedAt: { not: null },
        id: { not: article.id },
        ...(article.categoryId ? { categoryId: article.categoryId } : {}),
      },
      orderBy: [{ publishedAt: "desc" }],
      take: 3,
      include: relatedArticleInclude,
    }),
    db.article.findMany({
      where: {
        status: "published",
        publishedAt: { not: null },
        id: { not: article.id },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
    }),
  ]);

  const authorName = article.author?.profile?.displayName ?? article.author?.email ?? "Anshome";
  const publishedLabel = formatPublishedDate(article.publishedAt);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.coverMedia?.publicUrl ?? undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Anshome",
    },
  };

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <ArticleViewTracker articleId={article.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <section className="mx-auto w-full max-w-[820px] px-4 py-6">
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-[#c7352d]">Anshome</Link>
          <span className="mx-1">/</span>
          <Link href="/tin-tuc" className="hover:text-[#c7352d]">Tin tức</Link>
          {article.category ? (
            <>
              <span className="mx-1">/</span>
              <Link href={`/tin-tuc?category=${article.category.slug}`} className="hover:text-[#c7352d]">
                {article.category.name}
              </Link>
            </>
          ) : null}
        </nav>

        <article className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
          {article.coverMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverMedia.publicUrl} alt={article.title} className="max-h-[420px] w-full object-cover" />
          ) : null}
          <div className="p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{article.category?.name ?? "Tin tức"}</p>
            <h1 className="mt-2 text-[26px] font-extrabold leading-8 text-[#20242d]">{article.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-[#8a8f99]">
              <span>{authorName}</span>
              <span>·</span>
              <span>{publishedLabel}</span>
            </div>
            {article.excerpt ? (
              <p className="mt-5 border-l-2 border-[#c7352d] pl-4 text-[15px] font-semibold leading-6 text-[#4a515e]">{article.excerpt}</p>
            ) : null}
            <div className="mt-6 whitespace-pre-wrap text-[15px] font-medium leading-7 text-[#333a46]">{article.body}</div>
          </div>
        </article>

        {relatedArticles.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-[18px] font-extrabold leading-6 text-[#20242d]">Bài viết liên quan</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link key={item.id} href={`/tin-tuc/${item.slug}`} className="group overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
                  {item.coverMedia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverMedia.publicUrl} alt={item.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="aspect-[16/9] bg-[#eceff3]" />
                  )}
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#20242d] group-hover:text-[#c7352d]">{item.title}</h3>
                    <p className="mt-2 text-[12px] font-semibold text-[#8a8f99]">{formatPublishedDate(item.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-[820px] px-4 pb-8">
        <div className="rounded-md border border-[#e1e4ea] bg-white p-4">
          <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">Bài viết mới nhất</h2>
          <div className="mt-3 grid gap-2">
            {latestArticles.map((item) => (
              <Link key={item.id} href={`/tin-tuc/${item.slug}`} className="flex items-baseline justify-between gap-3 border-b border-[#edf0f3] pb-2 text-[13px] font-semibold text-[#4a515e] last:border-0 last:pb-0 hover:text-[#c7352d]">
                <span className="line-clamp-1">{item.title}</span>
                <span className="shrink-0 text-[12px] text-[#8a8f99]">{formatPublishedDate(item.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function formatPublishedDate(value: Date | null): string {
  if (!value) {
    return "Mới cập nhật";
  }

  const diffDays = Math.max(0, Math.floor((Date.now() - value.getTime()) / 86_400_000));
  if (diffDays === 0) {
    return "Hôm nay";
  }
  if (diffDays === 1) {
    return "Hôm qua";
  }
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }
  return value.toLocaleDateString("vi-VN");
}
