import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/status-badge";
import { moderateProjectReview } from "@/app/du-an/review-actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectReviewsPage() {
  const reviews = await db.projectReview.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      project: {
        select: { name: true, slug: true },
      },
      user: {
        include: {
          profile: {
            select: { displayName: true },
          },
        },
      },
    },
  });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nội dung</p>
          <h1 className="mt-1 text-2xl font-extrabold">Đánh giá dự án</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Duyệt các đánh giá người dùng gửi cho dự án. Đánh giá được duyệt sẽ xuất hiện công khai tại trang chi tiết dự án.
          </p>
        </div>
        <p className="text-sm font-bold text-[#384052]">Tổng: {reviews.length}</p>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Dự án</th>
              <th className="px-4 py-3">Người đánh giá</th>
              <th className="px-4 py-3">Số sao</th>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {reviews.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={7}>
                  Chưa có đánh giá nào.
                </td>
              </tr>
            ) : null}
            {reviews.map((review) => (
              <tr key={review.id} className="align-top hover:bg-[#fafbfc]">
                <td className="px-4 py-3">
                  <Link href={`/du-an/${review.project.slug}`} className="font-bold text-[#c7352d] hover:underline">
                    {review.project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-bold text-[#1f2430]">{review.user.profile?.displayName ?? "Ẩn danh"}</td>
                <td className="px-4 py-3 text-[#f5a623]">
                  <span className="font-bold text-[#384052]">{review.rating}</span>
                  <span className="ml-1">{"★".repeat(review.rating)}</span>
                </td>
                <td className="max-w-[220px] px-4 py-3 font-bold text-[#1f2430]">{review.title ?? "-"}</td>
                <td className="max-w-[280px] px-4 py-3 text-[#5f6675]">
                  <p className="line-clamp-2">{review.content ?? "-"}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge value={review.status} /></td>
                <td className="px-4 py-3">
                  {review.status === "pending" ? (
                    <div className="flex gap-2">
                      <form action={moderateProjectReview}>
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button type="submit" className="rounded-md bg-[#16794f] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#116141]">
                          Duyệt
                        </button>
                      </form>
                      <form action={moderateProjectReview}>
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button type="submit" className="rounded-md bg-[#b42318] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#8f1c13]">
                          Từ chối
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#8a8f99]">-</span>
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
