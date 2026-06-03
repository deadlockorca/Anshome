"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { adminRoleCodes } from "@/lib/auth/roles";
import { formBoolean, formDecimalString, formInt, formString } from "@/lib/forms";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import type { CategoryTransactionType, LocationType } from "@/generated/prisma/client";

const locationTypes = new Set<LocationType>(["country", "province", "district", "ward", "street"]);
const categoryTransactionTypes = new Set<CategoryTransactionType>(["sale", "rent", "both"]);

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Vui lòng nhập ${field}.`);
  }

  return value;
}

export async function createLocation(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const type = required(formString(formData, "type"), "loại khu vực") as LocationType;

  if (!locationTypes.has(type)) {
    throw new Error("Loại khu vực không hợp lệ.");
  }

  const name = required(formString(formData, "name"), "tên");
  const fullName = required(formString(formData, "fullName"), "tên đầy đủ");
  const slug = formString(formData, "slug") ?? slugify(name);
  const parentId = formString(formData, "parentId");
  const latitude = formDecimalString(formData, "latitude");
  const longitude = formDecimalString(formData, "longitude");

  const location = await db.location.create({
    data: {
      type,
      name,
      fullName,
      slug,
      parentId,
      oldName: formString(formData, "oldName"),
      newName: formString(formData, "newName"),
      code: formString(formData, "code"),
      latitude,
      longitude,
      isActive: formBoolean(formData, "isActive"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "location",
    entityId: location.id,
    action: "location.create",
    after: location,
  });

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function updateLocation(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const id = required(formString(formData, "id"), "ID");
  const type = required(formString(formData, "type"), "loại khu vực") as LocationType;

  if (!locationTypes.has(type)) {
    throw new Error("Loại khu vực không hợp lệ.");
  }

  const before = await db.location.findUniqueOrThrow({ where: { id } });
  const name = required(formString(formData, "name"), "tên");
  const fullName = required(formString(formData, "fullName"), "tên đầy đủ");
  const slug = formString(formData, "slug") ?? slugify(name);
  const parentId = formString(formData, "parentId");
  const latitude = formDecimalString(formData, "latitude");
  const longitude = formDecimalString(formData, "longitude");

  const after = await db.location.update({
    where: { id },
    data: {
      type,
      name,
      fullName,
      slug,
      parentId,
      oldName: formString(formData, "oldName"),
      newName: formString(formData, "newName"),
      code: formString(formData, "code"),
      latitude,
      longitude,
      isActive: formBoolean(formData, "isActive"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "location",
    entityId: after.id,
    action: "location.update",
    before,
    after,
  });

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function createCategory(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const transactionType = required(formString(formData, "transactionType"), "loại giao dịch") as CategoryTransactionType;

  if (!categoryTransactionTypes.has(transactionType)) {
    throw new Error("Loại giao dịch của danh mục không hợp lệ.");
  }

  const name = required(formString(formData, "name"), "tên");
  const slug = formString(formData, "slug") ?? slugify(name);
  const code = formString(formData, "code") ?? slug.replace(/-/g, "_");

  const category = await db.category.create({
    data: {
      parentId: formString(formData, "parentId"),
      transactionType,
      code,
      name,
      slug,
      sortOrder: formInt(formData, "sortOrder"),
      isActive: formBoolean(formData, "isActive"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "category",
    entityId: category.id,
    action: "category.create",
    after: category,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const id = required(formString(formData, "id"), "ID");
  const transactionType = required(formString(formData, "transactionType"), "loại giao dịch") as CategoryTransactionType;

  if (!categoryTransactionTypes.has(transactionType)) {
    throw new Error("Loại giao dịch của danh mục không hợp lệ.");
  }

  const before = await db.category.findUniqueOrThrow({ where: { id } });
  const name = required(formString(formData, "name"), "tên");
  const slug = formString(formData, "slug") ?? slugify(name);
  const code = formString(formData, "code") ?? slug.replace(/-/g, "_");

  const after = await db.category.update({
    where: { id },
    data: {
      parentId: formString(formData, "parentId"),
      transactionType,
      code,
      name,
      slug,
      sortOrder: formInt(formData, "sortOrder"),
      isActive: formBoolean(formData, "isActive"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "category",
    entityId: after.id,
    action: "category.update",
    before,
    after,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
