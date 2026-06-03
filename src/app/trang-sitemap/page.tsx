import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { buildSeoLandingPath, getInternalSeoLinks } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sơ đồ website | Anshome",
  description: "Tổng hợp các đường dẫn chính của Anshome: nhà đất bán, nhà đất cho thuê, khu vực phổ biến, tài khoản và công cụ quản trị.",
};

export default async function HtmlSitemapPage() {
  const [categories, provinces, links, publishedListings] = await Promise.all([
    db.category.findMany({
      where: {
        isActive: true,
        transactionType: {
          in: ["sale", "rent"],
        },
      },
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        transactionType: true,
      },
    }),
    db.location.findMany({
      where: {
        isActive: true,
        type: "province",
      },
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        fullName: true,
        type: true,
      },
    }),
    getInternalSeoLinks(),
    db.listing.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 20,
      select: {
        publicId: true,
        title: true,
      },
    }),
  ]);

  const saleCategories = categories.filter((category) => category.transactionType === "sale");
  const rentCategories = categories.filter((category) => category.transactionType === "rent");
  const saleProvinceLinks = provinces.map((province) => ({
    label: `Nhà đất bán ${province.name}`,
    href: buildSeoLandingPath({ transactionType: "sale", location: province }),
  }));
  const rentProvinceLinks = provinces.map((province) => ({
    label: `Nhà đất cho thuê ${province.name}`,
    href: buildSeoLandingPath({ transactionType: "rent", location: province }),
  }));

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-6">
          <Link href="/" className="text-lg font-extrabold text-[#c7352d]">Anshome</Link>
          <nav className="flex items-center gap-4 text-sm font-bold text-[#384052]">
            <Link href="/nha-dat-ban">Nhà đất bán</Link>
            <Link href="/nha-dat-cho-thue">Nhà đất cho thuê</Link>
            <Link href="/tin-dang">Tin đăng</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Sơ đồ website</p>
          <h1 className="mt-1 text-3xl font-extrabold">Sơ đồ website</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Trang tổng hợp các nhóm đường dẫn chính để người dùng và công cụ tìm kiếm di chuyển qua các landing page quan trọng.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SitemapSection title="Trang chính" items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tất cả tin đăng", href: "/tin-dang" },
            { label: "Nhà đất bán", href: "/nha-dat-ban" },
            { label: "Nhà đất cho thuê", href: "/nha-dat-cho-thue" },
            { label: "Đăng nhập", href: "/dang-nhap" },
          ]} />

          <SitemapSection
            title="Nhà đất bán"
            items={[
              { label: "Nhà đất bán", href: "/nha-dat-ban" },
              ...saleCategories.map((category) => ({
                label: category.name,
                href: buildSeoLandingPath({ category }),
              })),
            ]}
          />

          <SitemapSection
            title="Nhà đất cho thuê"
            items={[
              { label: "Nhà đất cho thuê", href: "/nha-dat-cho-thue" },
              ...rentCategories.map((category) => ({
                label: category.name,
                href: buildSeoLandingPath({ category }),
              })),
            ]}
          />

          <SitemapSection title="Khu vực nhà đất bán phổ biến" items={saleProvinceLinks} />
          <SitemapSection title="Khu vực nhà đất cho thuê phổ biến" items={rentProvinceLinks} />
          <SitemapSection title="Danh mục theo khu vực" items={links.categoryProvinces.slice(0, 36)} />

          <SitemapSection
            title="Tin đăng mới"
            items={publishedListings.map((listing) => ({
              label: listing.title,
              href: `/tin-dang/${listing.publicId}`,
            }))}
          />

          <SitemapSection title="Tài khoản" items={[
            { label: "Quản lý tin đăng", href: "/tai-khoan/tin-dang" },
            { label: "Tạo tin mới", href: "/tai-khoan/tin-dang/tao-moi" },
            { label: "Quản lý khách liên hệ", href: "/tai-khoan/leads" },
          ]} />

          <SitemapSection title="Quản trị" items={[
            { label: "Bảng điều khiển quản trị", href: "/admin" },
            { label: "Quản lý người dùng", href: "/admin/users" },
            { label: "Quản lý tin đăng", href: "/admin/listings" },
            { label: "Quản lý địa lý", href: "/admin/locations" },
            { label: "Quản lý danh mục", href: "/admin/categories" },
            { label: "Nhật ký hoạt động", href: "/admin/audit-logs" },
          ]} />

          <SitemapSection title="Hệ thống" items={[
            { label: "XML sitemap", href: "/sitemap.xml" },
            { label: "Robots", href: "/robots.txt" },
          ]} />
        </div>
      </section>
    </main>
  );
}

function SitemapSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <section className="rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
      <h2 className="text-base font-extrabold">{title}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có dữ liệu.</p> : null}
        {items.map((item) => (
          <Link key={`${title}-${item.href}-${item.label}`} href={item.href} className="rounded-md px-2 py-1.5 text-sm font-bold leading-5 text-[#384052] hover:bg-[#f5f6f8] hover:text-[#c7352d]">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
