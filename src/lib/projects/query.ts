import type { Prisma } from "@/generated/prisma/client";
import type { ProjectSeoContext } from "@/lib/seo/landing";

export type ProjectFilterParams = {
  q?: string;
  categoryId?: string;
  provinceId?: string;
  status?: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export type ProjectSortKey = "newest" | "updated" | "price_desc" | "price_asc";

export const projectSortOptions: Array<{ key: ProjectSortKey; label: string }> = [
  { key: "newest", label: "Mới nhất" },
  { key: "updated", label: "Mới cập nhật" },
  { key: "price_desc", label: "Giá cao nhất" },
  { key: "price_asc", label: "Giá thấp nhất" },
];

export function resolveProjectSort(sort?: string): ProjectSortKey {
  if (sort && projectSortOptions.some((option) => option.key === sort)) return sort as ProjectSortKey;
  return "newest";
}

export function resolveProjectPage(page?: string): number {
  const parsed = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

export const PROJECTS_PER_PAGE = 12;

export const projectPricePresets: Array<{ label: string; min?: string; max?: string }> = [
  { label: "Tất cả khoảng giá" },
  { label: "Dưới 5 triệu/m²", max: "5000000" },
  { label: "5 - 10 triệu/m²", min: "5000000", max: "10000000" },
  { label: "10 - 20 triệu/m²", min: "10000000", max: "20000000" },
  { label: "20 - 35 triệu/m²", min: "20000000", max: "35000000" },
  { label: "35 - 50 triệu/m²", min: "35000000", max: "50000000" },
  { label: "50 - 80 triệu/m²", min: "50000000", max: "80000000" },
  { label: "Trên 80 triệu/m²", min: "80000000" },
];

export const projectStatusOptions = [
  { value: "upcoming", label: "Sắp mở bán" },
  { value: "selling", label: "Đang mở bán" },
  { value: "handed_over", label: "Đã bàn giao" },
];

export function buildProjectWhere(params: ProjectFilterParams, context: ProjectSeoContext | null): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {
    publishedAt: { not: null },
    ...(context?.category ? { categoryId: context.category.id } : {}),
  };

  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.provinceId) where.provinceId = params.provinceId;
  if (params.status && projectStatusOptions.some((o) => o.value === params.status)) where.status = params.status as Prisma.ProjectWhereInput["status"];

  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { description: { contains: params.q } },
      { addressText: { contains: params.q } },
      { developer: { name: { contains: params.q } } },
      { province: { fullName: { contains: params.q } } },
      { district: { fullName: { contains: params.q } } },
    ];
  }

  const priceRange = decimalRange(params.minPrice, params.maxPrice);
  if (priceRange) {
    where.AND = [{ priceMin: priceRange }];
  }

  return where;
}

function decimalRange(min?: string, max?: string): Prisma.DecimalNullableFilter | undefined {
  const range: Prisma.DecimalNullableFilter = {};
  if (min && /^\d+(\.\d+)?$/.test(min)) range.gte = min;
  if (max && /^\d+(\.\d+)?$/.test(max)) range.lte = max;
  return Object.keys(range).length > 0 ? range : undefined;
}

export function buildProjectOrderBy(sort?: string): Prisma.ProjectOrderByWithRelationInput[] {
  switch (resolveProjectSort(sort)) {
    case "updated":
      return [{ updatedAt: "desc" }];
    case "price_desc":
      return [{ priceMin: "desc" }, { publishedAt: "desc" }];
    case "price_asc":
      return [{ priceMin: "asc" }, { publishedAt: "desc" }];
    case "newest":
    default:
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

export function buildProjectPagination(page: number, pageSize = PROJECTS_PER_PAGE) {
  const safePage = Math.max(1, page);
  return { skip: (safePage - 1) * pageSize, take: pageSize };
}

export function resolveTotalProjectPages(total: number, pageSize = PROJECTS_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
