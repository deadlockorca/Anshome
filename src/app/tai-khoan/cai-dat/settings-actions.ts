"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { formString } from "@/lib/forms";
import { isStrongEnoughPassword, normalizePhone } from "@/lib/auth/input";

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Cần nhập ${field}.`);
  }
  return value;
}

export async function updateProfile(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/cai-dat");
  }

  const displayName = required(formString(formData, "displayName"), "tên hiển thị");
  const companyName = formString(formData, "companyName");
  const bio = formString(formData, "bio");
  const licenseNumber = formString(formData, "licenseNumber");

  const phone = formString(formData, "phone");
  const normalizedPhone = phone ? normalizePhone(phone) : null;

  if (phone && !normalizedPhone) {
    throw new Error("Số điện thoại không hợp lệ.");
  }

  await db.profile.upsert({
    where: { userId: currentSession.user.id },
    create: {
      userId: currentSession.user.id,
      displayName,
      companyName,
      bio,
      licenseNumber,
    },
    update: {
      displayName,
      companyName,
      bio,
      licenseNumber,
    },
  });

  if (normalizedPhone) {
    const existingPhoneUser = await db.user.findFirst({
      where: { phone: normalizedPhone, id: { not: currentSession.user.id } },
      select: { id: true },
    });

    if (existingPhoneUser) {
      throw new Error("Số điện thoại đã được người dùng khác sử dụng.");
    }

    await db.user.update({
      where: { id: currentSession.user.id },
      data: { phone: normalizedPhone },
    });
  }

  revalidatePath("/tai-khoan/cai-dat");
  redirect("/tai-khoan/cai-dat");
}

export async function changePassword(formData: FormData) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/cai-dat");
  }

  const currentPassword = required(formString(formData, "currentPassword"), "mật khẩu hiện tại");
  const newPassword = required(formString(formData, "newPassword"), "mật khẩu mới");
  const confirmPassword = required(formString(formData, "confirmPassword"), "xác nhận mật khẩu mới");

  if (newPassword !== confirmPassword) {
    throw new Error("Mật khẩu mới và xác nhận không khớp.");
  }

  if (!isStrongEnoughPassword(newPassword)) {
    throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự.");
  }

  const user = await db.user.findUniqueOrThrow({
    where: { id: currentSession.user.id },
    select: { passwordHash: true },
  });

  if (!user.passwordHash || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new Error("Mật khẩu hiện tại không chính xác.");
  }

  await db.user.update({
    where: { id: currentSession.user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  revalidatePath("/tai-khoan/cai-dat");
  redirect("/tai-khoan/cai-dat");
}