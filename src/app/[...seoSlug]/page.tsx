import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/public-listings/listing-card";
import {
  buildLandingWhere,
  buildSeoLandingPath,
  getInternalSeoLinks,
  getLandingDescription,
  getLandingTitle,
  getSiteUrl,
  resolveSeoLanding,
} from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ seoSlug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const context = await resolveSeoLanding(slug);

  if (!context) {
    return {
      title: "Không tìm thấy trang | Anshome",
    };
  }

  const title = `${getLandingTitle(context)} | Anshome`;
  const description = getLandingDescription(context);
  const canonical = `${getSiteUrl()}${context.location || context.category ? buildSeoLandingPath({ category: context.category, location: context.location, transactionType: context.transactionType }) : `/${context.slug}`}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const context = await resolveSeoLanding(slug);

  if (!context) {
    notFound();
  }

  const where = buildLandingWhere(context);
  const [listings, total, links] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 30,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        province: {
          select: {
            fullName: true,
          },
        },
        district: {
          select: {
            fullName: true,
          },
        },
        media: {
          where: {
            moderationStatus: "approved",
            media: {
              status: "approved",
            },
          },
          orderBy: [{ sortOrder: "asc" }],
          take: 1,
          include: {
            media: {
              select: {
                publicUrl: true,
              },
            },
          },
        },
      },
    }),
    db.listing.count({ where }),
    getInternalSeoLinks(),
  ]);

  const title = getLandingTitle(context);
  const description = getLandingDescription(context);
  const breadcrumbItems = [
    { label: "Anshome", href: "/" },
    { label: context.transactionType === "sale" ? "Nhà đất bán" : "Nhà đất cho thuê", href: buildSeoLandingPath({ transactionType: context.transactionType }) },
    ...(context.category ? [{ label: context.category.name, href: buildSeoLandingPath({ category: context.category }) }] : []),
    ...(context.location ? [{ label: context.location.fullName, href: buildSeoLandingPath({ category: context.category, location: context.location, transactionType: context.transactionType }) }] : []),
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-6">
          <Link href="/" className="text-lg font-extrabold text-[#c7352d]">Anshome</Link>
          <nav className="flex items-center gap-4 text-sm font-bold text-[#384052]">
            <Link href="/nha-dat-ban">Nhà đất bán</Link>
            <Link href="/nha-dat-cho-thue">Nhà đất cho thuê</Link>
            <Link href="/tin-dang">Tất cả tin</Link>
            <Link href="/dang-nhap">Đăng nhập</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-[#6c7280]">
          {breadcrumbItems.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              {index > 0 ? <span>/</span> : null}
              <Link href={item.href} className="hover:text-[#c7352d]">{item.label}</Link>
            </span>
          ))}
        </nav>

        <div className="mb-6 grid gap-5 rounded-md border border-[#dde1e7] bg-white p-5 shadow-[0_14px_40px_rgba(20,28,45,0.04)] lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Trang SEO</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f6675]">{description}</p>
          </div>
          <div className="rounded-md bg-[#f5f6f8] p-4">
            <p className="text-xs font-bold uppercase text-[#6c7280]">Kết quả</p>
            <p className="mt-2 text-4xl font-extrabold text-[#1f2430]">{total}</p>
            <p className="mt-1 text-sm text-[#6c7280]">tin đăng đang hiển thị</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="grid gap-4 lg:grid-cols-2">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {listings.length === 0 ? (
              <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có tin đăng phù hợp cho trang landing này.
              </div>
            ) : null}
          </div>

          <aside className="grid content-start gap-4">
            <Link href="/tai-khoan/tin-dang/tao-moi" className="rounded-md bg-[#c7352d] px-4 py-3 text-center text-sm font-extrabold text-white">
              Đăng tin
            </Link>
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Danh mục liên quan</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold text-[#384052]">
                {links.categories.slice(0, 12).map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 hover:bg-[#f5f6f8] hover:text-[#c7352d]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Khu vực phổ biến</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold text-[#384052]">
                {links.categoryProvinces.slice(0, 12).map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 hover:bg-[#f5f6f8] hover:text-[#c7352d]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
