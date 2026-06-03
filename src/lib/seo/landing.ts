import { db } from "@/lib/db";
import type { Category, Location, Prisma, TransactionType } from "@/generated/prisma/client";

export type SeoLandingContext = {
  slug: string;
  transactionType: TransactionType;
  category: Pick<Category, "id" | "name" | "slug" | "transactionType"> | null;
  location: Pick<Location, "id" | "name" | "slug" | "fullName" | "type"> | null;
};

type TaxonomyCategory = Pick<Category, "id" | "name" | "slug" | "transactionType" | "sortOrder">;
type TaxonomyLocation = Pick<Location, "id" | "name" | "slug" | "fullName" | "type">;

export const saleRootSlug = "nha-dat-ban";
export const rentRootSlug = "nha-dat-cho-thue";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function getRootSlug(transactionType: TransactionType): string {
  return transactionType === "sale" ? saleRootSlug : rentRootSlug;
}

export function buildSeoLandingPath(input: {
  transactionType?: TransactionType;
  category?: Pick<Category, "slug" | "transactionType"> | null;
  location?: Pick<Location, "slug"> | null;
}): string {
  const baseSlug = input.category?.slug ?? getRootSlug(input.transactionType ?? "sale");
  const slug = input.location ? `${baseSlug}-${input.location.slug}` : baseSlug;
  return `/${slug}`;
}

export async function resolveSeoLanding(slug: string): Promise<SeoLandingContext | null> {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug || normalizedSlug.includes("/")) {
    return null;
  }

  const [categories, locations] = await Promise.all([getLandingCategories(), getLandingLocations()]);
  const directRoot = resolveRootLanding(normalizedSlug);

  if (directRoot) {
    return directRoot;
  }

  const rootWithLocation = resolveRootLocationLanding(normalizedSlug, locations);

  if (rootWithLocation) {
    return rootWithLocation;
  }

  const directCategory = categories.find((category) => category.slug === normalizedSlug);

  if (directCategory && (directCategory.transactionType === "sale" || directCategory.transactionType === "rent")) {
    return {
      slug: directCategory.slug,
      transactionType: directCategory.transactionType,
      category: directCategory,
      location: null,
    };
  }

  return resolveCategoryLocationLanding(normalizedSlug, categories, locations);
}

export function buildLandingWhere(context: SeoLandingContext): Prisma.ListingWhereInput {
  return {
    status: "published",
    transactionType: context.transactionType,
    ...(context.category ? { categoryId: context.category.id } : {}),
    ...(context.location?.type === "province" ? { provinceId: context.location.id } : {}),
    ...(context.location?.type === "district" ? { districtId: context.location.id } : {}),
    ...(context.location?.type === "ward" ? { wardId: context.location.id } : {}),
    ...(context.location?.type === "street" ? { streetId: context.location.id } : {}),
  };
}

export function getLandingTitle(context: SeoLandingContext): string {
  const subject = context.category?.name ?? (context.transactionType === "sale" ? "Nhà đất bán" : "Nhà đất cho thuê");
  return context.location ? `${subject} tại ${context.location.fullName}` : subject;
}

export function getLandingDescription(context: SeoLandingContext): string {
  const title = getLandingTitle(context);
  return `${title}: cập nhật tin đăng mới nhất, thông tin giá, diện tích, vị trí, pháp lý và liên hệ trực tiếp trên Anshome.`;
}

export async function getInternalSeoLinks() {
  const [categories, provinces] = await Promise.all([getLandingCategories(), getLandingProvinces()]);
  const listingCategories = categories.filter((category) => category.transactionType !== "both");

  return {
    roots: [
      { label: "Nhà đất bán", href: `/${saleRootSlug}` },
      { label: "Nhà đất cho thuê", href: `/${rentRootSlug}` },
    ],
    categories: listingCategories.map((category) => ({
      label: category.name,
      href: buildSeoLandingPath({ category }),
    })),
    categoryProvinces: listingCategories.flatMap((category) =>
      provinces.slice(0, 8).map((province) => ({
        label: `${category.name} ${province.name}`,
        href: buildSeoLandingPath({ category, location: province }),
      })),
    ),
  };
}

export async function getSitemapSeoEntries() {
  const [categories, provinces] = await Promise.all([getLandingCategories(), getLandingProvinces()]);
  const listingCategories = categories.filter((category) => category.transactionType !== "both");
  const now = new Date();

  return [
    { url: `${getSiteUrl()}/${saleRootSlug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${getSiteUrl()}/${rentRootSlug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    ...listingCategories.map((category) => ({
      url: `${getSiteUrl()}${buildSeoLandingPath({ category })}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...listingCategories.flatMap((category) =>
      provinces.map((province) => ({
        url: `${getSiteUrl()}${buildSeoLandingPath({ category, location: province })}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ),
  ];
}

async function getLandingCategories(): Promise<TaxonomyCategory[]> {
  return db.category.findMany({
    where: {
      isActive: true,
      transactionType: {
        in: ["sale", "rent"],
      },
    },
    orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      transactionType: true,
      sortOrder: true,
    },
  });
}

async function getLandingLocations(): Promise<TaxonomyLocation[]> {
  return db.location.findMany({
    where: {
      isActive: true,
      type: {
        in: ["province", "district", "ward", "street"],
      },
    },
    orderBy: [{ type: "asc" }, { fullName: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      fullName: true,
      type: true,
    },
  });
}

async function getLandingProvinces(): Promise<TaxonomyLocation[]> {
  return db.location.findMany({
    where: {
      isActive: true,
      type: "province",
    },
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      fullName: true,
      type: true,
    },
  });
}

function resolveRootLanding(slug: string): SeoLandingContext | null {
  if (slug === saleRootSlug) {
    return {
      slug,
      transactionType: "sale",
      category: null,
      location: null,
    };
  }

  if (slug === rentRootSlug) {
    return {
      slug,
      transactionType: "rent",
      category: null,
      location: null,
    };
  }

  return null;
}

function resolveRootLocationLanding(slug: string, locations: TaxonomyLocation[]): SeoLandingContext | null {
  for (const root of [
    { slug: saleRootSlug, transactionType: "sale" as TransactionType },
    { slug: rentRootSlug, transactionType: "rent" as TransactionType },
  ]) {
    const prefix = `${root.slug}-`;

    if (!slug.startsWith(prefix)) {
      continue;
    }

    const locationSlug = slug.slice(prefix.length);
    const location = locations.find((item) => item.slug === locationSlug);

    if (location) {
      return {
        slug,
        transactionType: root.transactionType,
        category: null,
        location,
      };
    }
  }

  return null;
}

function resolveCategoryLocationLanding(slug: string, categories: TaxonomyCategory[], locations: TaxonomyLocation[]): SeoLandingContext | null {
  const sortedCategories = [...categories]
    .filter((category) => category.transactionType !== "both")
    .sort((a, b) => b.slug.length - a.slug.length);

  for (const category of sortedCategories) {
    if (category.transactionType !== "sale" && category.transactionType !== "rent") {
      continue;
    }

    const prefix = `${category.slug}-`;

    if (!slug.startsWith(prefix)) {
      continue;
    }

    const locationSlug = slug.slice(prefix.length);
    const location = locations.find((item) => item.slug === locationSlug);

    if (location) {
      return {
        slug,
        transactionType: category.transactionType,
        category,
        location,
      };
    }
  }

  return null;
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
}
