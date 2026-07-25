import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { deleteOwnListing, submitListingForReview } from "@/app/tai-khoan/tin-dang/listing-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

export default async function AccountListingsPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap");
  }

  const listings = await db.listing.findMany({
    where: {
      ownerUserId: currentSession.user.id,
      status: {
        not: "deleted",
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    include: {
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
    },
  });
  const stats = [
    { label: "Bản nháp", value: listings.filter((listing) => listing.status === "draft").length },
    { label: "Chờ duyệt", value: listings.filter((listing) => listing.status === "pending_review").length },
    { label: "Đã đăng", value: listings.filter((listing) => listing.status === "published").length },
    { label: "Bị từ chối", value: listings.filter((listing) => listing.status === "rejected").length },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Quản lý tin đăng</p>
          <h1 className="mt-1 text-2xl font-extrabold">Tin đăng của tôi</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Khu vực tạo bản nháp, cập nhật nội dung và gửi tin sang hàng chờ kiểm duyệt.
          </p>
        </div>
        <Link href="/tai-khoan/tin-dang/tao-moi" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
          Tạo tin mới
        </Link>
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
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Tin đăng</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Khu vực</th>
              <th className="px-4 py-3 text-right">Giá</th>
              <th className="px-4 py-3 text-right">Diện tích</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {listings.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={7}>
                  Chưa có tin đăng nào.
                </td>
              </tr>
            ) : null}
            {listings.map((listing) => (
              <tr key={listing.id} className="align-top hover:bg-[#fafbfc]">
                <td className="px-4 py-3">
                  <Link href={`/tai-khoan/tin-dang/${listing.id}`} className="font-bold text-[#1f2430] hover:text-[#c7352d]">
                    {listing.title}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-[#6c7280]">{listing.publicId}</p>
                </td>
                <td className="px-4 py-3">{listing.category.name}</td>
                <td className="px-4 py-3 text-[#5f6675]">{[listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || "-"}</td>
                <td className="px-4 py-3 text-right">{listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "-"}</td>
                <td className="px-4 py-3 text-right">{listing.area ? `${listing.area.toString()} m2` : "-"}</td>
                <td className="px-4 py-3"><StatusBadge value={listing.status} /></td>
                <td className="px-4 py-3">
                  {listing.status === "draft" || listing.status === "rejected" ? (
                    <div className="grid w-[120px] gap-2">
                      <form action={submitListingForReview}>
                        <input type="hidden" name="id" value={listing.id} />
                        <button type="submit" className="w-full rounded-md border border-[#c7352d] px-3 py-1.5 text-xs font-extrabold text-[#c7352d]">
                          Gửi duyệt
                        </button>
                      </form>
                      <form action={deleteOwnListing}>
                        <input type="hidden" name="id" value={listing.id} />
                        <input type="hidden" name="note" value="Chủ tin xóa mềm từ danh sách quản lý." />
                        <button type="submit" className="w-full rounded-md border border-[#d5dae2] px-3 py-1.5 text-xs font-extrabold text-[#5f6675] hover:border-[#c7352d] hover:text-[#c7352d]">
                          Xóa tin
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#6c7280]">Không có thao tác</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
