"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { formString } from "@/lib/forms";
import { writeAuditLog } from "@/lib/audit";
import type { LeadStatus } from "@/generated/prisma/client";

const leadStatuses = new Set<LeadStatus>(["new", "contacted", "qualified", "won", "lost", "spam"]);

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`${field} is required.`);
  }

  return value;
}

export async function updateLeadStatus(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const id = required(formString(formData, "id"), "Lead ID");
  const status = required(formString(formData, "status"), "Lead status") as LeadStatus;
  const note = formString(formData, "note");

  if (!leadStatuses.has(status)) {
    throw new Error("Invalid lead status.");
  }

  const before = await db.lead.findFirstOrThrow({
    where: {
      id,
      recipientUserId: currentSession.user.id,
    },
  });

  const after = await db.$transaction(async (tx) => {
    const updatedLead = await tx.lead.update({
      where: { id },
      data: { status },
    });

    await tx.leadEvent.create({
      data: {
        leadId: id,
        actorUserId: currentSession.user.id,
        eventType: "lead.status_updated",
        note: note ? `${before.status} -> ${status}: ${note}` : `${before.status} -> ${status}`,
      },
    });

    return updatedLead;
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "lead",
    entityId: after.id,
    action: "lead.update_status",
    before,
    after,
  });

  revalidatePath("/tai-khoan/leads");
  redirect("/tai-khoan/leads");
}
