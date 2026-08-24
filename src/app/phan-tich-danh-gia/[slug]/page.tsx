import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

const ARTICLES_PER_PAGE = 12;

const ANALYSIS_CATEGORIES = [
  {
    slug: "bieu-do-gia",
    label: "Biểu đồ giá",
    title: "Biểu đồ giá bất động sản",
    description: "Lịch sử giá bất động sản, biểu đồ giá theo từng địa bàn và những biến động giá qua các thời kỳ.",
  },
  {
    slug: "video-danh-gia",
    label: "Video đánh giá",
    title: "Video đánh giá bất động sản",
    description: "Video đánh giá, phân tích thị trường bất động sản từ các chuyên gia uy tín.",
  },
  {
    slug: "bao-cao-thi-truong",
    label: "Báo cáo thị trường",
    title: "Báo cáo thị trường bất động sản",
    description: "Báo cáo thị trường bất động sản định kỳ với dữ liệu về nguồn cung, giao dịch và mặt bằng giá.",
  },
  {
    slug: "goc-nhin-chuyen-gia",
    label: "Góc nhìn chuyên gia",
    title: "Góc nhìn chuyên gia",
    description: "Chia sẻ, nhận định và đánh giá của các chuyên gia về thị trường bất động sản.",
  },
  {
    slug: "interkative-story",
    label: "Interkative Story",
    title: "Interkative Story",
    description: "Những câu chuyện tương tác về bất động sản giúp bạn trải nghiệm thị trường một cách trực quan.",
  },
];

function getCategoryBySlug(slug: string): (typeof ANALYSIS_CATEGORIES)[number] | undefined {
  return ANALYSIS_CATEGORIES.find((cat) => cat.slug === slug);
}

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

function formatAnalysisDate(value: Date | null): string {
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
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Không tìm thấy chuyên mục | Phân tích đánh giá | Anshome" };
  }

  return {
    title: `${category.label} | Phân tích đánh giá | Anshome`,
    description: category.description,
    alternates: {
      canonical: `${getSiteUrl()}/phan-tich-danh-gia/${slug}`,
    },
    openGraph: {
      title: `${category.label} | Phân tích đánh giá | Anshome`,
      description: category.description,
      url: `${getSiteUrl()}/phan-tich-danh-gia/${slug}`,
      type: "website",
    },
  };
}

export default async function AnalysisCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = resolvePage(sp.page);
  const tab = sp.tab === "hot" ? "hot" : "new";

  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const where: Prisma.ArticleWhereInput = {
    category: { slug },
    status: "published",
    publishedAt: { not: null },
  };

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] = tab === "hot"
    ? [{ viewCount: "desc" }, { publishedAt: "desc" }]
    : [{ publishedAt: "desc" }];

  const [articles, total, provinces, hotArticles] = await Promise.all([
    db.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
      include: articleCardInclude,
    }),
    db.article.count({ where }),
    db.location.findMany({
      where: { type: "province", isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, slug: true },
      take: 10,
    }),
    db.article.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
      take: 6,
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
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/phan-tich-danh-gia" className="hover:text-brand">Phân tích đánh giá</Link>
          <span>/</span>
          <span className="text-[#303743]">{category.label}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="min-w-0">
            <h1 className="text-[22px] font-extrabold leading-8 text-[#20242d]">{category.title}</h1>
            <p className="mt-1 text-[14px] font-semibold text-[#66707c]">{category.description}</p>

            {featured ? (
              <Link href={`/tin-tuc/${featured.slug}`} className="group mt-6 block overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#e9ecef]">
                  {featured.coverMedia?.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.coverMedia.publicUrl} alt={featured.title} className="h-full w-full object-cover" loading="eager" />
                  ) : (
                    <span className="grid h-full place-items-center text-sm font-bold text-[#7a808c]">{category.label}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-bold text-brand">{category.label}</p>
                  <h2 className="mt-1 text-[17px] font-extrabold leading-7 text-[#20242d] group-hover:text-brand">{featured.title}</h2>
                  <p className="mt-2 line-clamp-2 text-[14px] font-medium leading-6 text-[#66707c]">{featured.excerpt}</p>
                  <p className="mt-2 text-[12px] font-bold text-[#8b8f96]">{formatAnalysisDate(featured.publishedAt)}</p>
                </div>
              </Link>
            ) : null}

            <div className="mt-6 flex items-center gap-4 border-b border-[#e1e4ea]">
              <Link
                href={`/phan-tich-danh-gia/${slug}`}
                className={`pb-2 text-[13px] font-extrabold ${tab !== "hot" ? "border-b-2 border-brand text-brand" : "text-[#8b8f96]"}`}
              >
                {category.label} mới nhất
              </Link>
              <Link
                href={`/phan-tich-danh-gia/${slug}?tab=hot`}
                className={`pb-2 text-[13px] font-extrabold ${tab === "hot" ? "border-b-2 border-brand text-brand" : "text-[#8b8f96]"}`}
              >
                Bài viết xem nhiều
              </Link>
            </div>

            {gridArticles.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {gridArticles.map((article) => (
                  <AnalysisArticleCard key={article.id} article={article} />
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
              <h3 className="mb-3 text-[13px] font-extrabold text-[#20242d]">Chuyên mục</h3>
              <div className="flex flex-col gap-1">
                {ANALYSIS_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/phan-tich-danh-gia/${cat.slug}`}
                    className={`text-[13px] font-bold ${cat.slug === slug ? "text-brand" : "text-[#303743] hover:text-brand"}`}
                  >
                    {cat.label}
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
                    href="/phan-tich-danh-gia"
                    className="text-[13px] font-bold text-[#303743] hover:text-brand"
                  >
                    {province.fullName}
                  </Link>
                ))}
              </div>
              <Link href="/phan-tich-danh-gia" className="mt-2 inline-block text-[12px] font-bold text-brand">Xem thêm</Link>
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
                      <p className="mt-1 text-[11px] font-bold text-[#8b8f96]">{formatAnalysisDate(article.publishedAt)}</p>
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

function AnalysisArticleCard({ article }: { article: ArticleCard }) {
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
        <p className="text-xs font-bold uppercase tracking-normal text-brand">{categoryLabel(article)}</p>
        <Link href={`/tin-tuc/${article.slug}`} className="mt-1 block line-clamp-2 text-[15px] font-extrabold leading-5 text-[#20242d] hover:text-brand">
          {article.title}
        </Link>
        {article.excerpt ? <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[#5f6675]">{article.excerpt}</p> : null}
        <p className="mt-3 text-[12px] font-semibold text-[#8a8f99]">{formatAnalysisDate(article.publishedAt)}</p>
      </div>
    </article>
  );
}

function categoryLabel(article: ArticleCard): string {
  const cat = getCategoryBySlug(article.category?.slug ?? "");
  return cat?.label ?? article.category?.name ?? "Phân tích đánh giá";
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
  return `/phan-tich-danh-gia/${slug}${queryString ? `?${queryString}` : ""}`;
}