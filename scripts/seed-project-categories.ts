import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, type CategoryTransactionType } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const categories: Array<{
  code: string;
  name: string;
  slug: string;
  transactionType: CategoryTransactionType;
  sortOrder: number;
}> = [
  { code: "project_apartment", name: "Dự án căn hộ chung cư", slug: "du-an-can-ho-chung-cu", transactionType: "both", sortOrder: 210 },
  { code: "project_office", name: "Dự án cao ốc văn phòng", slug: "du-an-cao-oc-van-phong", transactionType: "both", sortOrder: 220 },
  { code: "project_mall", name: "Dự án trung tâm thương mại", slug: "du-an-trung-tam-thuong-mai", transactionType: "both", sortOrder: 230 },
  { code: "project_urban_area", name: "Dự án khu đô thị mới", slug: "du-an-khu-do-thi-moi", transactionType: "both", sortOrder: 240 },
  { code: "project_complex", name: "Dự án khu phức hợp", slug: "du-an-khu-phuc-hop", transactionType: "both", sortOrder: 250 },
  { code: "project_social_housing", name: "Dự án nhà ở xã hội", slug: "du-an-nha-o-xa-hoi", transactionType: "both", sortOrder: 260 },
  { code: "project_resort", name: "Dự án khu nghỉ dưỡng, sinh thái", slug: "du-an-nghi-duong-sinh-thai", transactionType: "both", sortOrder: 270 },
  { code: "project_industrial", name: "Dự án khu công nghiệp", slug: "du-an-khu-cong-nghiep", transactionType: "both", sortOrder: 280 },
  { code: "project_villa", name: "Dự án biệt thự, liền kề", slug: "du-an-biet-thu-lien-ke", transactionType: "both", sortOrder: 290 },
  { code: "project_shophouse", name: "Dự án shophouse", slug: "du-an-shophouse", transactionType: "both", sortOrder: 300 },
  { code: "project_street_house", name: "Dự án nhà mặt phố", slug: "du-an-nha-mat-pho", transactionType: "both", sortOrder: 310 },
  { code: "project_other", name: "Dự án khác", slug: "du-an-khac", transactionType: "both", sortOrder: 320 },
];

async function main() {
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { code: category.code },
      create: {
        code: category.code,
        name: category.name,
        slug: category.slug,
        transactionType: category.transactionType,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      update: {
        name: category.name,
        slug: category.slug,
        transactionType: category.transactionType,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
    console.log(`category: ${category.code} -> ${record.slug} (sortOrder=${record.sortOrder}, isActive=${record.isActive})`);
  }

  const total = await prisma.category.count({
    where: { transactionType: "both", isActive: true },
  });
  console.log(`total project categories (both, active): ${total}`);
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
