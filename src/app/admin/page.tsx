import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

const listingStatusLabel: Record<string, string> = {
  pending_review: "Chờ duyệt",
  published: "Đã đăng",
  rejected: "Bị từ chối",
  draft: "Bản nháp",
  hidden: "Đã ẩn",
  expired: "Hết hạn",
  deleted: "Đã xóa",
};

const leadStatusLabel: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  won: "Thành công",
  lost: "Thất bại",
  spam: "Spam",
};

export default async function AdminDashboardPage() {
  const [users, locations, categories, articleCount, listingGroups, leadGroups, recentLeads, recentAuditLogs] =
    await Promise.all([
      db.user.count(),
      db.location.count(),
      db.category.count(),
      db.article.count(),
      db.listing.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.lead.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.lead.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 5,
        include: {
          listing: { select: { title: true } },
        },
      }),
      db.auditLog.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 5,
        include: {
          actor: {
            include: {
              profile: { select: { displayName: true } },
            },
          },
        },
      }),
    ]);

  const listingCountByStatus = new Map<string, number>(listingGroups.map((item) => [item.status, item._count._all]));
  const leadCountByStatus = new Map<string, number>(leadGroups.map((item) => [item.status, item._count._all]));
  const totalListings = listingGroups.reduce((sum, item) => sum + item._count._all, 0);
  const totalLeads = leadGroups.reduce((sum, item) => sum + item._count._all, 0);
  const pendingReview = listingCountByStatus.get("pending_review") ?? 0;

  const coreStats = [
    { label: "Người dùng", value: users },
    { label: "Tin đăng", value: totalListings },
    { label: "Khách liên hệ", value: totalLeads },
    { label: "Bài viết", value: articleCount },
    { label: "Khu vực", value: locations },
    { label: "Danh mục", value: categories },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nền tảng quản trị</p>
          <h1 className="mt-1 text-2xl font-extrabold">Bảng điều khiển quản trị</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Tổng quan dữ liệu nền tảng: người dùng, tin đăng, khách liên hệ và hoạt động gần đây.
          </p>
        </div>
        {pendingReview > 0 ? (
          <Link href="/admin/listings" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
            {pendingReview} tin chờ duyệt
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {coreStats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6c7280]">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Tin đăng theo trạng thái</h2>
            <Link href="/admin/listings" className="text-sm font-extrabold text-[#c7352d]">Xem hàng chờ</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(listingStatusLabel).map(([status, label]) => (
              <div key={status} className="rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3">
                <p className="text-xs font-bold text-[#6c7280]">{label}</p>
                <p className="mt-1 text-2xl font-extrabold">{listingCountByStatus.get(status) ?? 0}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Khách liên hệ theo trạng thái</h2>
            <Link href="/admin/leads" className="text-sm font-extrabold text-[#c7352d]">Xem tất cả</Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Object.entries(leadStatusLabel).map(([status, label]) => (
              <div key={status} className="rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3">
                <p className="text-xs font-bold text-[#6c7280]">{label}</p>
                <p className="mt-1 text-2xl font-extrabold">{leadCountByStatus.get(status) ?? 0}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Khách liên hệ gần đây</h2>
            <Link href="/admin/leads" className="text-sm font-extrabold text-[#c7352d]">Xem tất cả</Link>
          </div>
          <div className="mt-3 grid gap-2">
            {recentLeads.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có khách liên hệ.</p> : null}
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 rounded-md border border-[#edf0f3] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1f2430]">{lead.name}</p>
                  <p className="truncate text-xs text-[#6c7280]">{lead.listing?.title ?? lead.sourceType}</p>
                </div>
                <StatusBadge value={lead.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Nhật ký hoạt động gần đây</h2>
            <Link href="/admin/audit-logs" className="text-sm font-extrabold text-[#c7352d]">Xem tất cả</Link>
          </div>
          <div className="mt-3 grid gap-2">
            {recentAuditLogs.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có hoạt động.</p> : null}
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-3 rounded-md border border-[#edf0f3] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1f2430]">{log.action}</p>
                  <p className="truncate text-xs text-[#6c7280]">
                    {log.actor?.profile?.displayName ?? log.actor?.email ?? "Hệ thống"} · {log.entityType}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#8a8f99]">{log.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { label: "Duyệt tin đăng", href: "/admin/listings", description: "Duyệt, từ chối và xem lịch sử kiểm duyệt." },
          { label: "Quản lý bài viết", href: "/admin/articles", description: "Viết bài tin tức và quản lý SEO metadata." },
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
