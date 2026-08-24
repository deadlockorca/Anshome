import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleForm } from "@/components/articles/article-form";
import { archiveArticle, updateArticle } from "@/app/admin/articles/article-actions";
import { articleEditorRoleCodes } from "@/lib/auth/roles";
import { getCurrentSession, hasRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, currentSession] = await Promise.all([params, getCurrentSession()]);
  const [article, categories] = await Promise.all([
    db.article.findUnique({
      where: { id },
      include: {
        coverMedia: {
          select: { publicUrl: true },
        },
      },
    }),
    db.articleCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!article) {
    notFound();
  }

  const canEdit = currentSession ? hasRole(currentSession, articleEditorRoleCodes) : false;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nội dung</p>
          <h1 className="mt-1 text-2xl font-extrabold">{article.title}</h1>
          <p className="mt-2 font-mono text-xs text-[#6c7280]">/{article.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/tin-tuc/${article.slug}`} className="rounded-md border border-[#c9ced7] px-4 py-2 text-sm font-extrabold text-[#384052]">
            Xem public
          </Link>
          <Link href="/admin/articles" className="rounded-md border border-[#c9ced7] px-4 py-2 text-sm font-extrabold text-[#384052]">
            Về danh sách
          </Link>
        </div>
      </div>

      {canEdit ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <ArticleForm
            action={updateArticle}
            categories={categories}
            article={article}
            coverMediaUrl={article.coverMedia?.publicUrl}
            submitLabel="Lưu bài viết"
          />
          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Thao tác</h2>
              {article.status !== "archived" ? (
                <form action={archiveArticle} className="mt-3">
                  <input type="hidden" name="id" value={article.id} />
                  <button type="submit" className="w-full rounded-md border border-[#c7352d] px-3 py-2 text-sm font-extrabold text-[#c7352d]">
                    Lưu trữ bài viết
                  </button>
                </form>
              ) : (
                <p className="mt-3 text-sm font-bold text-[#6c7280]">Bài viết đã được lưu trữ.</p>
              )}
            </section>
          </aside>
        </div>
      ) : (
        <div className="rounded-md border border-[#dde1e7] bg-white p-4 text-sm font-bold text-[#6c7280]">
          Tài khoản hiện tại chỉ có quyền xem trang quản trị.
        </div>
      )}
    </section>
  );
}
