import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession, hasRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { ListingForm } from "@/components/listings/listing-form";
import { ListingMediaSection } from "@/components/listings/listing-media-section";
import { deleteOwnListing, submitListingForReview, updateDraftListing } from "@/app/tai-khoan/tin-dang/listing-actions";
import { applyBenefit } from "@/app/tai-khoan/goi-dang-tin/package-actions";
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
  const isPublished = listing.status === "published";

  const paidOrders = isPublished
    ? await db.order.findMany({
        where: {
          userId: currentSession.user.id,
          status: "paid",
          expiresAt: { gt: new Date() },
        },
        include: {
          package: {
            select: { featuredQuota: true, boostQuota: true, refreshQuota: true },
          },
          benefits: {
            select: { benefitType: true },
          },
        },
      })
    : [];

  const remainingQuota = { featured: 0, boost: 0, refresh: 0 };

  for (const order of paidOrders) {
    const used = {
      featured: order.benefits.filter((benefit) => benefit.benefitType === "featured").length,
      boost: order.benefits.filter((benefit) => benefit.benefitType === "boost").length,
      refresh: order.benefits.filter((benefit) => benefit.benefitType === "refresh").length,
    };
    remainingQuota.featured += Math.max(0, order.package.featuredQuota - used.featured);
    remainingQuota.boost += Math.max(0, order.package.boostQuota - used.boost);
    remainingQuota.refresh += Math.max(0, order.package.refreshQuota - used.refresh);
  }

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

      {isPublished ? <ListingBenefitSection listingId={listing.id} remainingQuota={remainingQuota} featuredActive={listing.isFeatured} /> : null}

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

function ListingBenefitSection({
  listingId,
  remainingQuota,
  featuredActive,
}: {
  listingId: string;
  remainingQuota: { featured: number; boost: number; refresh: number };
  featuredActive: boolean;
}) {
  const benefits = [
    {
      type: "featured",
      label: "Nổi bật",
      description: "Hiển thị ưu tiên với nhãn tin nổi bật trong 30 ngày.",
      remaining: remainingQuota.featured,
      active: featuredActive,
      accent: "#8a5a00",
    },
    {
      type: "boost",
      label: "Đẩy tin",
      description: "Kéo tin lên đầu danh sách tìm kiếm trong 30 ngày.",
      remaining: remainingQuota.boost,
      active: false,
      accent: "#2f5ea8",
    },
    {
      type: "refresh",
      label: "Làm mới",
      description: "Cập nhật thời gian đăng, tin xuất hiện như mới đăng.",
      remaining: remainingQuota.refresh,
      active: false,
      accent: "#16794f",
    },
  ];

  return (
    <section className="rounded-md border border-[#dde1e7] bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Quyền lợi gói đăng tin</p>
          <h2 className="mt-1 text-base font-extrabold">Nổi bật · Đẩy tin · Làm mới</h2>
        </div>
        <Link href="/tai-khoan/goi-dang-tin" className="text-sm font-extrabold text-[#c7352d]">Mua thêm gói</Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.type} className="rounded-md border border-[#edf0f3] bg-[#fafbfc] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-[#1f2430]">{benefit.label}</p>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-extrabold ${benefit.active ? "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]" : "border-[#d5dae2] bg-white text-[#6c7280]"}`}>
                {benefit.active ? "Đang kích hoạt" : `${benefit.remaining} lượt còn lại`}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#6c7280]">{benefit.description}</p>
            <form action={applyBenefit} className="mt-3">
              <input type="hidden" name="listingId" value={listingId} />
              <input type="hidden" name="benefitType" value={benefit.type} />
              <button
                type="submit"
                disabled={benefit.remaining <= 0}
                className="w-full rounded-md border px-3 py-2 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: benefit.accent, color: benefit.accent }}
              >
                {benefit.type === "featured" ? "Áp dụng nổi bật" : benefit.type === "boost" ? "Áp dụng đẩy tin" : "Làm mới tin"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
