import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { deleteSavedSearch, updateSearchFrequency } from "@/app/tai-khoan/yeu-thich/favorite-actions";
import type { SavedSearch } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const frequencyOptions = [
  { value: "daily", label: "Mỗi ngày" },
  { value: "weekly", label: "Mỗi tuần" },
  { value: "instant", label: "Tức thì" },
];

export default async function SavedSearchesPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/tim-kiem-da-luu");
  }

  const searches = await db.savedSearch.findMany({
    where: { userId: currentSession.user.id },
    orderBy: [{ createdAt: "desc" }],
  });

  const activeCount = searches.filter((search) => search.isActive).length;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tài khoản</p>
        <h1 className="mt-1 text-2xl font-extrabold">Tìm kiếm đã lưu</h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6675]">
          {activeCount > 0
            ? `${activeCount} tìm kiếm đang nhận cảnh báo tin mới theo lịch.`
            : "Lưu bộ lọc tìm kiếm từ trang tin đăng để nhận cảnh báo tin mới phù hợp."}
        </p>
      </div>

      <div className="grid gap-4">
        {searches.length === 0 ? (
          <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có tìm kiếm nào được lưu. Mở trang{" "}
            <Link href="/nha-dat-ban" className="text-[#c7352d]">Nhà đất bán</Link> hoặc{" "}
            <Link href="/nha-dat-cho-thue" className="text-[#c7352d]">Nhà đất cho thuê</Link> và nhấn &quot;Lưu tìm kiếm&quot;.
          </div>
        ) : null}
        {searches.map((search) => (
          <SearchRow key={search.id} search={search} />
        ))}
      </div>
    </section>
  );
}

function SearchRow({ search }: { search: SavedSearch }) {
  const applyHref = buildApplyHref(search);
  const querySummary = summarizeQuery(search.queryJson as Record<string, unknown>);

  return (
    <article className="rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-[#1f2430]">{search.name}</h2>
          <p className="mt-1 text-sm font-semibold text-[#5f6675]">{querySummary}</p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-extrabold ${search.isActive ? "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]" : "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]"}`}>
          {search.isActive ? "Đang bật" : "Đang tắt"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0f3] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={applyHref} className="rounded-md bg-[#c7352d] px-3 py-2 text-sm font-extrabold text-white">
            Xem kết quả
          </Link>
          <form action={updateSearchFrequency} className="flex items-center gap-1">
            <input type="hidden" name="id" value={search.id} />
            <AutoSubmitSelect
              name="frequency"
              defaultValue={search.frequency}
              options={frequencyOptions}
              className="rounded-md border border-[#d5dae2] px-2 py-2 text-sm font-semibold text-[#384052]"
            />
            <span className="text-xs font-semibold text-[#8a8f99]">cảnh báo</span>
          </form>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#8a8f99]">
            Tạo {search.createdAt.toLocaleDateString("vi-VN")}
            {search.lastSentAt ? ` · Gửi lần cuối ${search.lastSentAt.toLocaleDateString("vi-VN")}` : ""}
          </span>
          <form action={deleteSavedSearch}>
            <input type="hidden" name="id" value={search.id} />
            <button type="submit" className="rounded-md border border-[#c7352d] px-3 py-2 text-xs font-extrabold text-[#c7352d]">
              Xóa
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

function buildApplyHref(search: SavedSearch): string {
  const query = (search.queryJson ?? {}) as Record<string, unknown>;
  const transactionType = typeof query.transactionType === "string" ? query.transactionType : "sale";
  const base = transactionType === "rent" ? "/nha-dat-cho-thue" : "/nha-dat-ban";
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (key === "transactionType") {
      continue;
    }
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  }

  const queryString = params.toString();
  return `${base}${queryString ? `?${queryString}` : ""}`;
}

function summarizeQuery(query: Record<string, unknown>): string {
  const parts: string[] = [];

  if (typeof query.q === "string" && query.q) {
    parts.push(`Từ khóa: "${query.q}"`);
  }
  if (query.verified === "true") {
    parts.push("Tin xác thực");
  }
  if (typeof query.price === "string" && query.price) {
    parts.push(`Giá: ${query.price}`);
  }
  if (typeof query.area === "string" && query.area) {
    parts.push(`Diện tích: ${query.area}`);
  }
  if (typeof query.sort === "string" && query.sort && query.sort !== "newest") {
    parts.push(`Sắp xếp: ${query.sort}`);
  }

  return parts.length > 0 ? parts.join(" · ") : "Tất cả tin đăng";
}
