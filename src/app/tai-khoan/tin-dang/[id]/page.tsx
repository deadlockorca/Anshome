import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession, hasRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { ListingForm } from "@/components/listings/listing-form";
import { ListingMediaSection } from "@/components/listings/listing-media-section";
import { deleteOwnListing, submitListingForReview, updateDraftListing } from "@/app/tai-khoan/tin-dang/listing-actions";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamic = "force-dynamic";

const moderationActionLabel: Record<string, string> = {
  submit: "Gửi duyệt",
  approve: "Duyệt tin",
  reject: "Từ chối",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, currentSession] = await Promise.all([params, getCurrentSession()]);

  if (!currentSession) {
    redirect("/dang-nhap");
  }

  if (!hasRole(currentSession, listingPosterRoleCodes)) {
    redirect("/khong-co-quyen");
  }

  const [listing, categories, locations, moderationEvents] = await Promise.all([
    db.listing.findFirst({
      where: { id, ownerUserId: currentSession.user.id },
      include: {
        attributes: true,
        category: {
          select: {
            name: true,
          },
        },
        media: {
          orderBy: [{ sortOrder: "asc" }],
          include: {
            media: true,
          },
        },
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        transactionType: true,
      },
    }),
    db.location.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        type: true,
      },
    }),
    db.listingModerationEvent.findMany({
      where: { listingId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
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
    }),
  ]);

  if (!listing) {
    notFound();
  }

  const canEdit = listing.status === "draft" || listing.status === "rejected";

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Chi tiết tin đăng</p>
          <h1 className="mt-1 text-2xl font-extrabold">{listing.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#5f6675]">
            <span className="font-mono text-xs">{listing.publicId}</span>
            <StatusBadge value={listing.status} />
            <StatusBadge value={listing.moderationStatus} />
          </div>
        </div>
        <Link href="/tai-khoan/tin-dang" className="rounded-md border border-[#c9ced7] px-4 py-2 text-sm font-extrabold text-[#384052]">
          Quay lại danh sách
        </Link>
      </div>

      {canEdit ? (
        <div className="grid gap-4">
          <ListingForm action={updateDraftListing} categories={categories} locations={locations} listing={listing} submitLabel="Lưu bản nháp" />
          <ListingMediaSection listingId={listing.id} canEdit={canEdit} media={listing.media} />
          <form action={submitListingForReview} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <input type="hidden" name="id" value={listing.id} />
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Ghi chú gửi duyệt
              <textarea name="note" rows={3} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
            </label>
            <button type="submit" className="mt-3 rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white">
              Gửi sang kiểm duyệt
            </button>
          </form>
          <form action={deleteOwnListing} className="rounded-md border border-[#f1b8b4] bg-white p-4">
            <input type="hidden" name="id" value={listing.id} />
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Ghi chú xóa tin
              <textarea name="note" rows={2} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
            </label>
            <button type="submit" className="mt-3 rounded-md border border-[#c7352d] px-4 py-2 text-sm font-extrabold text-[#c7352d]">
              Xóa tin nháp
            </button>
          </form>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-md border border-[#dde1e7] bg-white p-4 text-sm leading-6 text-[#5f6675]">
            Tin đăng đang ở trạng thái không cho sửa trong luồng nền tảng này. Quản trị viên sẽ xử lý bước tiếp theo.
          </div>
          <ListingMediaSection listingId={listing.id} canEdit={canEdit} media={listing.media} />
        </div>
      )}

      <div className="mt-6 rounded-md border border-[#dde1e7] bg-white p-4">
        <h2 className="text-base font-extrabold">Lịch sử kiểm duyệt</h2>
        <div className="mt-3 grid gap-3">
          {moderationEvents.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có sự kiện kiểm duyệt.</p> : null}
          {moderationEvents.map((event) => (
            <div key={event.id} className="rounded-md border border-[#edf0f3] p-3 text-sm">
              <p className="font-bold">
                {moderationActionLabel[event.action] ?? event.action} {event.beforeStatus ? `${event.beforeStatus} -> ${event.afterStatus}` : ""}
              </p>
              <p className="mt-1 text-xs text-[#6c7280]">
                {event.actor.profile?.displayName ?? event.actor.email ?? event.actor.phone ?? "Người dùng"} - {event.createdAt.toISOString()}
              </p>
              {event.reasonCode ? <p className="mt-2 text-[#5f6675]">Lý do: {event.reasonCode}</p> : null}
              {event.note ? <p className="mt-2 text-[#5f6675]">{event.note}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
