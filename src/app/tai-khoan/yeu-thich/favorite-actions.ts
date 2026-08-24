"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { formString } from "@/lib/forms";
import type { Prisma } from "@/generated/prisma/client";

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Cần nhập ${field}.`);
  }
  return value;
}

export async function toggleFavorite(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    const redirectPath = formString(formData, "redirectPath") ?? "/tai-khoan/yeu-thich";
    redirect(`/dang-nhap?next=${encodeURIComponent(redirectPath)}`);
  }

  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const userId = currentSession.user.id;

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });

  if (existing) {
    await db.favorite.delete({
      where: { userId_listingId: { userId, listingId } },
    });
  } else {
    await db.favorite.create({
      data: { userId, listingId },
    });
  }

  revalidatePath("/tai-khoan/yeu-thich");

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    select: { slug: true, publicId: true },
  });

  if (listing) {
    revalidatePath(`/tin-dang/${listing.slug}-${listing.publicId}`);
  }
}

export async function saveSearch(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    const redirectPath = formString(formData, "redirectPath") ?? "/tai-khoan/tim-kiem-da-luu";
    redirect(`/dang-nhap?next=${encodeURIComponent(redirectPath)}`);
  }

  const name = required(formString(formData, "name"), "tên tìm kiếm");
  const queryJson = required(formString(formData, "queryJson"), "query");
  const frequency = formString(formData, "frequency") ?? "daily";

  let parsed: unknown;
  try {
    parsed = JSON.parse(queryJson);
  } catch {
    throw new Error("Query không hợp lệ.");
  }

  await db.savedSearch.create({
    data: {
      userId: currentSession.user.id,
      name,
      queryJson: parsed as Prisma.InputJsonValue,
      frequency,
      isActive: true,
    },
  });

  revalidatePath("/tai-khoan/tim-kiem-da-luu");
  redirect("/tai-khoan/tim-kiem-da-luu");
}

export async function deleteSavedSearch(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    throw new Error("Bạn cần đăng nhập.");
  }

  const id = required(formString(formData, "id"), "mã tìm kiếm");
  const search = await db.savedSearch.findFirstOrThrow({
    where: { id, userId: currentSession.user.id },
  });

  await db.savedSearch.delete({ where: { id: search.id } });
  revalidatePath("/tai-khoan/tim-kiem-da-luu");
  redirect("/tai-khoan/tim-kiem-da-luu");
}

export async function updateSearchFrequency(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return;
  }

  const id = required(formString(formData, "id"), "mã tìm kiếm");
  const frequency = formString(formData, "frequency") ?? "daily";

  await db.savedSearch.updateMany({
    where: { id, userId: currentSession.user.id },
    data: { frequency },
  });

  revalidatePath("/tai-khoan/tim-kiem-da-luu");
}