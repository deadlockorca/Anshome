import { db } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { isStrongEnoughPassword, normalizeEmail, normalizePhone, readString } from "@/lib/auth/input";
import { jsonError, jsonResponse } from "@/lib/http/json";
import type { RoleCode } from "@/generated/prisma/client";

const allowedSelfServeRoles = new Set<RoleCode>(["seeker", "owner", "agent"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return jsonError("Dữ liệu gửi lên không hợp lệ.");
  }

  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const password = body.password;
  const displayName = readString(body.displayName);
  const requestedRole = readString(body.role) as RoleCode | null;
  const roleCode = requestedRole && allowedSelfServeRoles.has(requestedRole) ? requestedRole : "seeker";

  if (!email && !phone) {
    return jsonError("Cần nhập email hoặc số điện thoại.");
  }

  if (!isStrongEnoughPassword(password)) {
    return jsonError("Mật khẩu phải có ít nhất 8 ký tự.");
  }

  if (!displayName) {
    return jsonError("Cần nhập tên hiển thị.");
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
    select: { id: true },
  });

  if (existingUser) {
    return jsonError("Tài khoản đã tồn tại.", 409);
  }

  const role = await db.role.findUnique({
    where: { code: roleCode },
    select: { id: true, code: true },
  });

  if (!role) {
    return jsonError("Thiếu dữ liệu vai trò tài khoản.", 500);
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      phone,
      passwordHash,
      profile: {
        create: {
          displayName,
        },
      },
      roles: {
        create: {
          roleId: role.id,
        },
      },
    },
    select: {
      id: true,
      email: true,
      phone: true,
      status: true,
      profile: {
        select: {
          displayName: true,
        },
      },
      roles: {
        select: {
          role: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  });

  await createSession(user.id);

  return jsonResponse({ user }, { status: 201 });
}
