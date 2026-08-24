import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export default async function AdminPackagesPage() {
  const packages = await db.listingPackage.findMany({
    orderBy: [{ sortOrder: "asc" }],
  });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Gói & đơn hàng</p>
          <h1 className="mt-1 text-2xl font-extrabold">Gói đăng tin</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Quản lý gói dịch vụ đăng tin và quyền lợi kèm theo.
          </p>
        </div>
        <Link href="/admin/packages/tao-moi" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
          Tạo gói mới
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Hiệu lực</th>
              <th className="px-4 py-3 text-center">Nổi bật</th>
              <th className="px-4 py-3 text-center">Đẩy</th>
              <th className="px-4 py-3 text-center">Làm mới</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-[#fafbfc]">
                <td className="px-4 py-3 font-bold text-[#1f2430]">{pkg.name}</td>
                <td className="px-4 py-3">{pkg.price.toString() === "0" ? "Miễn phí" : `${numberFormatter.format(Number(pkg.price.toString()))} đ`}</td>
                <td className="px-4 py-3">{pkg.durationDays} ngày</td>
                <td className="px-4 py-3 text-center">{pkg.featuredQuota}</td>
                <td className="px-4 py-3 text-center">{pkg.boostQuota}</td>
                <td className="px-4 py-3 text-center">{pkg.refreshQuota}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-extrabold ${pkg.isActive ? "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]" : "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]"}`}>
                    {pkg.isActive ? "Đang bán" : "Đã tắt"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/packages/${pkg.id}`} className="font-extrabold text-[#c7352d] hover:underline">
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}