import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const projectDetails: Array<{
  name: string;
  towerCount: number;
  apartmentCount: number;
  amenities: string[];
}> = [
  {
    name: "The Royal - Five Star Eco City",
    towerCount: 3,
    apartmentCount: 540,
    amenities: ["Hồ bơi", "Công viên", "Bãi đỗ xe", "An ninh 24/7", "Trường học", "Siêu thị", "Gym"],
  },
  {
    name: "The Peak Garden",
    towerCount: 2,
    apartmentCount: 320,
    amenities: ["Hồ bơi", "Gym", "Công viên", "Bãi đỗ xe", "An ninh 24/7"],
  },
  {
    name: "Cloud Icon L' Avenir",
    towerCount: 2,
    apartmentCount: 612,
    amenities: ["Hồ bơi", "Gym", "Cà phê", "Bãi đỗ xe", "An ninh 24/7", "Shophouse"],
  },
  {
    name: "Prosper Phố Đông",
    towerCount: 1,
    apartmentCount: 156,
    amenities: ["Công viên", "Bãi đỗ xe", "An ninh 24/7"],
  },
];

async function main() {
  const projects = await prisma.project.findMany({
    select: { slug: true, name: true },
  });
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const projectByExactName = new Map(projects.map((project) => [project.name, project]));
  const projectByNormalizedName = new Map(
    projects.map((project) => [project.name.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, ""), project]),
  );

  for (const detail of projectDetails) {
    const matched =
      projectByExactName.get(detail.name) ??
      projectByNormalizedName.get(detail.name.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

    if (!matched) {
      console.warn(`project not found: ${detail.name} (skipped)`);
      continue;
    }

    const result = await prisma.project.updateMany({
      where: { slug: matched.slug },
      data: {
        towerCount: detail.towerCount,
        apartmentCount: detail.apartmentCount,
        amenities: detail.amenities,
      },
    });

    const count = result.count > 0 ? projectBySlug.get(matched.slug)?.name ?? matched.slug : matched.slug;
    console.log(
      `project: ${count} -> towerCount=${detail.towerCount}, apartmentCount=${detail.apartmentCount}, amenities=${detail.amenities.length}`,
    );
  }

  const updated = await prisma.project.count({
    where: {
      towerCount: { not: null },
    },
  });
  console.log(`total projects with scale details: ${updated}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
