import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dự án bất động sản | Anshome",
  description: "Danh sách dự án bất động sản đang được cập nhật trên Anshome.",
};

type SearchParams = {
  q?: string;
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
  const where = buildProjectWhere(query);
  const [projects, total] = await Promise.all([
    db.project.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 24,
      include: projectInclude,
    }),
    db.project.count({ where }),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f6f8] pt-[var(--header-height)] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1180px] px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-[#c7352d]">Dự án</p>
          <h1 className="mt-1 text-2xl font-extrabold">Dự án bất động sản</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Tìm kiếm dự án theo tên, chủ đầu tư, mô tả hoặc khu vực.
          </p>
        </div>

        <form className="mb-6 grid gap-3 rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)] md:grid-cols-[1fr_auto]" action="/du-an">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Từ khóa
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder="Nhập tên dự án, khu vực, chủ đầu tư..."
              className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]"
            />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2.5 text-sm font-extrabold text-white">
              Tìm kiếm
            </button>
            <Link href="/du-an" className="rounded-md border border-[#d5dae2] px-4 py-2.5 text-sm font-extrabold text-[#384052]">
              Đặt lại
            </Link>
          </div>
        </form>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-[#384052]">{total} dự án đang hiển thị</p>
          <Link href="/tin-dang" className="rounded-md border border-[#c7352d] px-4 py-2 text-sm font-extrabold text-[#c7352d]">
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
    </main>
  );
}

function buildProjectWhere(query?: string): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {
    publishedAt: {
      not: null,
    },
  };

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { addressText: { contains: query } },
      { developer: { name: { contains: query } } },
      { province: { fullName: { contains: query } } },
      { district: { fullName: { contains: query } } },
    ];
  }

  return where;
}

function ProjectCard({ project }: { project: ProjectResult }) {
  const imageUrl = project.media[0]?.media.publicUrl;
  const location = [project.district?.fullName, project.province?.fullName].filter(Boolean).join(", ") || project.addressText || "Đang cập nhật";
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
