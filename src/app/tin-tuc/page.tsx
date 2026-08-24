import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { publishDueScheduledArticles } from "@/lib/articles/publish";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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

type SearchParams = {
  page?: string;
  category?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  const page = resolvePage(params.page);

  return {
    title: "Tin tức bất động sản | Anshome",
    description: "Tin tức thị trường bất động sản mới nhất: xu hướng giá, pháp lý dự án, kinh nghiệm mua bán và phân tích chuyên gia trên Anshome.",
    alternates: {
      canonical: `${getSiteUrl()}/tin-tuc${page > 1 ? `?page=${page}` : ""}`,
    },
    robots: page > 1 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: "Tin tức bất động sản | Anshome",
      description: "Tin tức thị trường bất động sản mới nhất trên Anshome.",
      url: `${getSiteUrl()}/tin-tuc`,
      type: "website",
    },
  };
}

export default async function NewsListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await publishDueScheduledArticles();
  const params = await searchParams;
  const page = resolvePage(params.page);
  const categorySlug = params.category;
  const category = categorySlug
    ? await db.articleCategory.findFirst({ where: { slug: categorySlug }, select: { id: true, name: true, slug: true } })
    : null;

  const where: Prisma.ArticleWhereInput = {
    status: "published",
    publishedAt: { not: null },
    ...(category ? { categoryId: category.id } : {}),
  };

  const [articles, total, categories] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
      include: articleCardInclude,
    }),
    db.article.count({ where }),
    db.articleCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1100px] px-4 py-6">
        <nav className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-[#c7352d]">Anshome</Link>
          <span className="mx-1">/</span>
          <span className="text-[#2f3340]">Tin tức</span>
        </nav>

        <div className="mb-5 rounded-md border border-[#e1e4ea] bg-white px-4 py-3">
          <h1 className="text-[22px] font-extrabold leading-7 text-[#20242d]">{category ? category.name : "Tin tức bất động sản"}</h1>
          <p className="mt-1 text-[13px] font-semibold leading-5 text-[#66707c]">
            {total} bài viết{category ? ` trong chuyên mục ${category.name}` : ""}. Cập nhật thị trường, pháp lý và kinh nghiệm đầu tư.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {featured ? (
              <article className="mb-4 grid overflow-hidden rounded-md border border-[#e1e4ea] bg-white md:grid-cols-[300px_1fr]">
                <Link href={`/tin-tuc/${featured.slug}`} className="block bg-[#f0f2f5]">
                  {featured.coverMedia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.coverMedia.publicUrl} alt={featured.title} className="h-full min-h-[190px] w-full object-cover" />
                  ) : (
                    <div className="grid h-full min-h-[190px] place-items-center text-xs font-extrabold text-[#6c7280]">Ảnh bài viết</div>
                  )}
                </Link>
                <div className="flex min-w-0 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{featured.category?.name ?? "Tin tức"}</p>
                  <Link href={`/tin-tuc/${featured.slug}`} className="mt-1 line-clamp-2 text-[18px] font-extrabold leading-6 text-[#20242d] hover:text-[#c7352d]">
                    {featured.title}
                  </Link>
                  {featured.excerpt ? <p className="mt-2 line-clamp-3 text-[13px] font-medium leading-6 text-[#5f6675]">{featured.excerpt}</p> : null}
                  <p className="mt-3 text-[12px] font-semibold text-[#8a8f99]">{formatPublishedDate(featured.publishedAt)}</p>
                </div>
              </article>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {rest.map((article) => (
                <ArticleCardItem key={article.id} article={article} />
              ))}
            </div>

            {articles.length === 0 ? (
              <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có bài viết phù hợp.
              </div>
            ) : null}

            {totalPages > 1 ? <Pagination currentPage={page} totalPages={totalPages} categorySlug={categorySlug} /> : null}
          </div>

          <aside className="hidden content-start gap-4 lg:grid">
            <section className="rounded-md border border-[#e1e4ea] bg-white p-4">
              <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">Chuyên mục</h2>
              <div className="mt-3 grid gap-1">
                <Link href="/tin-tuc" className="rounded-md px-2 py-1.5 text-[13px] font-semibold text-[#4a515e] hover:bg-[#f5f6f8] hover:text-[#c7352d]">
                  Tất cả
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/tin-tuc?category=${item.slug}`}
                    className="rounded-md px-2 py-1.5 text-[13px] font-semibold text-[#4a515e] hover:bg-[#f5f6f8] hover:text-[#c7352d]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </section>
            <section className="rounded-md border border-[#e1e4ea] bg-white p-4">
              <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">Hướng dẫn sử dụng</h2>
              <div className="mt-3 grid gap-2 text-[13px] font-semibold leading-5 text-[#4a515e]">
                <Link href="/tai-khoan/tin-dang/tao-moi" className="hover:text-[#c7352d]">Đăng tin bán nhà đất</Link>
                <Link href="/nha-dat-ban" className="hover:text-[#c7352d]">Tìm kiếm nhà đất bán</Link>
                <Link href="/nha-dat-cho-thue" className="hover:text-[#c7352d]">Tìm kiếm nhà đất cho thuê</Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function ArticleCardItem({ article }: { article: ArticleCard }) {
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
        <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{article.category?.name ?? "Tin tức"}</p>
        <Link href={`/tin-tuc/${article.slug}`} className="mt-1 block line-clamp-2 text-[15px] font-extrabold leading-5 text-[#20242d] hover:text-[#c7352d]">
          {article.title}
        </Link>
        {article.excerpt ? <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[#5f6675]">{article.excerpt}</p> : null}
        <p className="mt-3 text-[12px] font-semibold text-[#8a8f99]">{formatPublishedDate(article.publishedAt)}</p>
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, categorySlug }: { currentPage: number; totalPages: number; categorySlug?: string }) {
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Phân trang">
      {currentPage > 1 ? <PageLink href={pageHref(currentPage - 1, categorySlug)} label="Trước" /> : null}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <PageLink key={item} href={pageHref(item, categorySlug)} label={String(item)} active={item === currentPage} />
      ))}
      {currentPage < totalPages ? <PageLink href={pageHref(currentPage + 1, categorySlug)} label="Sau" /> : null}
    </nav>
  );
}

function PageLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-[13px] font-extrabold ${
        active
          ? "border-[#e43d35] bg-[#e43d35] text-white"
          : "border-[#d8dce3] bg-white text-[#30343d] hover:border-[#c7352d] hover:text-[#c7352d]"
      }`}
    >
      {label}
    </Link>
  );
}

function pageHref(page: number, categorySlug?: string): string {
  const query = new URLSearchParams();
  if (categorySlug) {
    query.set("category", categorySlug);
  }
  if (page > 1) {
    query.set("page", String(page));
  }
  const queryString = query.toString();
  return `/tin-tuc${queryString ? `?${queryString}` : ""}`;
}

function resolvePage(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
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
