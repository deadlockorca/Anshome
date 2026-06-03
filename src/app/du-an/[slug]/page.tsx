import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Category, Listing, ListingMedia, Location, Media } from "@/generated/prisma/client";
import { SiteHeader } from "@/components/site-header";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

type RelatedListing = Listing & {
  category: Pick<Category, "name">;
  province: Pick<Location, "fullName"> | null;
  district: Pick<Location, "fullName"> | null;
  media: Array<ListingMedia & { media: Pick<Media, "publicUrl"> }>;
};

function formatDecimal(value: { toString(): string } | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatPrice(value: { toString(): string } | null, unit: string | null): string {
  if (!value) {
    return "Đang cập nhật";
  }

  const price = Number(value);
  const normalizedUnit = unit?.trim() || "VND/m2";

  if (normalizedUnit.toLowerCase().includes("m") && price >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(price / 1_000_000)} triệu/m²`;
  }

  return `${formatDecimal(value)} ${normalizedUnit}`.trim();
}

function formatScale(value: { toString(): string } | null): string {
  if (!value) {
    return "Đang cập nhật";
  }

  const area = Number(value);

  if (area >= 10000) {
    return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(area / 10000)} ha`;
  }

  return `${formatDecimal(value)} m²`;
}

function statusLabel(status: string): string {
  if (status === "selling") {
    return "Đang mở bán";
  }

  if (status === "upcoming") {
    return "Sắp mở bán";
  }

  if (status === "handed_over") {
    return "Đã bàn giao";
  }

  return "Đang cập nhật";
}

function formatListingPrice(listing: Pick<Listing, "price" | "priceUnit">): string {
  if (!listing.price) {
    return "Liên hệ";
  }

  const price = Number(listing.price);
  const unit = listing.priceUnit?.trim();

  if (!unit || unit.toLowerCase() === "vnd") {
    if (price >= 1_000_000_000) {
      return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(price / 1_000_000_000)} tỷ`;
    }

    if (price >= 1_000_000) {
      return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(price / 1_000_000)} triệu`;
    }
  }

  return `${formatDecimal(listing.price)} ${unit ?? ""}`.trim();
}

function formatPublishedDate(value: Date | null): string {
  if (!value) {
    return "Đã đăng";
  }

  const diffDays = Math.floor((Date.now() - value.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) {
    return "Đăng hôm nay";
  }

  return `Đăng ${diffDays} ngày trước`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findFirst({
    where: {
      slug,
      publishedAt: {
        not: null,
      },
    },
    include: {
      province: { select: { fullName: true } },
      district: { select: { fullName: true } },
      media: {
        where: {
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
    },
  });

  if (!project) {
    return {
      title: "Dự án không tồn tại | Anshome",
    };
  }

  const location = [project.district?.fullName, project.province?.fullName].filter(Boolean).join(", ");

  return {
    title: `${project.name} | Anshome`,
    description: project.description ?? `${project.name}${location ? ` tại ${location}` : ""}.`,
    openGraph: {
      title: project.name,
      description: project.description ?? undefined,
      type: "website",
      images: project.media[0]?.media.publicUrl ? [project.media[0].media.publicUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await db.project.findFirst({
    where: {
      slug,
      publishedAt: {
        not: null,
      },
    },
    include: {
      category: true,
      developer: true,
      province: true,
      district: true,
      ward: true,
      street: true,
      media: {
        where: {
          media: {
            status: "approved",
          },
        },
        orderBy: [{ sortOrder: "asc" }],
        include: {
          media: true,
        },
      },
      listings: {
        where: {
          status: "published",
        },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
        include: {
          category: {
            select: {
              name: true,
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
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const location =
    [project.street?.fullName, project.ward?.fullName, project.district?.fullName, project.province?.fullName]
      .filter(Boolean)
      .join(", ") ||
    project.addressText ||
    "Đang cập nhật";
  const images = project.media.filter((item) => item.type === "image");
  const heroImage = images[0];
  const thumbImages = images.slice(1, 5);
  const currentStatus = statusLabel(project.status);
  const currentPrice = formatPrice(project.priceMin, project.priceUnit);
  const currentScale = formatScale(project.landArea);
  const developerName = project.developer?.name ?? "Đang cập nhật";
  const navItems = [
    { label: "Bán & Cho thuê", description: "Danh sách tin rao", href: "#tin-rao" },
    { label: "Tổng quan", description: "Giới thiệu về dự án", href: "#tong-quan", active: true },
    { label: "Mặt bằng dự án", description: "Tổng thể hạ tầng", href: "#mat-bang" },
    { label: "Vị trí", description: "Bản đồ dự án", href: "#vi-tri" },
    { label: "Ước tính khoản vay", description: "Hỗ trợ tính lãi suất", href: "#vay-mua" },
    { label: "Xem thêm", description: "Câu hỏi thường gặp, Dự án liên quan", href: "#faq", more: true },
  ];

  return (
    <main className="min-h-screen bg-white pt-[var(--header-height)] text-[#1f2430]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1200px] px-6 py-6">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-[#6c7280]">
          <Link href="/" className="hover:text-[#c7352d]">Anshome</Link>
          <span>/</span>
          <Link href="/du-an" className="hover:text-[#c7352d]">Dự án</Link>
          <span>/</span>
          <span className="text-[#1f2430]">{project.name}</span>
        </nav>

        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[32px] font-extrabold leading-tight text-[#2b2c33]">{project.name}</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-[#555965]">
              {location} <a href="#vi-tri" className="font-extrabold text-[#c7352d]">Xem bản đồ</a>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#384052]">
            <button type="button" className="rounded-md border border-[#d7dbe3] px-3 py-2 hover:border-[#c7352d] hover:text-[#c7352d]">
              Chia sẻ
            </button>
            <button type="button" className="rounded-md border border-[#d7dbe3] px-3 py-2 hover:border-[#c7352d] hover:text-[#c7352d]">
              Lưu
            </button>
          </div>
        </div>

        <section className="grid overflow-hidden rounded-md bg-[#f0f2f5] md:grid-cols-[1.55fr_1fr]">
          <div className="min-w-0">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage.media.publicUrl} alt={project.name} className="h-full min-h-[360px] w-full object-cover" />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center text-sm font-extrabold text-[#6c7280]">
                Chưa có ảnh dự án
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1 p-1">
            {(thumbImages.length > 0 ? thumbImages : images.slice(0, 4)).map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={item.id} src={item.media.publicUrl} alt={project.name} className="h-full min-h-[178px] w-full object-cover" />
            ))}
            {images.length === 0 ? (
              <div className="col-span-2 flex min-h-[360px] items-center justify-center text-sm font-extrabold text-[#6c7280]">
                Chưa có thư viện ảnh
              </div>
            ) : null}
          </div>
        </section>

        <nav className="sticky top-[var(--header-height)] z-20 mt-5 overflow-x-auto border-y border-[#e3e3e3] bg-[#fdfdfd] shadow-[0_10px_24px_rgba(20,28,45,0.025)]">
          <div className="flex h-[52px] min-w-[760px] items-stretch justify-between gap-4 px-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative flex shrink-0 flex-col justify-center pr-3 ${
                item.active ? "text-[#2b2c33]" : "text-[#91939a] hover:text-[#2b2c33]"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[13px] font-extrabold leading-none tracking-normal xl:text-[15px]">
                {item.label}
                {item.more ? <ChevronSmallIcon /> : null}
              </span>
              <span className={`mt-1.5 max-w-[150px] truncate text-[9px] font-extrabold leading-none xl:text-[10px] ${item.active ? "text-[#2b2c33]" : "text-[#9a9ca3]"}`}>
                {item.description}
              </span>
              <span
                className={`absolute bottom-[-1px] left-0 h-[2px] rounded-full bg-[#df3029] transition-all ${
                  item.active ? "w-[72px]" : "w-0 group-hover:w-[42px]"
                }`}
                aria-hidden
              />
            </a>
          ))}
          </div>
        </nav>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <section id="tong-quan" className="rounded-md border border-[#e5e8ef] bg-white p-5">
              <h2 className="text-2xl font-extrabold">Tổng quan {project.name}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SummaryItem label="Diện tích" value={currentScale} />
                <SummaryItem label="Chủ đầu tư" value={developerName} />
                <SummaryItem label="Loại hình" value={project.category?.name ?? "Dự án"} />
                <SummaryItem label="Pháp lý" value={project.legalStatus ?? "Đang cập nhật"} />
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#384052]">
                {project.description ?? "Thông tin dự án đang được cập nhật."}
              </p>
            </section>

            <section id="tin-rao" className="mt-5 rounded-md border border-[#e5e8ef] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-extrabold">Tin mua bán tại {project.name}</h2>
                <Link href="/tin-dang" className="text-sm font-extrabold text-[#c7352d]">Xem tất cả</Link>
              </div>
              {project.listings.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {project.listings.map((listing) => (
                    <ProjectListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-md bg-[#f7f8fa] p-4 text-sm font-bold text-[#5f6675]">
                  Chưa có tin rao liên kết trực tiếp với dự án này.
                </div>
              )}
            </section>

            <section id="mat-bang" className="mt-5 rounded-md border border-[#e5e8ef] bg-white p-5">
              <h2 className="text-2xl font-extrabold">Mặt bằng dự án</h2>
              <div className="mt-4 overflow-hidden rounded-md bg-[#f0f2f5]">
                {images[1] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[1].media.publicUrl} alt={`Mặt bằng ${project.name}`} className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center text-sm font-extrabold text-[#6c7280]">
                    Đang cập nhật mặt bằng
                  </div>
                )}
              </div>
            </section>

            <section id="vi-tri" className="mt-5 rounded-md border border-[#e5e8ef] bg-white p-5">
              <h2 className="text-2xl font-extrabold">Vị trí dự án {project.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f6675]">{location}</p>
              <div className="mt-4 grid min-h-[260px] place-items-center rounded-md border border-[#dde1e7] bg-[#eef1f4] text-center text-sm font-extrabold text-[#6c7280]">
                Bản đồ dự án
              </div>
            </section>

            <section id="vay-mua" className="mt-5 rounded-md border border-[#e5e8ef] bg-white p-5">
              <h2 className="text-2xl font-extrabold">Ước tính khoản vay mua {project.name}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <LoanBox label="Giá trị tham khảo" value={currentPrice} />
                <LoanBox label="Tỉ lệ vay" value="40%" />
                <LoanBox label="Thời hạn vay" value="20 năm" />
              </div>
            </section>

            <section id="faq" className="mt-5 rounded-md border border-[#e5e8ef] bg-white p-5">
              <h2 className="text-2xl font-extrabold">Câu hỏi thường gặp</h2>
              <div className="mt-4 grid gap-3">
                <FaqItem question={`Vị trí dự án ${project.name}?`} answer={location} />
                <FaqItem question={`Quy mô dự án ${project.name}?`} answer={currentScale} />
                <FaqItem question={`Trạng thái dự án ${project.name}?`} answer={currentStatus} />
              </div>
            </section>
          </article>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-[#e5e8ef] bg-white p-4">
              <h2 className="text-lg font-extrabold">Thông tin chi tiết</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <Detail label="Diện tích" value={currentScale} />
                <Detail label="Chủ đầu tư" value={developerName} />
                <Detail label="Loại hình" value={project.category?.name ?? "Đang cập nhật"} />
                <Detail label="Trạng thái" value={currentStatus} />
                <Detail label="Địa chỉ" value={location} />
              </dl>
            </section>

            <section className="rounded-md border border-[#e5e8ef] bg-white p-4">
              <h2 className="text-lg font-extrabold">Liên hệ tư vấn miễn phí</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f6675]">Nhận thông tin mới nhất về dự án và các tin rao liên quan.</p>
              <form className="mt-4 grid gap-3">
                <input className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]" placeholder="Họ và tên" />
                <input className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]" placeholder="Số điện thoại" />
                <button type="button" className="rounded-md bg-[#c7352d] px-4 py-3 text-sm font-extrabold text-white">
                  Gửi thông tin
                </button>
              </form>
            </section>

            <section className="rounded-md border border-[#e5e8ef] bg-white p-4">
              <h2 className="text-lg font-extrabold">Tiện ích</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#384052]">
                {["Công viên", "Bãi đỗ xe", "Hồ bơi", "Trường học", "Siêu thị", "An ninh"].map((item) => (
                  <span key={item} className="rounded-full bg-[#f5f6f8] px-3 py-1.5">{item}</span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f7f8fa] p-4">
      <p className="text-xs font-bold uppercase text-[#6c7280]">{label}</p>
      <p className="mt-1 text-base font-extrabold text-[#1f2430]">{value}</p>
    </div>
  );
}

function LoanBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dde1e7] p-4">
      <p className="text-xs font-bold uppercase text-[#6c7280]">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-[#1f2430]">{value}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="rounded-md border border-[#dde1e7] p-4" open>
      <summary className="cursor-pointer text-sm font-extrabold text-[#1f2430]">{question}</summary>
      <p className="mt-3 text-sm leading-6 text-[#5f6675]">{answer}</p>
    </details>
  );
}

function ProjectListingCard({ listing }: { listing: RelatedListing }) {
  const cover = listing.media.find((item) => item.type === "image") ?? listing.media[0];
  const location = [listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || listing.addressText || "Đang cập nhật";
  const area = formatDecimal(listing.area);

  return (
    <article className="grid overflow-hidden rounded-md border border-[#e5e8ef] bg-white transition hover:border-[#c7352d] md:grid-cols-[180px_1fr]">
      <Link href={`/tin-dang/${listing.publicId}`} className="block bg-[#f0f2f5]">
        {cover?.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.media.publicUrl} alt={cover.caption ?? listing.title} className="h-full min-h-[140px] w-full object-cover" />
        ) : (
          <span className="flex h-full min-h-[140px] items-center justify-center text-xs font-extrabold text-[#6c7280]">Chưa có ảnh</span>
        )}
      </Link>
      <div className="min-w-0 p-4">
        <p className="text-xs font-bold uppercase text-[#c7352d]">{listing.category.name}</p>
        <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-snug text-[#1f2430]">
          <Link href={`/tin-dang/${listing.publicId}`} className="hover:text-[#c7352d]">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-base font-extrabold text-[#df3029]">
          <span>{formatListingPrice(listing)}</span>
          {area ? (
            <>
              <span className="text-[#a3a7af]">·</span>
              <span>{area} m²</span>
            </>
          ) : null}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#555965]">{location}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#8a9099]">
          <span>{formatPublishedDate(listing.publishedAt)}</span>
          <span className="font-mono">{listing.publicId}</span>
        </div>
      </div>
    </article>
  );
}

function ChevronSmallIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 18 18" fill="none" className="mt-0.5 text-current">
      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-[#6c7280]">{label}</dt>
      <dd className="mt-1 font-bold text-[#1f2430]">{value}</dd>
    </div>
  );
}
