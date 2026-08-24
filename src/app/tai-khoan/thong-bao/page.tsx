import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const templateLabel: Record<string, string> = {
  "lead.new": "Khách liên hệ mới",
  "listing.approved": "Tin đăng đã được duyệt",
  "listing.rejected": "Tin đăng bị từ chối",
  "listing.archived": "Tin đăng đã hết hạn",
};

const channelLabel: Record<string, string> = {
  in_app: "Trong ứng dụng",
  email: "Email",
  sms: "SMS",
  zalo: "Zalo",
  push: "Push",
};

const statusLabel: Record<string, string> = {
  pending: "Đang chờ gửi",
  sent: "Đã gửi",
  failed: "Gửi thất bại",
  cancelled: "Đã hủy",
};

export default async function NotificationListPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    notFound();
  }

  const notifications = await db.notification.findMany({
    where: { userId: currentSession.user.id },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  const newCount = notifications.filter((item) => item.status === "pending").length;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tài khoản</p>
        <h1 className="mt-1 text-2xl font-extrabold">Thông báo</h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6675]">
          {newCount > 0 ? `Bạn có ${newCount} thông báo mới.` : "Không có thông báo mới."}
        </p>
      </div>

      <div className="grid gap-3">
        {notifications.length === 0 ? (
          <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có thông báo nào.
          </div>
        ) : null}
        {notifications.map((notification) => {
          const payload = notification.payloadJson as Record<string, unknown> | null;
          const listingTitle = typeof payload?.listingTitle === "string" ? payload.listingTitle : null;
          const senderName = typeof payload?.senderName === "string" ? payload.senderName : null;
          const publicId = typeof payload?.publicId === "string" ? payload.publicId : null;

          return (
            <article key={notification.id} className="rounded-md border border-[#dde1e7] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-extrabold text-[#1f2430]">
                  {templateLabel[notification.templateCode] ?? notification.templateCode}
                </h2>
                <span className="text-xs font-bold text-[#6c7280]">{statusLabel[notification.status] ?? notification.status}</span>
              </div>
              {notification.templateCode === "lead.new" ? (
                <div className="mt-3 grid gap-1 text-sm leading-6 text-[#384052]">
                  {senderName ? <p>Người gửi: <strong>{senderName}</strong></p> : null}
                  {listingTitle ? <p>Tin: {listingTitle}</p> : null}
                  <p>
                    <Link href="/tai-khoan/leads" className="font-extrabold text-[#c7352d]">
                      Xem khách liên hệ
                    </Link>
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[#384052]">
                  {publicId ? `Mã tin: ${publicId}. ` : ""}Thông báo từ Anshome.
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#edf0f3] pt-3 text-xs font-semibold text-[#8a8f99]">
                <span>Kênh: {channelLabel[notification.channel] ?? notification.channel}</span>
                <span>·</span>
                <span>{notification.createdAt.toLocaleString("vi-VN")}</span>
                {notification.sentAt ? (
                  <>
                    <span>·</span>
                    <span>Gửi lúc {notification.sentAt.toLocaleString("vi-VN")}</span>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
