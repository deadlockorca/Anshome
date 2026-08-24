import type { Metadata } from "next";
import { ListingIndex, buildListingIndexMetadata } from "@/components/public-listings/listing-index";
import { saleRootSlug } from "@/lib/seo/landing";
import type { ListingFilterParams } from "@/lib/listings/query";

export const dynamic = "force-dynamic";

const context = {
  slug: saleRootSlug,
  transactionType: "sale" as const,
  category: null,
  location: null,
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ListingFilterParams>;
}): Promise<Metadata> {
  return buildListingIndexMetadata(context, await searchParams);
}

export default async function SaleListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingFilterParams>;
}) {
  return <ListingIndex context={context} searchParams={await searchParams} />;
}
