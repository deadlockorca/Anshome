"use server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

function readString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function recordListingView(formData: FormData) {
  const listingId = readString(formData, "listingId");
  const sessionId = readString(formData, "sessionId");

  if (!listingId || !sessionId) {
    return;
  }

  const existing = await db.listingView.findFirst({
    where: {
      listingId,
      sessionId,
      source: "page_view",
    },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const currentSession = await getCurrentSession();

  await db.listingView.create({
    data: {
      listingId,
      sessionId,
      source: "page_view",
      userId: currentSession?.user.id,
    },
  });
}

export async function recordPhoneReveal(formData: FormData) {
  const listingId = readString(formData, "listingId");
  const sessionId = readString(formData, "sessionId");

  if (!listingId || !sessionId) {
    return;
  }

  const existing = await db.listingView.findFirst({
    where: {
      listingId,
      sessionId,
      source: "phone_reveal",
    },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const currentSession = await getCurrentSession();

  await db.listingView.create({
    data: {
      listingId,
      sessionId,
      source: "phone_reveal",
      userId: currentSession?.user.id,
    },
  });
}
