import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

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

const businessDirectoryPath = "/danh-ba/doanh-nghiep-bat-dong-san";

type SearchParams = {
  q?: string;
  industry?: string;
  province?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Doanh nghiệp bất động sản | Danh bạ | Anshome",
    description: "Các doanh nghiệp, công ty bất động sản uy tín tại Việt Nam trên Anshome.",
    alternates: {
      canonical: `${getSiteUrl()}${businessDirectoryPath}`,
    },
    openGraph: {
      title: "Doanh nghiệp bất động sản | Danh bạ | Anshome",
      description: "Các doanh nghiệp, công ty bất động sản uy tín tại Việt Nam trên Anshome.",
      url: `${getSiteUrl()}${businessDirectoryPath}`,
      type: "website",
    },
  };
}

export default async function BusinessDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const industry = params.industry && industries.some((item) => item.key === params.industry) ? params.industry : undefined;
  const province = params.province;

  const agencyWhere: Prisma.AgencyWhereInput = { status: "active" };

  if (q) {
    const matchedIndustryKeys = industries
      .filter((item) => item.label.toLowerCase().includes(q.toLowerCase()))
      .map((item) => item.key);
    agencyWhere.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { address: { contains: q } },
      ...(matchedIndustryKeys.length > 0 ? [{ industry: { in: matchedIndustryKeys } }] : []),
    ];
  }

  if (industry) {
    agencyWhere.industry = industry;
  }

  if (province) {
    agencyWhere.provinceId = province;
  }

  const [agencies, provinces, projects] = await Promise.all([
    db.agency.findMany({
      where: agencyWhere,
      include: {
        logoMedia: { select: { publicUrl: true } },
        province: { select: { fullName: true } },
      },
      orderBy: { name: "asc" },
    }),
    db.location.findMany({
      where: { type: "province", isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    db.project.findMany({
      where: { status: { in: ["selling", "upcoming"] } },
      orderBy: { publishedAt: "desc" },
      take: 10,
      include: {
        district: { select: { fullName: true } },
        province: { select: { fullName: true } },
      },
    }),
  ]);

  const agenciesByIndustry = new Map<string, typeof agencies>();
  for (const item of industries) {
    agenciesByIndustry.set(item.key, []);
  }
  for (const agency of agencies) {
    const list = agenciesByIndustry.get(agency.industry ?? "other") ?? [];
    list.push(agency);
    agenciesByIndustry.set(agency.industry ?? "other", list);
  }

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/danh-ba" className="hover:text-brand">Danh bạ</Link>
          <span>/</span>
          <span className="text-[#303743]">Doanh nghiệp</span>
        </div>

        <h1 className="text-[22px] font-extrabold leading-8 text-[#20242d]">
          Các doanh nghiệp, công ty bất động sản uy tín tại Việt Nam
        </h1>
        <p className="mt-1 text-[14px] font-semibold text-[#66707c]">
          Danh bạ doanh nghiệp bất động sản xếp theo lĩnh vực hoạt động.
        </p>

        <form method="get" action={businessDirectoryPath} className="mt-6 grid gap-3 rounded-md border border-[#e1e4ea] bg-white p-4 md:grid-cols-[1fr_220px_180px_auto]">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Tìm kiếm tên doanh nghiệp..."
            className="h-10 rounded-md border border-[#d5dae2] px-3 text-[13px] font-semibold text-[#1f2430] outline-none focus:border-brand"
          />
          <select
            name="industry"
            defaultValue={industry ?? ""}
            className="h-10 cursor-pointer rounded-md border border-[#d5dae2] bg-white px-2 text-[13px] font-semibold text-[#303743] outline-none focus:border-brand"
          >
            <option value="">Lĩnh vực</option>
            {industries.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
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

        {agencies.length === 0 ? (
          <div className="mt-6 rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có doanh nghiệp phù hợp với bộ lọc hiện tại.
          </div>
        ) : null}

        {industries.map((group) => {
          const groupAgencies = agenciesByIndustry.get(group.key) ?? [];
          if (groupAgencies.length === 0) {
            return null;
          }
          return (
            <section key={group.key} className="mt-8">
              <h2 className="text-[17px] font-extrabold text-[#20242d]">{group.label}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {groupAgencies.map((agency) => (
                  <Link key={agency.id} href={`/danh-ba/doanh-nghiep/${agency.slug}`} className="flex items-center gap-3 rounded-md border border-[#e1e4ea] bg-white p-4 hover:border-brand">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-[#eef0f3] bg-[#f0f2f5]">
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
                      <p className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#20242d]">{agency.name}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#8a8f99]">{agency.province?.fullName ?? "Toàn quốc"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {projects.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-[17px] font-extrabold text-[#20242d]">Dự án đang thi công</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const location = project.district?.fullName ?? project.province?.fullName ?? "";
                return (
                  <Link
                    key={project.id}
                    href={`/du-an/${project.slug}`}
                    className="rounded-md border border-[#e1e4ea] bg-white p-4 hover:border-brand"
                  >
                    <p className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#20242d]">{project.name}</p>
                    <p className="mt-1 text-[12px] font-medium text-[#66707c]">Tiến độ dự án cập nhật...</p>
                    {location ? (
                      <p className="mt-1 text-[12px] font-semibold text-[#8a8f99]">{location}</p>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

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
