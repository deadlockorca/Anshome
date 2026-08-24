import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingIndex, buildListingIndexMetadata } from "@/components/public-listings/listing-index";
import { ProjectIndex, buildProjectIndexMetadata } from "@/components/public-listings/project-index";
import { resolveProjectLanding, resolveSeoLanding } from "@/lib/seo/landing";
import type { ListingFilterParams } from "@/lib/listings/query";
import type { ProjectFilterParams } from "@/lib/projects/query";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ seoSlug: string[] }>;
  searchParams: Promise<ListingFilterParams & ProjectFilterParams>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const listingContext = await resolveSeoLanding(slug);
  const projectContext = listingContext ? null : await resolveProjectLanding(slug);

  if (projectContext) {
    return buildProjectIndexMetadata(projectContext, await searchParams);
  }

  if (!listingContext) {
    return {
      title: "Không tìm thấy trang | Anshome",
    };
  }

  return buildListingIndexMetadata(listingContext, await searchParams);
}

export default async function SeoLandingPage({ params, searchParams }: Props) {
  const { seoSlug } = await params;
  const slug = seoSlug.join("/");
  const listingContext = await resolveSeoLanding(slug);
  const projectContext = listingContext ? null : await resolveProjectLanding(slug);

  if (projectContext) {
    return <ProjectIndex context={projectContext} searchParams={await searchParams} />;
  }

  if (!listingContext) {
    notFound();
  }

  return <ListingIndex context={listingContext} searchParams={await searchParams} />;
}
