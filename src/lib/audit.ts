import { headers } from "next/headers";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

type AuditInput = {
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
};

export async function writeAuditLog(input: AuditInput): Promise<void> {
  const headerStore = await headers();
  const beforeJson = input.before === undefined ? undefined : toJsonInput(input.before);
  const afterJson = input.after === undefined ? undefined : toJsonInput(input.after);

  await db.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      beforeJson,
      afterJson,
      ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: headerStore.get("user-agent"),
    },
  });
}

function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
