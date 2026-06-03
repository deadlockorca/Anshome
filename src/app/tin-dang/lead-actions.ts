"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formString } from "@/lib/forms";
import { getCurrentSession } from "@/lib/auth/session";

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Cần nhập ${field}.`);
  }

  return value;
}

function normalizeEmail(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

export async function createListingLead(formData: FormData) {
  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const name = required(formString(formData, "name"), "họ tên");
  const phone = formString(formData, "phone");
  const email = normalizeEmail(formString(formData, "email"));
  const message = formString(formData, "message");

  if (!phone && !email) {
    throw new Error("Cần nhập số điện thoại hoặc email.");
  }

  const listing = await db.listing.findFirstOrThrow({
    where: {
      id: listingId,
      status: "published",
    },
    select: {
      id: true,
      publicId: true,
      title: true,
      ownerUserId: true,
    },
  });

  const currentSession = await getCurrentSession();

  const lead = await db.$transaction(async (tx) => {
    const createdLead = await tx.lead.create({
      data: {
        sourceType: "listing",
        sourceId: listing.id,
        listingId: listing.id,
        recipientUserId: listing.ownerUserId,
        senderUserId: currentSession?.user.id,
        name,
        phone,
        email,
        message,
        status: "new",
      },
    });

    await tx.leadEvent.create({
      data: {
        leadId: createdLead.id,
        actorUserId: currentSession?.user.id,
        eventType: "lead.created",
        note: message,
      },
    });

    await tx.notification.create({
      data: {
        userId: listing.ownerUserId,
        channel: "in_app",
        templateCode: "lead.new",
        payloadJson: {
          leadId: createdLead.id,
          listingId: listing.id,
          publicId: listing.publicId,
          listingTitle: listing.title,
          senderName: name,
        },
      },
    });

    return createdLead;
  });

  revalidatePath(`/tin-dang/${listing.publicId}`);
  revalidatePath("/tai-khoan/leads");
  redirect(`/tin-dang/${listing.publicId}?lead=sent&leadId=${lead.id}`);
}
