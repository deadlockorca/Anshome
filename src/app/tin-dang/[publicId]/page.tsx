import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { LeadForm } from "@/components/public-listings/lead-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ lead?: string }>;
};

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
  const description = `${listing.category.name}${location ? ` tại ${location}` : ""}. Giá ${listing.price ? listing.price.toString() : "liên hệ"}, diện tích ${listing.area ? listing.area.toString() : "chưa cập nhật"} m2.`;

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

export default async function PublicListingDetailPage({ params, searchParams }: Props) {
  const [{ publicId }, query] = await Promise.all([params, searchParams]);
  const listing = await db.listing.findFirst({
    where: {
      publicId,
      status: "published",
    },
    include: {
      attributes: true,
      category: true,
      owner: {
        include: {
          profile: {
            select: {
              displayName: true,
              verificationStatus: true,
              companyName: true,
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
    },
  });

  if (!listing) {
    notFound();
  }

  const ownerName = listing.owner.profile?.displayName ?? listing.owner.email ?? listing.owner.phone ?? "Người đăng tin";

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-6">
          <Link href="/" className="text-lg font-extrabold text-[#c7352d]">Anshome</Link>
          <nav className="flex items-center gap-4 text-sm font-bold text-[#384052]">
            <Link href="/tin-dang">Tin đăng</Link>
            <Link href="/dang-nhap">Đăng nhập</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1320px] gap-6 px-6 py-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <section className="mb-5 overflow-hidden rounded-md border border-[#dde1e7] bg-white shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
            {listing.media[0]?.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.media[0].media.publicUrl} alt={listing.media[0].caption ?? listing.title} className="aspect-[16/9] w-full bg-[#f0f2f5] object-cover" />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-[#eceff3] text-sm font-extrabold text-[#6c7280]">
                Chưa có ảnh tin đăng
              </div>
            )}
            {listing.media.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 p-2">
                {listing.media.slice(1, 5).map((item) => (
                  item.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={item.id} src={item.media.publicUrl} alt={item.caption ?? listing.title} className="aspect-[4/3] w-full rounded-md bg-[#f0f2f5] object-cover" />
                  ) : (
                    <a key={item.id} href={item.media.publicUrl} target="_blank" rel="noreferrer" className="flex aspect-[4/3] items-center justify-center rounded-md bg-[#f0f2f5] p-2 text-center text-xs font-bold text-[#384052]">
                      {item.type}
                    </a>
                  )
                ))}
              </div>
            ) : null}
          </section>

          <div className="rounded-md border border-[#dde1e7] bg-white p-5 shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
            <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">{listing.category.name}</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight">{listing.title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#5f6675]">{[listing.street?.fullName, listing.ward?.fullName, listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || listing.addressText || "Chưa cập nhật vị trí"}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Metric label="Giá" value={listing.price ? `${listing.price.toString()} ${listing.priceUnit ?? ""}` : "Liên hệ"} />
              <Metric label="Diện tích" value={listing.area ? `${listing.area.toString()} m2` : "-"} />
              <Metric label="Đơn giá" value={listing.pricePerSqm ? `${listing.pricePerSqm.toString()}/m2` : "-"} />
              <Metric label="Mã tin" value={listing.publicId} />
            </div>
          </div>

          <section className="mt-5 rounded-md border border-[#dde1e7] bg-white p-5">
            <h2 className="text-xl font-extrabold">Mô tả</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#384052]">{listing.description}</p>
          </section>

          <section className="mt-5 rounded-md border border-[#dde1e7] bg-white p-5">
            <h2 className="text-xl font-extrabold">Thông tin bất động sản</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <Detail label="Phòng ngủ" value={listing.attributes?.bedrooms ?? "-"} />
              <Detail label="Phòng tắm" value={listing.attributes?.bathrooms ?? "-"} />
              <Detail label="Số tầng" value={listing.attributes?.floors ?? "-"} />
              <Detail label="Hướng nhà" value={listing.attributes?.direction ?? "-"} />
              <Detail label="Mặt tiền" value={listing.attributes?.frontageWidth ? `${listing.attributes.frontageWidth.toString()} m` : "-"} />
              <Detail label="Đường vào" value={listing.attributes?.roadWidth ? `${listing.attributes.roadWidth.toString()} m` : "-"} />
              <Detail label="Pháp lý" value={listing.attributes?.legalStatus ?? "-"} />
              <Detail label="Nội thất" value={listing.attributes?.interiorStatus ?? "-"} />
              <Detail label="Diện tích sử dụng" value={listing.attributes?.usableArea ? `${listing.attributes.usableArea.toString()} m2` : "-"} />
            </dl>
          </section>
        </article>

        <aside className="grid content-start gap-4">
          <section className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Người đăng</p>
            <h2 className="mt-1 text-xl font-extrabold">{ownerName}</h2>
            <p className="mt-2 text-sm text-[#6c7280]">{listing.owner.profile?.companyName ?? "Tài khoản Anshome"}</p>
            <div className="mt-4 rounded-md bg-[#f5f6f8] p-3">
              <p className="text-xs font-bold uppercase text-[#6c7280]">Liên hệ trực tiếp</p>
              <p className="mt-1 text-lg font-extrabold text-[#1f2430]">{listing.contactPhone}</p>
              <p className="mt-1 text-sm text-[#5f6675]">{listing.contactName}</p>
            </div>
          </section>
          <LeadForm listingId={listing.id} leadSent={query.lead === "sent"} />
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f5f6f8] p-3">
      <p className="text-xs font-bold uppercase text-[#6c7280]">{label}</p>
      <p className="mt-1 truncate text-base font-extrabold text-[#1f2430]">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-[#6c7280]">{label}</dt>
      <dd className="mt-1 font-bold text-[#1f2430]">{value}</dd>
    </div>
  );
}
