import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { ListingGallery } from "./listing-gallery";

export const dynamic = "force-dynamic";

const listingDetailInclude = {
  attributes: true,
  agency: {
    include: {
      logoMedia: {
        select: {
          publicUrl: true,
        },
      },
    },
  },
  category: true,
  owner: {
    include: {
      profile: {
        select: {
          displayName: true,
          verificationStatus: true,
          companyName: true,
          avatarMedia: {
            select: {
              publicUrl: true,
            },
          },
        },
      },
    },
  },
  project: {
    include: {
      developer: true,
      media: {
        where: {
          type: "image",
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
    },
  },
  province: true,
  district: true,
  ward: true,
  street: true,
  media: {
    where: {
      moderationStatus: "approved",
      media: {
        status: "approved",
      },
    },
    orderBy: [{ sortOrder: "asc" }],
    include: {
      media: true,
    },
  },
} satisfies Prisma.ListingInclude;

const relatedListingInclude = {
  media: {
    where: {
      moderationStatus: "approved",
      media: {
        status: "approved",
      },
    },
    orderBy: [{ sortOrder: "asc" }],
    take: 1,
    include: {
      media: {
        select: {
          publicUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ListingInclude;

type ListingDetail = Prisma.ListingGetPayload<{ include: typeof listingDetailInclude }>;
type RelatedListing = Prisma.ListingGetPayload<{ include: typeof relatedListingInclude }>;
type NumericValue = { toString(): string } | number | string | null | undefined;
type MarketInsightView = {
  title: string;
  summary: string;
  changePercent: NumericValue;
  periodLabel: string;
  currentPricePerSqm: NumericValue;
  lowPricePerSqm: NumericValue;
  highPricePerSqm: NumericValue;
  ctaLabel: string | null;
  ctaHref: string | null;
} | null;
type DetailLinkView = {
  label: string;
  href: string;
  count: number | null;
};

type Props = {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ lead?: string }>;
};

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

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

function formatPrice(price: NumericValue, unit?: string | null): string {
  const value = toNumber(price);

  if (!value) {
    return "Thỏa thuận";
  }

  if (!unit || unit === "VND") {
    return formatMoneyAmount(value);
  }

  return `${integerFormatter.format(value)} ${unit}`;
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

function formatArea(area: NumericValue): string {
  const value = toNumber(area);
  return value ? `${numberFormatter.format(value)} m²` : "Đang cập nhật";
}

function formatDate(date: Date | null): string {
  return date ? date.toLocaleDateString("vi-VN") : "Đang cập nhật";
}

function compactAddress(listing: ListingDetail): string {
  return [listing.street?.fullName, listing.ward?.fullName, listing.district?.fullName, listing.province?.fullName]
    .filter(Boolean)
    .join(", ") || listing.addressText || "Vị trí đang cập nhật";
}

function getGalleryImages(listing: ListingDetail) {
  const urls = new Set<string>();
  const images: Array<{ id: string; url: string; alt: string }> = [];

  for (const item of listing.media) {
    if (item.type !== "image") {
      continue;
    }

    const url = item.media.publicUrl;
    if (!urls.has(url)) {
      urls.add(url);
      images.push({ id: item.id, url, alt: item.caption ?? listing.title });
    }
  }

  for (const item of listing.project?.media ?? []) {
    const url = item.media.publicUrl;
    if (!urls.has(url)) {
      urls.add(url);
      images.push({ id: item.id, url, alt: listing.project?.name ?? listing.title });
    }
  }

  return images;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const listing = await db.listing.findFirst({
    where: { publicId, status: "published" },
    include: {
      province: { select: { fullName: true } },
      district: { select: { fullName: true } },
      category: { select: { name: true } },
      media: {
        where: {
          moderationStatus: "approved",
          media: { status: "approved" },
        },
        orderBy: [{ sortOrder: "asc" }],
        take: 1,
        include: {
          media: {
            select: {
              publicUrl: true,
            },
          },
        },
      },
    },
  });

  if (!listing) {
    return {
      title: "Tin đăng không tồn tại | Anshome",
    };
  }

  const location = [listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ");
  const description = `${listing.category.name}${location ? ` tại ${location}` : ""}. Giá ${formatPrice(listing.price, listing.priceUnit)}, diện tích ${formatArea(listing.area)}.`;

  return {
    title: `${listing.title} | Anshome`,
    description,
    openGraph: {
      title: listing.title,
      description,
      type: "article",
      images: listing.media[0]?.media.publicUrl ? [listing.media[0].media.publicUrl] : undefined,
    },
  };
}

export default async function PublicListingDetailPage({ params }: Props) {
  const { publicId } = await params;
  const listing = await db.listing.findFirst({
    where: {
      publicId,
      status: "published",
    },
    include: listingDetailInclude,
  });

  if (!listing) {
    notFound();
  }

  const relatedFilters = [
    { categoryId: listing.categoryId },
    listing.projectId ? { projectId: listing.projectId } : null,
    listing.provinceId ? { provinceId: listing.provinceId } : null,
  ].filter((item): item is { categoryId: string } | { projectId: string } | { provinceId: string } => Boolean(item));

  const linkLocationIds = [listing.wardId, listing.districtId, listing.provinceId].filter((id): id is string => Boolean(id));
  const [relatedListings, marketInsight, detailLinks, recentViews] = await Promise.all([
    db.listing.findMany({
      where: {
        id: { not: listing.id },
        status: "published",
        OR: relatedFilters,
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 12,
      include: relatedListingInclude,
    }),
    db.listingMarketInsight.findFirst({
      where: {
        isActive: true,
        transactionType: listing.transactionType,
        OR: [
          { categoryId: listing.categoryId, districtId: listing.districtId },
          { categoryId: listing.categoryId, provinceId: listing.provinceId },
          { categoryId: listing.categoryId },
        ],
      },
      orderBy: [{ districtId: "desc" }, { provinceId: "desc" }, { updatedAt: "desc" }],
    }),
    db.listingDetailLink.findMany({
      where: {
        isActive: true,
        OR: [
          { categoryId: listing.categoryId },
          { locationId: { in: linkLocationIds } },
          { categoryId: null, locationId: null },
        ],
      },
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    }),
    db.listingView.findMany({
      where: {
        listingId: { not: listing.id },
      },
      orderBy: [{ viewedAt: "desc" }],
      distinct: ["listingId"],
      take: 6,
      include: {
        listing: {
          include: relatedListingInclude,
        },
      },
    }),
  ]);

  const ownerName = listing.owner.profile?.displayName ?? listing.owner.email ?? listing.owner.phone ?? "Người đăng tin";
  const ownerCompany = listing.agency?.name ?? listing.owner.profile?.companyName ?? "Môi giới chuyên nghiệp";
  const address = compactAddress(listing);
  const galleryImages = getGalleryImages(listing);
  const priceLabel = formatPrice(listing.price, listing.priceUnit);
  const areaLabel = formatArea(listing.area);
  const pricePerSqmLabel = formatPricePerSqm(listing.pricePerSqm);
  const bedroomsLabel = listing.attributes?.bedrooms ? `${listing.attributes.bedrooms} PN` : "-";
  const bathroomsLabel = listing.attributes?.bathrooms ? `${listing.attributes.bathrooms} phòng` : "-";
  const floorsLabel = listing.attributes?.floors ? `${listing.attributes.floors} tầng` : "Đang cập nhật";
  const mapLatitude = listing.latitude ?? listing.project?.latitude;
  const mapLongitude = listing.longitude ?? listing.project?.longitude;
  const areaShort = listing.area ? `${numberFormatter.format(toNumber(listing.area) ?? 0)} m²` : "-";
  const priceShort = priceLabel;
  const districtName = listing.district?.fullName ?? "khu vực này";
  const areaLinks = detailLinks.filter((link) => link.group === "area_market");
  const popularLinks = detailLinks.filter((link) => link.group === "popular_property");
  const utilityLinks = detailLinks.filter((link) => link.group === "utility");
  const viewedListings = recentViews.map((view) => view.listing).filter((item) => item.status === "published");

  return (
    <main className="stage-root overflow-x-hidden bg-white text-[#2b2c33]">
      <SiteHeader />

      <section className="mx-auto grid w-full max-w-[1000px] gap-6 px-4 py-6 lg:grid-cols-[650px_270px]">
        <article className="min-w-0">
          <ListingGallery images={galleryImages} />

          <div className="mt-5 text-[13px] font-semibold text-[#7b808a]">
            <Link href="/" className="hover:text-[#c7352d]">Bán</Link>
            <span className="mx-2">/</span>
            <Link href="/tin-dang" className="hover:text-[#c7352d]">{listing.province?.fullName ?? "Nhà đất"}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#2f3340]">{listing.category.name}</span>
          </div>

          <section className="mt-3">
            <h1 className="break-words text-[25px] font-extrabold leading-[1.28] text-[#20242d]">
              {listing.title}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-[13px] font-bold leading-5 text-[#404653]">
              <LocationIcon />
              <span>{address}</span>
            </p>

            <div className="mt-5 grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-4 border-b border-[#e9ebef] pb-4">
              <TopMetric label="Khoảng giá" value={priceShort} helper={pricePerSqmLabel} />
              <TopMetric label="Diện tích" value={areaShort} helper="" />
              <TopMetric label="Phòng ngủ" value={bedroomsLabel} helper="" />
              <div className="flex items-center gap-2 pb-1">
                <IconButton label="Chia sẻ"><ShareIcon /></IconButton>
                <IconButton label="Báo lỗi"><WarningIcon /></IconButton>
                <IconButton label="Lưu tin"><HeartIcon /></IconButton>
              </div>
            </div>

            <MarketPulse insight={marketInsight} fallbackPricePerSqm={pricePerSqmLabel} />
          </section>

          <ContentSection title="Thông tin mô tả">
            <p className="whitespace-pre-wrap text-[13px] font-medium leading-6 text-[#252a34]">{listing.description}</p>
            <div className="mt-3 space-y-1 text-[13px] font-medium leading-6 text-[#252a34]">
              <p>Diện tích: {areaLabel}. Giá: {priceLabel}.</p>
              <p>Pháp lý: {listing.attributes?.legalStatus ?? "Đang cập nhật"}. Nội thất: {listing.attributes?.interiorStatus ?? "Đang cập nhật"}.</p>
              <p>Liên hệ: {listing.contactName} - {listing.contactPhone}</p>
            </div>
          </ContentSection>

          <ContentSection title="Đặc điểm bất động sản">
            <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <FeatureRow icon={<MoneyIcon />} label="Khoảng giá" value={priceLabel} />
              <FeatureRow icon={<BathIcon />} label="Số phòng tắm, vệ sinh" value={bathroomsLabel} />
              <FeatureRow icon={<AreaIcon />} label="Diện tích" value={areaLabel} />
              <FeatureRow icon={<BuildingIcon />} label="Số tầng" value={floorsLabel} />
              <FeatureRow icon={<BedIcon />} label="Số phòng ngủ" value={bedroomsLabel} />
              <FeatureRow icon={<DocumentIcon />} label="Pháp lý" value={listing.attributes?.legalStatus ?? "Đang cập nhật"} />
            </dl>
          </ContentSection>

          <ValuationBanner insight={marketInsight} categoryName={listing.category.name} />

          <ContentSection title="Xem trên bản đồ">
            <MiniMap address={address} latitude={mapLatitude?.toString()} longitude={mapLongitude?.toString()} />
          </ContentSection>

          <ListingMetaBar
            publishedAt={formatDate(listing.publishedAt)}
            expiredAt={formatDate(listing.expiredAt)}
            listingType={listing.isFeatured ? "Tin nổi bật" : "Tin thường"}
            publicId={listing.publicId}
          />

          {relatedListings.length > 0 ? (
            <ContentSection title="Bất động sản dành cho bạn">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {relatedListings.slice(0, 11).map((item) => (
                  <RelatedCard key={item.id} listing={item} />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Link href="/tin-dang" className="rounded-md border border-[#d8dce3] px-5 py-2 text-sm font-extrabold text-[#30343d] hover:border-[#c7352d] hover:text-[#c7352d]">
                  Xem thêm
                </Link>
              </div>
            </ContentSection>
          ) : null}

          {(viewedListings.length > 0 || relatedListings.length > 0) ? (
            <ContentSection title="Tin đăng đã xem">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {(viewedListings.length > 0 ? viewedListings : relatedListings).slice(0, 6).map((item) => (
                  <RelatedCard key={`viewed-${item.id}`} listing={item} compact />
                ))}
              </div>
            </ContentSection>
          ) : null}
        </article>

        <aside className="hidden content-start gap-4 lg:grid">
          <AgentCard contactName={ownerName} company={ownerCompany} phone={listing.contactPhone} zalo={listing.contactZalo} relatedCount={relatedListings.length + 1} />
          <SidebarList title={`Mua bán nhà đất tại ${districtName}`} items={areaLinks} more />
          <SidebarList title="Bất động sản nổi bật" items={popularLinks} />
          <SidebarList title="Hỗ trợ tiện ích" items={utilityLinks} />
        </aside>
      </section>

      <div className="fixed right-0 top-1/2 hidden -translate-y-1/2 rounded-l-md bg-[#f2f3f5] px-2 py-5 text-xs font-extrabold text-[#4c525f] shadow-sm lg:block [writing-mode:vertical-rl]">
        Tin Nhà đất
      </div>
    </main>
  );
}

function TopMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] font-semibold text-[#888d98]">{label}</p>
      <p className="mt-1 truncate text-[17px] font-extrabold leading-6 text-[#20242d]">{value}</p>
      {helper ? <p className="mt-0.5 truncate text-[11px] font-semibold text-[#66707c]">{helper}</p> : null}
    </div>
  );
}

function MarketPulse({ insight, fallbackPricePerSqm }: { insight: MarketInsightView; fallbackPricePerSqm: string }) {
  const changePercent = toNumber(insight?.changePercent);
  const changeLabel = changePercent ? `↑ ${numberFormatter.format(changePercent)}%` : "↑ 12%";
  const summary = insight?.summary ?? "Giá tại khu vực này đã tăng trong vòng 1 năm qua";
  const ctaLabel = insight?.ctaLabel ?? "Xem lịch sử giá";
  const ctaHref = insight?.ctaHref ?? "#gia";

  return (
    <div className="mt-4 flex items-center gap-3 rounded-sm border border-[#16c784] bg-[#f4fff9] px-3 py-2 text-[12px] font-bold text-[#27313d]">
      <span className="rounded bg-[#16c784] px-2 py-1 text-xs font-extrabold text-white">{changeLabel}</span>
      <span className="min-w-0 flex-1">{summary} {insight?.currentPricePerSqm ? `· ${formatPricePerSqm(insight.currentPricePerSqm)}` : `· ${fallbackPricePerSqm}`}</span>
      <Link href={ctaHref} className="text-[#078c5b]">{ctaLabel}</Link>
    </div>
  );
}

function ContentSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-8">
      <h2 className="text-[18px] font-extrabold leading-6 text-[#20242d]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FeatureRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-[#edf0f3] py-3 text-[13px]">
      <span className="text-[#606773]">{icon}</span>
      <dt className="font-bold text-[#4d535e]">{label}</dt>
      <dd className="text-right font-extrabold text-[#20242d]">{value}</dd>
    </div>
  );
}

function ValuationBanner({ insight, categoryName }: { insight: MarketInsightView; categoryName: string }) {
  const ctaLabel = insight?.ctaLabel ?? "Xem lịch sử giá";
  const ctaHref = insight?.ctaHref ?? "#gia";

  return (
    <section className="mt-8 overflow-hidden rounded-sm bg-[#dbf7f4]">
      <div className="grid gap-4 p-5 md:grid-cols-[1fr_170px]">
        <div>
          <p className="text-base font-extrabold text-[#08949c]">Truy cập miễn phí thông tin độc quyền về {categoryName} tại</p>
          <ul className="mt-3 grid gap-2 text-[13px] font-semibold text-[#33404a]">
            <li>Khoảng giá an toàn hiện tại để giao dịch</li>
            <li>{insight?.summary ?? "Lịch sử biến động giá được tổng hợp và xử lý bởi Anshome"}</li>
          </ul>
          <Link href={ctaHref} className="mt-4 inline-flex rounded bg-[#e8382f] px-4 py-2 text-sm font-extrabold text-white">{ctaLabel}</Link>
        </div>
        <div className="relative hidden min-h-[125px] overflow-hidden rounded bg-[#a8e6e2] md:block">
          <div className="absolute bottom-0 left-3 h-16 w-10 bg-[#6cc9c4]" />
          <div className="absolute bottom-0 left-16 h-24 w-12 bg-[#4fb9b4]" />
          <div className="absolute bottom-0 left-32 h-20 w-10 bg-[#72d7d1]" />
          <div className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-full bg-[#09a7a7] text-2xl font-extrabold text-white">$</div>
        </div>
      </div>
    </section>
  );
}

function MiniMap({ address, latitude, longitude }: { address: string; latitude?: string; longitude?: string }) {
  return (
    <div className="relative h-[210px] overflow-hidden rounded-sm border border-[#d8dce3] bg-[#f2efe7]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(90,130,170,.16)_1px,transparent_1px),linear-gradient(rgba(90,130,170,.16)_1px,transparent_1px)] bg-[length:42px_42px]" />
      <div className="absolute left-[58%] top-[36%] grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e84b3c] text-white shadow-md"><LocationIcon /></div>
      <p className="absolute left-4 right-4 bottom-4 rounded bg-white/90 px-3 py-2 text-xs font-bold text-[#414852]">
        {address}{latitude && longitude ? ` · ${latitude}, ${longitude}` : ""}
      </p>
    </div>
  );
}

function ListingMetaBar({
  publishedAt,
  expiredAt,
  listingType,
  publicId,
}: {
  publishedAt: string;
  expiredAt: string;
  listingType: string;
  publicId: string;
}) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-y-4 border-y border-[#edf0f3] py-5 text-[12px] sm:grid-cols-4">
      <MetaItem label="Ngày đăng" value={publishedAt} />
      <MetaItem label="Ngày hết hạn" value={expiredAt} />
      <MetaItem label="Loại tin" value={listingType} />
      <MetaItem label="Mã tin" value={publicId} />
    </dl>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[#8a909a]">{label}</dt>
      <dd className="mt-2 font-extrabold text-[#20242d]">{value}</dd>
    </div>
  );
}

function RelatedCard({ listing, compact = false }: { listing: RelatedListing; compact?: boolean }) {
  const image = listing.media[0]?.media.publicUrl;

  return (
    <Link href={`/tin-dang/${listing.publicId}`} className="block overflow-hidden rounded-md border border-[#e0e4ea] bg-white shadow-[0_2px_8px_rgba(20,28,45,0.05)]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={listing.title} className="h-[122px] w-full object-cover" />
      ) : (
        <div className="grid h-[122px] place-items-center bg-[#eceff3] text-xs font-bold text-[#777c86]">Ảnh</div>
      )}
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-10 text-[13px] font-extrabold leading-5 text-[#20242d]">{listing.title}</h3>
        <p className="mt-2 text-[14px] font-extrabold text-[#d33d35]">
          {formatPrice(listing.price, listing.priceUnit)}
          <span className="text-[#d33d35]"> · {formatArea(listing.area)}</span>
        </p>
        {!compact ? (
          <p className="mt-2 text-[12px] font-semibold text-[#68707c]">hẻm · 3 · 4 · đầy đủ</p>
        ) : null}
        <p className="mt-3 truncate text-[12px] font-semibold text-[#68707c]">Đăng {formatDate(listing.publishedAt)}</p>
      </div>
    </Link>
  );
}

function AgentCard({ contactName, company, phone, zalo, relatedCount }: { contactName: string; company: string; phone: string; zalo?: string | null; relatedCount: number }) {
  const zaloPhone = zalo ?? phone;

  return (
    <section className="rounded-md border border-[#e6e9ef] bg-white p-4 shadow-[0_4px_18px_rgba(20,28,45,0.06)]">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#fde4df] text-lg font-extrabold text-[#c7352d]">
          {contactName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold text-[#20242d]">{contactName}</p>
          <p className="text-xs font-semibold text-[#66707c]">Xem thêm {relatedCount} tin khác</p>
        </div>
      </div>
      <a href={`https://zalo.me/${zaloPhone.replace(/\D/g, "")}`} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#d8dce3] bg-white text-sm font-extrabold text-[#1c5ecb]">
        Chat qua Zalo
      </a>
      <a href={`tel:${phone}`} className="mt-3 flex h-11 items-center justify-center gap-2 rounded-md bg-[#18b9bb] px-4 text-sm font-extrabold text-white">
        <PhoneIcon />
        {phone} · Hiện số
      </a>
      <p className="sr-only">{company}</p>
    </section>
  );
}

function SidebarList({ title, items, more = false }: { title: string; items: DetailLinkView[]; more?: boolean }) {
  return (
    <section className="rounded-md bg-[#f3f4f6] p-4">
      <h2 className="text-sm font-extrabold text-[#20242d]">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <Link key={`${item.href}-${item.label}`} href={item.href} className="text-[13px] font-semibold leading-5 text-[#303743] hover:text-[#c7352d]">
            {item.label}{item.count ? ` (${item.count})` : ""}
          </Link>
        ))}
      </div>
      {more ? <button type="button" className="mt-3 text-[13px] font-extrabold text-[#e23d35]">Xem thêm</button> : null}
    </section>
  );
}

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-full border border-[#e0e3e9] bg-white text-[#414653] hover:border-[#c7352d] hover:text-[#c7352d]">
      {children}
    </button>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
      <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8.6 13.5 15.5 17M15.4 7 8.6 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20.2 4.9C18.2 2.9 15 2.9 13 4.9L12 5.9L11 4.9C9 2.9 5.8 2.9 3.8 4.9C1.7 6.9 1.7 10.2 3.8 12.2L12 20.4L20.2 12.2C22.3 10.2 22.3 6.9 20.2 4.9Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 4 21 20H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 3.5 10 7l-2 3c1.3 2.7 3.3 4.7 6 6l3-2 3.5 3.4c.3.3.4.7.2 1.1-.7 1.8-2.4 2.9-4.3 2.5C9.7 19.8 4.2 14.3 3 7.6c-.3-1.9.8-3.6 2.5-4.3.4-.2.8-.1 1.1.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12h.01M16 12h.01M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 11h14v3a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-3Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V6a2 2 0 0 1 2-2h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 5h14v14H5V5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 5v14M15 5v14M5 9h14M5 15h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 20V5h9v15M15 10h4v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8h1M12 8h1M9 11h1M12 11h1M9 14h1M12 14h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 18V8M20 18v-5a3 3 0 0 0-3-3H4v8h16Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V8h4v2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h7l3 3v13H7V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 4v4h4M9.5 12h5M9.5 15h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
