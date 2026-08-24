"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession, requireRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { formString } from "@/lib/forms";
import { writeAuditLog } from "@/lib/audit";

function required(value: string | null, field: string): string {
  if (!value) throw new Error(`Cần nhập ${field}.`);
  return value;
}

export async function createOrder(formData: FormData) {
  const currentSession = await getCurrentSession();
  if (!currentSession) redirect("/dang-nhap?next=/tai-khoan/goi-dang-tin");

  const packageId = required(formString(formData, "packageId"), "package");
  const pkg = await db.listingPackage.findUniqueOrThrow({
    where: { id: packageId, isActive: true },
  });

  const order = await db.order.create({
    data: {
      userId: currentSession.user.id,
      packageId: pkg.id,
      amount: pkg.price,
      currency: pkg.currency,
      status: "pending",
      paymentMethod: "bank_transfer",
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "order",
    entityId: order.id,
    action: "order.create",
    after: { id: order.id, packageId: pkg.id, amount: pkg.price.toString() },
  });

  revalidatePath("/tai-khoan/goi-dang-tin");
  redirect(`/tai-khoan/goi-dang-tin?order=${order.id}`);
}

export async function payOrderMock(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const orderId = required(formString(formData, "orderId"), "orderId");
  const order = await db.order.findFirstOrThrow({
    where: { id: orderId, userId: currentSession.user.id, status: "pending" },
    include: {
      package: {
        select: { durationDays: true, featuredQuota: true, boostQuota: true, refreshQuota: true, name: true },
      },
    },
  });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + order.package.durationDays * 24 * 60 * 60 * 1000);

  await db.order.update({
    where: { id: order.id },
    data: {
      status: "paid",
      paymentMethod: "mock",
      paidAt: now,
      expiresAt,
    },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "order",
    entityId: order.id,
    action: "order.pay_mock",
    before: { status: "pending" },
    after: { status: "paid", expiresAt: expiresAt.toISOString() },
  });

  revalidatePath("/tai-khoan/goi-dang-tin");
  revalidatePath("/tai-khoan/tin-dang");
  redirect("/tai-khoan/goi-dang-tin");
}

export async function applyBenefit(formData: FormData) {
  const currentSession = await requireRole(listingPosterRoleCodes);
  const listingId = required(formString(formData, "listingId"), "mã tin đăng");
  const benefitType = required(formString(formData, "benefitType"), "benefitType");

  if (!["featured", "boost", "refresh"].includes(benefitType)) {
    throw new Error("Loại quyền lợi không hợp lệ.");
  }

  const listing = await db.listing.findFirstOrThrow({
    where: { id: listingId, ownerUserId: currentSession.user.id, status: "published" },
  });

  await db.$transaction(async (tx) => {
    const [orderRow] = await tx.$queryRawUnsafe<Array<{ id: string; featuredQuota: number; boostQuota: number; refreshQuota: number }>>(
      `SELECT o.id, p.featured_quota AS featuredQuota, p.boost_quota AS boostQuota, p.refresh_quota AS refreshQuota
       FROM orders o
       JOIN listing_packages p ON p.id = o.package_id
       WHERE o.user_id = ? AND o.status = 'paid' AND o.expires_at > NOW()
       ORDER BY o.expires_at ASC
       LIMIT 1
       FOR UPDATE`,
      currentSession.user.id,
    );

    if (!orderRow) {
      throw new Error(`Bạn chưa có gói nào còn hạn.`);
    }

    const benefitKey = benefitType === "featured" ? "featuredQuota" : benefitType === "boost" ? "boostQuota" : "refreshQuota";
    const quota = orderRow[benefitKey as keyof typeof orderRow] as number;

    const used = await tx.orderBenefit.count({
      where: { orderId: orderRow.id, benefitType },
    });

    if (quota <= used) {
      throw new Error(`Bạn đã hết lượt ${benefitType === "featured" ? "nổi bật" : benefitType === "boost" ? "đẩy tin" : "làm mới"}. Vui lòng mua thêm gói.`);
    }

    await tx.orderBenefit.create({
      data: {
        orderId: orderRow.id,
        listingId: listing.id,
        benefitType,
      },
    });

    const now = new Date();

    if (benefitType === "featured") {
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          isFeatured: true,
          featuredExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } else if (benefitType === "boost") {
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          isFeatured: true,
          boostExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } else if (benefitType === "refresh") {
      await tx.listing.update({
        where: { id: listing.id },
        data: { refreshCount: { increment: 1 }, publishedAt: now },
      });
    }
  });

  const actionLabel = benefitType === "featured" ? "listing.apply_featured" : benefitType === "boost" ? "listing.apply_boost" : "listing.refresh";

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "listing",
    entityId: listing.id,
    action: actionLabel,
  });

  revalidatePath("/tai-khoan/tin-dang");
  revalidatePath(`/tai-khoan/tin-dang/${listing.id}`);
  revalidatePath("/tai-khoan/goi-dang-tin");
  revalidatePath("/nha-dat-ban");
  revalidatePath("/nha-dat-cho-thue");
  redirect(`/tai-khoan/tin-dang/${listing.id}`);
}

export async function confirmOrderPayment(formData: FormData) {
  const currentSession = await requireRole(["moderator", "ops", "super_admin"]);
  const orderId = required(formString(formData, "orderId"), "orderId");
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { package: { select: { durationDays: true } } },
  });

  if (order.status !== "pending") {
    throw new Error("Đơn hàng không ở trạng thái chờ thanh toán.");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + order.package.durationDays * 24 * 60 * 60 * 1000);

  await db.order.update({
    where: { id: orderId },
    data: { status: "paid", paidAt: now, expiresAt },
  });

  await writeAuditLog({
    actorUserId: currentSession.user.id,
    entityType: "order",
    entityId: order.id,
    action: "order.confirm_payment",
    before: { status: "pending" },
    after: { status: "paid" },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/tai-khoan/goi-dang-tin");
  redirect("/admin/orders");
}