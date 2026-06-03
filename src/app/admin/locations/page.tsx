import { db } from "@/lib/db";
import { createLocation, updateLocation } from "@/app/admin/taxonomy-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

const locationTypeLabel = {
  country: "Quốc gia",
  province: "Tỉnh, thành",
  district: "Quận, huyện",
  ward: "Phường, xã",
  street: "Đường",
} as const;

export default async function AdminLocationsPage() {
  const [locations, parentOptions] = await Promise.all([
    db.location.findMany({
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
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
    db.location.findMany({
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        type: true,
      },
    }),
  ]);

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
        <p className="text-sm font-bold text-[#384052]">{locations.length} bản ghi</p>
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
              {parentOptions.map((location) => (
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
            {locations.map((location) => (
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
                          {parentOptions
                            .filter((option) => option.id !== location.id)
                            .map((option) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
