import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [users, listings, locations, categories, articles, leads] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.location.count(),
    db.category.count(),
    db.article.count(),
    db.lead.count(),
  ]);

  const stats = [
    { label: "Người dùng", value: users },
    { label: "Tin đăng", value: listings },
    { label: "Khu vực", value: locations },
    { label: "Danh mục", value: categories },
    { label: "Bài viết", value: articles },
    { label: "Khách liên hệ", value: leads },
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nền tảng quản trị</p>
        <h1 className="mt-1 text-2xl font-extrabold">Bảng điều khiển quản trị</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Khung quản trị đọc dữ liệu trực tiếp từ MySQL. Tin đăng, CMS và kiểm duyệt sẽ được vận hành từ khu vực này.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6c7280]">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { label: "Duyệt tin đăng", href: "/admin/listings", description: "Duyệt, từ chối và xem lịch sử kiểm duyệt." },
          { label: "Quản lý danh mục", href: "/admin/categories", description: "Điều khiển phân loại cho biểu mẫu, tìm kiếm và SEO." },
          { label: "Nhật ký hoạt động", href: "/admin/audit-logs", description: "Theo dõi các thao tác quản trị quan trọng." },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="rounded-md border border-[#dde1e7] bg-white p-4 hover:border-[#c7352d] hover:shadow-[0_14px_40px_rgba(20,28,45,0.06)]">
            <p className="text-sm font-extrabold text-[#1f2430]">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#6c7280]">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
