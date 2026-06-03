import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession, hasRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateLeadStatus } from "@/app/tai-khoan/leads/lead-actions";
import type { LeadStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost", "spam"];
const leadStatusLabel: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  won: "Thành công",
  lost: "Thất bại",
  spam: "Spam",
};

export default async function AccountLeadsPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/leads");
  }

  if (!hasRole(currentSession, listingPosterRoleCodes)) {
    redirect("/khong-co-quyen");
  }

  const leads = await db.lead.findMany({
    where: {
      recipientUserId: currentSession.user.id,
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      listing: {
        select: {
          publicId: true,
          title: true,
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          actor: {
            include: {
              profile: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const stats = leadStatuses.map((status) => ({
    label: leadStatusLabel[status],
    value: leads.filter((lead) => lead.status === status).length,
  }));

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Quản lý khách liên hệ</p>
        <h1 className="mt-1 text-2xl font-extrabold">Khách liên hệ</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Khách liên hệ được tạo từ trang chi tiết tin đăng công khai và gán trực tiếp cho chủ tin.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6c7280]">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có khách liên hệ nào.
          </div>
        ) : null}
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={lead.status} />
                  <span className="font-mono text-xs text-[#6c7280]">{lead.id}</span>
                </div>
                <h2 className="mt-3 text-lg font-extrabold">{lead.name}</h2>
                <div className="mt-2 grid gap-2 text-sm text-[#384052] md:grid-cols-3">
                  <p><strong>Số điện thoại:</strong> {lead.phone ?? "-"}</p>
                  <p><strong>Email:</strong> {lead.email ?? "-"}</p>
                  <p><strong>Ngày tạo:</strong> {lead.createdAt.toISOString().slice(0, 10)}</p>
                </div>
                {lead.message ? <p className="mt-3 rounded-md bg-[#f5f6f8] p-3 text-sm leading-6 text-[#384052]">{lead.message}</p> : null}
                {lead.listing ? (
                  <p className="mt-3 text-sm text-[#5f6675]">
                    Tin:{" "}
                    <Link href={`/tin-dang/${lead.listing.publicId}`} className="font-bold text-[#c7352d]">
                      {lead.listing.title}
                    </Link>
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2">
                  {lead.events.map((event) => (
                    <p key={event.id} className="text-xs text-[#6c7280]">
                      {event.createdAt.toISOString()} - {event.eventType}
                      {event.note ? ` - ${event.note}` : ""}
                    </p>
                  ))}
                </div>
              </div>

              <form action={updateLeadStatus} className="grid content-start gap-3 rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3">
                <input type="hidden" name="id" value={lead.id} />
                <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                  Trạng thái
                  <select name="status" defaultValue={lead.status} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>{leadStatusLabel[status]}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                  Ghi chú
                  <textarea name="note" rows={3} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
                </label>
                <button type="submit" className="rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white">
                  Cập nhật khách liên hệ
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
