import { db } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { isStrongEnoughPassword, normalizeEmail, normalizePhone, readString } from "@/lib/auth/input";
import { jsonError, jsonResponse } from "@/lib/http/json";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return jsonError("Dữ liệu gửi lên không hợp lệ.");
  }

  const identifier = readString(body.identifier);
  const password = body.password;

  if (!identifier || !isStrongEnoughPassword(password)) {
    return jsonError("Thông tin đăng nhập không hợp lệ.", 401);
  }

  const email = normalizeEmail(identifier);
  const phone = normalizePhone(identifier);

  if (!email && !phone) {
    return jsonError("Thông tin đăng nhập không hợp lệ.", 401);
  }

  const user = await db.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
      status: "active",
    },
    include: {
      profile: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user?.passwordHash) {
    return jsonError("Thông tin đăng nhập không hợp lệ.", 401);
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return jsonError("Thông tin đăng nhập không hợp lệ.", 401);
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession(user.id);

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.status,
      profile: user.profile
        ? {
            displayName: user.profile.displayName,
            publicSlug: user.profile.publicSlug,
            verificationStatus: user.profile.verificationStatus,
          }
        : null,
      roles: user.roles.map(({ role, scopeType, scopeId }) => ({
        code: role.code,
        scopeType,
        scopeId,
      })),
    },
  });
}
