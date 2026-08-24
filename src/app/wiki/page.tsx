import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WikiSubnav } from "@/components/wiki/wiki-subnav";
import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

const articleCardInclude = {
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
} satisfies Prisma.ArticleInclude;

type ArticleCard = Prisma.ArticleGetPayload<{ include: typeof articleCardInclude }>;

const WIKI_CATEGORY_SLUGS = [
  "mua-bat-dong-san",
  "ban-bat-dong-san",
  "thue-bat-dong-san",
  "tai-chinh-bat-dong-san",
  "quy-hoach-phap-ly",
  "noi-ngoai-that",
  "phong-tuc",
];

function formatWikiDate(value: Date | null): string {
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Wiki BĐS | Anshome",
    description: "Kiến thức bất động sản, mẹo hay, tài chính, phong tục và nội ngoại thất trên Anshome.",
    alternates: {
      canonical: `${getSiteUrl()}/wiki`,
    },
    openGraph: {
      title: "Wiki BĐS | Anshome",
      description: "Kiến thức bất động sản, mẹo hay, tài chính, phong tục và nội ngoại thất trên Anshome.",
      url: `${getSiteUrl()}/wiki`,
      type: "website",
    },
  };
}

export default async function WikiHubPage() {
  const featuredArticles = await db.article.findMany({
    where: {
      status: "published",
      publishedAt: { not: null },
      category: { slug: { in: WIKI_CATEGORY_SLUGS } },
    },
    orderBy: [{ publishedAt: "desc" }],
    take: 6,
    include: articleCardInclude,
  });

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <WikiSubnav />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        {featuredArticles.length > 0 ? (
          <div>
            <h2 className="mb-4 text-[17px] font-extrabold text-[#20242d]">Bài viết nổi bật</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <WikiArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
      <SiteFooter />
    </main>
  );
}

function WikiArticleCard({ article }: { article: ArticleCard }) {
  return (
    <article className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
      <Link href={`/tin-tuc/${article.slug}`} className="block bg-[#f0f2f5]">
        {article.coverMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coverMedia.publicUrl} alt={article.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-[#eceff3] text-xs font-extrabold text-[#6c7280]">Ảnh bài viết</div>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-normal text-brand">{article.category?.name ?? "Wiki BĐS"}</p>
        <Link href={`/tin-tuc/${article.slug}`} className="mt-1 block line-clamp-2 text-[15px] font-extrabold leading-5 text-[#20242d] hover:text-brand">
          {article.title}
        </Link>
        {article.excerpt ? <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[#5f6675]">{article.excerpt}</p> : null}
        <p className="mt-3 text-[12px] font-semibold text-[#8a8f99]">{formatWikiDate(article.publishedAt)}</p>
      </div>
    </article>
  );
}
