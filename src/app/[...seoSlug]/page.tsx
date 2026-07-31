import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { LandingAreaFilter, LandingCategoryFilter, LandingPriceFilter } from "@/components/landing-category-filter";
import {
  buildLandingWhere,
  buildSeoLandingPath,
  getInternalSeoLinks,
  getSiteUrl,
  resolveSeoLanding,
} from "@/lib/seo/landing";
import type { SeoLandingContext } from "@/lib/seo/landing";

export const dynamic = "force-dynamic";

const listingInclude = {
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
      moderationStatus: "approved",
      media: {
        status: "approved",
      },
    },
    orderBy: [{ sortOrder: "asc" }],
    take: 3,
    include: {
      media: {
        select: {
          publicUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ListingInclude;

type LandingListing = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;
type NumericValue = { toString(): string } | number | string | null | undefined;

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

const categoryLabelBySlug: Record<string, string> = {
  "ban-can-ho-chung-cu": "Bán căn hộ chung cư",
  "ban-chung-cu-mini-can-ho-dich-vu": "Bán chung cư mini, căn hộ dịch vụ",
  "ban-nha-rieng": "Bán nhà riêng",
  "ban-nha-biet-thu-lien-ke": "Bán nhà biệt thự, liền kề",
  "ban-nha-mat-pho": "Bán nhà mặt phố",
  "ban-shophouse-nha-pho-thuong-mai": "Bán shophouse, nhà phố thương mại",
  "ban-dat-nen-du-an": "Bán đất nền dự án",
  "ban-dat": "Bán đất",
  "ban-trang-trai-khu-nghi-duong": "Bán trang trại, khu nghỉ dưỡng",
  "ban-condotel": "Bán condotel",
  "ban-kho-nha-xuong": "Bán kho, nhà xưởng",
  "ban-bat-dong-san-khac": "Bán loại bất động sản khác",
  "cho-thue-can-ho-chung-cu": "Cho thuê căn hộ chung cư",
  "cho-thue-chung-cu-mini-can-ho-dich-vu": "Cho thuê chung cư mini, căn hộ dịch vụ",
  "cho-thue-nha-rieng": "Cho thuê nhà riêng",
  "cho-thue-nha-biet-thu-lien-ke": "Cho thuê nhà biệt thự, liền kề",
  "cho-thue-nha-mat-pho": "Cho thuê nhà mặt phố",
  "cho-thue-nha-tro-phong-tro": "Cho thuê nhà trọ, phòng trọ",
  "cho-thue-shophouse-nha-pho-thuong-mai": "Cho thuê shophouse, nhà phố thương mại",
  "cho-thue-van-phong": "Cho thuê văn phòng",
  "cho-thue-cua-hang-ki-ot": "Cho thuê, sang nhượng cửa hàng, ki ốt",
  "cho-thue-kho-nha-xuong-dat": "Cho thuê kho, nhà xưởng, đất",
  "cho-thue-bat-dong-san-khac": "Cho thuê loại bất động sản khác",
};

type Props = {
  params: Promise<{ seoSlug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const context = await resolveSeoLanding(slug);

  if (!context) {
    return {
      title: "Không tìm thấy trang | Anshome",
    };
  }

  const title = `${getDisplayLandingTitle(context)} | Anshome`;
  const description = getDisplayLandingDescription(context);
  const canonical = `${getSiteUrl()}${context.location || context.category ? buildSeoLandingPath({ category: context.category, location: context.location, transactionType: context.transactionType }) : `/${context.slug}`}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const context = await resolveSeoLanding(slug);

  if (!context) {
    notFound();
  }

  const where = buildLandingWhere(context);
  const [listings, total, links] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 30,
      include: listingInclude,
    }),
    db.listing.count({ where }),
    getInternalSeoLinks(),
  ]);

  const title = getDisplayLandingTitle(context);
  const description = getDisplayLandingDescription(context);
  const breadcrumbItems = [
    { label: "Anshome", href: "/" },
    { label: context.transactionType === "sale" ? "Nhà đất bán" : "Nhà đất cho thuê", href: buildSeoLandingPath({ transactionType: context.transactionType }) },
    ...(context.category ? [{ label: getCategoryLabel(context.category), href: buildSeoLandingPath({ category: context.category }) }] : []),
    ...(context.location ? [{ label: context.location.fullName, href: buildSeoLandingPath({ category: context.category, location: context.location, transactionType: context.transactionType }) }] : []),
  ];

  return (
    <main className="stage-root bg-[#f5f5f5] text-[#2b2c33]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[958px] px-4 py-4 lg:max-w-[926px] lg:px-0">
        <LandingSearchBar title={title} />

        <div className="grid gap-4 lg:grid-cols-[650px_260px]">
          <section className="min-w-0">
            <nav className="mb-3 flex flex-wrap items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
              {breadcrumbItems.map((item, index) => (
                <span key={item.href} className="flex items-center gap-1.5">
                  {index > 0 ? <span>/</span> : null}
                  <Link href={item.href} className="hover:text-[#c7352d]">{item.label}</Link>
                </span>
              ))}
            </nav>

            <div className="mb-3 rounded-md border border-[#e1e4ea] bg-white px-4 py-3">
              <h1 className="text-[19px] font-extrabold leading-7 text-[#20242d]">{title}</h1>
              <p className="mt-1 text-[13px] font-semibold leading-5 text-[#66707c]">{total} tin đăng phù hợp. {description}</p>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-md border border-[#e1e4ea] bg-white px-3 py-2">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#303743]">
                <span>Sắp xếp:</span>
                <button type="button" className="rounded border border-[#d8dce3] px-2 py-1 text-[#c7352d]">Tin mới nhất</button>
                <button type="button" className="hidden rounded border border-[#d8dce3] px-2 py-1 sm:inline-flex">Giá thấp đến cao</button>
              </div>
              <Link href="/tai-khoan/tin-dang/tao-moi" className="rounded bg-[#19b7b8] px-3 py-1.5 text-[12px] font-extrabold text-white">
                Đăng tin
              </Link>
            </div>

            <div className="grid gap-3">
              {listings.map((listing, index) => (
                <div key={listing.id} className="grid gap-3">
                  {index === 2 ? <InlineProjectStrip listings={listings.slice(0, 4)} /> : null}
                  {index === 4 ? <InlinePromo /> : null}
                  <LandingListingCard listing={listing} />
                </div>
              ))}
            </div>

            {listings.length === 0 ? (
              <div className="rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có tin đăng phù hợp cho trang landing này.
              </div>
            ) : null}

            <SeoTextBlock title={title} />
          </section>

          <aside className="hidden content-start gap-4 lg:grid">
            <SidebarBox title={`Lọc ${title.toLowerCase()}`} items={["Mức giá", "Diện tích", "Số phòng ngủ", "Hướng nhà", "Thời gian đăng"]} />
            <SidebarBox title="Khu vực phổ biến" items={links.categoryProvinces.slice(0, 12).map((item) => getSeoLinkLabel(item))} />
            <SidebarBox title="Danh mục liên quan" items={links.categories.slice(0, 12).map((item) => getSeoLinkLabel(item))} />
            <SidebarNews />
          </aside>
        </div>
      </section>
    </main>
  );
}

function LandingSearchBar({ title }: { title: string }) {
  return (
    <form className="landing-search-panel mb-4 rounded-md border border-[#e0e3e9] bg-white p-3 shadow-[0_2px_10px_rgba(20,28,45,0.04)]">
      <div className="landing-search-main flex flex-col gap-2 md:flex-row">
        <label className="flex min-h-10 flex-1 items-center gap-2 rounded border border-[#d7dbe3] bg-white px-3 text-[13px] font-semibold text-[#6a707b]">
          <SearchIcon />
          <input name="q" className="min-w-0 flex-1 outline-none" placeholder={title} />
        </label>
        <button type="submit" className="landing-search-submit rounded bg-[#e43d30] px-5 py-2 text-[13px] font-extrabold text-white">
          <span className="landing-search-submit-label">Tìm kiếm</span>
          <span className="landing-search-submit-icon" aria-hidden>
            <SubmitSearchIcon />
          </span>
        </button>
      </div>
      <div className="mt-3 flex max-w-full flex-nowrap gap-1 overflow-x-auto overflow-y-hidden pb-2 text-[12px] font-extrabold text-[#333333] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        <button type="button" className="sticky left-0 z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#cfd1d4] bg-white px-2 shadow-[8px_0_14px_rgba(255,255,255,0.96),0_1px_1px_rgba(20,28,45,0.04)]">
          <FilterIcon />
          <span className="whitespace-nowrap">Lọc</span>
          <span className="grid h-6 min-w-6 place-items-center rounded-md bg-[#e43d35] px-1.5 text-[13px] font-black text-white">1</span>
        </button>

        <button type="button" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#cfd1d4] bg-white px-2 text-[#9a9a9a] shadow-[0_1px_1px_rgba(20,28,45,0.04)]">
          <VerifiedIcon />
          <span className="whitespace-nowrap">Tin xác thực</span>
          <ToggleSwitch />
        </button>

        <LandingCategoryFilter label={formatFilterCategoryLabel(title)} />

        <LandingPriceFilter />

        <LandingAreaFilter />

        <button type="button" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#cfd1d4] bg-white px-2 text-[#9a9a9a] shadow-[0_1px_1px_rgba(20,28,45,0.04)]">
          <ProBrokerIcon />
          <span className="whitespace-nowrap">Môi giới chuyên nghiệp</span>
          <ToggleSwitch />
        </button>
      </div>
    </form>
  );
}

function LandingListingCard({ listing }: { listing: LandingListing }) {
  const cover = listing.media.find((item) => item.type === "image") ?? listing.media[0];
  const imageUrl = cover?.type === "image" ? cover.media.publicUrl : null;
  const galleryImages = [imageUrl, imageUrl, imageUrl].filter(Boolean) as string[];
  const location = [listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || listing.addressText || "Đang cập nhật";
  const ownerName = listing.owner.profile?.displayName ?? listing.contactName;
  const attributes = [
    listing.attributes?.bedrooms ? `${listing.attributes.bedrooms}` : null,
    listing.attributes?.bathrooms ? `${listing.attributes.bathrooms}` : null,
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white shadow-[0_2px_10px_rgba(20,28,45,0.04)]">
      <Link href={`/tin-dang/${listing.publicId}`} className="block">
        <div className="relative grid h-[265px] grid-cols-[2fr_1fr] gap-0.5 overflow-hidden bg-[#dde1e7]">
          <div className="relative min-w-0">
            {galleryImages[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={galleryImages[0]} alt={cover?.caption ?? listing.title} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid h-full place-items-center bg-[#edf0f3] text-sm font-bold text-[#777c86]">Ảnh</div>
            )}
            <span className="absolute left-8 top-[96px] max-w-[72%] rounded-sm bg-white/80 px-3 py-2 text-[14px] font-bold leading-5 text-[#3c3f46]">
              {listing.title}
            </span>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded bg-black/70 px-3 py-2 text-[13px] font-black text-white">
              <EyeIcon />
              Đã xem
            </span>
          </div>
          <div className="grid min-w-0 grid-rows-2 gap-0.5">
            {galleryImages.slice(1, 3).map((url, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${listing.id}-gallery-${index}`} src={url} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
            ))}
          </div>
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded bg-black/55 px-3 py-2 text-[13px] font-black text-white">
            <ImageIcon />
            {Math.max(1, listing.media.length)}
          </span>
        </div>

        <div className="border-b border-[#edf0f3] px-5 py-5">
          <h2 className="text-[14px] font-black uppercase leading-6 text-[#4a4d53] hover:text-[#c7352d]">
            {listing.title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-black text-[#8f9298]">
            <span>{formatPrice(listing.price, listing.priceUnit)}</span>
            <span>·</span>
            <span>{formatArea(listing.area)}</span>
            <span>·</span>
            <span>{formatPricePerSqm(listing.pricePerSqm)}</span>
            {attributes.map((item, index) => (
              <span key={`${listing.id}-attr-${index}`} className="inline-flex items-center gap-1">
                <span>·</span>
                {index === 0 ? <BedIcon /> : <BathIcon />}
                {item}
              </span>
            ))}
            <span>·</span>
            <span>{location}</span>
          </div>
          <p className="mt-4 line-clamp-2 text-[14px] font-semibold leading-6 text-[#8a8d93]">{listing.description}</p>
        </div>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fde4df] text-lg font-black text-[#c7352d]">{ownerName.charAt(0).toUpperCase()}</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-black text-[#2e323b]">{ownerName}</p>
            <p className="mt-0.5 text-[12px] font-bold text-[#8b8f96]">{formatPublishedDate(listing.publishedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={`tel:${listing.contactPhone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#079fa4] px-5 text-[12px] font-black text-white [&_svg]:h-5 [&_svg]:w-5">
            <PhoneIcon />
            {formatMaskedPhone(listing.contactPhone)} · Hiện số
          </a>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-[#cfd2d8] text-[#20242d]" aria-label="Lưu tin">
            <HeartIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function InlineProjectStrip({ listings }: { listings: LandingListing[] }) {
  return (
    <section className="rounded-md border border-[#dde1e7] bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-[#20242d]">Tin nổi bật khu vực</h2>
        <Link href="/tin-dang" className="text-[12px] font-extrabold text-[#c7352d]">Xem thêm</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {listings.map((listing) => {
          const cover = listing.media.find((item) => item.type === "image") ?? listing.media[0];
          return (
            <Link key={`strip-${listing.id}`} href={`/tin-dang/${listing.publicId}`} className="min-w-0">
              {cover?.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover.media.publicUrl} alt={listing.title} className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
              ) : (
                <div className="aspect-[4/3] rounded bg-[#edf0f3]" />
              )}
              <p className="mt-2 line-clamp-2 text-[12px] font-extrabold leading-4">{listing.title}</p>
              <p className="mt-1 text-[12px] font-black text-[#e23d35]">{formatPrice(listing.price, listing.priceUnit)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function InlinePromo() {
  return (
    <section className="grid min-h-[92px] overflow-hidden rounded-md border border-[#f4c5be] bg-[#fff3f1] sm:grid-cols-[1fr_170px]">
      <div className="p-4">
        <p className="text-[14px] font-black text-[#e23d35]">Gói đăng tin nổi bật</p>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[#5f6675]">Tăng hiển thị tin đăng trong danh sách tìm kiếm và nhận liên hệ nhanh hơn.</p>
      </div>
      <Link href="/tai-khoan/tin-dang/tao-moi" className="grid place-items-center bg-[#e23d35] px-4 text-center text-[13px] font-black text-white">
        Đăng tin ngay
      </Link>
    </section>
  );
}

function SidebarBox({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-md border border-[#e1e4ea] bg-white p-4">
      <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <button key={item} type="button" className="text-left text-[13px] font-semibold leading-5 text-[#4a515e] hover:text-[#c7352d]">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function SidebarNews() {
  const items = [
    "Kinh nghiệm mua căn hộ lần đầu",
    "Cách kiểm tra pháp lý dự án",
    "Xu hướng giá chung cư mới nhất",
    "Lưu ý khi vay mua nhà",
  ];

  return (
    <section className="rounded-md border border-[#e1e4ea] bg-white p-4">
      <h2 className="text-[15px] font-extrabold leading-5 text-[#20242d]">Tin tức bất động sản</h2>
      <div className="mt-3 grid gap-3">
        {items.map((item) => (
          <Link key={item} href="/tin-tuc" className="border-b border-[#edf0f3] pb-3 text-[13px] font-semibold leading-5 text-[#4a515e] last:border-0 last:pb-0 hover:text-[#c7352d]">
            {item}
          </Link>
        ))}
      </div>
    </section>
  );
}

function SeoTextBlock({ title }: { title: string }) {
  return (
    <section className="mt-6 rounded-md border border-[#dde1e7] bg-white p-5 text-[13px] font-medium leading-6 text-[#4b5360]">
      <h2 className="text-[18px] font-extrabold text-[#20242d]">{title}: thông tin tổng quan</h2>
      <p className="mt-3">
        Danh sách tin đăng được cập nhật theo trạng thái đã duyệt, giúp người mua nhanh chóng so sánh giá, diện tích, vị trí và thông tin liên hệ. Khi quan tâm một tin, bạn có thể mở chi tiết để xem ảnh, mô tả, bản đồ và thông tin người đăng.
      </p>
      <p className="mt-3">
        Nên ưu tiên các tin có ảnh rõ ràng, mô tả đầy đủ, pháp lý minh bạch và mức giá phù hợp với mặt bằng khu vực. Anshome tiếp tục hoàn thiện dữ liệu thị trường để hỗ trợ quá trình tìm kiếm bất động sản hiệu quả hơn.
      </p>
    </section>
  );
}

function getCategoryLabel(category: { name: string; slug: string }) {
  return categoryLabelBySlug[category.slug] ?? category.name;
}

function getDisplayLandingTitle(context: SeoLandingContext) {
  const subject = context.category ? getCategoryLabel(context.category) : context.transactionType === "sale" ? "Nhà đất bán" : "Nhà đất cho thuê";
  return context.location ? `${subject} tại ${context.location.fullName}` : subject;
}

function getDisplayLandingDescription(context: SeoLandingContext) {
  const title = getDisplayLandingTitle(context);
  return `${title}: cập nhật tin đăng mới nhất, thông tin giá, diện tích, vị trí, pháp lý và liên hệ trực tiếp trên Anshome.`;
}

function getSeoLinkLabel(item: { label: string; href: string }) {
  const slug = item.href.replace(/^\/+/, "");
  const directLabel = categoryLabelBySlug[slug];

  if (directLabel) {
    return directLabel;
  }

  const matchedSlug = Object.keys(categoryLabelBySlug)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => slug.startsWith(`${candidate}-`));

  if (!matchedSlug) {
    return item.label;
  }

  const accentLabel = categoryLabelBySlug[matchedSlug];
  const asciiLabel = stripVietnameseAccent(accentLabel);

  if (item.label.toLowerCase().startsWith(asciiLabel.toLowerCase())) {
    return `${accentLabel}${item.label.slice(asciiLabel.length)}`;
  }

  return item.label;
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

function formatMaskedPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length >= 7) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ***`;
  }

  return phone;
}

function stripVietnameseAccent(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function formatFilterCategoryLabel(title: string) {
  const label = title.replace(/^(Bán|Cho thuê)\s+/i, "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function EyeIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
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
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M4 18V8M20 18v-5a3 3 0 0 0-3-3H4v8h16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V8h4v2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M5 11h14v3a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V6a2 2 0 0 1 2-2h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 3.5 10 7l-2 3c1.3 2.7 3.3 4.7 6 6l3-2 3.5 3.4c.3.3.4.7.2 1.1-.7 1.8-2.4 2.9-4.3 2.5C9.7 19.8 4.2 14.3 3 7.6c-.3-1.9.8-3.6 2.5-4.3.4-.2.8-.1 1.1.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.2 4.9C18.2 2.9 15 2.9 13 4.9L12 5.9L11 4.9C9 2.9 5.8 2.9 3.8 4.9C1.7 6.9 1.7 10.2 3.8 12.2L12 20.4L20.2 12.2C22.3 10.2 22.3 6.9 20.2 4.9Z" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#6c7280]">
      <path d="m20 20-4.5-4.5M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SubmitSearchIcon() {
  return (
    <svg aria-hidden width="25" height="25" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="10.5" cy="10.5" r="6.7" stroke="currentColor" strokeWidth="2" />
      <path d="M15.7 15.7L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden width="21" height="21" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#2f2f2f]">
      <path d="M4 5.5H20L13.8 12.8V18.2L10.2 20V12.8L4 5.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md bg-[#0f9b64] text-white">
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M6 12.4L10 16.4L18.4 7.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ToggleSwitch() {
  return (
    <span className="relative h-6 w-10 shrink-0 rounded-full bg-[#c8c9cb]" aria-hidden>
      <span className="absolute left-1.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(20,28,45,0.18)]" />
    </span>
  );
}

function ProBrokerIcon() {
  return (
    <span className="relative grid h-[22px] w-[22px] shrink-0 place-items-center">
      <span className="absolute h-[18px] w-[18px] rotate-45 rounded-[4px] bg-[#1bb4b7]" />
      <span className="absolute h-3 w-3 rounded-full bg-[#f6b647]" />
      <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" className="relative text-white">
        <path d="M6.5 12.2L10 15.7L17.5 8.3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
