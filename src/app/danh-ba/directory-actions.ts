"use server";

import { db } from "@/lib/db";

export type DirectoryLeadState = { status: "idle" | "success" | "error"; message?: string } | undefined;

export async function createBrokerLead(
  brokerUserId: string,
  prevState: DirectoryLeadState,
  formData: FormData,
): Promise<DirectoryLeadState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { status: "error", message: "Vui lòng nhập họ và tên." };
  }

  if (!/^[0-9+()\s-]{9,15}$/.test(phone)) {
    return { status: "error", message: "Số điện thoại không hợp lệ." };
  }

  const recipient = await db.user.findUnique({ where: { id: brokerUserId }, select: { id: true } });
  if (!recipient) {
    return { status: "error", message: "Môi giới không tồn tại." };
  }

  await db.lead.create({
    data: {
      sourceType: "broker",
      sourceId: brokerUserId,
      recipientUserId: brokerUserId,
      name,
      phone,
      message: message || null,
    },
  });

  return { status: "success", message: "Đã gửi thông tin thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất." };
}

export async function createAgencyLead(
  agencyId: string,
  prevState: DirectoryLeadState,
  formData: FormData,
): Promise<DirectoryLeadState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { status: "error", message: "Vui lòng nhập họ và tên." };
  }

  if (!/^[0-9+()\s-]{9,15}$/.test(phone)) {
    return { status: "error", message: "Số điện thoại không hợp lệ." };
  }

  await db.lead.create({
    data: {
      sourceType: "agency",
      sourceId: agencyId,
      name,
      phone,
      message: message || null,
    },
  });

  return { status: "success", message: "Đã gửi thông tin thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất." };
}
