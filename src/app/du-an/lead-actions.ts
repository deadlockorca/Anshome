"use server";

import { db } from "@/lib/db";

export type ProjectLeadState = { status: "idle" | "success" | "error"; message?: string } | undefined;

export async function createProjectLead(
  projectId: string,
  prevState: ProjectLeadState,
  formData: FormData,
): Promise<ProjectLeadState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { status: "error", message: "Vui lòng nhập họ và tên." };
  }

  if (!/^[0-9+()\s-]{9,15}$/.test(phone)) {
    return { status: "error", message: "Số điện thoại không hợp lệ." };
  }

  const project = await db.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!project) {
    return { status: "error", message: "Dự án không tồn tại." };
  }

  await db.lead.create({
    data: {
      sourceType: "project",
      sourceId: project.id,
      projectId: project.id,
      name,
      phone,
      message: message || null,
    },
  });

  return { status: "success", message: "Đã gửi thông tin thành công. Bộ phận tư vấn sẽ liên hệ với bạn sớm nhất." };
}
