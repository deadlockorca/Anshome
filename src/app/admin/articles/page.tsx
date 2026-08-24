import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const [articles, categories, draftCount, publishedCount, scheduledCount] = await Promise.all([
    db.article.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 100,
      include: {
        category: {
          select: { name: true },
        },
        author: {
          include: {
            profile: {
              select: { displayName: true },
            },
          },
        },
      },
    }),
    db.articleCategory.count(),
    db.article.count({ where: { status: "draft" } }),
    db.article.count({ where: { status: "published" } }),
    db.article.count({ where: { status: "scheduled" } }),
  ]);

  const stats = [
    { label: "Bản nháp", value: draftCount },
    { label: "Đã đăng", value: publishedCount },
    { label: "Đặt lịch", value: scheduledCount },
    { label: "Chuyên mục", value: categories },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nội dung</p>
          <h1 className="mt-1 text-2xl font-extrabold">Quản lý bài viết</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Quản lý bài viết tin tức, SEO metadata và trạng thái xuất bản. Bài viết đã đăng sẽ hiển thị công khai tại /tin-tuc.
          </p>
        </div>
        <Link href="/admin/articles/tao-moi" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
          Tạo bài viết
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
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Bài viết</th>
              <th className="px-4 py-3">Chuyên mục</th>
              <th className="px-4 py-3">Tác giả</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {articles.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={5}>
                  Chưa có bài viết nào.
                </td>
              </tr>
            ) : null}
            {articles.map((article) => (
              <tr key={article.id} className="align-top hover:bg-[#fafbfc]">
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${article.id}`} className="font-bold text-[#1f2430] hover:text-[#c7352d]">
                    {article.title}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-[#6c7280]">/{article.slug}</p>
                </td>
                <td className="px-4 py-3">{article.category?.name ?? "-"}</td>
                <td className="px-4 py-3">{article.author?.profile?.displayName ?? article.author?.email ?? "-"}</td>
                <td className="px-4 py-3"><StatusBadge value={article.status} /></td>
                <td className="px-4 py-3 text-[#5f6675]">{article.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
