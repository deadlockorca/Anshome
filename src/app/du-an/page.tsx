import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FeaturedProjectsBanner } from "@/components/projects/featured-projects-banner";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { buildProjectWhere, projectPricePresets, projectStatusOptions } from "@/lib/projects/query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dự án bất động sản | Anshome",
  description: "Danh sách dự án bất động sản đang được cập nhật trên Anshome.",
};

type SearchParams = {
  q?: string;
  provinceId?: string;
  categoryId?: string;
  price?: string;
  status?: string;
};

const projectInclude = {
  category: {
    select: {
      name: true,
    },
  },
  developer: {
    select: {
      name: true,
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
} satisfies Prisma.ProjectInclude;

type ProjectResult = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim();
  const [minimumPrice = "", maximumPrice = ""] = (params.price ?? "-").split("-");
  const where = buildProjectWhere(
    {
      q: query,
      provinceId: params.provinceId,
      categoryId: params.categoryId,
      status: params.status,
      minPrice: minimumPrice || undefined,
      maxPrice: maximumPrice || undefined,
    },
    null,
  );
  const [projects, total, provinces, categories] = await Promise.all([
    db.project.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 24,
      include: projectInclude,
    }),
    db.project.count({ where }),
    db.location.findMany({
      where: { isActive: true, type: "province" },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    db.category.findMany({
      where: { isActive: true, transactionType: "both" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f6f8] pt-[var(--header-height)] text-[#1f2430]">
      <SiteHeader />
      <FeaturedProjectsBanner />
      <section className="mx-auto w-full max-w-[1180px] px-6 py-8">
        <form
          action="/du-an"
          className="mb-8 grid overflow-hidden rounded-lg border border-[#dde1e7] bg-white p-3 shadow-[0_8px_24px_rgba(20,28,45,0.05)] md:grid-cols-2 lg:grid-cols-[minmax(240px,1.8fr)_repeat(4,minmax(125px,1fr))_56px] lg:p-0"
        >
          <label className="flex min-w-0 items-center gap-3 rounded-md bg-[#f4f4f4] px-4 py-3 lg:m-3 lg:mr-4">
            <SearchIcon />
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder="Tìm kiếm dự án..."
              aria-label="Tìm kiếm dự án"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#30343d] outline-none placeholder:text-[#999ca2]"
            />
          </label>

          <ProjectFilterField label="Khu vực">
            <AutoSubmitSelect
              name="provinceId"
              defaultValue={params.provinceId ?? ""}
              options={[{ value: "", label: "Toàn quốc" }, ...provinces.map((province) => ({ value: province.id, label: province.fullName }))]}
              className="w-full cursor-pointer border-0 bg-transparent text-[15px] font-bold text-[#30343d] outline-none"
            />
          </ProjectFilterField>

          <ProjectFilterField label="Loại hình">
            <AutoSubmitSelect
              name="categoryId"
              defaultValue={params.categoryId ?? ""}
              options={[{ value: "", label: "Tất cả" }, ...categories.map((category) => ({ value: category.id, label: category.name }))]}
              className="w-full cursor-pointer border-0 bg-transparent text-[15px] font-bold text-[#30343d] outline-none"
            />
          </ProjectFilterField>

          <ProjectFilterField label="Khoảng giá">
            <AutoSubmitSelect
              name="price"
              defaultValue={params.price ?? ""}
              options={projectPricePresets.map((preset) => ({
                value: preset.min || preset.max ? `${preset.min ?? ""}-${preset.max ?? ""}` : "",
                label: preset.min || preset.max ? preset.label : "Tất cả",
              }))}
              className="w-full cursor-pointer border-0 bg-transparent text-[15px] font-bold text-[#30343d] outline-none"
            />
          </ProjectFilterField>

          <ProjectFilterField label="Trạng thái">
            <AutoSubmitSelect
              name="status"
              defaultValue={params.status ?? ""}
              options={[{ value: "", label: "Tất cả" }, ...projectStatusOptions]}
              className="w-full cursor-pointer border-0 bg-transparent text-[15px] font-bold text-[#30343d] outline-none"
            />
          </ProjectFilterField>

          <Link
            href="/du-an"
            aria-label="Đặt lại bộ lọc"
            title="Đặt lại bộ lọc"
            className="grid min-h-14 place-items-center border-t border-[#eceef1] text-[#4d525b] transition hover:bg-[#f5f6f8] hover:text-[#c7352d] md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0"
          >
            <ResetIcon />
          </Link>
        </form>

        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-[#c7352d]">Dự án</p>
          <h1 className="mt-1 text-2xl font-extrabold">Dự án bất động sản</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Tìm kiếm dự án theo tên, chủ đầu tư, mô tả hoặc khu vực.
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-[#384052]">{total} dự án đang hiển thị</p>
          <Link href="/nha-dat-ban" className="rounded-md border border-[#c7352d] px-4 py-2 text-sm font-extrabold text-[#c7352d]">
            Xem tin đăng
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có dự án phù hợp với từ khóa.
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

function ProjectFilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-h-14 min-w-0 flex-col justify-center border-t border-[#eceef1] px-4 py-2 lg:border-l lg:border-t-0">
      <span className="text-[12px] font-bold text-[#3f434b]">{label}</span>
      <span className="mt-1 block min-w-0">{children}</span>
    </label>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="21" height="21" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#20242d]">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m15.5 15.5 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5.2 8.2A7 7 0 1 1 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.2 4.8v3.7h3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectCard({ project }: { project: ProjectResult }) {
  const imageUrl = project.media[0]?.media.publicUrl;
  const location = project.district?.fullName ?? project.province?.fullName ?? project.addressText ?? "Đang cập nhật";
  const category = project.category?.name ?? "Dự án";
  const developer = project.developer?.name ?? "Đang cập nhật";

  return (
    <article className="overflow-hidden rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)] transition hover:border-[#c7352d]">
      <Link href={`/du-an/${project.slug}`} className="block bg-[#e9ecef]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={project.name} className="aspect-[16/9] w-full object-cover" loading="lazy" />
        ) : (
          <span className="grid aspect-[16/9] place-items-center text-sm font-bold text-[#7a808c]">Chưa có ảnh</span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs font-bold uppercase text-[#c7352d]">{category}</p>
        <h2 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-[#252a36]">
          <Link href={`/du-an/${project.slug}`} className="hover:text-[#c7352d]">
            {project.name}
          </Link>
        </h2>
        <p className="mt-3 text-sm font-semibold text-[#5f6675]">{location}</p>
        <p className="mt-2 text-sm font-bold text-[#384052]">Chủ đầu tư: {developer}</p>
      </div>
    </article>
  );
}
