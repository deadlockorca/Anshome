import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/status-badge";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { buildListingDetailPath } from "@/lib/listing-url";
import type { LeadStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const leadStatusLabel: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  won: "Thành công",
  lost: "Thất bại",
  spam: "Spam",
};

const leadStatuses: Array<LeadStatus | ""> = ["", "new", "contacted", "qualified", "won", "lost", "spam"];

type SearchParams = {
  status?: string;
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status && leadStatusLabel[params.status as LeadStatus] ? (params.status as LeadStatus) : null;

  const where = status ? { status } : {};
  const [leads, total, byStatus] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 200,
      include: {
        listing: {
          select: {
            publicId: true,
            slug: true,
            title: true,
          },
        },
        project: {
          select: {
            slug: true,
            name: true,
          },
        },
        sender: {
          include: {
            profile: {
              select: { displayName: true },
            },
          },
        },
        recipient: {
          include: {
            profile: {
              select: { displayName: true },
            },
          },
        },
      },
    }),
    db.lead.count({ where }),
    db.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus = new Map(byStatus.map((item) => [item.status, item._count._all]));

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Vận hành</p>
        <h1 className="mt-1 text-2xl font-extrabold">Khách liên hệ</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Toàn bộ khách liên hệ gửi từ tin đăng và dự án. Lọc theo trạng thái pipeline để theo dõi chất lượng nguồn liên hệ.
        </p>
      </div>

      <form className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-[#dde1e7] bg-white p-3">
        <label className="flex items-center gap-2 text-sm font-bold text-[#384052]">
          Trạng thái
          <AutoSubmitSelect
            name="status"
            defaultValue={status ?? ""}
            options={leadStatuses.map((item) => ({
              value: item,
              label: item ? `${leadStatusLabel[item]} (${countByStatus.get(item) ?? 0})` : "Tất cả trạng thái",
            }))}
            className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]"
          />
        </label>
        <span className="text-sm font-bold text-[#5f6675]">Tổng: {total}</span>
      </form>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Liên hệ</th>
              <th className="px-4 py-3">Tin đăng</th>
              <th className="px-4 py-3">Nội dung tư vấn</th>
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Nguồn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={8}>
                  Không có khách liên hệ nào.
                </td>
              </tr>
            ) : null}
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top hover:bg-[#fafbfc]">
                <td className="px-4 py-3 font-bold text-[#1f2430]">{lead.name}</td>
                <td className="px-4 py-3 text-[#5f6675]">
                  {lead.phone ?? "-"}
                  {lead.email ? <p className="mt-1 text-xs">{lead.email}</p> : null}
                </td>
                <td className="px-4 py-3">
                  {lead.listing ? (
                    <Link href={buildListingDetailPath(lead.listing)} className="font-bold text-[#c7352d] hover:underline">
                      {lead.listing.title}
                    </Link>
                  ) : lead.project ? (
                    <Link href={`/du-an/${lead.project.slug}`} className="font-bold text-[#c7352d] hover:underline">
                      {lead.project.name}
                    </Link>
                  ) : (
                    <span className="text-[#8a8f99]">-</span>
                  )}
                </td>
                <td className="max-w-[260px] px-4 py-3 text-[#5f6675]">
                  {lead.message ? <p className="line-clamp-2 leading-5">{lead.message}</p> : <span className="text-[#8a8f99]">-</span>}
                </td>
                <td className="px-4 py-3">{lead.sourceType === "project" ? "Dự án" : "Tin đăng"}</td>
                <td className="px-4 py-3"><StatusBadge value={lead.status} /></td>
                <td className="px-4 py-3 text-[#5f6675]">{lead.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
