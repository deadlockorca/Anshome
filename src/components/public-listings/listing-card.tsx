import Link from "next/link";
import type { Category, Listing, ListingMedia, Location, Media } from "@/generated/prisma/client";

type ListingCardProps = {
  listing: Listing & {
    category: Pick<Category, "name" | "slug">;
    province: Pick<Location, "fullName"> | null;
    district: Pick<Location, "fullName"> | null;
    media: Array<ListingMedia & { media: Pick<Media, "publicUrl"> }>;
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  const cover = listing.media.find((item) => item.type === "image") ?? listing.media[0];
  const transactionLabel = listing.transactionType === "sale" ? "Bán" : "Cho thuê";

  return (
    <article className="overflow-hidden rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)] transition hover:border-[#c7352d]">
      <Link href={`/tin-dang/${listing.publicId}`} className="block">
        {cover?.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.media.publicUrl} alt={cover.caption ?? listing.title} className="aspect-[16/9] w-full bg-[#f0f2f5] object-cover" />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-[#eceff3] text-sm font-extrabold text-[#6c7280]">
            Chưa có ảnh
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{listing.category.name}</p>
            <h2 className="mt-1 line-clamp-2 text-lg font-extrabold leading-snug text-[#1f2430]">
              <Link href={`/tin-dang/${listing.publicId}`} className="hover:text-[#c7352d]">
                {listing.title}
              </Link>
            </h2>
          </div>
          <p className="rounded-md bg-[#fff4f2] px-3 py-2 text-sm font-extrabold text-[#c7352d]">{transactionLabel}</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Metric label="Giá" value={listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "Liên hệ"} />
          <Metric label="Diện tích" value={listing.area ? `${listing.area.toString()} m2` : "-"} />
          <Metric label="Đơn giá" value={listing.pricePerSqm ? `${listing.pricePerSqm.toString()}/m2` : "-"} />
        </div>
        <p className="mt-4 text-sm leading-6 text-[#5f6675]">{[listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || listing.addressText || "Chưa cập nhật vị trí"}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf0f3] pt-3 text-xs text-[#6c7280]">
          <span className="font-mono">{listing.publicId}</span>
          <span>{listing.publishedAt?.toISOString().slice(0, 10) ?? "Đã đăng"}</span>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-[#6c7280]">{label}</p>
      <p className="mt-1 truncate font-extrabold text-[#1f2430]">{value}</p>
    </div>
  );
}
