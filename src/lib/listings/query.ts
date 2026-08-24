import type { Prisma, TransactionType } from "@/generated/prisma/client";
import { buildLandingWhere, type SeoLandingContext } from "@/lib/seo/landing";

export const LISTINGS_PER_PAGE = 24;
export const MAX_LISTINGS_PER_PAGE = 48;

export type ListingFilterParams = {
  q?: string;
  transactionType?: string;
  categoryId?: string;
  provinceId?: string;
  districtId?: string;
  price?: string;
  area?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  verified?: string;
  agent?: string;
  bedrooms?: string;
  direction?: string;
  bathrooms?: string;
  balconyDirection?: string;
  projectId?: string;
  sort?: string;
  page?: string;
};

export type ListingSortKey =
  | "default"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "price_per_sqm_asc"
  | "price_per_sqm_desc"
  | "area_asc"
  | "area_desc"
  | "verified";

export const listingSortOptions: Array<{ key: ListingSortKey; label: string }> = [
  { key: "default", label: "Mặc định" },
  { key: "verified", label: "Tin xác thực xếp trước" },
  { key: "newest", label: "Tin mới nhất" },
  { key: "price_asc", label: "Giá thấp đến cao" },
  { key: "price_desc", label: "Giá cao đến thấp" },
  { key: "price_per_sqm_asc", label: "Giá trên m² thấp đến cao" },
  { key: "price_per_sqm_desc", label: "Giá trên m² cao đến thấp" },
  { key: "area_asc", label: "Diện tích bé đến lớn" },
  { key: "area_desc", label: "Diện tích lớn đến bé" },
];

export function resolveListingSort(sort?: string): ListingSortKey {
  if (sort && listingSortOptions.some((option) => option.key === sort)) {
    return sort as ListingSortKey;
  }

  return "default";
}

export function resolveListingPage(page?: string): number {
  const parsed = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

export function buildListingWhere(
  params: ListingFilterParams,
  context: SeoLandingContext | null,
): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: "published",
    ...(context ? buildLandingWhere(context) : {}),
  };

  if (!context && (params.transactionType === "sale" || params.transactionType === "rent")) {
    where.transactionType = params.transactionType;
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.provinceId) {
    where.provinceId = params.provinceId;
  }

  if (params.districtId) {
    where.districtId = params.districtId;
  }

  if (params.projectId) {
    where.projectId = params.projectId;
  }

  if (params.verified === "true" || params.verified === "on") {
    where.isVerified = true;
  }

  const attributesIs: Prisma.ListingAttributeWhereInput = {};

  if (params.bathrooms && /^\d+$/.test(params.bathrooms)) {
    const bathrooms = Number.parseInt(params.bathrooms, 10);
    if (bathrooms >= 5) {
      attributesIs.bathrooms = { gte: 5 };
    } else {
      attributesIs.bathrooms = { equals: bathrooms };
    }
  }

  if (params.balconyDirection && listingDirections.includes(params.balconyDirection)) {
    attributesIs.balconyDirection = params.balconyDirection;
  }

  if (params.bedrooms && /^\d+$/.test(params.bedrooms)) {
    const bedrooms = Number.parseInt(params.bedrooms, 10);
    if (bedrooms >= 5) {
      attributesIs.bedrooms = { gte: 5 };
    } else {
      attributesIs.bedrooms = { equals: bedrooms };
    }
  }

  if (params.direction && listingDirections.includes(params.direction)) {
    attributesIs.direction = params.direction;
  }

  if (Object.keys(attributesIs).length > 0) {
    where.attributes = { is: attributesIs };
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
      { addressText: { contains: params.q } },
    ];
  }

  const priceRange = decimalRange(params.minPrice, params.maxPrice);
  if (priceRange) {
    where.price = priceRange;
  }

  const areaRange = decimalRange(params.minArea, params.maxArea);
  if (areaRange) {
    where.area = areaRange;
  }

  const agentWhere: Prisma.ListingWhereInput | null =
    params.agent === "true"
      ? {
          OR: [
            { agencyId: { not: null } },
            { owner: { roles: { some: { role: { code: "agent" } } } } },
          ],
        }
      : null;

  if (agentWhere) {
    if (where.AND) {
      (where.AND as Prisma.ListingWhereInput[]).push(agentWhere);
    } else {
      where.AND = [agentWhere];
    }
  }

  return where;
}

export function buildListingOrderBy(sort?: string): Prisma.ListingOrderByWithRelationInput[] {
  switch (resolveListingSort(sort)) {
    case "price_asc":
      return [{ price: "asc" }, { publishedAt: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { publishedAt: "desc" }];
    case "price_per_sqm_asc":
      return [{ pricePerSqm: "asc" }, { publishedAt: "desc" }];
    case "price_per_sqm_desc":
      return [{ pricePerSqm: "desc" }, { publishedAt: "desc" }];
    case "area_asc":
      return [{ area: "asc" }, { publishedAt: "desc" }];
    case "area_desc":
      return [{ area: "desc" }, { publishedAt: "desc" }];
    case "verified":
      return [{ isVerified: "desc" }, { publishedAt: "desc" }];
    case "default":
    case "newest":
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

export function buildListingPagination(page: number, pageSize = LISTINGS_PER_PAGE) {
  return {
    skip: (page - 1) * pageSize,
    take: Math.max(1, Math.min(pageSize, MAX_LISTINGS_PER_PAGE)),
  };
}

export function resolveTotalPages(total: number, pageSize = LISTINGS_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export const listingDirections = ["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"];

export const pricePresets: Record<TransactionType, Array<{ label: string; min?: string; max?: string }>> = {
  sale: [
    { label: "Tất cả mức giá" },
    { label: "Dưới 500 triệu", max: "500000000" },
    { label: "500 - 800 triệu", min: "500000000", max: "800000000" },
    { label: "800 triệu - 1 tỷ", min: "800000000", max: "1000000000" },
    { label: "1 - 2 tỷ", min: "1000000000", max: "2000000000" },
    { label: "2 - 3 tỷ", min: "2000000000", max: "3000000000" },
    { label: "3 - 5 tỷ", min: "3000000000", max: "5000000000" },
    { label: "5 - 7 tỷ", min: "5000000000", max: "7000000000" },
    { label: "7 - 10 tỷ", min: "7000000000", max: "10000000000" },
    { label: "10 - 20 tỷ", min: "10000000000", max: "20000000000" },
    { label: "20 - 30 tỷ", min: "20000000000", max: "30000000000" },
    { label: "30 - 40 tỷ", min: "30000000000", max: "40000000000" },
    { label: "40 - 60 tỷ", min: "40000000000", max: "60000000000" },
    { label: "Trên 60 tỷ", min: "60000000000" },
    { label: "Thỏa thuận", min: "1", max: "1" },
  ],
  rent: [
    { label: "Tất cả mức giá" },
    { label: "Dưới 5 triệu", max: "5000000" },
    { label: "5 - 10 triệu", min: "5000000", max: "10000000" },
    { label: "10 - 20 triệu", min: "10000000", max: "20000000" },
    { label: "20 - 50 triệu", min: "20000000", max: "50000000" },
    { label: "50 - 100 triệu", min: "50000000", max: "100000000" },
    { label: "Trên 100 triệu", min: "100000000" },
  ],
};

export const areaPresets: Array<{ label: string; min?: string; max?: string }> = [
  { label: "Tất cả diện tích" },
  { label: "Dưới 30 m²", max: "30" },
  { label: "30 - 50 m²", min: "30", max: "50" },
  { label: "50 - 80 m²", min: "50", max: "80" },
  { label: "80 - 100 m²", min: "80", max: "100" },
  { label: "100 - 150 m²", min: "100", max: "150" },
  { label: "150 - 200 m²", min: "150", max: "200" },
  { label: "200 - 250 m²", min: "200", max: "250" },
  { label: "250 - 300 m²", min: "250", max: "300" },
  { label: "300 - 500 m²", min: "300", max: "500" },
];

function decimalRange(min?: string, max?: string): Prisma.DecimalNullableFilter | undefined {
  const range: Prisma.DecimalNullableFilter = {};
  if (min && /^\d+(\.\d+)?$/.test(min)) {
    range.gte = min;
  }
  if (max && /^\d+(\.\d+)?$/.test(max)) {
    range.lte = max;
  }

  return Object.keys(range).length > 0 ? range : undefined;
}
