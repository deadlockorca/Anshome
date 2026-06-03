"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { listingModeratorRoleCodes, listingPosterRoleCodes } from "@/lib/auth/roles";
import { formDecimalString, formInt, formString } from "@/lib/forms";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/lib/audit";
import type { LocationType, MediaStatus, MediaType, TransactionType } from "@/generated/prisma/client";

const transactionTypes = new Set<TransactionType>(["sale", "rent"]);
const editableStatuses = new Set(["draft", "rejected"]);
const reviewableStatuses = new Set(["pending_review", "submitted"]);
const mediaTypes = new Set<MediaType>(["image", "video", "floor_plan", "document"]);

function required(value: string | null, field: string): string {
  if (!value) {
    throw new Error(`Cần nhập ${field}.`);
  }

  return value;
}

function optionalInt(formData: FormData, key: string): number | null {
  const value = formString(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function pricePerSqm(price: string | null, area: string | null): string | null {
  if (!price || !area) {
    return null;
  }

  const parsedPrice = Number(price);
  const parsedArea = Number(area);

  if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedArea) || parsedArea <= 0) {
    return null;
  }

  return (parsedPrice / parsedArea).toFixed(2);
}

function requiredPublicUrl(value: string | null): string {
  const rawUrl = required(value, "URL tệp đính kèm");
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("URL tệp đính kèm không hợp lệ.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("URL tệp đính kèm phải dùng http hoặc https.");
  }

  return url.toString();
}

function guessMimeType(publicUrl: string, fallback: string | null): string {
  if (fallback) {
    return fallback;
  }

  const pathname = new URL(publicUrl).pathname.toLowerCase();

  if (pathname.endsWith(".png")) {
    return "image/png";
  }
  if (pathname.endsWith(".webp")) {
    return "image/webp";
  }
  if (pathname.endsWith(".gif")) {
    return "image/gif";
  }
  if (pathname.endsWith(".mp4")) {
    return "video/mp4";
  }
  if (pathname.endsWith(".pdf")) {
    return "application/pdf";
  }

  return "image/jpeg";
}

function readMediaType(formData: FormData): MediaType {
  const type = (formString(formData, "type") ?? "image") as MediaType;

  if (!mediaTypes.has(type)) {
    throw new Error("Loại tệp đính kèm không hợp lệ.");
  }

  return type;
}

async function requireEditableOwnerListing(listingId: string, ownerUserId: string) {
  const listing = await db.listing.findFirstOrThrow({
    where: { id: listingId, ownerUserId },
    select: {
      id: true,
      publicId: true,
      status: true,
    },
  });

  if (!editableStatuses.has(listing.status)) {
    throw new Error("Chỉ tin nháp hoặc tin bị từ chối mới được sửa tệp đính kèm.");
  }

  return listing;
}

async function createPublicId(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const publicId = `AN${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString("hex").toUpperCase()}`;
    const existing = await db.listing.findUnique({
      where: { publicId },
      select: { id: true },
    });

    if (!existing) {
      return publicId;
    }
  }

  throw new Error("Không thể tạo mã tin đăng.");
}

async function assertCategory(categoryId: string, transactionType: TransactionType) {
  const category = await db.category.findFirst({
    where: { id: categoryId, isActive: true },
    select: { id: true, transactionType: true },
  });

  if (!category) {
    throw new Error("Danh mục không hợp lệ.");
  }

  if (category.transactionType !== "both" && category.transactionType !== transactionType) {
    throw new Error("Danh mục không khớp với loại giao dịch.");
  }

  return category;
}

async function assertLocation(id: string | null, type: LocationType): Promise<string | null> {
  if (!id) {
    return null;
  }

  const location = await db.location.findFirst({
    where: { id, type, isActive: true },
    select: { id: true },
  });

  if (!location) {
    throw new Error("Khu vực không hợp lệ.");
  }

  return location.id;
}

async function readListingPayload(formData: FormData) {
  const transactionType = required(formString(formData, "transactionType"), "loại giao dịch") as TransactionType;

  if (!transactionTypes.has(transactionType)) {
    throw new Error("Loại giao dịch không hợp lệ.");
  }

  const categoryId = required(formString(formData, "categoryId"), "danh mục");
  await assertCategory(categoryId, transactionType);

  const title = required(formString(formData, "title"), "tiêu đề");
  const description = required(formString(formData, "description"), "mô tả");
  const price = formDecimalString(formData, "price");
  const area = formDecimalString(formData, "area");
  const provinceId = await assertLocation(formString(formData, "provinceId"), "province");
  const districtId = await assertLocation(formString(formData, "districtId"), "district");
  const wardId = await assertLocation(formString(formData, "wardId"), "ward");
  const streetId = await assertLocation(formString(formData, "streetId"), "street");

  return {
    listing: {
      transactionType,
      categoryId,
      title,
      slug: slugify(title),
      description,
      price,
      priceUnit: formString(formData, "priceUnit") ?? "VND",
      area,
      pricePerSqm: pricePerSqm(price, area),
      provinceId,
      districtId,
      wardId,
      streetId,
      addressText: formString(formData, "addressText"),
      contactName: required(formString(formData, "contactName"), "tên liên hệ"),
      contactPhone: required(formString(formData, "contactPhone"), "số điện thoại liên hệ"),
    },
    attributes: {
      bedrooms: optionalInt(formData, "bedrooms"),
      bathrooms: optionalInt(formData, "bathrooms"),
      floors: optionalInt(formData, "floors"),
      frontageWidth: formDecimalString(formData, "frontageWidth"),
      roadWidth: formDecimalString(formData, "roadWidth"),
      direction: formString(formData, "direction"),
      legalStatus: formString(formData, "legalStatus"),
      interiorStatus: formString(formData, "interiorStatus"),
      usableArea: formDecimalString(formData, "usableArea"),
      landArea: formDecimalString(formData, "landArea"),
    },
  };
}

export async function createDraftListing(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const payload = await readListingPayload(formData);

  const listing = await db.listing.create({
    data: {
      ...payload.listing,
      publicId: await createPublicId(),
      ownerUserId: currentSession.user.id,
      status: "draft",
      moderationStatus: "none",
      attributes: {
        create: payload.attributes,
      },
    },
    include: {
      attributes: true,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: listing.id,
    action: "listing.create_draft",
    after: listing,
  });

  revalidatePath("/tai-khoan/tin-dang");
  redirect(`/tai-khoan/tin-dang/${listing.id}`);
}

export async function updateDraftListing(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const id = required(formString(formData, "id"), "mã tin đăng");
  const before = await db.listing.findFirstOrThrow({
    where: { id, ownerUserId: currentSession.user.id },
    include: { attributes: true },
  });

  if (!editableStatuses.has(before.status)) {
    throw new Error("Chỉ tin nháp hoặc tin bị từ chối mới được chỉnh sửa trong luồng hiện tại.");
  }

  const payload = await readListingPayload(formData);
  const after = await db.listing.update({
    where: { id },
    data: {
      ...payload.listing,
      status: "draft",
      moderationStatus: "none",
      publishedAt: null,
      expiredAt: null,
      attributes: {
        upsert: {
          create: payload.attributes,
          update: payload.attributes,
        },
      },
    },
    include: {
      attributes: true,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: after.id,
    action: "listing.update_draft",
    before,
    after,
  });

  revalidatePath("/tai-khoan/tin-dang");
  revalidatePath(`/tai-khoan/tin-dang/${after.id}`);
  redirect(`/tai-khoan/tin-dang/${after.id}`);
}

export async function submitListingForReview(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const id = required(formString(formData, "id"), "mã tin đăng");
  const before = await db.listing.findFirstOrThrow({
    where: { id, ownerUserId: currentSession.user.id },
  });

  if (!editableStatuses.has(before.status)) {
    throw new Error("Chỉ tin nháp hoặc tin bị từ chối mới được gửi duyệt.");
  }

  const after = await db.listing.update({
    where: { id },
    data: {
      status: "pending_review",
      moderationStatus: "pending",
    },
  });

  await db.listingModerationEvent.create({
    data: {
      listingId: after.id,
      actorUserId: currentSession.user.id,
      action: "submit",
      beforeStatus: before.status,
      afterStatus: after.status,
      note: formString(formData, "note"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: after.id,
    action: "listing.submit_review",
    before,
    after,
  });

  revalidatePath("/tai-khoan/tin-dang");
  revalidatePath(`/tai-khoan/tin-dang/${after.id}`);
  revalidatePath("/admin/listings");
  redirect("/tai-khoan/tin-dang");
}

export async function addListingMedia(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const listing = await requireEditableOwnerListing(listingId, currentSession.user.id);
  const publicUrl = requiredPublicUrl(formString(formData, "publicUrl"));
  const type = readMediaType(formData);
  const mimeType = guessMimeType(publicUrl, formString(formData, "mimeType"));
  const sortOrder = formInt(formData, "sortOrder");

  const listingMedia = await db.listingMedia.create({
    data: {
      listing: {
        connect: { id: listing.id },
      },
      type,
      sortOrder,
      caption: formString(formData, "caption"),
      moderationStatus: "pending",
      media: {
        create: {
          ownerUserId: currentSession.user.id,
          storageKey: `remote/${listing.id}/${randomBytes(8).toString("hex")}`,
          publicUrl,
          mimeType,
          sizeBytes: 0,
          status: "pending" as MediaStatus,
        },
      },
    },
    include: {
      media: true,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing_media",
    entityId: listingMedia.id,
    action: "listing_media.add",
    after: listingMedia,
  });

  revalidatePath(`/tai-khoan/tin-dang/${listing.id}`);
  revalidatePath(`/admin/listings/${listing.id}`);
  revalidatePath(`/tin-dang/${listing.publicId}`);
  redirect(`/tai-khoan/tin-dang/${listing.id}`);
}

export async function updateListingMedia(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const listingMediaId = required(formString(formData, "listingMediaId"), "mã tệp đính kèm");
  const listing = await requireEditableOwnerListing(listingId, currentSession.user.id);
  const before = await db.listingMedia.findFirstOrThrow({
    where: {
      id: listingMediaId,
      listingId: listing.id,
    },
    include: {
      media: true,
    },
  });

  const publicUrl = requiredPublicUrl(formString(formData, "publicUrl"));
  const type = readMediaType(formData);
  const mimeType = guessMimeType(publicUrl, formString(formData, "mimeType"));

  const after = await db.listingMedia.update({
    where: { id: listingMediaId },
    data: {
      type,
      sortOrder: formInt(formData, "sortOrder"),
      caption: formString(formData, "caption"),
      moderationStatus: "pending",
      media: {
        update: {
          publicUrl,
          mimeType,
          status: "pending",
        },
      },
    },
    include: {
      media: true,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing_media",
    entityId: after.id,
    action: "listing_media.update",
    before,
    after,
  });

  revalidatePath(`/tai-khoan/tin-dang/${listing.id}`);
  revalidatePath(`/admin/listings/${listing.id}`);
  revalidatePath(`/tin-dang/${listing.publicId}`);
  redirect(`/tai-khoan/tin-dang/${listing.id}`);
}

export async function removeListingMedia(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const listingMediaId = required(formString(formData, "listingMediaId"), "mã tệp đính kèm");
  const listing = await requireEditableOwnerListing(listingId, currentSession.user.id);
  const before = await db.listingMedia.findFirstOrThrow({
    where: {
      id: listingMediaId,
      listingId: listing.id,
    },
    include: {
      media: true,
    },
  });

  await db.$transaction(async (tx) => {
    await tx.listingMedia.delete({
      where: { id: listingMediaId },
    });

    const remainingLinks = await tx.listingMedia.count({
      where: { mediaId: before.mediaId },
    });

    if (remainingLinks === 0) {
      await tx.media.delete({
        where: { id: before.mediaId },
      });
    }
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing_media",
    entityId: before.id,
    action: "listing_media.remove",
    before,
  });

  revalidatePath(`/tai-khoan/tin-dang/${listing.id}`);
  revalidatePath(`/admin/listings/${listing.id}`);
  revalidatePath(`/tin-dang/${listing.publicId}`);
  redirect(`/tai-khoan/tin-dang/${listing.id}`);
}

export async function approveListing(formData: FormData) {
  const currentSession = await requireRole(listingModeratorRoleCodes);
  const id = required(formString(formData, "id"), "mã tin đăng");
  const before = await db.listing.findUniqueOrThrow({ where: { id } });

  if (!reviewableStatuses.has(before.status)) {
    throw new Error("Chỉ tin đang chờ duyệt mới được phê duyệt.");
  }

  const publishedAt = new Date();
  const expiredAt = new Date(publishedAt.getTime() + 60 * 24 * 60 * 60 * 1000);
  const after = await db.$transaction(async (tx) => {
    const updatedListing = await tx.listing.update({
      where: { id },
      data: {
        status: "published",
        moderationStatus: "approved",
        publishedAt,
        expiredAt,
      },
    });

    const linkedMedia = await tx.listingMedia.findMany({
      where: { listingId: id },
      select: { mediaId: true },
    });

    await tx.listingMedia.updateMany({
      where: { listingId: id },
      data: { moderationStatus: "approved" },
    });

    if (linkedMedia.length > 0) {
      await tx.media.updateMany({
        where: {
          id: {
            in: linkedMedia.map((item) => item.mediaId),
          },
        },
        data: { status: "approved" },
      });
    }

    return updatedListing;
  });

  await db.listingModerationEvent.create({
    data: {
      listingId: after.id,
      actorUserId: currentSession.user.id,
      action: "approve",
      beforeStatus: before.status,
      afterStatus: after.status,
      note: formString(formData, "note"),
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: after.id,
    action: "listing.approve",
    before,
    after,
  });

  revalidatePath("/admin/listings");
  revalidatePath("/tai-khoan/tin-dang");
  revalidatePath("/tin-dang");
  revalidatePath(`/tin-dang/${after.publicId}`);
  redirect("/admin/listings");
}

export async function rejectListing(formData: FormData) {
  const currentSession = await requireRole(listingModeratorRoleCodes);
  const id = required(formString(formData, "id"), "mã tin đăng");
  const reasonCode = formString(formData, "reasonCode") ?? "content_quality";
  const note = required(formString(formData, "note"), "ghi chú từ chối");
  const before = await db.listing.findUniqueOrThrow({ where: { id } });

  if (!reviewableStatuses.has(before.status)) {
    throw new Error("Chỉ tin đang chờ duyệt mới được từ chối.");
  }

  const after = await db.listing.update({
    where: { id },
    data: {
      status: "rejected",
      moderationStatus: "rejected",
      publishedAt: null,
      expiredAt: null,
    },
  });

  await db.listingModerationEvent.create({
    data: {
      listingId: after.id,
      actorUserId: currentSession.user.id,
      action: "reject",
      reasonCode,
      note,
      beforeStatus: before.status,
      afterStatus: after.status,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: after.id,
    action: "listing.reject",
    before,
    after,
  });

  revalidatePath("/admin/listings");
  revalidatePath("/tai-khoan/tin-dang");
  revalidatePath("/tin-dang");
  revalidatePath(`/tin-dang/${after.publicId}`);
  redirect("/admin/listings");
}
