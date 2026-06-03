import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import type { RoleCode, Session, User } from "@/generated/prisma/client";

export const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "anshome_session";

const defaultSessionTtlDays = Number(process.env.SESSION_TTL_DAYS ?? 30);

type SessionUser = User & {
  profile: {
    displayName: string;
    publicSlug: string | null;
    verificationStatus: string;
  } | null;
  roles: Array<{
    role: {
      code: RoleCode;
    };
    scopeType: string | null;
    scopeId: string | null;
  }>;
};

export type CurrentSession = {
  session: Session;
  user: SessionUser;
};

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiry(ttlDays = defaultSessionTtlDays): Date {
  return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
}

export async function createSession(userId: string, token = createSessionToken()): Promise<string> {
  const headerStore = await headers();
  const expiresAt = getSessionExpiry();

  await db.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: headerStore.get("user-agent"),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: {
        include: {
          profile: {
            select: {
              displayName: true,
              publicSlug: true,
              verificationStatus: true,
            },
          },
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    return null;
  }

  return {
    session,
    user: session.user,
  };
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await db.session.updateMany({
      where: {
        tokenHash: hashSessionToken(token),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  cookieStore.delete(sessionCookieName);
}

export function hasRole(currentSession: CurrentSession | null, allowedRoles: RoleCode[]): boolean {
  if (!currentSession) {
    return false;
  }

  const roleSet = new Set(currentSession.user.roles.map(({ role }) => role.code));

  return allowedRoles.some((role) => roleSet.has(role));
}

export async function requireRole(allowedRoles: RoleCode[]): Promise<CurrentSession> {
  const currentSession = await getCurrentSession();

  if (!currentSession || !hasRole(currentSession, allowedRoles)) {
    throw new Error("Forbidden");
  }

  return currentSession;
}
