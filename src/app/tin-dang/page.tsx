import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/public-listings/listing-card";
import { buildSeoLandingPath, getInternalSeoLinks } from "@/lib/seo/landing";
import type { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tin đăng bất động sản | Anshome",
  description: "Danh sách tin bất động sản đã được duyệt trên Anshome.",
};

const transactionTypeLabel: Record<string, string> = {
  sale: "Bán",
  rent: "Cho thuê",
};

type SearchParams = {
  q?: string;
  transactionType?: string;
  categoryId?: string;
  provinceId?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  sort?: string;
};

export default async function PublicListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const where = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const [listings, total, categories, provinces, links] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
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
    db.category.findMany({
      where: { isActive: true },
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, transactionType: true },
    }),
    db.location.findMany({
      where: { isActive: true, type: "province" },
      orderBy: { fullName: "asc" },
      select: { id: true, name: true, slug: true, fullName: true, type: true },
    }),
    getInternalSeoLinks(),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-6">
          <Link href="/" className="text-lg font-extrabold text-[#c7352d]">Anshome</Link>
          <nav className="flex items-center gap-4 text-sm font-bold text-[#384052]">
            <Link href="/tin-dang" className="text-[#c7352d]">Tin đăng</Link>
            <Link href="/dang-nhap">Đăng nhập</Link>
          </nav>
        </div>
      </header>
      <section className="mx-auto w-full max-w-[1320px] px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Sàn tin đăng</p>
          <h1 className="mt-1 text-3xl font-extrabold">Tin bất động sản đang hiển thị</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Khu vực công khai cho các tin đã được quản trị viên duyệt.
          </p>
        </div>

        <form className="mb-6 grid gap-3 rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)] md:grid-cols-4" action="/tin-dang">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280] md:col-span-2">
            Từ khóa
            <input name="q" defaultValue={params.q ?? ""} placeholder="Tìm theo tiêu đề, mô tả..." className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Giao dịch
            <select name="transactionType" defaultValue={params.transactionType ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
              <option value="">Tất cả</option>
              <option value="sale">Bán</option>
              <option value="rent">Cho thuê</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Sắp xếp
            <select name="sort" defaultValue={params.sort ?? "newest"} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="area_desc">Diện tích lớn</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Danh mục
            <select name="categoryId" defaultValue={params.categoryId ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name} ({transactionTypeLabel[category.transactionType] ?? category.transactionType})</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Tỉnh/thành
            <select name="provinceId" defaultValue={params.provinceId ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
              <option value="">Tất cả tỉnh/thành</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>{province.fullName}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Giá thấp nhất
            <input name="minPrice" inputMode="decimal" defaultValue={params.minPrice ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Giá cao nhất
            <input name="maxPrice" inputMode="decimal" defaultValue={params.maxPrice ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Diện tích nhỏ nhất
            <input name="minArea" inputMode="decimal" defaultValue={params.minArea ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Diện tích lớn nhất
            <input name="maxArea" inputMode="decimal" defaultValue={params.maxArea ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2.5 text-sm font-extrabold text-white">Tìm kiếm</button>
            <Link href="/tin-dang" className="rounded-md border border-[#d5dae2] px-4 py-2.5 text-sm font-extrabold text-[#384052]">Đặt lại</Link>
          </div>
        </form>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-[#384052]">{total} tin đang hiển thị</p>
          <Link href="/tai-khoan/tin-dang/tao-moi" className="rounded-md border border-[#c7352d] px-4 py-2 text-sm font-extrabold text-[#c7352d]">Đăng tin</Link>
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
                Chưa có tin đăng phù hợp với bộ lọc.
              </div>
            ) : null}
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Trang SEO chính</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold text-[#384052]">
                {links.roots.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 hover:bg-[#f5f6f8] hover:text-[#c7352d]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Danh mục SEO</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold text-[#384052]">
                {links.categories.slice(0, 14).map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 hover:bg-[#f5f6f8] hover:text-[#c7352d]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
            {categories[0] && provinces[0] ? (
              <section className="rounded-md border border-[#dde1e7] bg-white p-4">
                <h2 className="text-base font-extrabold">Ví dụ landing</h2>
                <Link
                  href={buildSeoLandingPath({ category: categories[0], location: provinces[0] })}
                  className="mt-3 block rounded-md px-2 py-1.5 text-sm font-bold text-[#384052] hover:bg-[#f5f6f8] hover:text-[#c7352d]"
                >
                  {categories[0].name} {provinces[0].fullName}
                </Link>
              </section>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

function buildWhere(params: SearchParams): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: "published",
  };

  if (params.transactionType === "sale" || params.transactionType === "rent") {
    where.transactionType = params.transactionType;
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.provinceId) {
    where.provinceId = params.provinceId;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
      { addressText: { contains: params.q } },
    ];
  }

  const priceRange = decimalRange(params.minPrice, params.maxPrice);
  if (priceRange) {
    where.price = priceRange;
  }

  const areaRange = decimalRange(params.minArea, params.maxArea);
  if (areaRange) {
    where.area = areaRange;
  }

  return where;
}

function decimalRange(min?: string, max?: string): Prisma.DecimalNullableFilter | undefined {
  const range: Prisma.DecimalNullableFilter = {};
  if (min && /^\d+(\.\d+)?$/.test(min)) {
    range.gte = min;
  }
  if (max && /^\d+(\.\d+)?$/.test(max)) {
    range.lte = max;
  }

  return Object.keys(range).length > 0 ? range : undefined;
}

function buildOrderBy(sort?: string): Prisma.ListingOrderByWithRelationInput[] {
  if (sort === "price_asc") {
    return [{ price: "asc" }, { publishedAt: "desc" }];
  }
  if (sort === "price_desc") {
    return [{ price: "desc" }, { publishedAt: "desc" }];
  }
  if (sort === "area_desc") {
    return [{ area: "desc" }, { publishedAt: "desc" }];
  }

  return [{ publishedAt: "desc" }, { createdAt: "desc" }];
}
