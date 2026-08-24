import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the migration.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const CATEGORY_NAMES: Record<string, string> = {
  "ban-can-ho-chung-cu": "Bán căn hộ chung cư",
  "ban-chung-cu-mini-can-ho-dich-vu": "Bán chung cư mini, căn hộ dịch vụ",
  "ban-nha-rieng": "Bán nhà riêng",
  "ban-nha-biet-thu-lien-ke": "Bán nhà biệt thự, liền kề",
  "ban-nha-mat-pho": "Bán nhà mặt phố",
  "ban-shophouse-nha-pho-thuong-mai": "Bán shophouse, nhà phố thương mại",
  "ban-dat-nen-du-an": "Bán đất nền dự án",
  "ban-dat": "Bán đất",
  "ban-trang-trai-khu-nghi-duong": "Bán trang trại, khu nghỉ dưỡng",
  "ban-condotel": "Bán condotel",
  "ban-kho-nha-xuong": "Bán kho, nhà xưởng",
  "ban-bat-dong-san-khac": "Bán loại bất động sản khác",
  "cho-thue-can-ho-chung-cu": "Cho thuê căn hộ chung cư",
  "cho-thue-chung-cu-mini-can-ho-dich-vu": "Cho thuê chung cư mini, căn hộ dịch vụ",
  "cho-thue-nha-rieng": "Cho thuê nhà riêng",
  "cho-thue-nha-biet-thu-lien-ke": "Cho thuê nhà biệt thự, liền kề",
  "cho-thue-nha-mat-pho": "Cho thuê nhà mặt phố",
  "cho-thue-nha-tro-phong-tro": "Cho thuê nhà trọ, phòng trọ",
  "cho-thue-shophouse-nha-pho-thuong-mai": "Cho thuê shophouse, nhà phố thương mại",
  "cho-thue-van-phong": "Cho thuê văn phòng",
  "cho-thue-cua-hang-ki-ot": "Cho thuê, sang nhượng cửa hàng, ki ốt",
  "cho-thue-kho-nha-xuong-dat": "Cho thuê kho, nhà xưởng, đất",
  "cho-thue-bat-dong-san-khac": "Cho thuê loại bất động sản khác",
  "du-an-can-ho-chung-cu": "Dự án căn hộ chung cư",
  "du-an-cao-oc-van-phong": "Dự án cao ốc văn phòng",
  "du-an-trung-tam-thuong-mai": "Dự án trung tâm thương mại",
  "du-an-khu-do-thi-moi": "Dự án khu đô thị mới",
  "du-an-khu-phuc-hop": "Dự án khu phức hợp",
  "du-an-nha-o-xa-hoi": "Dự án nhà ở xã hội",
  "du-an-nghi-duong-sinh-thai": "Dự án khu nghỉ dưỡng, sinh thái",
  "du-an-khu-cong-nghiep": "Dự án khu công nghiệp",
  "du-an-biet-thu-lien-ke": "Dự án biệt thự, liền kề",
  "du-an-shophouse": "Dự án shophouse",
  "du-an-nha-mat-pho": "Dự án nhà mặt phố",
  "du-an-khac": "Dự án khác",
};

const LOCATION_NAMES: Record<string, { name: string; fullName: string }> = {
  "viet-nam": { name: "Việt Nam", fullName: "Việt Nam" },
  "ha-noi": { name: "Hà Nội", fullName: "Thành phố Hà Nội" },
  "tp-ho-chi-minh": { name: "TP. Hồ Chí Minh", fullName: "Thành phố Hồ Chí Minh" },
  "da-nang": { name: "Đà Nẵng", fullName: "Thành phố Đà Nẵng" },
  "binh-duong": { name: "Bình Dương", fullName: "Bình Dương" },
  "dong-nai": { name: "Đồng Nai", fullName: "Đồng Nai" },
  "long-an": { name: "Long An", fullName: "Long An" },
  "phu-yen": { name: "Phú Yên", fullName: "Phú Yên" },
  "cau-giay": { name: "Cầu Giấy", fullName: "Quận Cầu Giấy, Hà Nội" },
  "quan-1": { name: "Quận 1", fullName: "Quận 1, TP. Hồ Chí Minh" },
  "quan-2": { name: "Quận 2", fullName: "Quận 2, TP. Hồ Chí Minh" },
  "quan-7": { name: "Quận 7", fullName: "Quận 7, TP. Hồ Chí Minh" },
  "thu-duc": { name: "Thủ Đức", fullName: "Thủ Đức, TP. Hồ Chí Minh" },
  "binh-thanh": { name: "Bình Thạnh", fullName: "Bình Thạnh, TP. Hồ Chí Minh" },
  "can-giuoc": { name: "Cần Giuộc", fullName: "Cần Giuộc, Long An" },
  "tuy-hoa": { name: "Tuy Hòa", fullName: "Tuy Hòa, Phú Yên" },
  "ngu-hanh-son": { name: "Ngũ Hành Sơn", fullName: "Quận Ngũ Hành Sơn, Đà Nẵng" },
  "thuan-an": { name: "Thuận An", fullName: "Thuận An, Bình Dương" },
  "bien-hoa": { name: "Biên Hòa", fullName: "Biên Hòa, Đồng Nai" },
};

const ARTICLE_CATEGORY_NAMES: Record<string, string> = {
  "tin-tuc": "Tin tức",
  wiki: "Wiki BĐS",
  "mua-bat-dong-san": "Mua BĐS",
  "ban-bat-dong-san": "Bán BĐS",
  "thue-bat-dong-san": "Thuê BĐS",
  "tai-chinh-bat-dong-san": "Tài chính BĐS",
  "quy-hoach-phap-ly": "Quy hoạch - Pháp lý",
  "noi-ngoai-that": "Nội - Ngoại thất",
  "bao-cao-thi-truong": "Báo cáo thị trường",
  "goc-nhin-chuyen-gia": "Góc nhìn chuyên gia",
  "phong-tuc": "Phong tục",
};

const ROLE_NAMES: Record<string, string> = {
  seeker: "Người tìm kiếm",
  owner: "Chủ tài sản",
  agent: "Môi giới",
  agency_admin: "Quản trị viên công ty",
  developer: "Chủ đầu tư",
  moderator: "Kiểm duyệt viên",
  editor: "Biên tập viên",
  ops: "Vận hành",
  super_admin: "Quản trị viên cấp cao",
};

const DETAIL_LINK_LABELS: Array<{ from: string; to: string }> = [
  { from: "Can Giuoc, Long An", to: "Cần Giuộc, Long An" },
  { from: "Cau Giay", to: "Cầu Giấy" },
  { from: "Thu Duc", to: "Thủ Đức" },
  { from: "Tuy Hoa", to: "Tuy Hòa" },
  { from: "Bien Hoa", to: "Biên Hòa" },
  { from: "Ngu Hanh Son", to: "Ngũ Hành Sơn" },
  { from: "Binh Duong", to: "Bình Dương" },
  { from: "Dong Nai", to: "Đồng Nai" },
  { from: "Phu Yen", to: "Phú Yên" },
];

async function updateBySlug(
  model: {
    findMany: (args: { select: { slug: true; name: true; id: true } }) => Promise<Array<{ id: string; slug: string; name: string }>>;
    updateMany: (args: { where: { id: string }; data: { name: string } }) => Promise<{ count: number }>;
  },
  targets: Record<string, string>,
): Promise<number> {
  const rows = await model.findMany({ select: { slug: true, name: true, id: true } });
  let changed = 0;
  for (const row of rows) {
    const target = targets[row.slug];
    if (target !== undefined && row.name !== target) {
      const result = await model.updateMany({ where: { id: row.id }, data: { name: target } });
      changed += result.count;
    }
  }
  return changed;
}

async function updateCategories() {
  return updateBySlug(
    prisma.category as unknown as Parameters<typeof updateBySlug>[0],
    CATEGORY_NAMES,
  );
}

async function updateLocations() {
  const rows = await prisma.location.findMany({ select: { id: true, slug: true, name: true, fullName: true } });
  let changed = 0;
  for (const row of rows) {
    const target = LOCATION_NAMES[row.slug];
    if (target && (row.name !== target.name || row.fullName !== target.fullName)) {
      const result = await prisma.location.updateMany({
        where: { id: row.id },
        data: { name: target.name, fullName: target.fullName },
      });
      changed += result.count;
    }
  }
  return changed;
}

async function updateArticleCategories() {
  return updateBySlug(
    prisma.articleCategory as unknown as Parameters<typeof updateBySlug>[0],
    ARTICLE_CATEGORY_NAMES,
  );
}

async function updateRoles() {
  const rows = await prisma.role.findMany({ select: { id: true, code: true, name: true } });
  let changed = 0;
  for (const row of rows) {
    const target = ROLE_NAMES[row.code];
    if (target !== undefined && row.name !== target) {
      const result = await prisma.role.updateMany({ where: { id: row.id }, data: { name: target } });
      changed += result.count;
    }
  }
  return changed;
}

async function updateProject() {
  const row = await prisma.project.findUnique({
    where: { slug: "prosper-pho-dong" },
    select: { id: true, name: true },
  });
  if (!row || row.name === "Prosper Phố Đông") {
    return 0;
  }
  const result = await prisma.project.updateMany({
    where: { id: row.id },
    data: { name: "Prosper Phố Đông" },
  });
  return result.count;
}

async function updateListingDetailLinks() {
  const rows = await prisma.listingDetailLink.findMany({ select: { id: true, label: true } });
  let changed = 0;
  for (const row of rows) {
    const match = DETAIL_LINK_LABELS.find(({ from }) => row.label === from);
    if (match) {
      const result = await prisma.listingDetailLink.updateMany({
        where: { id: row.id },
        data: { label: match.to },
      });
      changed += result.count;
    }
  }
  return changed;
}

async function main() {
  const categories = await updateCategories();
  const locations = await updateLocations();
  const articleCategories = await updateArticleCategories();
  const roles = await updateRoles();
  const project = await updateProject();
  const detailLinks = await updateListingDetailLinks();

  console.log(`category: ${categories} rows changed`);
  console.log(`location: ${locations} rows changed`);
  console.log(`articleCategory: ${articleCategories} rows changed`);
  console.log(`role: ${roles} rows changed`);
  console.log(`project: ${project} rows changed`);
  console.log(`listingDetailLink: ${detailLinks} rows changed`);
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
