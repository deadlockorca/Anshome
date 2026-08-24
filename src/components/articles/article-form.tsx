import type { Article, ArticleCategory } from "@/generated/prisma/client";

type ArticleFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: Array<Pick<ArticleCategory, "id" | "name">>;
  article?: Article;
  coverMediaUrl?: string | null;
  submitLabel: string;
};

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "draft", label: "Bản nháp" },
  { value: "scheduled", label: "Đặt lịch" },
  { value: "published", label: "Đã đăng" },
  { value: "archived", label: "Lưu trữ" },
];

const statusLabel: Record<string, string> = {
  draft: "Bản nháp",
  scheduled: "Đặt lịch",
  published: "Đã đăng",
  archived: "Lưu trữ",
};

export function ArticleForm({ action, categories, article, coverMediaUrl, submitLabel }: ArticleFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-md border border-[#dde1e7] bg-white p-4">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Tiêu đề
          <input name="title" required defaultValue={article?.title ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Slug (để trống để tự tạo từ tiêu đề)
          <input name="slug" defaultValue={article?.slug ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Chuyên mục
          <select name="categoryId" defaultValue={article?.categoryId ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
            <option value="">Chưa chọn</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Trạng thái
          <select name="status" defaultValue={article?.status ?? "draft"} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          URL ảnh bìa
          <input name="coverMediaUrl" type="url" defaultValue={coverMediaUrl ?? ""} placeholder="https://..." className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Thời gian đăng (lên lịch)
        <input name="publishedAt" type="datetime-local" defaultValue={article?.publishedAt?.toISOString().slice(0, 16) ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
      </label>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Tóm tắt (excerpt)
        <textarea name="excerpt" rows={3} defaultValue={article?.excerpt ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
      </label>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Nội dung
        <textarea name="body" required rows={14} defaultValue={article?.body ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
      </label>

      <fieldset className="grid gap-3 rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3 md:grid-cols-2">
        <legend className="px-2 text-xs font-bold uppercase text-[#6c7280]">SEO</legend>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          SEO title
          <input name="seoTitle" defaultValue={article?.seoTitle ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          SEO description
          <input name="seoDescription" defaultValue={article?.seoDescription ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Canonical URL
          <input name="canonicalUrl" type="url" defaultValue={article?.canonicalUrl ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="flex items-center gap-2 self-end text-sm font-bold text-[#384052]">
          <input name="noindex" type="checkbox" defaultChecked={article?.noindex ?? false} className="h-4 w-4" />
          Noindex (chặn Google lập chỉ mục)
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
          {submitLabel}
        </button>
        {article ? (
          <span className="text-sm font-bold text-[#6c7280]">
            Trạng thái hiện tại: {statusLabel[article.status] ?? article.status}
          </span>
        ) : null}
      </div>
    </form>
  );
}
