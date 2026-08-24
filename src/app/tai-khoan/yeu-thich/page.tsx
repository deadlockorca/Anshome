import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { buildListingDetailPath } from "@/lib/listing-url";
import { FavoriteButton } from "@/components/public-listings/favorite-button";

export const dynamic = "force-dynamic";

const favoriteInclude = {
  listing: {
    include: {
      category: {
        select: { name: true },
      },
      province: {
        select: { fullName: true },
      },
      district: {
        select: { fullName: true },
      },
      media: {
        where: {
          moderationStatus: "approved",
          media: { status: "approved" },
        },
        orderBy: [{ sortOrder: "asc" }],
        take: 1,
        include: {
          media: { select: { publicUrl: true } },
        },
      },
    },
  },
} satisfies Prisma.FavoriteInclude;

type FavoriteWithListing = Prisma.FavoriteGetPayload<{ include: typeof favoriteInclude }>;

export default async function FavoriteListingsPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/yeu-thich");
  }

  const favorites = await db.favorite.findMany({
    where: { userId: currentSession.user.id },
    orderBy: [{ createdAt: "desc" }],
    include: favoriteInclude,
  });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tài khoản</p>
        <h1 className="mt-1 text-2xl font-extrabold">Tin đã lưu</h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6675]">Danh sách tin đăng bạn đã lưu để xem lại sau.</p>
      </div>

      <div className="grid gap-4">
        {favorites.length === 0 ? (
          <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
            Chưa có tin nào được lưu. Nhấn biểu tượng trái tim trên tin đăng để lưu.
          </div>
        ) : null}
        {favorites.map(({ listing, createdAt }) => (
          <FavoriteRow key={listing.id} listing={listing} savedAt={createdAt} />
        ))}
      </div>
    </section>
  );
}

function FavoriteRow({
  listing,
  savedAt,
}: {
  listing: FavoriteWithListing["listing"];
  savedAt: Date;
}) {
  const cover = listing.media[0];
  const location = listing.district?.fullName ?? listing.province?.fullName ?? listing.addressText ?? "Chưa cập nhật vị trí";
  const price = listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "Thỏa thuận";

  return (
    <article className="grid gap-4 rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.04)] md:grid-cols-[140px_minmax(0,1fr)_auto]">
      <Link href={buildListingDetailPath(listing)} className="block overflow-hidden rounded-md bg-[#f0f2f5]">
        {cover?.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.media.publicUrl} alt={listing.title} className="h-24 w-full object-cover md:h-full" loading="lazy" />
        ) : (
          <div className="grid h-24 w-full place-items-center bg-[#eceff3] text-xs font-extrabold text-[#6c7280] md:h-full">Ảnh</div>
        )}
      </Link>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{listing.category.name}</p>
        <Link href={buildListingDetailPath(listing)} className="mt-1 block line-clamp-2 text-base font-extrabold leading-snug text-[#1f2430] hover:text-[#c7352d]">
          {listing.title}
        </Link>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-extrabold text-[#df3029]">
          <span>{price}</span>
          {listing.area ? (
            <>
              <span className="text-[#a3a7af]">·</span>
              <span>{listing.area.toString()} m²</span>
            </>
          ) : null}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#555965]">{location}</p>
        <p className="mt-1 text-xs font-semibold text-[#8a8f99]">Lưu lúc {savedAt.toLocaleString("vi-VN")}</p>
      </div>
      <div className="flex items-start justify-end gap-2">
        <Link
          href={buildListingDetailPath(listing)}
          className="rounded-md border border-[#c9ced7] px-3 py-2 text-sm font-extrabold text-[#384052] hover:border-[#c7352d] hover:text-[#c7352d]"
        >
          Xem chi tiết
        </Link>
        <FavoriteButton
          listingId={listing.id}
          initialActive
          className="grid h-10 w-10 place-items-center rounded-md border border-[#c7352d] text-[#c7352d]"
        />
      </div>
    </article>
  );
}
