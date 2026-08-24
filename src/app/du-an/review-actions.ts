"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { getCurrentSession, requireRole } from "@/lib/auth/session";
import { articleEditorRoleCodes } from "@/lib/auth/roles";

export type ProjectReviewState = { status: "idle" | "success" | "error"; message?: string } | undefined;

export async function recalculateProjectRating(projectId: string): Promise<void> {
  const grouped = await db.projectReview.groupBy({
    by: ["rating"],
    where: { projectId, status: "approved" },
    _count: { _all: true },
  });

  const total = grouped.reduce((sum, item) => sum + item._count._all, 0);
  if (total === 0) {
    await db.project.update({
      where: { id: projectId },
      data: { ratingAverage: null, ratingCount: 0, ratingBreakdown: Prisma.DbNull },
    });
    return;
  }

  const weightedSum = grouped.reduce((sum, item) => sum + item.rating * item._count._all, 0);
  const breakdown: Record<string, number> = {};
  for (let star = 5; star >= 1; star -= 1) {
    breakdown[String(star)] = grouped.find((item) => item.rating === star)?._count._all ?? 0;
  }

  await db.project.update({
    where: { id: projectId },
    data: {
      ratingAverage: Math.round((weightedSum / total) * 100) / 100,
      ratingCount: total,
      ratingBreakdown: breakdown,
    },
  });
}

export async function createProjectReview(
  projectId: string,
  prevState: ProjectReviewState,
  formData: FormData,
): Promise<ProjectReviewState> {
  const currentSession = await getCurrentSession();
  if (!currentSession) {
    return { status: "error", message: "Bạn cần đăng nhập để đánh giá dự án." };
  }

  const rating = Number.parseInt(String(formData.get("rating") ?? ""), 10);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Vui lòng chọn số sao đánh giá." };
  }
  if (title.length < 5) {
    return { status: "error", message: "Tiêu đề đánh giá phải có ít nhất 5 ký tự." };
  }

  const project = await db.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!project) return { status: "error", message: "Dự án không tồn tại." };

  try {
    await db.projectReview.create({
      data: {
        projectId,
        userId: currentSession.user.id,
        rating,
        title,
        content: content || null,
        status: "pending",
      },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as { code?: string }).code === "P2002") {
      return { status: "error", message: "Bạn đã đánh giá dự án này rồi." };
    }
    throw error;
  }

  return { status: "success", message: "Đã gửi đánh giá. Quản trị viên sẽ duyệt trong thời gian sớm nhất." };
}

export async function moderateProjectReview(formData: FormData) {
  await requireRole(articleEditorRoleCodes);

  const reviewId = String(formData.get("reviewId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!reviewId || !["approved", "rejected"].includes(status)) return;

  const review = await db.projectReview.findUnique({ where: { id: reviewId }, select: { projectId: true } });
  if (!review) return;

  await db.projectReview.update({ where: { id: reviewId }, data: { status: status as "approved" | "rejected" } });
  await recalculateProjectRating(review.projectId);
  revalidatePath("/admin/project-reviews");
  revalidatePath(`/du-an`);
}
