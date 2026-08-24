import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ListingCard, listingCardInclude } from "@/components/public-listings/landing-listing-card";
import { ListingFilterBar } from "@/components/public-listings/listing-filter-bar";
import { getCurrentSession } from "@/lib/auth/session";
import { saveSearch } from "@/app/tai-khoan/yeu-thich/favorite-actions";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import {
  areaPresets,
  buildListingOrderBy,
  buildListingPagination,
  buildListingWhere,
  listingSortOptions,
  pricePresets,
  resolveListingPage,
  resolveListingSort,
  resolveTotalPages,
  type ListingFilterParams,
} from "@/lib/listings/query";
import {
  buildLandingWhere,
  getCategoryDisplayLabel,
  getLandingDescription,
  getLandingTitle,
  getSiteUrl,
  rentRootSlug,
  saleRootSlug,
  type SeoLandingContext,
} from "@/lib/seo/landing";

type ListingIndexProps = {
  context: SeoLandingContext;
  searchParams: ListingFilterParams;
};

export async function ListingIndex({ context, searchParams }: ListingIndexProps) {
  const params = normalizeParams(searchParams);
  const priceRange = parseRangePreset(params.price);
  const areaRange = parseRangePreset(params.area);
  const where = buildListingWhere(
    {
      q: params.q,
      transactionType: params.transactionType,
      categoryId: params.categoryId,
      provinceId: params.provinceId,
      districtId: params.districtId,
      minPrice: params.minPrice ?? priceRange.min,
      maxPrice: params.maxPrice ?? priceRange.max,
      minArea: params.minArea ?? areaRange.min,
      maxArea: params.maxArea ?? areaRange.max,
      verified: params.verified,
      agent: params.agent,
      bedrooms: params.bedrooms,
      direction: params.direction,
      bathrooms: params.bathrooms,
      balconyDirection: params.balconyDirection,
      projectId: params.projectId,
      sort: params.sort,
      page: params.page,
    },
    context,
  );
  const orderBy = buildListingOrderBy(params.sort);
  const page = resolveListingPage(params.page);
  const pagination = buildListingPagination(page);

  const [listings, total, provinces, currentSession, categories, recentArticles, districts, projects] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
      ...pagination,
      include: listingCardInclude,
    }),
    db.listing.count({ where }),
    db.location.findMany({
      where: { isActive: true, type: "province" },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    getCurrentSession(),
    db.category.findMany({
      where: { isActive: true, transactionType: context.transactionType },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, transactionType: true },
    }),
    db.article.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }],
      take: 6,
      select: { id: true, title: true, slug: true, publishedAt: true, coverMedia: { select: { publicUrl: true } } },
    }),
    db.location.findMany({
      where: { type: "district", isActive: true, parentId: { not: null } },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, parentId: true },
    }),
    db.project.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, provinceId: true },
    }),
  ]);

  const provinceCounts = context
    ? await db.listing.groupBy({
        by: ["provinceId"],
        where: { ...buildLandingWhere(context) },
        _count: { _all: true },
      })
    : [];
  const countByProvinceId = new Map(provinceCounts.map((item) => [item.provinceId, item._count._all]));

  const favoriteListingIds = new Set<string>();

  if (currentSession && listings.length > 0) {
    const favorites = await db.favorite.findMany({
      where: {
        userId: currentSession.user.id,
        listingId: { in: listings.map((listing) => listing.id) },
      },
      select: { listingId: true },
    });
    favorites.forEach((favorite) => favoriteListingIds.add(favorite.listingId));
  }

  const totalPages = resolveTotalPages(total);
  const title = getLandingTitle(context);
  const pageTitle = !context.category && !context.location
    ? context.transactionType === "sale"
      ? "Mua bán nhà đất trên toàn quốc"
      : "Cho thuê nhà đất trên toàn quốc"
    : `${title}${context.location ? "" : " trên toàn quốc"}`;
  const tabHref = context.transactionType === "sale" ? saleRootSlug : rentRootSlug;
  const actionPath = `/${context.slug}`;
  const currentSort = resolveListingSort(params.sort);
  const priceOptions = pricePresets[context.transactionType];
  const pricePresetsForType = pricePresets[context.transactionType];
  const categoryOptions = categories.map((category) => ({
    slug: category.slug,
    label: getCategoryDisplayLabel(category),
    isActive: (context?.category?.id ?? params.categoryId) === category.id,
  }));
  const breadcrumbItems = [
    { label: context.transactionType === "sale" ? "Bán" : "Cho thuê", href: `/${tabHref}` },
    ...(!context.category && !context.location ? [{ label: "Tất cả BĐS trên toàn quốc", href: `/${tabHref}` }] : []),
    ...(context.category ? [{ label: getCategoryDisplayLabel(context.category).replace(/^(Bán|Cho thuê)\s+/, ""), href: `/${context.category.slug}` }] : []),
    ...(context.location ? [{ label: context.location.fullName, href: actionPath }] : []),
  ];
  const popularProvinces = provinces
    .map((province) => ({ ...province, count: countByProvinceId.get(province.id) ?? 0 }))
    .filter((province) => province.count > 0)
    .sort((a, b) => b.count - a.count);

  const sidebar = (
    <>
      <SidebarFilterBox title="Lọc theo khoảng giá">
        {priceOptions.map((preset) => {
          const isSpecial = preset.label === "Thỏa thuận";
          const value = preset.min ?? preset.max ? `${preset.min ?? ""}-${preset.max ?? ""}` : "";
          const linkValue = isSpecial ? "" : value;
          const active = isSpecial ? false : linkValue === "" ? !params.price : params.price === linkValue;
          return (
            <FilterRow key={preset.label} href={sidebarHref(actionPath, params, { price: linkValue })} active={active}>
              {preset.label}
            </FilterRow>
          );
        })}
        <form action={actionPath} method="get" className="mt-2 grid grid-cols-2 gap-1">
          {hiddenInputs(params, { price: undefined })}
          <input
            name="minPrice"
            type="text"
            inputMode="numeric"
            defaultValue={params.minPrice ?? ""}
            placeholder="Thấp nhất"
            className="col-span-1 rounded border border-[#d5dae2] px-2 py-1.5 text-[12px] text-[#1f2430]"
          />
          <input
            name="maxPrice"
            type="text"
            inputMode="numeric"
            defaultValue={params.maxPrice ?? ""}
            placeholder="Cao nhất"
            className="col-span-1 rounded border border-[#d5dae2] px-2 py-1.5 text-[12px] text-[#1f2430]"
          />
          <button type="submit" className="col-span-2 mt-1 rounded bg-[#4aa64b] py-1.5 text-[12px] font-extrabold text-white">
            Áp dụng
          </button>
        </form>
      </SidebarFilterBox>

      <SidebarFilterBox title="Lọc theo diện tích">
        {areaPresets.map((preset) => {
          const value = preset.min ?? preset.max ? `${preset.min ?? ""}-${preset.max ?? ""}` : "";
          const active = value === "" ? !params.area : params.area === value;
          return (
            <FilterRow key={preset.label} href={sidebarHref(actionPath, params, { area: value })} active={active}>
              {preset.label}
            </FilterRow>
          );
        })}
        <form action={actionPath} method="get" className="mt-2 grid grid-cols-2 gap-1">
          {hiddenInputs(params, { area: undefined })}
          <input
            name="minArea"
            type="text"
            inputMode="numeric"
            defaultValue={params.minArea ?? ""}
            placeholder="Tối thiểu"
            className="col-span-1 rounded border border-[#d5dae2] px-2 py-1.5 text-[12px] text-[#1f2430]"
          />
          <input
            name="maxArea"
            type="text"
            inputMode="numeric"
            defaultValue={params.maxArea ?? ""}
            placeholder="Tối đa"
            className="col-span-1 rounded border border-[#d5dae2] px-2 py-1.5 text-[12px] text-[#1f2430]"
          />
          <button type="submit" className="col-span-2 mt-1 rounded bg-[#4aa64b] py-1.5 text-[12px] font-extrabold text-white">
            Áp dụng
          </button>
        </form>
      </SidebarFilterBox>

      <SidebarFilterBox title={context.transactionType === "sale" ? "Mua bán nhà đất" : "Cho thuê nhà đất"}>
        {popularProvinces.slice(0, 10).map((province) => (
          <FilterRow
            key={province.id}
            href={sidebarHref(actionPath, params, { provinceId: province.id })}
            active={params.provinceId === province.id}
            count={province.count}
          >
            {province.fullName}
          </FilterRow>
        ))}
        {popularProvinces.length > 10 ? (
          <details className="group">
            <summary className="mt-1 flex cursor-pointer list-none items-center gap-2 px-1 py-1 text-[13px] font-bold text-[#e43b32] [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Xem thêm</span>
              <span className="hidden group-open:inline">Thu gọn</span>
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition group-open:rotate-180">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="grid gap-1">
              {popularProvinces.slice(10).map((province) => (
                <FilterRow
                  key={province.id}
                  href={sidebarHref(actionPath, params, { provinceId: province.id })}
                  active={params.provinceId === province.id}
                  count={province.count}
                >
                  {province.fullName}
                </FilterRow>
              ))}
            </div>
          </details>
        ) : null}
      </SidebarFilterBox>
    </>
  );

  return (
    <main className="stage-root bg-white text-[#2b2c33]">
      <SiteHeader mobileBackHref="/" />

      <section className="mx-auto w-full max-w-[960px] px-4 py-4">
        <div className="mb-7 space-y-3">
          <form
            action={actionPath}
            method="get"
            className="flex h-12 items-center overflow-hidden rounded-lg border border-[#cfd1d4] bg-white p-1 shadow-[0_1px_2px_rgba(20,28,45,0.04)] focus-within:border-[#aeb3bb] sm:h-16 sm:rounded-xl sm:p-1.5"
          >
            {hiddenInputs(params, { q: undefined, page: undefined })}
            <span className="ml-3 hidden h-10 w-10 shrink-0 place-items-center text-[#20242d] sm:grid" aria-hidden>
              <SearchIcon />
            </span>
            <input
              name="q"
              type="search"
              defaultValue={params.q ?? ""}
              placeholder="Nhập từ khóa tìm kiếm bất động sản"
              aria-label="Từ khóa tìm kiếm"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] font-semibold text-[#30343d] outline-none placeholder:text-[#92959b] sm:px-2 sm:text-[17px]"
            />
            <button
              type="submit"
              className="grid h-full w-12 shrink-0 place-items-center rounded-md bg-[#e43b32] text-white transition hover:bg-[#cd3028] sm:block sm:w-auto sm:rounded-lg sm:px-7 sm:text-[16px] sm:font-extrabold"
            >
              <span className="hidden sm:inline">Tìm kiếm</span>
              <span className="sm:hidden"><SearchIcon /></span>
            </button>
          </form>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
              <ListingFilterBar
                actionPath={actionPath}
                params={params}
                categoryOptions={categoryOptions}
                pricePresets={pricePresetsForType}
                areaPresets={areaPresets}
                provinces={provinces}
                districts={districts}
                projects={projects}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-1 text-[14px] font-semibold text-[#8a8f99] sm:text-[14px]">
              {breadcrumbItems.map((item, index) => (
                <span key={`${item.href}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <span>/</span> : null}
                  <Link
                    href={item.href}
                    className={index === breadcrumbItems.length - 1 ? "font-bold text-[#30343d] hover:text-brand" : "hover:text-brand"}
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </div>

            <div className="mb-6 sm:mb-7">
              <h1 className="max-w-5xl text-[18px] font-extrabold leading-[1.3] text-[#20242d] sm:text-[24px]">{pageTitle}</h1>
              <p className="mt-3 hidden text-[16px] font-semibold text-[#4f535b] sm:block">{`Hiện có ${total.toLocaleString("vi-VN")} bất động sản.`}</p>
            </div>

            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="whitespace-nowrap text-[14px] font-semibold text-[#30343d] sm:hidden">{`Có ${total.toLocaleString("vi-VN")} bất động sản.`}</p>

              <form action={saveSearch} className="hidden sm:block">
                <input type="hidden" name="name" value={title} />
                <input type="hidden" name="queryJson" value={JSON.stringify(buildSavedQuery(params, context))} />
                <input type="hidden" name="frequency" value="daily" />
                <input type="hidden" name="redirectPath" value={actionPath} />
                <button type="submit" className="inline-flex h-11 items-center gap-3 text-[15px] font-extrabold text-[#30343d]">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffad00] text-white" aria-hidden>
                    <NotificationBellIcon />
                  </span>
                  <span>Nhận email tin mới</span>
                  <span className="relative h-5 w-9 rounded-full bg-[#c8c9cb]" aria-hidden>
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                  </span>
                </button>
              </form>

              <form action={actionPath} method="get" className="w-[150px] shrink-0 sm:w-[320px]">
                {hiddenInputs(params, { sort: undefined })}
                <AutoSubmitSelect
                  name="sort"
                  defaultValue={currentSort}
                  options={listingSortOptions.map((option) => ({ value: option.key, label: option.label }))}
                  className="h-9 w-full cursor-pointer rounded-md border border-[#cfd1d4] bg-white px-3 text-[14px] font-bold text-[#5e6269] outline-none transition hover:border-[#9da2aa] focus:border-[#9da2aa] sm:h-11 sm:px-4 sm:text-[15px]"
                />
              </form>
            </div>

            <div className="grid gap-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} isFavorite={favoriteListingIds.has(listing.id)} />
              ))}
            </div>
            {listings.length === 0 ? (
              <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có tin đăng phù hợp với bộ lọc hiện tại.
              </div>
            ) : null}

            {totalPages > 1 ? (
              <Pagination currentPage={page} totalPages={totalPages} basePath={actionPath} params={buildPaginationParams(params)} />
            ) : null}

            <SeoTextBlock title={title} />

            {/* Tỉnh thành phổ biến */}
            <div className="mt-8 rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[14px] font-extrabold text-[#20242d]">
                {context.category ? getCategoryDisplayLabel(context.category) : (context.transactionType === "sale" ? "Nhà đất bán" : "Nhà đất cho thuê")} tại...
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {provinceCounts
                  .filter((item) => item._count._all > 0)
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((item) => {
                    const province = provinces.find((p) => p.id === item.provinceId);
                    if (!province) return null;
                    const href = `/${context.slug}?provinceId=${province.id}`;
                    return (
                      <Link key={province.id} href={href} className="text-[13px] font-bold text-brand hover:underline">
                        {province.fullName} ({item._count._all.toLocaleString("vi-VN")})
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Bài viết được quan tâm */}
            <div className="mt-4 rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[14px] font-extrabold text-[#20242d]">Bài viết được quan tâm</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {recentArticles.map((article) => (
                  <Link key={article.id} href={`/tin-tuc/${article.slug}`} className="group">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-md bg-[#e9ecef]">
                      {article.coverMedia?.publicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.coverMedia.publicUrl} alt={article.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="grid h-full place-items-center text-sm font-bold text-[#7a808c]">Tin tức</span>
                      )}
                    </div>
                    <h4 className="mt-2 line-clamp-2 text-[13px] font-extrabold leading-5 text-[#20242d] group-hover:text-brand">{article.title}</h4>
                    <p className="mt-1 text-[11px] font-bold text-[#8b8f96]">
                      {article.publishedAt ? formatSimpleDate(article.publishedAt) : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="hidden content-start gap-4 lg:grid">{sidebar}</aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export function buildListingIndexMetadata(
  context: SeoLandingContext,
  searchParams: ListingFilterParams,
): Metadata {
  const title = `${getLandingTitle(context)} | Anshome`;
  const description = getLandingDescription(context);
  const canonicalUrl = buildCanonicalUrl(context, searchParams);
  const page = resolveListingPage(searchParams.page);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

function buildCanonicalUrl(context: SeoLandingContext, searchParams: ListingFilterParams): string {
  const url = new URL(`${getSiteUrl()}/${context.slug}`);
  const page = resolveListingPage(searchParams.page);

  if (page > 1) {
    url.searchParams.set("page", String(page));
    return url.toString();
  }

  if (searchParams.q) {
    url.searchParams.set("q", searchParams.q);
  }
  if (searchParams.categoryId) {
    url.searchParams.set("categoryId", searchParams.categoryId);
  }
  if (searchParams.provinceId) {
    url.searchParams.set("provinceId", searchParams.provinceId);
  }
  if (searchParams.districtId) {
    url.searchParams.set("districtId", searchParams.districtId);
  }
  if (searchParams.verified === "true") {
    url.searchParams.set("verified", "true");
  }
  if (searchParams.agent === "true") {
    url.searchParams.set("agent", "true");
  }
  if (searchParams.price) {
    url.searchParams.set("price", searchParams.price);
  }
  if (searchParams.area) {
    url.searchParams.set("area", searchParams.area);
  }
  if (searchParams.bedrooms) {
    url.searchParams.set("bedrooms", searchParams.bedrooms);
  }
  if (searchParams.direction) {
    url.searchParams.set("direction", searchParams.direction);
  }
  if (searchParams.bathrooms) {
    url.searchParams.set("bathrooms", searchParams.bathrooms);
  }
  if (searchParams.balconyDirection) {
    url.searchParams.set("balconyDirection", searchParams.balconyDirection);
  }
  if (searchParams.projectId) {
    url.searchParams.set("projectId", searchParams.projectId);
  }

  return url.toString();
}

function normalizeParams(searchParams: ListingFilterParams): ListingFilterParams {
  return {
    q: searchParams.q,
    price: searchParams.price,
    area: searchParams.area,
    transactionType: searchParams.transactionType,
    categoryId: searchParams.categoryId,
    provinceId: searchParams.provinceId,
    districtId: searchParams.districtId,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    minArea: searchParams.minArea,
    maxArea: searchParams.maxArea,
    verified: searchParams.verified,
    agent: searchParams.agent,
    bedrooms: searchParams.bedrooms,
    direction: searchParams.direction,
    bathrooms: searchParams.bathrooms,
    balconyDirection: searchParams.balconyDirection,
    projectId: searchParams.projectId,
    sort: searchParams.sort,
    page: searchParams.page,
  };
}

function parseRangePreset(value?: string): { min?: string; max?: string } {
  if (!value || !value.includes("-")) {
    return {};
  }

  const [min, max] = value.split("-");
  return { min: min || undefined, max: max || undefined };
}

function buildPaginationParams(params: ListingFilterParams): URLSearchParams {
  const query = new URLSearchParams();
  if (params.q) {
    query.set("q", params.q);
  }
  if (params.categoryId) {
    query.set("categoryId", params.categoryId);
  }
  if (params.provinceId) {
    query.set("provinceId", params.provinceId);
  }
  if (params.districtId) {
    query.set("districtId", params.districtId);
  }
  if (params.verified === "true") {
    query.set("verified", "true");
  }
  if (params.agent === "true") {
    query.set("agent", "true");
  }
  if (params.price) {
    query.set("price", params.price);
  }
  if (params.area) {
    query.set("area", params.area);
  }
  if (params.bedrooms) {
    query.set("bedrooms", params.bedrooms);
  }
  if (params.direction) {
    query.set("direction", params.direction);
  }
  if (params.bathrooms) {
    query.set("bathrooms", params.bathrooms);
  }
  if (params.balconyDirection) {
    query.set("balconyDirection", params.balconyDirection);
  }
  if (params.projectId) {
    query.set("projectId", params.projectId);
  }
  if (params.sort && params.sort !== "default") {
    query.set("sort", params.sort);
  }
  return query;
}

function buildSavedQuery(params: ListingFilterParams, context: SeoLandingContext): Record<string, string> {
  const query: Record<string, string> = {
    transactionType: context.transactionType,
  };

  if (params.q) {
    query.q = params.q;
  }
  if (params.categoryId) {
    query.categoryId = params.categoryId;
  }
  if (params.provinceId) {
    query.provinceId = params.provinceId;
  }
  if (params.districtId) {
    query.districtId = params.districtId;
  }
  if (params.price) {
    query.price = params.price;
  }
  if (params.area) {
    query.area = params.area;
  }
  if (params.bedrooms) {
    query.bedrooms = params.bedrooms;
  }
  if (params.direction) {
    query.direction = params.direction;
  }
  if (params.bathrooms) {
    query.bathrooms = params.bathrooms;
  }
  if (params.balconyDirection) {
    query.balconyDirection = params.balconyDirection;
  }
  if (params.projectId) {
    query.projectId = params.projectId;
  }
  if (params.verified === "true") {
    query.verified = "true";
  }
  if (params.agent === "true") {
    query.agent = "true";
  }
  if (params.sort && params.sort !== "newest") {
    query.sort = params.sort;
  }

  return query;
}

function buildSidebarQuery(params: ListingFilterParams, overrides: Partial<ListingFilterParams> = {}): URLSearchParams {
  const query = new URLSearchParams();
  const merged: ListingFilterParams = { ...params, ...overrides };
  const entries: Array<[string, string | undefined]> = [
    ["q", merged.q],
    ["categoryId", merged.categoryId],
    ["provinceId", merged.provinceId],
    ["districtId", merged.districtId],
    ["verified", merged.verified === "true" ? "true" : undefined],
    ["agent", merged.agent === "true" ? "true" : undefined],
    ["price", merged.price],
    ["area", merged.area],
    ["bedrooms", merged.bedrooms],
    ["direction", merged.direction],
    ["bathrooms", merged.bathrooms],
    ["balconyDirection", merged.balconyDirection],
    ["projectId", merged.projectId],
    ["sort", merged.sort && merged.sort !== "newest" ? merged.sort : undefined],
  ];
  for (const [key, value] of entries) {
    if (value) {
      query.set(key, value);
    }
  }
  return query;
}

function sidebarHref(actionPath: string, params: ListingFilterParams, overrides: Partial<ListingFilterParams> = {}): string {
  const queryString = buildSidebarQuery(params, overrides).toString();
  return queryString ? `${actionPath}?${queryString}` : actionPath;
}

function SidebarFilterBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-[#e1e4ea] bg-white p-4">
      <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">{title}</h2>
      <div className="mt-3 grid gap-1">{children}</div>
    </section>
  );
}

function FilterRow({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded px-1 py-1.5 text-[13px] leading-5 ${
        active ? "font-extrabold text-brand" : "font-semibold text-[#303743] hover:text-brand"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {active ? <CheckIcon /> : null}
        {children}
        {count !== undefined ? <span>({count.toLocaleString("vi-VN")})</span> : null}
      </span>
    </Link>
  );
}

function SeoTextBlock({ title }: { title: string }) {
  return (
    <section className="mt-6 rounded-md border border-[#dde1e7] bg-white p-5 text-[13px] font-medium leading-6 text-[#4b5360]">
      <h2 className="text-[18px] font-extrabold text-[#20242d]">{title}: thông tin tổng quan</h2>
      <p className="mt-3">
        Danh sách tin đăng được cập nhật theo trạng thái đã duyệt, giúp người mua nhanh chóng so sánh giá, diện tích, vị trí và thông tin liên hệ. Khi quan tâm một tin, bạn có thể mở chi tiết để xem ảnh, mô tả, bản đồ và thông tin người đăng.
      </p>
      <p className="mt-3">
        Nên ưu tiên các tin có ảnh rõ ràng, mô tả đầy đủ, pháp lý minh bạch và mức giá phù hợp với mặt bằng khu vực. Anshome tiếp tục hoàn thiện dữ liệu thị trường để hỗ trợ quá trình tìm kiếm bất động sản hiệu quả hơn.
      </p>
    </section>
  );
}

function Pagination({
  currentPage,
  totalPages,
  basePath,
  params,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params: URLSearchParams;
}) {
  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Phân trang">
      {currentPage > 1 ? (
        <PageLink href={pageHref(basePath, params, currentPage - 1)} label="‹" ariaLabel="Trang trước" />
      ) : null}
      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm font-bold text-[#8a8f99]">...</span>
        ) : (
          <PageLink
            key={item}
            href={pageHref(basePath, params, item)}
            label={String(item)}
            active={item === currentPage}
          />
        ),
      )}
      {currentPage < totalPages ? (
        <PageLink href={pageHref(basePath, params, currentPage + 1)} label="›" ariaLabel="Trang sau" />
      ) : null}
    </nav>
  );
}

function PageLink({ href, label, ariaLabel, active = false }: { href: string; label: string; ariaLabel?: string; active?: boolean }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-[13px] font-extrabold ${
        active
          ? "border-brand bg-brand text-white"
          : "border-[#d8dce3] bg-white text-[#30343d] hover:border-brand hover:bg-brand-soft hover:text-brand"
      }`}
    >
      {label}
    </Link>
  );
}

function pageHref(basePath: string, params: URLSearchParams, page: number): string {
  const query = new URLSearchParams(params);
  if (page > 1) {
    query.set("page", String(page));
  } else {
    query.delete("page");
  }
  const queryString = query.toString();
  return `${basePath}${queryString ? `?${queryString}` : ""}`;
}

function buildPageList(currentPage: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "..."> = [1];

  if (currentPage > 4) {
    pages.push("...");
  }

  for (let page = Math.max(2, currentPage - 2); page <= Math.min(totalPages - 1, currentPage + 2); page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);
  return pages;
}

function hiddenInputs(params: ListingFilterParams, overrides: Partial<ListingFilterParams> = {}): ReactNode {
  const merged: ListingFilterParams = { ...params, ...overrides };
  const keys: Array<keyof ListingFilterParams> = [
    "q",
    "categoryId",
    "provinceId",
    "districtId",
    "verified",
    "agent",
    "sort",
    "bedrooms",
    "direction",
    "bathrooms",
    "balconyDirection",
    "projectId",
    "area",
    "price",
    "minPrice",
    "maxPrice",
    "minArea",
    "maxArea",
  ];
  return (
    <>
      {keys.map((key) => {
        const value = merged[key];
        if (value === undefined || value === "") return null;
        if (key === "sort" && value === "default") return null;
        if (key === "verified" && value !== "true") return null;
        if (key === "agent" && value !== "true") return null;
        return <input key={key} type="hidden" name={key} value={value} />;
      })}
    </>
  );
}

function formatSimpleDate(d: Date): string {
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });
}

function CheckIcon() {
  return (
    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand">
      <path d="M5 12.5 9.8 17.3 19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function NotificationBellIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 10.5a5.5 5.5 0 0 1 11 0v3.2l1.7 2.3H4.8l1.7-2.3v-3.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 18.2a2.7 2.7 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17.7" cy="6.3" r="2.3" fill="#e43b32" />
    </svg>
  );
}
