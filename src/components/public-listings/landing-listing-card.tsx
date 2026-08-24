import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { buildListingDetailPath } from "@/lib/listing-url";
import { PhoneRevealButton } from "@/components/public-listings/listing-tracker";
import { FavoriteButton } from "@/components/public-listings/favorite-button";

export const listingCardInclude = {
  attributes: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  province: {
    select: {
      fullName: true,
    },
  },
  district: {
    select: {
      fullName: true,
    },
  },
  owner: {
    include: {
      profile: {
        select: {
          displayName: true,
        },
      },
    },
  },
  media: {
    where: {
      type: "image",
      moderationStatus: "approved",
      media: {
        status: "approved",
      },
    },
    orderBy: [{ sortOrder: "asc" }],
    take: 4,
    include: {
      media: {
        select: {
          publicUrl: true,
        },
      },
    },
  },
  _count: {
    select: {
      media: {
        where: {
          type: "image",
          moderationStatus: "approved",
          media: {
            status: "approved",
          },
        },
      },
    },
  },
} satisfies Prisma.ListingInclude;

export type ListingCardListing = Prisma.ListingGetPayload<{ include: typeof listingCardInclude }>;
type NumericValue = { toString(): string } | number | string | null | undefined;

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

export function ListingCard({ listing, isFavorite = false }: { listing: ListingCardListing; isFavorite?: boolean }) {
  const cover = listing.media[0];
  const imageUrl = cover?.media.publicUrl ?? null;
  const thumbnailImages = listing.media.slice(1, 4);
  const imageCount = listing._count.media;
  const location = listing.district?.fullName ?? listing.province?.fullName ?? listing.addressText ?? "Đang cập nhật";
  const ownerName = listing.owner.profile?.displayName ?? listing.contactName;
  const detailHref = buildListingDetailPath(listing);
  const featuredActive = isFeaturedActive(listing);

  return (
    <article className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white">
      <Link
        href={detailHref}
        className="relative block aspect-[4/3] min-h-[180px] overflow-hidden bg-[#dde1e7] sm:aspect-[3/1] sm:min-h-0"
      >
        <div className="grid h-full w-full grid-cols-3 grid-rows-[2fr_1fr] gap-[2px] bg-white sm:grid-cols-6 sm:grid-rows-2">
          <div className="relative col-span-3 min-h-0 overflow-hidden bg-[#dde1e7] sm:col-span-4 sm:row-span-2">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={cover?.caption ?? listing.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[#edf0f3] text-sm font-bold text-[#777c86]">Ảnh</div>
            )}
            {featuredActive ? (
              <span className="absolute left-2 top-2 rounded bg-[#e03c31] px-2 py-1 text-[11px] font-black text-white">Tin nổi bật</span>
            ) : null}
            {listing.isVerified ? (
              <span
                className={`absolute left-2 rounded bg-[#1bb34a] px-2 py-1 text-[11px] font-black text-white ${
                  featuredActive ? "top-[34px]" : "top-2"
                }`}
              >
                Tin xác thực
              </span>
            ) : null}
          </div>

          {[0, 1, 2].map((index) => {
            const thumbnail = thumbnailImages[index];
            return (
              <div
                key={thumbnail?.id ?? `empty-${index}`}
                className={`relative min-h-0 overflow-hidden bg-[#edf0f3] ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnail.media.publicUrl} alt={thumbnail.caption ?? listing.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-[11px] font-bold text-[#9297a0]">Ảnh</span>
                )}
                {index === 2 ? (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-[12px] font-black text-white">
                    <ImageIcon />
                    {Math.max(1, imageCount)}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <h2 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-[#20242d] sm:text-[18px] sm:leading-7">
          <Link href={detailHref} className="hover:text-brand">
            {listing.title}
          </Link>
        </h2>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold text-[#5f6675]">
          <span className="text-[15px] font-black text-[#e03c31]">{formatListingPrice(listing.price, listing.priceUnit)}</span>
          <span>·</span>
          <span>{formatArea(listing.area)}</span>
          <span>·</span>
          <span>{formatPricePerSqm(listing.pricePerSqm)}</span>
          {listing.attributes?.bedrooms ? (
            <span className="inline-flex items-center gap-1">
              <span>·</span>
              <BedIcon />
              <span>{listing.attributes.bedrooms}</span>
            </span>
          ) : null}
          {listing.attributes?.bathrooms ? (
            <span className="inline-flex items-center gap-1">
              <span>·</span>
              <BathIcon />
              <span>{listing.attributes.bathrooms}</span>
            </span>
          ) : null}
          <span>·</span>
          <span>{location}</span>
        </div>
        <p className="line-clamp-2 text-[13px] font-medium leading-6 text-[#8a8d93] sm:text-[14px]">{listing.description}</p>
        <div className="-mx-4 -mb-4 mt-2 flex items-center justify-between gap-3 border-t border-[#e8e9ec] px-4 py-3 sm:-mx-5 sm:-mb-5 sm:mt-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-[13px] font-black text-brand">
              {ownerName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-black text-[#2e323b]">{ownerName}</p>
              <p className="text-[12px] font-bold text-[#8b8f96]">{formatPublishedDate(listing.publishedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PhoneRevealButton
              listingId={listing.id}
              phone={listing.contactPhone}
              icon={<PhoneIcon />}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded bg-[#079fa4] px-4 text-[12px] font-black text-white sm:min-h-11 sm:px-5 sm:text-[14px] [&_svg]:h-4 [&_svg]:w-4"
            />
            <FavoriteButton
              listingId={listing.id}
              initialActive={isFavorite}
              className={`grid h-9 w-9 place-items-center rounded-md border sm:h-11 sm:w-11 ${
                isFavorite ? "border-[#c7352d] text-[#c7352d]" : "border-[#cfd2d8] text-[#20242d]"
              }`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function isFeaturedActive(listing: ListingCardListing): boolean {
  return listing.isFeatured && (!listing.featuredExpiresAt || listing.featuredExpiresAt.getTime() > Date.now());
}

function toNumber(value: NumericValue): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = Number(value.toString());
  return Number.isFinite(numeric) ? numeric : null;
}

function formatMoneyAmount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${numberFormatter.format(value / 1_000_000_000)} tỷ`;
  }

  if (value >= 1_000_000) {
    return `${numberFormatter.format(value / 1_000_000)} triệu`;
  }

  return `${integerFormatter.format(value)} đ`;
}

export function formatListingPrice(price: NumericValue, unit?: string | null): string {
  const value = toNumber(price);

  if (!value) {
    return "Thỏa thuận";
  }

  if (!unit || unit === "VND") {
    return formatMoneyAmount(value);
  }

  return `${integerFormatter.format(value)} ${unit}`;
}

function formatArea(area: NumericValue): string {
  const value = toNumber(area);
  return value ? `${numberFormatter.format(value)} m²` : "Đang cập nhật";
}

function formatPricePerSqm(pricePerSqm: NumericValue): string {
  const value = toNumber(pricePerSqm);

  if (!value) {
    return "Đang cập nhật";
  }

  if (value >= 1_000_000) {
    return `${numberFormatter.format(value / 1_000_000)} triệu/m²`;
  }

  return `${integerFormatter.format(value)} đ/m²`;
}

function formatPublishedDate(value: Date | null) {
  if (!value) {
    return "Đã đăng";
  }

  const diffDays = Math.max(0, Math.floor((Date.now() - value.getTime()) / 86_400_000));
  if (diffDays === 0) {
    return "Hôm nay";
  }
  if (diffDays === 1) {
    return "Hôm qua";
  }
  return `${diffDays} ngày trước`;
}

function ImageIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v14H4V5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m7 16 3.5-4 2.5 3 2-2.2 2 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 9.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M4 18V8M20 18v-5a3 3 0 0 0-3-3H4v8h16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V8h4v2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M5 11h14v3a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V6a2 2 0 0 1 2-2h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 3.5 10 7l-2 3c1.3 2.7 3.3 4.7 6 6l3-2 3.5 3.4c.3.3.4.7.2 1.1-.7 1.8-2.4 2.9-4.3 2.5C9.7 19.8 4.2 14.3 3 7.6c-.3-1.9.8-3.6 2.5-4.3.4-.2.8-.1 1.1.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
