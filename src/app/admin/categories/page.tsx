import { db } from "@/lib/db";
import { createCategory, updateCategory } from "@/app/admin/taxonomy-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

const transactionTypeLabel = {
  sale: "Bán",
  rent: "Cho thuê",
  both: "Cả hai",
} as const;

export default async function AdminCategoriesPage() {
  const [categories, parentOptions] = await Promise.all([
    db.category.findMany({
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            listings: true,
            projects: true,
          },
        },
      },
    }),
    db.category.findMany({
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        transactionType: true,
      },
    }),
  ]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Phân loại</p>
          <h1 className="mt-1 text-2xl font-extrabold">Danh mục</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Cây danh mục điều khiển biểu mẫu đăng tin, điều hướng công khai, bộ lọc tìm kiếm và tuyến SEO.
          </p>
        </div>
        <p className="text-sm font-bold text-[#384052]">{categories.length} bản ghi</p>
      </div>
      <details className="mb-5 rounded-md border border-[#dde1e7] bg-white p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-[#1f2430]">Tạo danh mục</summary>
        <form action={createCategory} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Loại giao dịch
            <select name="transactionType" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue="sale">
              <option value="sale">Bán</option>
              <option value="rent">Cho thuê</option>
              <option value="both">Cả hai</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Tên
            <input name="name" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Mã
            <input name="code" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Đường dẫn SEO
            <input name="slug" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Danh mục cha
            <select name="parentId" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue="">
              <option value="">Không có danh mục cha</option>
              {parentOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({transactionTypeLabel[category.transactionType]})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Thứ tự sắp xếp
            <input name="sortOrder" type="number" defaultValue={0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm font-bold text-[#384052]">
            <input name="isActive" type="checkbox" defaultChecked />
            Đang hoạt động
          </label>
          <div className="md:col-span-3">
            <button className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white" type="submit">
              Tạo danh mục
            </button>
          </div>
        </form>
      </details>
      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Giao dịch</th>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Đường dẫn SEO</th>
              <th className="px-4 py-3">Danh mục cha</th>
              <th className="px-4 py-3 text-right">Tin đăng</th>
              <th className="px-4 py-3 text-right">Dự án</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {categories.map((category) => (
              <tr key={category.id} className="align-top hover:bg-[#fafbfc]">
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer font-bold">{category.name}</summary>
                    <form action={updateCategory} className="mt-3 grid w-[760px] gap-3 rounded-md border border-[#dde1e7] bg-[#fafbfc] p-3 md:grid-cols-2">
                      <input type="hidden" name="id" value={category.id} />
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Loại giao dịch
                        <select name="transactionType" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={category.transactionType}>
                          <option value="sale">Bán</option>
                          <option value="rent">Cho thuê</option>
                          <option value="both">Cả hai</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Danh mục cha
                        <select name="parentId" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={category.parentId ?? ""}>
                          <option value="">Không có danh mục cha</option>
                          {parentOptions
                            .filter((option) => option.id !== category.id)
                            .map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name} ({transactionTypeLabel[option.transactionType]})
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Tên
                        <input name="name" required defaultValue={category.name} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Mã
                        <input name="code" defaultValue={category.code} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Đường dẫn SEO
                        <input name="slug" defaultValue={category.slug} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Thứ tự sắp xếp
                        <input name="sortOrder" type="number" defaultValue={category.sortOrder} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
                      </label>
                      <label className="flex items-center gap-2 pt-2 text-sm font-bold text-[#384052]">
                        <input name="isActive" type="checkbox" defaultChecked={category.isActive} />
                        Đang hoạt động
                      </label>
                      <div>
                        <button className="rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white" type="submit">
                          Lưu danh mục
                        </button>
                      </div>
                    </form>
                  </details>
                </td>
                <td className="px-4 py-3">{transactionTypeLabel[category.transactionType]}</td>
                <td className="px-4 py-3 font-mono text-xs">{category.code}</td>
                <td className="px-4 py-3 font-mono text-xs">{category.slug}</td>
                <td className="px-4 py-3 text-[#5f6675]">{category.parent?.name ?? "-"}</td>
                <td className="px-4 py-3 text-right">{category._count.listings}</td>
                <td className="px-4 py-3 text-right">{category._count.projects}</td>
                <td className="px-4 py-3"><StatusBadge value={category.isActive ? "active" : "inactive"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
