"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { articleEditorRoleCodes } from "@/lib/auth/roles";
import { formBoolean, formString } from "@/lib/forms";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import type { ArticleStatus } from "@/generated/prisma/client";

const articleStatuses = new Set<ArticleStatus>(["draft", "scheduled", "published", "archived"]);

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Cần nhập ${field}.`);
  }

  return value;
}

function optionalUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("URL không hợp lệ.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("URL phải dùng http hoặc https.");
  }

  return url.toString();
}

function readStatus(formData: FormData): ArticleStatus {
  const status = (formString(formData, "status") ?? "draft") as ArticleStatus;

  if (!articleStatuses.has(status)) {
    throw new Error("Trạng thái bài viết không hợp lệ.");
  }

  return status;
}

async function upsertCoverMedia(articleId: string, publicUrl: string | null, storageKey: string) {
  if (!publicUrl) {
    return null;
  }

  const media = await db.media.upsert({
    where: { storageKey },
    create: {
      storageKey,
      publicUrl,
      mimeType: "image/jpeg",
      sizeBytes: 0,
      status: "approved",
    },
    update: {
      publicUrl,
      status: "approved",
    },
    select: { id: true },
  });

  await db.article.update({
    where: { id: articleId },
    data: { coverMediaId: media.id },
  });

  return media.id;
}

async function readArticlePayload(formData: FormData) {
  const title = required(formString(formData, "title"), "tiêu đề");
  const body = required(formString(formData, "body"), "nội dung");
  const providedSlug = formString(formData, "slug");
  const categoryId = formString(formData, "categoryId");
  const status = readStatus(formData);
  const publishedAt =
    status === "published"
      ? new Date()
      : status === "scheduled"
        ? (() => {
            const raw = formString(formData, "publishedAt");
            if (!raw) {
              throw new Error("Cần chọn thời gian đăng khi đặt lịch.");
            }
            const date = new Date(raw);
            if (Number.isNaN(date.getTime())) {
              throw new Error("Thời gian đăng lịch không hợp lệ.");
            }
            return date;
          })()
        : null;

  if (categoryId) {
    const category = await db.articleCategory.findFirst({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new Error("Chuyên mục không hợp lệ.");
    }
  }

  return {
    data: {
      title,
      body,
      categoryId,
      status,
      excerpt: formString(formData, "excerpt"),
      seoTitle: formString(formData, "seoTitle"),
      seoDescription: formString(formData, "seoDescription"),
      canonicalUrl: optionalUrl(formString(formData, "canonicalUrl")),
      noindex: formBoolean(formData, "noindex"),
      publishedAt,
      slug: providedSlug ? slugify(providedSlug) : null,
    },
    coverMediaUrl: optionalUrl(formString(formData, "coverMediaUrl")),
  };
}

async function resolveUniqueArticleSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.article.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createArticle(formData: FormData) {
  const currentSession = await requireRole(articleEditorRoleCodes);
  const payload = await readArticlePayload(formData);
  const slug = await resolveUniqueArticleSlug(payload.data.slug ?? slugify(payload.data.title));

  const article = await db.article.create({
    data: {
      ...payload.data,
      slug,
      authorUserId: currentSession.user.id,
    },
    select: { id: true },
  });

  await upsertCoverMedia(article.id, payload.coverMediaUrl, `articles/${slug}-cover`);

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "article",
    entityId: article.id,
    action: "article.create",
    after: { id: article.id, slug },
  });

  revalidatePath("/tin-tuc");
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}`);
}

export async function updateArticle(formData: FormData) {
  const currentSession = await requireRole(articleEditorRoleCodes);
  const id = required(formString(formData, "id"), "mã bài viết");
  const before = await db.article.findUniqueOrThrow({ where: { id } });
  const payload = await readArticlePayload(formData);
  const slug = await resolveUniqueArticleSlug(payload.data.slug ?? slugify(payload.data.title), id);

  const after = await db.article.update({
    where: { id },
    data: {
      ...payload.data,
      slug,
    },
    select: { id: true, slug: true },
  });

  await upsertCoverMedia(after.id, payload.coverMediaUrl, `articles/${slug}-cover`);

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "article",
    entityId: after.id,
    action: "article.update",
    before: { id: before.id, slug: before.slug, status: before.status },
    after: { id: after.id, slug: after.slug, status: payload.data.status },
  });

  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${slug}`);
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${after.id}`);
  redirect(`/admin/articles/${after.id}`);
}

export async function archiveArticle(formData: FormData) {
  const currentSession = await requireRole(articleEditorRoleCodes);
  const id = required(formString(formData, "id"), "mã bài viết");
  const before = await db.article.findUniqueOrThrow({ where: { id } });

  if (before.status === "archived") {
    throw new Error("Bài viết đã ở trạng thái lưu trữ.");
  }

  const after = await db.article.update({
    where: { id },
    data: { status: "archived", publishedAt: null },
    select: { id: true, slug: true, status: true },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "article",
    entityId: after.id,
    action: "article.archive",
    before: { id: before.id, status: before.status },
    after,
  });

  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${after.slug}`);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}
