import type { RoleCode } from "@/generated/prisma/client";

export const adminRoleCodes: RoleCode[] = ["moderator", "editor", "ops", "super_admin"];
export const listingPosterRoleCodes: RoleCode[] = ["owner", "agent", "agency_admin", "developer", "ops", "super_admin"];
export const listingModeratorRoleCodes: RoleCode[] = ["moderator", "ops", "super_admin"];
