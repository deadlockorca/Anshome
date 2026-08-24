import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  approveListing,
  deleteListingByAdmin,
  hideListingByAdmin,
  rejectListing,
  requestEditListing,
} from "@/app/tai-khoan/tin-dang/listing-actions";
import { hideListingReasons, listingModerationReasons } from "@/lib/listings/moderation";
import { StatusBadge } from "@/components/ui/status-badge";
import { ListingMediaSection } from "@/components/listings/listing-media-section";
import { listingModeratorRoleCodes } from "@/lib/auth/roles";
import { getCurrentSession, hasRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const transactionTypeLabel: Record<string, string> = {
  sale: "Bán",
  rent: "Cho thuê",
};

const reasonLabel: Record<string, string> = Object.fromEntries(
  listingModerationReasons.map((reason) => [reason.code, reason.label]),
);

const moderationActionLabel: Record<string, string> = {
  submit: "Gửi duyệt",
  approve: "Duyệt tin",
  reject: "Từ chối",
  request_edit: "Yêu cầu chỉnh sửa",
  hide: "Ẩn tin",
  delete: "Xóa tin",
};

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, currentSession] = await Promise.all([params, getCurrentSession()]);
  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      attributes: true,
      owner: {
        include: {
          profile: {
            select: {
              displayName: true,
            },
          },
        },
      },
      category: true,
      province: true,
      district: true,
      ward: true,
      street: true,
      media: {
        orderBy: [{ sortOrder: "asc" }],
        include: {
          media: true,
        },
      },
      moderationEvents: {
        orderBy: { createdAt: "desc" },
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

  if (!listing) {
    notFound();
  }

  const ownerName = listing.owner.profile?.displayName ?? listing.owner.email ?? listing.owner.phone ?? "Người dùng";
  const canModerate = listing.status === "pending_review" || listing.status === "submitted";
  const canHide = listing.status !== "hidden" && listing.status !== "deleted";
  const canDelete = listing.status !== "deleted";
  const canManageListings = currentSession ? hasRole(currentSession, listingModeratorRoleCodes) : false;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Duyệt tin đăng</p>
          <h1 className="mt-1 text-2xl font-extrabold">{listing.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#5f6675]">
            <span className="font-mono text-xs">{listing.publicId}</span>
            <StatusBadge value={listing.status} />
            <StatusBadge value={listing.moderationStatus} />
            <span>Chủ tin: {ownerName}</span>
          </div>
        </div>
        <Link href="/admin/listings" className="rounded-md border border-[#c9ced7] px-4 py-2 text-sm font-extrabold text-[#384052]">
          Về hàng chờ
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <section className="rounded-md border border-[#dde1e7] bg-white p-4">
            <h2 className="text-base font-extrabold">Nội dung tin đăng</h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <Detail label="Giao dịch" value={transactionTypeLabel[listing.transactionType] ?? listing.transactionType} />
              <Detail label="Danh mục" value={listing.category.name} />
              <Detail label="Giá" value={listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "-"} />
              <Detail label="Diện tích" value={listing.area ? `${listing.area.toString()} m2` : "-"} />
              <Detail label="Khu vực" value={[listing.street?.fullName, listing.ward?.fullName, listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || "-"} />
              <Detail label="Địa chỉ" value={listing.addressText ?? "-"} />
              <Detail label="Liên hệ" value={`${listing.contactName} - ${listing.contactPhone}`} />
              <Detail label="Pháp lý" value={listing.attributes?.legalStatus ?? "-"} />
            </dl>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase text-[#6c7280]">Mô tả</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#384052]">{listing.description}</p>
            </div>
          </section>

          <ListingMediaSection listingId={listing.id} canEdit={false} media={listing.media} />

          <section className="rounded-md border border-[#dde1e7] bg-white p-4">
            <h2 className="text-base font-extrabold">Thuộc tính bất động sản</h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <Detail label="Phòng ngủ" value={listing.attributes?.bedrooms ?? "-"} />
              <Detail label="Phòng tắm" value={listing.attributes?.bathrooms ?? "-"} />
              <Detail label="Số tầng" value={listing.attributes?.floors ?? "-"} />
              <Detail label="Mặt tiền" value={listing.attributes?.frontageWidth ? `${listing.attributes.frontageWidth.toString()} m` : "-"} />
              <Detail label="Độ rộng đường" value={listing.attributes?.roadWidth ? `${listing.attributes.roadWidth.toString()} m` : "-"} />
              <Detail label="Hướng" value={listing.attributes?.direction ?? "-"} />
            </dl>
          </section>
        </div>

        <aside className="grid content-start gap-4">
          {canManageListings && canModerate ? (
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Thao tác kiểm duyệt</h2>
              <form action={approveListing} className="mt-4 grid gap-2">
                <input type="hidden" name="id" value={listing.id} />
                <input name="note" placeholder="Ghi chú duyệt" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm text-[#1f2430]" />
                <button type="submit" className="rounded-md bg-[#16794f] px-3 py-2 text-sm font-extrabold text-white">
                  Duyệt và đăng
                </button>
              </form>
              <form action={rejectListing} className="mt-4 grid gap-2">
                <input type="hidden" name="id" value={listing.id} />
                <select name="reasonCode" defaultValue="content_quality" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-bold text-[#1f2430]">
                  {listingModerationReasons.map((reason) => (
                    <option key={reason.code} value={reason.code}>{reason.label}</option>
                  ))}
                </select>
                <textarea name="note" required rows={3} placeholder="Ghi chú từ chối" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm text-[#1f2430]" />
                <button type="submit" className="rounded-md border border-[#c7352d] px-3 py-2 text-sm font-extrabold text-[#c7352d]">
                  Từ chối
                </button>
              </form>
              <form action={requestEditListing} className="mt-4 grid gap-2 border-t border-[#edf0f3] pt-4">
                <input type="hidden" name="id" value={listing.id} />
                <textarea name="note" required rows={3} placeholder="Ghi chú yêu cầu chỉnh sửa" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm text-[#1f2430]" />
                <button type="submit" className="rounded-md border border-[#8a5a00] px-3 py-2 text-sm font-extrabold text-[#8a5a00]">
                  Yêu cầu chỉnh sửa
                </button>
              </form>
            </section>
          ) : null}

          {canManageListings && (canHide || canDelete) ? (
            <section className="rounded-md border border-[#dde1e7] bg-white p-4">
              <h2 className="text-base font-extrabold">Ẩn hoặc xóa tin</h2>
              {canHide ? (
                <form action={hideListingByAdmin} className="mt-4 grid gap-2">
                  <input type="hidden" name="id" value={listing.id} />
                  <select name="reasonCode" defaultValue="policy_violation" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-bold text-[#1f2430]">
                    {hideListingReasons.map((reason) => (
                      <option key={reason.code} value={reason.code}>{reason.label}</option>
                    ))}
                  </select>
                  <textarea name="note" rows={2} placeholder="Lý do ẩn tin" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm text-[#1f2430]" />
                  <button type="submit" className="rounded-md border border-[#8a5a00] px-3 py-2 text-sm font-extrabold text-[#8a5a00]">
                    Ẩn tin khỏi public
                  </button>
                </form>
              ) : null}
              {canDelete ? (
                <form action={deleteListingByAdmin} className="mt-4 grid gap-2 border-t border-[#edf0f3] pt-4">
                  <input type="hidden" name="id" value={listing.id} />
                  <textarea name="note" rows={2} placeholder="Lý do xóa mềm" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm text-[#1f2430]" />
                  <button type="submit" className="rounded-md border border-[#c7352d] px-3 py-2 text-sm font-extrabold text-[#c7352d]">
                    Xóa mềm tin đăng
                  </button>
                </form>
              ) : null}
            </section>
          ) : null}

          {!canManageListings ? (
            <section className="rounded-md border border-[#dde1e7] bg-white p-4 text-sm font-bold text-[#6c7280]">
              Tài khoản hiện tại chỉ có quyền xem tin trong trang quản trị.
            </section>
          ) : null}

          <section className="rounded-md border border-[#dde1e7] bg-white p-4">
            <h2 className="text-base font-extrabold">Lịch sử</h2>
            <div className="mt-3 grid gap-3">
              {listing.moderationEvents.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có sự kiện.</p> : null}
              {listing.moderationEvents.map((event) => (
                <div key={event.id} className="rounded-md border border-[#edf0f3] p-3 text-sm">
                  <p className="font-bold">
                    {moderationActionLabel[event.action] ?? event.action} {event.beforeStatus ? `${event.beforeStatus} -> ${event.afterStatus}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-[#6c7280]">
                    {event.actor.profile?.displayName ?? event.actor.email ?? event.actor.phone ?? "Người dùng"} - {event.createdAt.toISOString()}
                  </p>
                  {event.reasonCode ? <p className="mt-2 text-[#5f6675]">Lý do: {reasonLabel[event.reasonCode] ?? event.reasonCode}</p> : null}
                  {event.note ? <p className="mt-2 text-[#5f6675]">{event.note}</p> : null}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-[#6c7280]">{label}</dt>
      <dd className="mt-1 text-[#1f2430]">{value}</dd>
    </div>
  );
}
