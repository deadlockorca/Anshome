import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WikiSubnav } from "@/components/wiki/wiki-subnav";
import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

const ARTICLES_PER_PAGE = 12;

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

function getWikiCategoryLabel(cat: { slug: string }): string {
  const map: Record<string, string> = {
    "mua-bat-dong-san": "Mua BĐS",
    "ban-bat-dong-san": "Bán BĐS",
    "thue-bat-dong-san": "Thuê BĐS",
    "tai-chinh-bat-dong-san": "Tài chính BĐS",
    "quy-hoach-phap-ly": "Quy hoạch - Pháp lý",
    "noi-ngoai-that": "Nội - Ngoại thất",
    "phong-tuc": "Phong tục",
  };
  return map[cat.slug] ?? cat.slug;
}

function getWikiCategoryTitle(cat: { slug: string }): string {
  const map: Record<string, string> = {
    "mua-bat-dong-san": "Mua bất động sản",
    "ban-bat-dong-san": "Bán bất động sản",
    "thue-bat-dong-san": "Thuê bất động sản",
    "tai-chinh-bat-dong-san": "Tài chính bất động sản",
    "quy-hoach-phap-ly": "Quy hoạch - Pháp lý",
    "noi-ngoai-that": "Nội - Ngoại thất",
    "phong-tuc": "Phong tục",
  };
  return map[cat.slug] ?? cat.slug;
}

function getWikiCategoryDescription(cat: { slug: string }): string {
  const map: Record<string, string> = {
    "mua-bat-dong-san": "Các chỉ dẫn, mẹo hay, kinh nghiệm mua bất động sản dành cho người mua nhà tại Việt Nam.",
    "ban-bat-dong-san": "Các chỉ dẫn, kinh nghiệm bán bất động sản hiệu quả dành cho người bán nhà.",
    "thue-bat-dong-san": "Kinh nghiệm, các chỉ dẫn thuê bất động sản và nhà ở phù hợp nhu cầu.",
    "tai-chinh-bat-dong-san": "Các kiến thức tài chính, vay vốn, thuế và các chi phí liên quan khi mua bán bất động sản.",
    "quy-hoach-phap-ly": "Thông tin quy hoạch chi tiết tại các địa phương, tỉnh thành, các vấn đề liên quan pháp lý dự án, pháp lý bất động sản.",
    "noi-ngoai-that": "Gợi ý, tư vấn thiết kế nội thất - ngoại thất giúp bạn hoàn thiện, làm đẹp không gian sống.",
    "phong-tuc": "Chỉ dẫn của Anshome về phong tục, tư vấn phong tục nhà ở, văn phòng.",
  };
  return map[cat.slug] ?? "";
}

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

function resolvePage(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

type SearchParams = {
  page?: string;
  tab?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.articleCategory.findUnique({
    where: { slug },
    select: { slug: true },
  });

  if (!category) {
    return { title: "Không tìm thấy chuyên mục | Wiki BĐS | Anshome" };
  }

  return {
    title: `${getWikiCategoryLabel(category)} | Wiki BĐS | Anshome`,
    description: getWikiCategoryDescription(category),
    alternates: {
      canonical: `${getSiteUrl()}/wiki/${slug}`,
    },
    openGraph: {
      title: `${getWikiCategoryLabel(category)} | Wiki BĐS | Anshome`,
      description: getWikiCategoryDescription(category),
      url: `${getSiteUrl()}/wiki/${slug}`,
      type: "website",
    },
  };
}

export default async function WikiCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = resolvePage(sp.page);
  const tab = sp.tab === "hot" ? "hot" : "new";

  const category = await db.articleCategory.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (!category) {
    notFound();
  }

  const where: Prisma.ArticleWhereInput = {
    categoryId: category.id,
    status: "published",
    publishedAt: { not: null },
  };

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] = tab === "hot"
    ? [{ viewCount: "desc" }, { publishedAt: "desc" }]
    : [{ publishedAt: "desc" }];

  const [articles, total, wikiCategories, provinces, hotArticles] = await Promise.all([
    db.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
      include: articleCardInclude,
    }),
    db.article.count({ where }),
    db.articleCategory.findMany({
      where: { slug: { in: WIKI_CATEGORY_SLUGS } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.location.findMany({
      where: { type: "province", isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, slug: true },
      take: 10,
    }),
    db.article.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
      take: 4,
      include: {
        coverMedia: {
          select: { publicUrl: true },
        },
      },
    }),
  ]);

  const featured = articles[0];
  const gridArticles = articles.slice(0);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <WikiSubnav activeSlug={slug} />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/wiki" className="hover:text-brand">Wiki BĐS</Link>
          <span>/</span>
          <span className="text-[#303743]">{getWikiCategoryLabel(category)}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="min-w-0">
            <h1 className="text-[22px] font-extrabold leading-8 text-[#20242d]">{getWikiCategoryTitle(category)}</h1>
            <p className="mt-1 text-[14px] font-semibold text-[#66707c]">{getWikiCategoryDescription(category)}</p>

            {featured ? (
              <Link href={`/tin-tuc/${featured.slug}`} className="group mt-6 block overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#e9ecef]">
                  {featured.coverMedia?.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.coverMedia.publicUrl} alt={featured.title} className="h-full w-full object-cover" loading="eager" />
                  ) : (
                    <span className="grid h-full place-items-center text-sm font-bold text-[#7a808c]">Wiki</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-bold text-brand">{getWikiCategoryLabel(category)}</p>
                  <h2 className="mt-1 text-[17px] font-extrabold leading-7 text-[#20242d] group-hover:text-brand">{featured.title}</h2>
                  <p className="mt-2 line-clamp-2 text-[14px] font-medium leading-6 text-[#66707c]">{featured.excerpt}</p>
                  <p className="mt-2 text-[12px] font-bold text-[#8b8f96]">{formatWikiDate(featured.publishedAt)}</p>
                </div>
              </Link>
            ) : null}

            <div className="mt-6 flex items-center gap-4 border-b border-[#e1e4ea]">
              <Link
                href={`/wiki/${slug}`}
                className={`pb-2 text-[13px] font-extrabold ${tab !== "hot" ? "border-b-2 border-brand text-brand" : "text-[#8b8f96]"}`}
              >
                Mới nhất
              </Link>
              <Link
                href={`/wiki/${slug}?tab=hot`}
                className={`pb-2 text-[13px] font-extrabold ${tab === "hot" ? "border-b-2 border-brand text-brand" : "text-[#8b8f96]"}`}
              >
                Bài viết xem nhiều
              </Link>
            </div>

            {gridArticles.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {gridArticles.map((article) => (
                  <WikiArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có bài viết trong chuyên mục này.
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Phân trang">
                {page > 1 ? (
                  <Link
                    href={pageHref(page - 1, slug, tab)}
                    className="grid h-9 min-w-9 place-items-center rounded-md border border-[#d8dce3] bg-white px-2 text-[13px] font-extrabold text-[#30343d] hover:border-[#c7352d] hover:text-[#c7352d]"
                  >
                    Trước
                  </Link>
                ) : null}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
                  <Link
                    key={item}
                    href={pageHref(item, slug, tab)}
                    aria-current={item === page ? "page" : undefined}
                    className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-[13px] font-extrabold ${
                      item === page
                        ? "border-[#e43d35] bg-[#e43d35] text-white"
                        : "border-[#d8dce3] bg-white text-[#30343d] hover:border-[#c7352d] hover:text-[#c7352d]"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
                {page < totalPages ? (
                  <Link
                    href={pageHref(page + 1, slug, tab)}
                    className="grid h-9 min-w-9 place-items-center rounded-md border border-[#d8dce3] bg-white px-2 text-[13px] font-extrabold text-[#30343d] hover:border-[#c7352d] hover:text-[#c7352d]"
                  >
                    Sau
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </section>

          <aside className="content-start gap-4 lg:grid">
            <div className="rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[13px] font-extrabold text-[#20242d]">Wiki BĐS</h3>
              <div className="flex flex-col gap-1">
                {wikiCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/wiki/${cat.slug}`}
                    className={`text-[13px] font-bold ${cat.slug === slug ? "text-brand" : "text-[#303743] hover:text-brand"}`}
                  >
                    {getWikiCategoryLabel(cat)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[13px] font-extrabold text-[#20242d]">Tỉnh/thành nổi bật</h3>
              <div className="flex flex-col gap-1">
                {provinces.slice(0, 8).map((province) => (
                  <Link
                    key={province.id}
                    href={`/tin-tuc?category=${slug}&province=${province.slug}`}
                    className="text-[13px] font-bold text-[#303743] hover:text-brand"
                  >
                    {province.fullName}
                  </Link>
                ))}
              </div>
              <Link href="/tin-tuc" className="mt-2 inline-block text-[12px] font-bold text-brand">Xem thêm</Link>
            </div>

            <div className="rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[13px] font-extrabold text-[#20242d]">Bài viết nổi bật</h3>
              <div className="flex flex-col gap-3">
                {hotArticles.slice(0, 4).map((article) => (
                  <Link key={article.id} href={`/tin-tuc/${article.slug}`} className="group flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#e9ecef]">
                      {article.coverMedia?.publicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.coverMedia.publicUrl} alt={article.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h4 className="line-clamp-2 text-[12px] font-extrabold leading-4 text-[#20242d] group-hover:text-brand">{article.title}</h4>
                      <p className="mt-1 text-[11px] font-bold text-[#8b8f96]">{formatWikiDate(article.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
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

function pageHref(page: number, slug: string, tab: string): string {
  const query = new URLSearchParams();
  if (tab === "hot") {
    query.set("tab", "hot");
  }
  if (page > 1) {
    query.set("page", String(page));
  }
  const queryString = query.toString();
  return `/wiki/${slug}${queryString ? `?${queryString}` : ""}`;
}
