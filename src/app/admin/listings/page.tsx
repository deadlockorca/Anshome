import Link from "next/link";
import { db } from "@/lib/db";
import { approveListing, rejectListing } from "@/app/tai-khoan/tin-dang/listing-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const [pendingCount, publishedCount, rejectedCount, draftCount, listings] = await Promise.all([
    db.listing.count({ where: { status: "pending_review" } }),
    db.listing.count({ where: { status: "published" } }),
    db.listing.count({ where: { status: "rejected" } }),
    db.listing.count({ where: { status: "draft" } }),
    db.listing.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 100,
      include: {
        owner: {
          include: {
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
        category: {
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
        moderationEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  const stats = [
    { label: "Chờ duyệt", value: pendingCount },
    { label: "Đã đăng", value: publishedCount },
    { label: "Bị từ chối", value: rejectedCount },
    { label: "Bản nháp", value: draftCount },
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Kiểm duyệt</p>
        <h1 className="mt-1 text-2xl font-extrabold">Hàng chờ tin đăng</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Hàng chờ để duyệt tin từ chủ tin hoặc môi giới. Tin được duyệt sẽ hiển thị công khai, tin bị từ chối sẽ trả về để chỉnh sửa và ghi nhận lịch sử kiểm duyệt.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6c7280]">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Tin đăng</th>
              <th className="px-4 py-3">Chủ tin</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Khu vực</th>
              <th className="px-4 py-3 text-right">Giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Kiểm duyệt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {listings.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={7}>
                  Chưa có tin đăng nào trong hàng chờ.
                </td>
              </tr>
            ) : null}
            {listings.map((listing) => {
              const ownerName = listing.owner.profile?.displayName ?? listing.owner.email ?? listing.owner.phone ?? "Người dùng";
              return (
                <tr key={listing.id} className="align-top hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/listings/${listing.id}`} className="font-bold text-[#1f2430] hover:text-[#c7352d]">
                      {listing.title}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-[#6c7280]">{listing.publicId}</p>
                  </td>
                  <td className="px-4 py-3">{ownerName}</td>
                  <td className="px-4 py-3">{listing.category.name}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{[listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-right">{listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "-"}</td>
                  <td className="px-4 py-3"><StatusBadge value={listing.status} /></td>
                  <td className="px-4 py-3">
                    {listing.status === "pending_review" || listing.status === "submitted" ? (
                      <div className="grid w-[340px] gap-2">
                        <form action={approveListing} className="grid gap-2">
                          <input type="hidden" name="id" value={listing.id} />
                          <input name="note" placeholder="Ghi chú duyệt" className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                          <button type="submit" className="rounded-md bg-[#16794f] px-3 py-2 text-xs font-extrabold text-white">
                            Duyệt và đăng
                          </button>
                        </form>
                        <form action={rejectListing} className="grid gap-2">
                          <input type="hidden" name="id" value={listing.id} />
                          <select name="reasonCode" defaultValue="content_quality" className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs font-bold text-[#1f2430]">
                            <option value="content_quality">Chất lượng nội dung</option>
                            <option value="missing_information">Thiếu thông tin</option>
                            <option value="duplicate">Trùng tin</option>
                            <option value="policy_violation">Vi phạm chính sách</option>
                          </select>
                          <textarea name="note" required rows={2} placeholder="Ghi chú từ chối" className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                          <button type="submit" className="rounded-md border border-[#c7352d] px-3 py-2 text-xs font-extrabold text-[#c7352d]">
                            Từ chối
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="text-xs leading-5 text-[#6c7280]">
                        <StatusBadge value={listing.moderationStatus} />
                        {listing.moderationEvents[0]?.note ? <p className="mt-1 max-w-[260px]">{listing.moderationEvents[0].note}</p> : null}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
