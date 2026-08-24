import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ListingCard, listingCardInclude } from "@/components/public-listings/landing-listing-card";
import { DirectoryContactForm } from "@/components/directory/directory-contact-form";
import { createBrokerLead } from "@/app/danh-ba/directory-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await db.user.findFirst({
    where: { profile: { publicSlug: slug }, status: "active" },
    select: { profile: { select: { displayName: true, bio: true } } },
  });

  if (!user?.profile) {
    return { title: "Nhà môi giới | Anshome" };
  }

  return {
    title: `${user.profile.displayName} | Nhà môi giới | Anshome`,
    description: user.profile.bio ?? undefined,
  };
}

export default async function BrokerProfilePage({ params }: Props) {
  const { slug } = await params;
  const user = await db.user.findFirst({
    where: { profile: { publicSlug: slug }, status: "active" },
    include: {
      profile: {
        include: {
          avatarMedia: { select: { publicUrl: true } },
        },
      },
      listings: {
        where: { status: "published" },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        take: 12,
        include: listingCardInclude,
      },
    },
  });

  if (!user?.profile) {
    notFound();
  }

  const profile = user.profile;
  const displayName = profile.displayName;
  const initial = displayName.trim().charAt(0).toUpperCase() || "M";
  const verified = profile.verificationStatus === "verified";
  const listings = user.listings;

  return (
    <main className="stage-root bg-[#f5f6f8] text-[#1f2430]">
      <SiteHeader />
      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#8a8f99]">
          <Link href="/" className="hover:text-brand">Trang chủ</Link>
          <span>/</span>
          <Link href="/danh-ba" className="hover:text-brand">Danh bạ</Link>
          <span>/</span>
          <Link href="/danh-ba/nha-moi-gioi" className="hover:text-brand">Nhà môi giới</Link>
          <span>/</span>
          <span className="text-[#303743]">{displayName}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-md border border-[#e1e4ea] bg-white p-5">
            <div className="flex flex-col items-center gap-2 text-center">
              {profile.avatarMedia?.publicUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarMedia.publicUrl}
                  alt={displayName}
                  className="h-24 w-24 rounded-full border border-[#eef0f3] object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid h-24 w-24 place-items-center rounded-full bg-brand-soft text-[28px] font-extrabold text-brand">
                  {initial}
                </span>
              )}
              <h1 className="text-[22px] font-extrabold leading-7 text-[#20242d]">{displayName}</h1>
              {verified ? (
                <span className="rounded bg-[#e8f6ee] px-2 py-1 text-[11px] font-extrabold text-[#0d7a3f]">Đã xác thực</span>
              ) : (
                <span className="rounded bg-[#f0f2f5] px-2 py-1 text-[11px] font-extrabold text-[#8a8f99]">Chưa xác thực</span>
              )}
            </div>

            <div className="mt-4 grid gap-2 border-t border-[#eef0f3] pt-4 text-[13px]">
              <p className="font-bold text-[#303743]">
                <span className="text-[#8a8f99]">Chứng chỉ: </span>
                {profile.licenseNumber ?? "Chưa cập nhật"}
              </p>
              {profile.companyName ? (
                <p className="font-bold text-[#303743]">
                  <span className="text-[#8a8f99]">Công ty: </span>
                  {profile.companyName}
                </p>
              ) : null}
              {user.phone ? (
                <p className="font-bold text-[#303743]">
                  <span className="text-[#8a8f99]">Điện thoại: </span>
                  {user.phone}
                </p>
              ) : null}
              {user.email ? (
                <p className="break-all font-bold text-[#303743]">
                  <span className="text-[#8a8f99]">Email: </span>
                  {user.email}
                </p>
              ) : null}
            </div>

            {profile.bio ? (
              <p className="mt-3 border-t border-[#eef0f3] pt-3 text-[13px] font-medium leading-5 text-[#5f6675]">
                {profile.bio}
              </p>
            ) : null}

            <div className="mt-4 border-t border-[#eef0f3] pt-4">
              <h2 className="text-[15px] font-extrabold text-[#20242d]">Gửi yêu cầu tư vấn</h2>
              <DirectoryContactForm action={createBrokerLead.bind(null, user.id)} />
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