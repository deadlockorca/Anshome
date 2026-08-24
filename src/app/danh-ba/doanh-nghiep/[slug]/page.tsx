import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ListingCard, listingCardInclude } from "@/components/public-listings/landing-listing-card";
import { DirectoryContactForm } from "@/components/directory/directory-contact-form";
import { createAgencyLead } from "@/app/danh-ba/directory-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const industries = [
  { key: "developer", label: "Chủ đầu tư" },
  { key: "construction", label: "Thi công xây dựng" },
  { key: "design", label: "Tư vấn thiết kế" },
  { key: "brokerage", label: "Sàn giao dịch bất động sản" },
  { key: "interior", label: "Trang trí nội thất" },
  { key: "material", label: "Vật liệu xây dựng" },
  { key: "finance", label: "Tài chính pháp lý" },
  { key: "other", label: "Các lĩnh vực khác" },
];

function industryLabel(industry: string | null): string {
  return industries.find((item) => item.key === industry)?.label ?? "Các lĩnh vực khác";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = await db.agency.findFirst({
    where: { slug, status: "active" },
    select: { name: true, description: true },
  });

  if (!agency) {
    return { title: "Doanh nghiệp | Anshome" };
  }

  return {
    title: `${agency.name} | Doanh nghiệp | Anshome`,
    description: agency.description ?? undefined,
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const { slug } = await params;
  const agency = await db.agency.findFirst({
    where: { slug, status: "active" },
    include: {
      logoMedia: { select: { publicUrl: true } },
      province: { select: { fullName: true } },
      district: { select: { fullName: true } },
      listings: {
        where: { status: "published" },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        take: 12,
        include: listingCardInclude,
      },
    },
  });

  if (!agency) {
    notFound();
  }

  const initial = agency.name.trim().charAt(0).toUpperCase() || "D";
  const verified = agency.verificationStatus === "verified";
  const listings = agency.listings;
  const address = agency.district?.fullName ?? agency.province?.fullName ?? agency.address ?? "Đang cập nhật";

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/danh-ba" className="hover:text-brand">Danh bạ</Link>
          <span>/</span>
          <Link href="/danh-ba/doanh-nghiep-bat-dong-san" className="hover:text-brand">Doanh nghiệp</Link>
          <span>/</span>
          <span className="text-[#303743]">{agency.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-md border border-[#e1e4ea] bg-white p-5">
            <div className="flex flex-col items-center gap-2 text-center">
              {agency.logoMedia?.publicUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={agency.logoMedia.publicUrl}
                  alt={agency.name}
                  className="h-24 w-24 rounded-full border border-[#eef0f3] object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid h-24 w-24 place-items-center rounded-full bg-brand-soft text-[28px] font-extrabold text-brand">
                  {initial}
                </span>
              )}
              <h1 className="text-[22px] font-extrabold leading-7 text-[#20242d]">{agency.name}</h1>
              <span className="rounded bg-[#eef1f6] px-2 py-1 text-[11px] font-extrabold text-[#303743]">{industryLabel(agency.industry)}</span>
              {verified ? (
                <span className="rounded bg-[#e8f6ee] px-2 py-1 text-[11px] font-extrabold text-[#0d7a3f]">Đã xác thực</span>
              ) : (
                <span className="rounded bg-[#f0f2f5] px-2 py-1 text-[11px] font-extrabold text-[#8a8f99]">Chưa xác thực</span>
              )}
            </div>

            <div className="mt-4 grid gap-2 border-t border-[#eef0f3] pt-4 text-[13px]">
              <p className="font-bold text-[#303743]">
                <span className="text-[#8a8f99]">Địa chỉ: </span>
                {address}
              </p>
              {agency.phone ? (
                <p className="font-bold text-[#303743]">
                  <span className="text-[#8a8f99]">Điện thoại: </span>
                  {agency.phone}
                </p>
              ) : null}
              {agency.email ? (
                <p className="break-all font-bold text-[#303743]">
                  <span className="text-[#8a8f99]">Email: </span>
                  {agency.email}
                </p>
              ) : null}
            </div>

            {agency.description ? (
              <p className="mt-3 border-t border-[#eef0f3] pt-3 text-[13px] font-medium leading-5 text-[#5f6675]">
                {agency.description}
              </p>
            ) : null}

            <div className="mt-4 border-t border-[#eef0f3] pt-4">
              <h2 className="text-[15px] font-extrabold text-[#20242d]">Gửi yêu cầu tư vấn</h2>
              <DirectoryContactForm action={createAgencyLead.bind(null, agency.id)} />
            </div>
          </aside>

          <div className="min-w-0">
            <h2 className="text-[17px] font-extrabold text-[#20242d]">Tin đang đăng ({listings.length})</h2>
            {listings.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} isFavorite={false} />
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-md border border-[#dde1e7] bg-white p-8 text-center text-sm font-bold text-[#6c7280]">
                Chưa có tin đăng nào.
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}