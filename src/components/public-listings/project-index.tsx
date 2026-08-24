import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FeaturedProjectsBanner } from "@/components/projects/featured-projects-banner";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import type { Prisma, ProjectStatus } from "@/generated/prisma/client";
import {
  getProjectCategoryDisplayLabel,
  getProjectLandingDescription,
  getProjectLandingTitle,
  getSiteUrl,
  type ProjectSeoContext,
} from "@/lib/seo/landing";
import {
  buildProjectOrderBy,
  buildProjectPagination,
  buildProjectWhere,
  projectPricePresets,
  projectSortOptions,
  projectStatusOptions,
  resolveProjectPage,
  resolveProjectSort,
  resolveTotalProjectPages,
  type ProjectFilterParams,
} from "@/lib/projects/query";

export const projectIndexInclude = {
  category: { select: { name: true, slug: true } },
  developer: { select: { name: true } },
  province: { select: { fullName: true } },
  district: { select: { fullName: true } },
  media: {
    where: { media: { status: "approved" } },
    orderBy: [{ sortOrder: "asc" }],
    take: 1,
    include: { media: { select: { publicUrl: true } } },
  },
  _count: { select: { media: true } },
} satisfies Prisma.ProjectInclude;

type ProjectIndexResult = Prisma.ProjectGetPayload<{ include: typeof projectIndexInclude }>;

type ProjectIndexProps = {
  context: ProjectSeoContext;
  searchParams: ProjectFilterParams;
};

export async function ProjectIndex({ context, searchParams }: ProjectIndexProps) {
  const params = normalizeParams(searchParams);
  const where = buildProjectWhere(params, context);
  const orderBy = buildProjectOrderBy(params.sort);
  const page = resolveProjectPage(params.page);
  const pagination = buildProjectPagination(page);
  const actionPath = `/${context.slug}`;

  const [projects, total, projectCategories, provinces, recentArticles] = await Promise.all([
    db.project.findMany({
      where,
      orderBy,
      ...pagination,
      include: projectIndexInclude,
    }),
    db.project.count({ where }),
    db.category.findMany({
      where: { transactionType: "both", isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    db.location.findMany({
      where: { isActive: true, type: "province" },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    db.article.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }],
      take: 6,
      select: { id: true, title: true, slug: true, publishedAt: true, coverMedia: { select: { publicUrl: true } } },
    }),
  ]);

  const provinceCounts = await db.project.groupBy({
    by: ["provinceId"],
    where: buildProjectWhere({ ...params, provinceId: undefined }, context),
    _count: { _all: true },
  });
  const countByProvinceId = new Map(provinceCounts.map((item) => [item.provinceId, item._count._all]));

  const totalPages = resolveTotalProjectPages(total);
  const currentSort = resolveProjectSort(params.sort);
  const title = getProjectLandingTitle(context);
  const categoryLabel = context.category ? getProjectCategoryDisplayLabel(context.category) : "Dự án";
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/du-an" },
    ...(context.category ? [{ label: categoryLabel, href: actionPath }] : []),
    ...(!params.provinceId ? [{ label: "Toàn Quốc", href: actionPath }] : []),
  ];

  const sidebar = (
    <>
      <SidebarFilterBox title="Khu vực">
        <FilterRow href={sidebarHref(actionPath, params, { provinceId: undefined })} active={!params.provinceId}>
          Trên toàn quốc
        </FilterRow>
        <div className="max-h-64 overflow-y-auto pr-1">
          {provinces
            .filter((province) => (countByProvinceId.get(province.id) ?? 0) > 0)
            .map((province) => {
              const count = countByProvinceId.get(province.id) ?? 0;
              return (
                <FilterRow
                  key={province.id}
                  href={sidebarHref(actionPath, params, { provinceId: province.id })}
                  active={params.provinceId === province.id}
                  count={count}
                >
                  {province.fullName}
                </FilterRow>
              );
            })}
        </div>
      </SidebarFilterBox>

      <SidebarFilterBox title="Loại hình">
        {projectCategories.map((category) => (
          <FilterRow key={category.id} href={`/${category.slug}`} active={context.category?.id === category.id}>
            {getProjectCategoryDisplayLabel(category)}
          </FilterRow>
        ))}
      </SidebarFilterBox>

      <SidebarFilterBox title="Khoảng giá">
        {projectPricePresets.map((preset) => {
          const active = preset.min === params.minPrice && preset.max === params.maxPrice;
          return (
            <FilterRow
              key={preset.label}
              href={sidebarHref(actionPath, params, { minPrice: preset.min, maxPrice: preset.max })}
              active={active}
            >
              {preset.label}
            </FilterRow>
          );
        })}
      </SidebarFilterBox>

      <SidebarFilterBox title="Trạng thái">
        {projectStatusOptions.map((option) => (
          <FilterRow
            key={option.value}
            href={sidebarHref(actionPath, params, { status: option.value })}
            active={params.status === option.value}
          >
            {option.label}
          </FilterRow>
        ))}
      </SidebarFilterBox>

      <Link href={actionPath} className="rounded-md border border-[#e1e4ea] bg-white px-3 py-2 text-[13px] font-extrabold text-[#303743] hover:text-brand">
        Đặt lại
      </Link>
    </>
  );

  return (
    <main className="stage-root bg-[#f5f6f7] text-[#2b2c33]">
      <SiteHeader />

      <FeaturedProjectsBanner />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          {breadcrumbItems.map((item, index) => (
            <span key={`${item.href}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span>/</span> : null}
              <Link href={item.href} className="hover:text-brand">{item.label}</Link>
            </span>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden content-start gap-4 lg:grid">{sidebar}</aside>

          <section className="min-w-0">
            <div className="mb-4">
              <h1 className="text-[22px] font-extrabold leading-8 text-[#20242d]">
                {`${title}${context.category ? " toàn quốc" : ""}`}
              </h1>
              <p className="mt-1 text-[14px] font-semibold text-[#66707c]">{`Hiện đang có ${total.toLocaleString("vi-VN")} dự án`}</p>
            </div>

            <form action={actionPath} method="get" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#e1e4ea] bg-white px-3 py-2">
              <input type="hidden" name="provinceId" value={params.provinceId ?? ""} />
              <input type="hidden" name="status" value={params.status ?? ""} />
              <input type="hidden" name="minPrice" value={params.minPrice ?? ""} />
              <input type="hidden" name="maxPrice" value={params.maxPrice ?? ""} />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Tìm kiếm dự án..."
                  className="h-9 min-w-0 flex-1 rounded-md border border-[#cfd1d4] bg-white px-3 text-[13px] font-semibold text-[#2f2f2f] outline-none focus:border-brand"
                />
                <button type="submit" className="h-9 shrink-0 rounded-md bg-brand px-4 text-[13px] font-extrabold text-white">
                  Tìm kiếm
                </button>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#303743]">
                <span>Sắp xếp:</span>
                <AutoSubmitSelect
                  name="sort"
                  defaultValue={currentSort}
                  options={projectSortOptions.map((option) => ({ value: option.key, label: option.label }))}
                  className="h-9 cursor-pointer rounded-md border border-[#cfd1d4] bg-white px-2 text-[12px] font-bold text-[#2f2f2f]"
                />
              </div>
            </form>

            {projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có dự án phù hợp với bộ lọc hiện tại.
              </div>
            )}

            {totalPages > 1 ? (
              <Pagination currentPage={page} totalPages={totalPages} basePath={actionPath} params={buildPaginationParams(params)} />
            ) : null}

            <SeoTextBlock title={title} />

            {/* Tin tức dự án */}
            <div className="mt-8 rounded-md border border-[#e1e4ea] bg-white p-4">
              <h3 className="mb-3 text-[14px] font-extrabold text-[#20242d]">Tin tức dự án</h3>
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
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export function buildProjectIndexMetadata(
  context: ProjectSeoContext,
  searchParams: ProjectFilterParams,
): Metadata {
  const title = `${getProjectLandingTitle(context)} toàn quốc | Anshome`;
  const description = getProjectLandingDescription(context);
  const canonicalUrl = buildProjectCanonicalUrl(context, searchParams);
  const page = resolveProjectPage(searchParams.page);

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

function buildProjectCanonicalUrl(context: ProjectSeoContext, searchParams: ProjectFilterParams): string {
  const url = new URL(`${getSiteUrl()}/${context.slug}`);
  const page = resolveProjectPage(searchParams.page);

  if (page > 1) {
    url.searchParams.set("page", String(page));
  }

  return url.toString();
}

function normalizeParams(searchParams: ProjectFilterParams): ProjectFilterParams {
  return {
    q: searchParams.q,
    categoryId: searchParams.categoryId,
    provinceId: searchParams.provinceId,
    status: searchParams.status,
    price: searchParams.price,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    page: searchParams.page,
  };
}

function buildPaginationParams(params: ProjectFilterParams): URLSearchParams {
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
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.minPrice) {
    query.set("minPrice", params.minPrice);
  }
  if (params.maxPrice) {
    query.set("maxPrice", params.maxPrice);
  }
  if (params.sort && params.sort !== "newest") {
    query.set("sort", params.sort);
  }
  return query;
}

function buildSidebarQuery(params: ProjectFilterParams, overrides: Partial<ProjectFilterParams> = {}): URLSearchParams {
  const query = new URLSearchParams();
  const merged: ProjectFilterParams = { ...params, ...overrides };
  const entries: Array<[string, string | undefined]> = [
    ["q", merged.q],
    ["provinceId", merged.provinceId],
    ["status", merged.status],
    ["minPrice", merged.minPrice],
    ["maxPrice", merged.maxPrice],
    ["sort", merged.sort && merged.sort !== "newest" ? merged.sort : undefined],
  ];
  for (const [key, value] of entries) {
    if (value) {
      query.set(key, value);
    }
  }
  return query;
}

function sidebarHref(actionPath: string, params: ProjectFilterParams, overrides: Partial<ProjectFilterParams> = {}): string {
  const queryString = buildSidebarQuery(params, overrides).toString();
  return queryString ? `${actionPath}?${queryString}` : actionPath;
}

function ProjectCard({ project }: { project: ProjectIndexResult }) {
  const imageUrl = project.media[0]?.media.publicUrl;
  const location = project.district?.fullName ?? project.province?.fullName ?? project.addressText ?? "Đang cập nhật";
  const description = project.description || "Thông tin chi tiết dự án đang được cập nhật.";
  const developer = project.developer?.name ?? "Đang cập nhật";
  const statusBadge = getStatusBadge(project.status);

  return (
    <article className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white shadow-[0_2px_10px_rgba(20,28,45,0.04)] hover:border-brand">
      <Link href={`/du-an/${project.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-[#e9ecef]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={project.name} className="h-full w-full object-cover" loading="lazy" />
        ) : null}
        <span className={`absolute left-2 top-2 rounded px-2 py-1 text-[11px] font-extrabold leading-none ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-[12px] font-black leading-none text-white">
          <ImageIcon />
          {project._count.media}
        </span>
      </Link>
      <div className="p-4">
        <h2 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-[#20242d] hover:text-brand">
          <Link href={`/du-an/${project.slug}`}>{project.name}</Link>
        </h2>
        <p className="mt-2 text-[12px] font-bold text-[#66707c]">
          {formatProjectArea(project.landArea)}
          {project.apartmentCount ? <> · {project.apartmentCount.toLocaleString("vi-VN")}</> : null}
          {project.towerCount ? <> · {project.towerCount}</> : null}
          {project.landArea || project.apartmentCount || project.towerCount ? " · " : ""}
          {formatProjectPrice(project.priceMin, project.priceMax, project.priceUnit)}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-[#66707c]">{location}</p>
        <p className="mt-2 line-clamp-3 text-[13px] font-medium leading-6 text-[#8a8d93]">{description}</p>
        <p className="mt-3 border-t border-[#eef0f3] pt-3 text-[12px] font-bold text-[#303743]">Chủ đầu tư: {developer}</p>
      </div>
    </article>
  );
}

function getStatusBadge(status: ProjectStatus): { label: string; className: string } {
  switch (status) {
    case "selling":
      return { label: "Đang mở bán", className: "bg-[#dcfff1] text-[#04a56a]" };
    case "upcoming":
      return { label: "Sắp mở bán", className: "bg-[#fff3d6] text-[#e8a200]" };
    case "handed_over":
      return { label: "Đã bàn giao", className: "bg-[#eef0f3] text-[#66707c]" };
    default:
      return { label: "Đang cập nhật", className: "bg-[#f2f2f2] text-[#9b9b9b]" };
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatProjectArea(landArea: { toNumber(): number } | null): string {
  if (landArea == null) {
    return "Đang cập nhật";
  }

  const area = landArea.toNumber();

  if (area >= 10000) {
    return `${formatNumber(area / 10000)} ha`;
  }

  return `${formatNumber(area)} m²`;
}

function formatProjectPrice(
  priceMin: { toNumber(): number } | null,
  priceMax: { toNumber(): number } | null,
  priceUnit: string | null,
): string {
  if (priceUnit !== "VND/m2") {
    return "Liên hệ";
  }

  const min = priceMin?.toNumber();
  const max = priceMax?.toNumber();

  if (min != null && max != null && min !== max) {
    return `${formatNumber(min / 1000000)} - ${formatNumber(max / 1000000)} triệu/m²`;
  }

  if (min != null) {
    return `${formatNumber(min / 1000000)} triệu/m²`;
  }

  if (max != null) {
    return `${formatNumber(max / 1000000)} triệu/m²`;
  }

  return "Liên hệ";
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
      className={`flex items-center justify-between gap-2 rounded px-1 py-1.5 text-[13px] leading-5 ${
        active ? "font-extrabold text-brand" : "font-semibold text-[#303743] hover:text-brand"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {active ? <CheckIcon /> : null}
        {children}
      </span>
      {count !== undefined ? <span className="text-[12px] font-semibold text-[#8a8f99]">{count.toLocaleString("vi-VN")}</span> : null}
    </Link>
  );
}

function SeoTextBlock({ title }: { title: string }) {
  return (
    <section className="mt-6 rounded-md border border-[#dde1e7] bg-white p-5 text-[13px] font-medium leading-6 text-[#4b5360]">
      <h2 className="text-[18px] font-extrabold text-[#20242d]">{title}: thông tin tổng quan</h2>
      <p className="mt-3">
        Danh sách dự án được cập nhật theo trạng thái đã duyệt, giúp người mua nhanh chóng so sánh vị trí, tiến độ, giá bán và chủ đầu tư. Khi quan tâm một dự án, bạn có thể mở chi tiết để xem ảnh, mô tả, vị trí và thông tin liên hệ.
      </p>
      <p className="mt-3">
        Nên ưu tiên các dự án có pháp lý minh bạch, tiến độ rõ ràng và mức giá phù hợp với mặt bằng khu vực. Anshome tiếp tục hoàn thiện dữ liệu thị trường để hỗ trợ quá trình tìm kiếm bất động sản hiệu quả hơn.
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

function ImageIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="m5 18 5-5 3 3 3-3 3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
