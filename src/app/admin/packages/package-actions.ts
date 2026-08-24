"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { adminRoleCodes } from "@/lib/auth/roles";
import { formBoolean, formInt, formString } from "@/lib/forms";
import { writeAuditLog } from "@/lib/audit";

function required(value: string | null, field: string): string {
  if (!value) throw new Error(`Cần nhập ${field}.`);
  return value;
}

function parsePrice(value: string | null): string {
  if (!value) {
    return "0";
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Giá gói không hợp lệ.");
  }
  return parsed.toFixed(2);
}

async function readPackagePayload(formData: FormData) {
  return {
    code: required(formString(formData, "code"), "mã gói"),
    name: required(formString(formData, "name"), "tên gói"),
    description: formString(formData, "description"),
    price: parsePrice(formString(formData, "price")),
    durationDays: formInt(formData, "durationDays", 30),
    featuredQuota: formInt(formData, "featuredQuota"),
    boostQuota: formInt(formData, "boostQuota"),
    refreshQuota: formInt(formData, "refreshQuota"),
    maxListings: formInt(formData, "maxListings", 0) || null,
    isActive: formBoolean(formData, "isActive"),
    sortOrder: formInt(formData, "sortOrder"),
  };
}

export async function createPackage(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const payload = await readPackagePayload(formData);

  const existing = await db.listingPackage.findUnique({ where: { code: payload.code } });
  if (existing) {
    throw new Error("Mã gói đã tồn tại.");
  }

  const pkg = await db.listingPackage.create({ data: payload, select: { id: true } });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing_package",
    entityId: pkg.id,
    action: "package.create",
    after: { code: payload.code, price: payload.price },
  });

  revalidatePath("/admin/packages");
  redirect(`/admin/packages/${pkg.id}`);
}

export async function updatePackage(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const id = required(formString(formData, "id"), "mã gói");
  const before = await db.listingPackage.findUniqueOrThrow({ where: { id } });
  const payload = await readPackagePayload(formData);

  const after = await db.listingPackage.update({
    where: { id },
    data: payload,
    select: { id: true, code: true, price: true, isActive: true },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing_package",
    entityId: after.id,
    action: "package.update",
    before: { id: before.id, price: before.price.toString() },
    after,
  });

  revalidatePath("/admin/packages");
  revalidatePath("/tai-khoan/goi-dang-tin");
  redirect(`/admin/packages/${after.id}`);
}