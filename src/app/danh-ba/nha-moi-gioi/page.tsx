import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

const industries = [
  { key: "developer", label: "Chủ đầu tư" },
  { key: "construction", label: "Thi công xây dựng" },
  { key: "design", label: "Tư vấn thiết kế" },
  { key: "brokerage", label: "Sàn giao dịch bất động sản" },
  { key: "interior", label: "Trang trí nội thất" },
  { key: "material", label: "Vật liệu xây dựng" },
  { key: "finance", label: "Tài chính pháp lý" },
  { key: "other", label: "Các lĩnh vực khác" },
];

const brokerDirectoryPath = "/danh-ba/nha-moi-gioi";

type SearchParams = {
  q?: string;
  kind?: string;
  province?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Nhà môi giới | Danh bạ | Anshome",
    description: "Danh bạ các cá nhân, công ty môi giới nhà đất uy tín tại Việt Nam trên Anshome.",
    alternates: {
      canonical: `${getSiteUrl()}${brokerDirectoryPath}`,
    },
    openGraph: {
      title: "Nhà môi giới | Danh bạ | Anshome",
      description: "Danh bạ các cá nhân, công ty môi giới nhà đất uy tín tại Việt Nam trên Anshome.",
      url: `${getSiteUrl()}${brokerDirectoryPath}`,
      type: "website",
    },
  };
}

export default async function BrokerDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const kind = params.kind === "individual" ? "individual" : "company";
  const province = params.province;
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const agencyWhere: Prisma.AgencyWhereInput = { status: "active" };

  if (q) {
    const matchedIndustryKeys = industries
      .filter((industry) => industry.label.toLowerCase().includes(q.toLowerCase()))
      .map((industry) => industry.key);
    agencyWhere.OR = [
      { name: { contains: q } },
      { address: { contains: q } },
      ...(matchedIndustryKeys.length > 0 ? [{ industry: { in: matchedIndustryKeys } }] : []),
    ];
  }

  if (province) {
    agencyWhere.provinceId = province;
  }

  const [agencies, total, provinces, provinceCounts, brokers, featuredAgencies] = await Promise.all([
    db.agency.findMany({
      where: agencyWhere,
      include: {
        logoMedia: { select: { publicUrl: true } },
        province: { select: { fullName: true } },
        district: { select: { fullName: true } },
      },
      orderBy: { name: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.agency.count({ where: { status: "active" } }),
    db.location.findMany({
      where: { type: "province", isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    db.listing.groupBy({
      by: ["provinceId"],
      where: { status: "published" },
      _count: { _all: true },
    }),
    db.user.findMany({
      where: { status: "active", roles: { some: { role: { code: "agent" } } } },
      include: { profile: true },
      orderBy: { createdAt: "asc" },
      take: 8,
    }),
    db.agency.findMany({
      where: { status: "active", verificationStatus: "verified" },
      include: { logoMedia: { select: { publicUrl: true } } },
      orderBy: { name: "asc" },
      take: 8,
    }),
  ]);

  const countByProvinceId = new Map(provinceCounts.map((item) => [item.provinceId, item._count._all]));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeTabHref = tabHref(kind, q, province);
  const otherKind = kind === "individual" ? "company" : "individual";
  const otherTabHref = tabHref(otherKind, q, province);

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/danh-ba" className="hover:text-brand">Danh bạ</Link>
          <span>/</span>
          <span className="text-[#303743]">Nhà môi giới</span>
        </div>

        <h1 className="text-[22px] font-extrabold leading-8 text-[#20242d]">Danh bạ nhà môi giới</h1>
        <p className="mt-1 text-[14px] font-semibold text-[#66707c]">
          Các cá nhân, công ty môi giới nhà đất uy tín tại Việt Nam.
        </p>

        <form method="get" action={brokerDirectoryPath} className="mt-6 grid gap-3 rounded-md border border-[#e1e4ea] bg-white p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Tìm kiếm tên công ty, môi giới..."
            className="h-10 rounded-md border border-[#d5dae2] px-3 text-[13px] font-semibold text-[#1f2430] outline-none focus:border-brand"
          />
          <select
            name="kind"
            defaultValue={kind}
            className="h-10 cursor-pointer rounded-md border border-[#d5dae2] bg-white px-2 text-[13px] font-semibold text-[#303743] outline-none focus:border-brand"
          >
            <option value="company">Công ty môi giới</option>
            <option value="individual">Cá nhân môi giới</option>
          </select>
          <select
            name="province"
            defaultValue={province ?? ""}
            className="h-10 cursor-pointer rounded-md border border-[#d5dae2] bg-white px-2 text-[13px] font-semibold text-[#303743] outline-none focus:border-brand"
          >
            <option value="">Tỉnh/Thành phố</option>
            {provinces.map((item) => (
              <option key={item.id} value={item.id}>{item.fullName}</option>
            ))}
          </select>
          <button type="submit" className="h-10 rounded-md bg-brand px-5 text-[13px] font-extrabold text-white hover:opacity-90">
            Tìm kiếm
          </button>
        </form>

        <div className="mt-6 flex gap-4 border-b border-[#e1e4ea]">
          <Link
            href={kind === "company" ? activeTabHref : otherTabHref}
            className={`border-b-2 pb-2 text-[14px] font-extrabold ${kind === "company" ? "border-brand text-brand" : "border-transparent text-[#66707c] hover:text-brand"}`}
          >
            Công ty môi giới
          </Link>
          <Link
            href={kind === "individual" ? activeTabHref : otherTabHref}
            className={`border-b-2 pb-2 text-[14px] font-extrabold ${kind === "individual" ? "border-brand text-brand" : "border-transparent text-[#66707c] hover:text-brand"}`}
          >
            Cá nhân môi giới
          </Link>
        </div>

        {kind === "individual" ? (
          brokers.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {brokers.map((broker) => {
                const initial = broker.profile?.displayName?.trim().charAt(0) ?? "M";
                const profileSlug = broker.profile?.publicSlug ?? broker.id;
                return (
                  <Link
                    key={broker.id}
                    href={`/danh-ba/nha-moi-gioi/${profileSlug}`}
                    className="flex items-start gap-3 rounded-md border border-[#e1e4ea] bg-white p-4 hover:border-brand"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-[16px] font-extrabold text-white">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold text-[#20242d]">{broker.profile?.displayName ?? "Môi giới"}</p>
                      {broker.profile?.licenseNumber ? (
                        <p className="mt-0.5 text-[12px] font-semibold text-[#8a8f99]">Chứng chỉ: {broker.profile.licenseNumber}</p>
                      ) : null}
                      {broker.profile?.companyName ? (
                        <p className="mt-0.5 text-[12px] font-semibold text-[#66707c]">{broker.profile.companyName}</p>
                      ) : null}
                      {broker.profile?.bio ? (
                        <p className="mt-1 text-[13px] font-medium leading-5 text-[#5f6675]">{broker.profile.bio}</p>
                      ) : null}
                      {broker.phone ? (
                        <p className="mt-1 text-[12px] font-bold text-brand">{broker.phone}</p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
              Chưa có cá nhân môi giới phù hợp với bộ lọc hiện tại.
            </div>
          )
        ) : agencies.length > 0 ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {agencies.map((agency) => {
              const region = agency.district?.fullName ?? agency.province?.fullName ?? "";
              return (
                <Link
                  key={agency.id}
                  href={`/danh-ba/doanh-nghiep/${agency.slug}`}
                  className="rounded-md border border-[#e1e4ea] bg-white p-4 hover:border-brand"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[#eef0f3] bg-[#f0f2f5]">
                      {agency.logoMedia?.publicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={agency.logoMedia.publicUrl} alt={agency.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-[13px] font-extrabold text-[#6c7280]">
                          {agency.name.trim().charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold text-[#20242d]">{agency.name}</p>
                      <p className="mt-1 text-[12px] font-semibold text-[#66707c]">{agency.address ?? "Đang cập nhật"}</p>
                      <p className="mt-1 flex flex-wrap gap-x-3 text-[12px] font-bold text-[#303743]">
                        {agency.phone ? <span>{agency.phone}</span> : null}
                        {agency.email ? <span>{agency.email}</span> : null}
                      </p>
                    </div>
                  </div>
                  {region ? (
                    <p className="mt-3 border-t border-[#eef0f3] pt-2 text-[12px] font-semibold text-[#8a8f99]">
                      Khu vực hoạt động: {region}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có công ty môi giới phù hợp với bộ lọc hiện tại.
          </div>
        )}

        {kind === "company" && totalPages > 1 ? (
          <Pagination currentPage={currentPage} totalPages={totalPages} q={q} kind={kind} province={province} />
        ) : null}

        {featuredAgencies.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-[17px] font-extrabold text-[#20242d]">Nhà môi giới tiêu biểu</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featuredAgencies.map((agency) => (
                <div key={agency.id} className="flex items-center gap-2 rounded-md border border-[#e1e4ea] bg-white p-3">
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#eef0f3] bg-[#f0f2f5]">
                    {agency.logoMedia?.publicUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={agency.logoMedia.publicUrl} alt={agency.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-[11px] font-extrabold text-[#6c7280]">
                        {agency.name.trim().charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-[12px] font-extrabold leading-4 text-[#303743]">{agency.name}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-[17px] font-extrabold uppercase text-[#20242d]">THEO TỈNH / THÀNH PHỐ</h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {provinceCounts
              .filter((item) => (countByProvinceId.get(item.provinceId) ?? 0) > 0)
              .sort((a, b) => (countByProvinceId.get(b.provinceId) ?? 0) - (countByProvinceId.get(a.provinceId) ?? 0))
              .map((item) => {
                const provinceItem = provinces.find((prov) => prov.id === item.provinceId);
                if (!provinceItem) {
                  return null;
                }
                const count = countByProvinceId.get(item.provinceId) ?? 0;
                return (
                  <Link
                    key={provinceItem.id}
                    href={`${brokerDirectoryPath}?province=${provinceItem.id}`}
                    className="text-[13px] font-bold text-brand hover:underline"
                  >
                    {provinceItem.fullName} ({count.toLocaleString("vi-VN")})
                  </Link>
                );
              })}
          </div>
        </section>

        <div className="mt-10 rounded-md border border-[#e1e4ea] bg-white p-4">
          <form method="get" className="flex flex-wrap items-center gap-3">
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              className="h-10 min-w-0 flex-1 rounded-md border border-[#d5dae2] px-3 text-[13px] font-semibold text-[#1f2430] outline-none focus:border-brand"
            />
            <span className="text-[13px] font-bold text-[#303743]">Nhận bản tin từ Anshome</span>
            <button type="submit" className="h-10 rounded-md bg-brand px-5 text-[13px] font-extrabold text-white hover:opacity-90">
              Đăng ký
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function tabHref(kind: string, q?: string, province?: string): string {
  const query = new URLSearchParams();
  query.set("kind", kind);
  if (q) {
    query.set("q", q);
  }
  if (province) {
    query.set("province", province);
  }
  return `${brokerDirectoryPath}?${query.toString()}`;
}

function Pagination({
  currentPage,
  totalPages,
  q,
  kind,
  province,
}: {
  currentPage: number;
  totalPages: number;
  q?: string;
  kind: string;
  province?: string;
}) {
  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Phân trang">
      {currentPage > 1 ? (
        <PageLink href={pageHref(currentPage - 1, q, kind, province)} label="‹" ariaLabel="Trang trước" />
      ) : null}
      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm font-bold text-[#8a8f99]">...</span>
        ) : (
          <PageLink
            key={item}
            href={pageHref(item, q, kind, province)}
            label={String(item)}
            active={item === currentPage}
          />
        ),
      )}
      {currentPage < totalPages ? (
        <PageLink href={pageHref(currentPage + 1, q, kind, province)} label="›" ariaLabel="Trang sau" />
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

function pageHref(page: number, q?: string, kind?: string, province?: string): string {
  const query = new URLSearchParams();
  if (page > 1) {
    query.set("page", String(page));
  }
  if (q) {
    query.set("q", q);
  }
  if (kind && kind !== "company") {
    query.set("kind", kind);
  }
  if (province) {
    query.set("province", province);
  }
  const queryString = query.toString();
  return `${brokerDirectoryPath}${queryString ? `?${queryString}` : ""}`;
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
