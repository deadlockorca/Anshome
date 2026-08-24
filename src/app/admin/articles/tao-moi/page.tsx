import { db } from "@/lib/db";
import { ArticleForm } from "@/components/articles/article-form";
import { createArticle } from "@/app/admin/articles/article-actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const categories = await db.articleCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nội dung</p>
        <h1 className="mt-1 text-2xl font-extrabold">Tạo bài viết mới</h1>
      </div>
      <ArticleForm action={createArticle} categories={categories} submitLabel="Tạo bài viết" />
    </section>
  );
}
