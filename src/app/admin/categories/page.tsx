import { db } from "@/lib/db";
import { createCategory, updateCategory } from "@/app/admin/taxonomy-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

const transactionTypeLabel = {
  sale: "Bán",
  rent: "Cho thuê",
  both: "Cả hai",
} as const;

const categoryNameLabel: Record<string, string> = {
  sale_apartment: "Bán căn hộ chung cư",
  sale_serviced_apartment: "Bán chung cư mini, căn hộ dịch vụ",
  sale_house: "Bán nhà riêng",
  sale_villa: "Bán nhà biệt thự, liền kề",
  sale_street_house: "Bán nhà mặt phố",
  sale_shophouse: "Bán shophouse, nhà phố thương mại",
  sale_project_land: "Bán đất nền dự án",
  sale_land: "Bán đất",
  sale_farm_resort: "Bán trang trại, khu nghỉ dưỡng",
  sale_condotel: "Bán condotel",
  sale_warehouse: "Bán kho, nhà xưởng",
  sale_other: "Bán loại bất động sản khác",
  rent_apartment: "Cho thuê căn hộ chung cư",
  rent_serviced_apartment: "Cho thuê chung cư mini, căn hộ dịch vụ",
  rent_house: "Cho thuê nhà riêng",
  rent_villa: "Cho thuê nhà biệt thự, liền kề",
  rent_street_house: "Cho thuê nhà mặt phố",
  rent_room: "Cho thuê nhà trọ, phòng trọ",
  rent_shophouse: "Cho thuê shophouse, nhà phố thương mại",
  rent_office: "Cho thuê văn phòng",
  rent_shop: "Cho thuê, sang nhượng cửa hàng, ki ốt",
  rent_warehouse_land: "Cho thuê kho, nhà xưởng, đất",
  rent_other: "Cho thuê loại bất động sản khác",
  project_apartment: "Dự án căn hộ chung cư",
  project_office: "Dự án cao ốc văn phòng",
  project_urban_area: "Dự án khu đô thị mới",
  project_social_housing: "Dự án nhà ở xã hội",
  project_industrial: "Dự án khu công nghiệp",
};

function displayCategoryName(category: { code: string; name: string }) {
  return categoryNameLabel[category.code] ?? category.name;
}

export default async function AdminCategoriesPage() {
  const [categories, parentOptions] = await Promise.all([
    db.category.findMany({
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: {
          select: {
            code: true,
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
        code: true,
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
                  {displayCategoryName(category)} ({transactionTypeLabel[category.transactionType]})
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
                    <summary className="cursor-pointer font-bold">{displayCategoryName(category)}</summary>
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
                                {displayCategoryName(option)} ({transactionTypeLabel[option.transactionType]})
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                        Tên
                        <input name="name" required defaultValue={displayCategoryName(category)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
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
                <td className="px-4 py-3 text-[#5f6675]">{category.parent ? displayCategoryName(category.parent) : "-"}</td>
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
