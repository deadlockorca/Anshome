import { db } from "@/lib/db";
import { createLocation, updateLocation } from "@/app/admin/taxonomy-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LocationType } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 40;

const locationTypeLabel = {
  country: "Quốc gia",
  province: "Tỉnh, thành",
  district: "Quận, huyện",
  ward: "Phường, xã",
  street: "Đường",
} as const;

const tabItems: { label: string; type: LocationType | null }[] = [
  { label: "Tất cả", type: null },
  { label: "Quốc gia", type: "country" },
  { label: "Tỉnh, thành", type: "province" },
  { label: "Quận, huyện", type: "district" },
  { label: "Phường, xã", type: "ward" },
  { label: "Đường", type: "street" },
];

const parentTypesFor = (type: string): LocationType[] => {
  switch (type) {
    case "province": return ["country"];
    case "district": return ["province"];
    case "ward": return ["district"];
    case "street": return ["district", "ward"];
    default: return [];
  }
};

const validTypes: LocationType[] = ["country", "province", "district", "ward", "street"];

function buildPageUrl(type: string | null, page: number): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin/locations${qs ? `?${qs}` : ""}`;
}

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const rawType = sp.type;
  const activeType: LocationType | undefined =
    rawType && (validTypes as readonly string[]).includes(rawType)
      ? (rawType as LocationType)
      : undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1") || 1);

  const where = {
    ...(activeType ? { type: activeType } : {}),
  };

  const [locations, total, allParentOptions] = await Promise.all([
    db.location.findMany({
      where,
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        parent: {
          select: {
            fullName: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    }),
    db.location.count({ where }),
    db.location.findMany({
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        type: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Phân loại</p>
          <h1 className="mt-1 text-2xl font-extrabold">Khu vực</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Dữ liệu địa lý đang dùng cho trang SEO, bộ lọc tìm kiếm, dự án và tin đăng.
          </p>
        </div>
        <p className="text-sm font-bold text-[#384052]">{total} bản ghi</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabItems.map((tab) => {
          const href = buildPageUrl(tab.type, 1);
          const isActive = tab.type === activeType;
          return (
            <a
              key={tab.label}
              href={href}
              className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                isActive
                  ? "bg-[#c7352d] text-white"
                  : "bg-[#f0f2f5] text-[#5f6675] hover:bg-[#e5e7eb]"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      <details className="mb-5 rounded-md border border-[#dde1e7] bg-white p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-[#1f2430]">Tạo khu vực</summary>
        <form action={createLocation} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Loại khu vực
            <select name="type" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue="province">
              <option value="country">Quốc gia</option>
              <option value="province">Tỉnh, thành</option>
              <option value="district">Quận, huyện</option>
              <option value="ward">Phường, xã</option>
              <option value="street">Đường</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Tên
            <input name="name" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Tên đầy đủ
            <input name="fullName" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Đường dẫn SEO
            <input name="slug" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Khu vực cha
            <select name="parentId" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue="">
              <option value="">Không có khu vực cha</option>
              {allParentOptions.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.fullName} ({locationTypeLabel[location.type]})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Mã
            <input name="code" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Vĩ độ
            <input name="latitude" inputMode="decimal" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Kinh độ
            <input name="longitude" inputMode="decimal" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm font-bold text-[#384052]">
            <input name="isActive" type="checkbox" defaultChecked />
            Đang hoạt động
          </label>
          <div className="md:col-span-3">
            <button className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white" type="submit">
              Tạo khu vực
            </button>
          </div>
        </form>
      </details>
      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Đường dẫn SEO</th>
              <th className="px-4 py-3">Khu vực cha</th>
              <th className="px-4 py-3 text-right">Khu vực con</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {locations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5f6675]">
                  Không có khu vực nào.
                </td>
              </tr>
            )}
            {locations.map((location) => {
              const allowedParentTypes = parentTypesFor(location.type);
              const parentOptions = allParentOptions.filter(
                (opt) => opt.id !== location.id && allowedParentTypes.includes(opt.type)
              );
              return (
                <tr key={location.id} className="align-top hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer font-bold">{location.fullName}</summary>
                      <form action={updateLocation} className="mt-3 grid w-[720px] gap-3 rounded-md border border-[#dde1e7] bg-[#fafbfc] p-3 md:grid-cols-2">
                        <input type="hidden" name="id" value={location.id} />
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Loại khu vực
                          <select name="type" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={location.type}>
                            <option value="country">Quốc gia</option>
                            <option value="province">Tỉnh, thành</option>
                            <option value="district">Quận, huyện</option>
                            <option value="ward">Phường, xã</option>
                            <option value="street">Đường</option>
                          </select>
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Khu vực cha
                          <select name="parentId" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={location.parentId ?? ""}>
                            <option value="">Không có khu vực cha</option>
                            {parentOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.fullName} ({locationTypeLabel[option.type]})
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Tên
                          <input name="name" required defaultValue={location.name} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Tên đầy đủ
                          <input name="fullName" required defaultValue={location.fullName} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Đường dẫn SEO
                          <input name="slug" defaultValue={location.slug} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                          Mã
                          <input name="code" defaultValue={location.code ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                        </label>
                        <label className="flex items-center gap-2 pt-2 text-sm font-bold text-[#384052]">
                          <input name="isActive" type="checkbox" defaultChecked={location.isActive} />
                          Đang hoạt động
                        </label>
                        <div>
                          <button className="rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white" type="submit">
                            Lưu khu vực
                          </button>
                        </div>
                      </form>
                    </details>
                  </td>
                  <td className="px-4 py-3">{locationTypeLabel[location.type]}</td>
                  <td className="px-4 py-3 font-mono text-xs">{location.slug}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{location.parent?.fullName ?? "-"}</td>
                  <td className="px-4 py-3 text-right">{location._count.children}</td>
                  <td className="px-4 py-3"><StatusBadge value={location.isActive ? "active" : "inactive"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          <a
            href={buildPageUrl(activeType ?? null, page - 1)}
            className={`inline-flex items-center rounded-md px-3 py-1.5 font-bold transition-colors ${
              page === 1
                ? "pointer-events-none text-[#b0b7c3]"
                : "bg-[#f0f2f5] text-[#5f6675] hover:bg-[#e5e7eb]"
            }`}
            aria-disabled={page === 1}
          >
            &laquo; Trước
          </a>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-[#b0b7c3]">...</span>
              ) : (
                <a
                  key={item}
                  href={buildPageUrl(activeType ?? null, item)}
                  className={`inline-flex items-center rounded-md px-3 py-1.5 font-bold transition-colors ${
                    item === page
                      ? "bg-[#c7352d] text-white"
                      : "bg-[#f0f2f5] text-[#5f6675] hover:bg-[#e5e7eb]"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          <a
            href={buildPageUrl(activeType ?? null, page + 1)}
            className={`inline-flex items-center rounded-md px-3 py-1.5 font-bold transition-colors ${
              page === totalPages
                ? "pointer-events-none text-[#b0b7c3]"
                : "bg-[#f0f2f5] text-[#5f6675] hover:bg-[#e5e7eb]"
            }`}
            aria-disabled={page === totalPages}
          >
            Sau &raquo;
          </a>
          <span className="ml-2 text-[#5f6675]">
            Trang {page} / {totalPages}
          </span>
        </div>
      )}
    </section>
  );
}