"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminRoleCodes } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { formString } from "@/lib/forms";
import type { RoleCode, UserStatus } from "@/generated/prisma/client";

const userStatuses = new Set<UserStatus>(["active", "suspended", "deleted"]);
const roleCodes = new Set<RoleCode>(["seeker", "owner", "agent", "agency_admin", "developer", "moderator", "editor", "ops", "super_admin"]);

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Vui lòng nhập ${field}.`);
  }

  return value;
}

function getSelectedRoles(formData: FormData): RoleCode[] {
  return formData
    .getAll("roles")
    .filter((value): value is string => typeof value === "string")
    .filter((value): value is RoleCode => roleCodes.has(value as RoleCode));
}

export async function updateUserStatus(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const userId = required(formString(formData, "userId"), "ID người dùng");
  const status = required(formString(formData, "status"), "trạng thái") as UserStatus;

  if (!userStatuses.has(status)) {
    throw new Error("Trạng thái tài khoản không hợp lệ.");
  }

  if (currentSession.user.id === userId && status !== "active") {
    throw new Error("Không thể khóa hoặc xóa tài khoản đang đăng nhập.");
  }

  const before = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  const after = await db.user.update({
    where: { id: userId },
    data: { status },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "user",
    entityId: after.id,
    action: "user.update_status",
    before,
    after,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRoles(formData: FormData) {
  const currentSession = await requireRole(adminRoleCodes);
  const userId = required(formString(formData, "userId"), "ID người dùng");
  const selectedRoles = Array.from(new Set(getSelectedRoles(formData)));

  if (currentSession.user.id === userId && !selectedRoles.some((role) => adminRoleCodes.includes(role))) {
    throw new Error("Không thể gỡ toàn bộ quyền quản trị của tài khoản đang đăng nhập.");
  }

  const before = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  const roles = await db.role.findMany({
    where: {
      code: {
        in: selectedRoles,
      },
    },
  });

  const after = await db.$transaction(async (tx) => {
    await tx.userRole.deleteMany({
      where: { userId },
    });

    if (roles.length > 0) {
      await tx.userRole.createMany({
        data: roles.map((role) => ({
          userId,
          roleId: role.id,
        })),
      });
    }

    return tx.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "user",
    entityId: after.id,
    action: "user.update_roles",
    before,
    after,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
