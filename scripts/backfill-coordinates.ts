import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

// Backfills latitude/longitude for Location (province/district) and Project rows.
// Source of the division list: https://provinces.open-api.vn/ (same API as seed-locations.ts).
// The public API version no longer ships coordinates, so coordinates are derived from the
// dvhcvn GIS dataset (https://github.com/daohoangson/dvhcvn, updated 2025-03) which uses the
// same TCTK admin codes: district centroid = mean of polygon vertices; province = mean of districts.
// Idempotent: rows already carrying the canonical value are skipped.

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to backfill coordinates.");

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const PROVINCE_PREFIX_RE = /^(Tỉnh|Thành phố)\s+/i;
const DISTRICT_PREFIX_RE = /^(Quận|Huyện|Thị xã|Thành phố)\s+/i;

const PROVINCE_SLUG_OVERRIDES: Record<string, string> = {
  "Thành phố Hà Nội": "ha-noi",
  "Thành phố Hồ Chí Minh": "tp-ho-chi-minh",
  "Thành phố Đà Nẵng": "da-nang",
  "Thành phố Hải Phòng": "hai-phong",
  "Thành phố Cần Thơ": "can-tho",
  "Thành phố Huế": "thua-thien-hue",
};

type Coord = { lat: number; lng: number };
type ApiDistrict = { code: number; name: string };
type ApiProvince = { code: number; name: string; districts: ApiDistrict[] };
type DbLocation = {
  id: string;
  type: string;
  slug: string;
  name: string;
  fullName: string | null;
  code: string | null;
  parentId: string | null;
  latitude: unknown;
  longitude: unknown;
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/\s*-\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normName(input: string): string {
  return slugify(input).replace(/-/g, " ");
}

function isNumericOnly(s: string): boolean {
  return /^\d+$/.test(s);
}

function round7(value: number): number {
  return Math.round(value * 1e7) / 1e7;
}

function coordOf(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function flattenPoints(value: unknown, out: Array<[number, number]>): void {
  if (!Array.isArray(value)) return;
  if (value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    out.push([value[0], value[1]]);
    return;
  }
  for (const item of value) flattenPoints(item, out);
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: HTTP ${res.status}`);
  return res.json();
}

async function main() {
  // 1. Canonical division list (same API used by seed-locations.ts)
  const api = (await fetchJson("https://provinces.open-api.vn/api/?depth=2")) as ApiProvince[];

  // 2. Coordinates from dvhcvn GIS (keyed by TCTK code: level1_id / level2_id)
  const districtCoordByCode = new Map<number, Coord>();
  const provinceCoordByCode = new Map<number, Coord>();

  const gisFiles = (await Promise.all(
    api.map((p) =>
      fetchJson(
        `https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/gis/${String(p.code).padStart(2, "0")}.json`,
      ),
    ),
  )) as Array<{ level1_id: string; level2s: Array<{ level2_id: string; coordinates: unknown }> }>;

  for (const file of gisFiles) {
    const districtCoords: Coord[] = [];
    for (const d of file.level2s) {
      const pts: Array<[number, number]> = [];
      flattenPoints(d.coordinates, pts);
      if (pts.length === 0) continue;
      const lat = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
      const lng = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
      districtCoordByCode.set(Number(d.level2_id), { lat, lng });
      districtCoords.push({ lat, lng });
    }
    if (districtCoords.length > 0) {
      provinceCoordByCode.set(Number(file.level1_id), {
        lat: districtCoords.reduce((sum, c) => sum + c.lat, 0) / districtCoords.length,
        lng: districtCoords.reduce((sum, c) => sum + c.lng, 0) / districtCoords.length,
      });
    }
  }

  // 3. Load DB rows once
  const dbLocations = (await prisma.location.findMany({
    select: { id: true, type: true, slug: true, name: true, fullName: true, code: true, parentId: true, latitude: true, longitude: true },
  })) as DbLocation[];

  const provinceBySlug = new Map<string, DbLocation>();
  const provinceByName = new Map<string, DbLocation>();
  const provinceByCode = new Map<string, DbLocation>();
  const districtBySlug = new Map<string, DbLocation>();
  const districtByNameByParent = new Map<string, DbLocation>();
  const districtByCode = new Map<string, DbLocation>();

  for (const row of dbLocations) {
    if (row.type === "province") {
      provinceBySlug.set(row.slug, row);
      if (row.fullName) provinceByName.set(normName(row.fullName), row);
      if (row.code) provinceByCode.set(row.code, row);
    } else if (row.type === "district") {
      districtBySlug.set(row.slug, row);
      if (row.parentId && row.name) districtByNameByParent.set(`${row.parentId}:${normName(row.name)}`, row);
      if (row.code) districtByCode.set(row.code, row);
    }
  }

  // 4. Update locations (only when null or differing)
  let provUpdated = 0;
  let provSkipped = 0;
  let distUpdated = 0;
  let distSkipped = 0;
  let distUnmatched = 0;
  const unmatchedDistricts: string[] = [];

  for (const p of api) {
    const provSlug = PROVINCE_SLUG_OVERRIDES[p.name] ?? slugify(p.name.replace(PROVINCE_PREFIX_RE, ""));
    const provRow =
      provinceBySlug.get(provSlug) ??
      provinceByName.get(normName(p.name)) ??
      provinceByCode.get(String(p.code).padStart(2, "0"));
    if (!provRow) {
      provSkipped++;
      console.warn(`  Unmatched province: ${p.name} (code ${p.code})`);
      continue;
    }

    const provCoord = provinceCoordByCode.get(p.code);
    if (provCoord) {
      const lat = round7(provCoord.lat);
      const lng = round7(provCoord.lng);
      const curLat = coordOf(provRow.latitude);
      const curLng = coordOf(provRow.longitude);
      if (curLat !== lat || curLng !== lng) {
        await prisma.location.updateMany({
          where: { id: provRow.id },
          data: { latitude: lat, longitude: lng },
        });
        provUpdated++;
      } else {
        provSkipped++;
      }
    } else {
      provSkipped++;
    }

    for (const d of p.districts) {
      const core = d.name.replace(DISTRICT_PREFIX_RE, "");
      const base = isNumericOnly(core) ? `quan-${slugify(core)}` : slugify(core);
      const candidates = [
        base,
        `${base}-${provSlug}`,
        slugify(d.name),
      ];
      let distRow: DbLocation | undefined;
      for (const candidate of candidates) {
        const hit = districtBySlug.get(candidate);
        if (hit) {
          distRow = hit;
          break;
        }
      }
      if (!distRow && provRow) {
        distRow =
          districtByNameByParent.get(`${provRow.id}:${normName(core)}`) ??
          districtByNameByParent.get(`${provRow.id}:${normName(d.name)}`);
      }
      if (!distRow) {
        distRow = districtByCode.get(String(d.code));
      }
      if (!distRow) {
        distUnmatched++;
        unmatchedDistricts.push(`${p.name} / ${d.name} (code ${d.code})`);
        continue;
      }

      const distCoord = districtCoordByCode.get(d.code);
      if (!distCoord) {
        distSkipped++;
        continue;
      }
      const lat = round7(distCoord.lat);
      const lng = round7(distCoord.lng);
      const curLat = coordOf(distRow.latitude);
      const curLng = coordOf(distRow.longitude);
      if (curLat !== lat || curLng !== lng) {
        await prisma.location.updateMany({
          where: { id: distRow.id },
          data: { latitude: lat, longitude: lng },
        });
        distUpdated++;
      } else {
        distSkipped++;
      }
    }
  }

  console.log(
    `Locations updated: ${provUpdated} provinces, ${distUpdated} districts (skipped: ${provSkipped} provinces, ${distSkipped} districts; unmatched districts: ${distUnmatched})`,
  );
  for (const u of unmatchedDistricts.slice(0, 20)) console.warn(`  Unmatched district: ${u}`);
  if (unmatchedDistricts.length > 20) console.warn(`  ... and ${unmatchedDistricts.length - 20} more`);

  // 5. Backfill projects from their district (fallback: province) location
  const projects = await prisma.project.findMany({
    select: { id: true, districtId: true, provinceId: true, latitude: true, longitude: true },
  });
  const locById = new Map(
    (await prisma.location.findMany({
      select: { id: true, latitude: true, longitude: true },
    })).map((l) => [l.id, l]),
  );
  let projectsUpdated = 0;
  let projectsSkipped = 0;

  for (const project of projects) {
    if (coordOf(project.latitude) !== null && coordOf(project.longitude) !== null) {
      projectsSkipped++;
      continue;
    }
    const loc = locById.get(project.districtId ?? "") ?? locById.get(project.provinceId ?? "");
    const lat = coordOf(loc?.latitude);
    const lng = coordOf(loc?.longitude);
    if (!loc || lat === null || lng === null) {
      projectsSkipped++;
      continue;
    }
    await prisma.project.updateMany({
      where: { id: project.id },
      data: { latitude: lat, longitude: lng },
    });
    projectsUpdated++;
  }

  console.log(
    `Projects updated: ${projectsUpdated} (skipped: ${projectsSkipped})`,
  );
}

main()
  .finally(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
