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

const industries = [
  { key: "developer", label: "Chủ đầu tư" },
  { key: "construction", label: "Thi công xây dựng" },
  { key: "design", label: "Tư vấn thiết kế" },
  { key: "brokerage", label: "Sàn giao dịch bất động sản" },
  { key: "interior", label: "Trang trí nội thất" },
  { key: "material", label: "Vật liệu xây dựng" },
  { key: "finance", label: "Tài chính pháp lý" },
  { key: "other", label: "Các lĩnh vực khác" },
];

const logoUrls = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=82",
];

type AgencySeed = {
  name: string;
  industry: string;
  provinceSlug: string;
  districtSlug: string;
  address: string;
  phone: string;
  email: string;
  description: string;
};

const agencies: AgencySeed[] = [
  {
    name: "Công ty Cổ phần Bất động sản Hùng Vượng",
    industry: "developer",
    provinceSlug: "ha-noi",
    districtSlug: "cau-giay",
    address: "Tòa nhà Hùng Vượng, 189 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    phone: "0901110001",
    email: "contact@hungvuong.vn",
    description: "Chủ đầu tư phát triển các khu đô thị và căn hộ chung cư cao cấp tại Hà Nội với hơn 15 năm kinh nghiệm.",
  },
  {
    name: "Tập đoàn Địa ốc Tây Nam",
    industry: "developer",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "quan-7",
    address: "Số 12 Nguyễn Văn Linh, Tân Phong, Quận 7, TP.HCM",
    phone: "0901110002",
    email: "info@taynamland.vn",
    description: "Tập đoàn đầu tư và phát triển bất động sản nhà ở, khu đô thị tại khu vực phía Nam.",
  },
  {
    name: "Công ty TNHH Thi công Xây dựng Kiến Tạo",
    industry: "construction",
    provinceSlug: "ha-noi",
    districtSlug: "cau-giay",
    address: "Số 45 Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    phone: "0901110003",
    email: "lienhe@kientao.vn",
    description: "Nhà thầu thi công xây dựng dân dụng và công nghiệp, đảm nhận thi công nhà phố, biệt thự tại Hà Nội.",
  },
  {
    name: "Tổng công ty Xây dựng Phú Gia",
    industry: "construction",
    provinceSlug: "da-nang",
    districtSlug: "ngu-hanh-son",
    address: "Lô 20, đường Trần Hữu Đức, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0901110004",
    email: "phugia@xaydung.vn",
    description: "Tổng thầu xây dựng công trình dân dụng, cao ốc văn phòng và khu nghỉ dưỡng tại miền Trung.",
  },
  {
    name: "Công ty Cổ phần Tư vấn thiết kế An Cư",
    industry: "design",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "quan-1",
    address: "Số 88 Đồng Khởi, Bến Nghé, Quận 1, TP.HCM",
    phone: "0901110005",
    email: "tuvanthietke@ancu.vn",
    description: "Đơn vị tư vấn thiết kế kiến trúc và quy hoạch, chuyên thiết kế chung cư, biệt thự và khu đô thị.",
  },
  {
    name: "Văn phòng Kiến trúc Sáng Tạo Việt",
    industry: "design",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "thu-duc",
    address: "Số 20 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM",
    phone: "0901110006",
    email: "sangtaoviet@kientruc.vn",
    description: "Văn phòng kiến trúc chuyên thiết kế nhà ở hiện đại, nội ngoại thất theo phong cách tối giản.",
  },
  {
    name: "Sàn giao dịch Bất động sản Nam Việt",
    industry: "brokerage",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "quan-7",
    address: "Số 180 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM",
    phone: "0901110007",
    email: "namviet@sanbatdongsan.vn",
    description: "Sàn giao dịch bất động sản chuyên phân phối căn hộ, nhà phố và đất nền tại khu vực phía Nam.",
  },
  {
    name: "Công ty Môi giới Bất động sản Thành Công",
    industry: "brokerage",
    provinceSlug: "ha-noi",
    districtSlug: "cau-giay",
    address: "Số 25 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    phone: "0901110008",
    email: "thanhcong@moigioi.vn",
    description: "Đơn vị môi giới bất động sản uy tín tại Hà Nội, hỗ trợ mua bán, cho thuê nhà đất trọn gói.",
  },
  {
    name: "Công ty TNHH Trang trí Nội thất Gia Việt",
    industry: "interior",
    provinceSlug: "ha-noi",
    districtSlug: "cau-giay",
    address: "Số 77 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội",
    phone: "0901110009",
    email: "giaviethome@giaviethome.vn",
    description: "Chuyên tư vấn, thi công nội thất chung cư, nhà phố và văn phòng theo phong cách hiện đại.",
  },
  {
    name: "Nội thất Đẹp Mỗi Nhà",
    industry: "interior",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "thu-duc",
    address: "Số 158 Lê Văn Chí, Linh Trung, Thủ Đức, TP.HCM",
    phone: "0901110010",
    email: "depmoinha@noithat.vn",
    description: "Hệ thống showroom nội thất cung cấp đồ gỗ, sofa và giải pháp nội thất trọn gói cho gia đình.",
  },
  {
    name: "Công ty Cổ phần Vật liệu Xây dựng Đông Á",
    industry: "material",
    provinceSlug: "binh-duong",
    districtSlug: "thuan-an",
    address: "Số 60 Nguyễn Lương Bằng, Thuận An, Bình Dương",
    phone: "0901110011",
    email: "donga@vatlieuxaydung.vn",
    description: "Cung cấp sắt thép, xi măng, gạch ốp lát và vật liệu xây dựng cho công trình dân dụng.",
  },
  {
    name: "Vật liệu Xanh Miền Nam",
    industry: "material",
    provinceSlug: "long-an",
    districtSlug: "can-giuoc",
    address: "Quốc lộ 1A, Cần Giuộc, Long An",
    phone: "0901110012",
    email: "xanhvn@vatlieu.vn",
    description: "Nhà phân phối vật liệu xây dựng thân thiện môi trường như gạch không nung, sơn sinh thái.",
  },
  {
    name: "Công ty TNHH Tài chính Bất động sản Phú Mỹ",
    industry: "finance",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "quan-1",
    address: "Tòa nhà Pearl, 168 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    phone: "0901110013",
    email: "phumy@taichinhbds.vn",
    description: "Tư vấn tài chính, hỗ trợ vay vốn ngân hàng và cấu trúc giao dịch bất động sản.",
  },
  {
    name: "Dịch vụ Pháp lý & Tài chính An Khang",
    industry: "finance",
    provinceSlug: "dong-nai",
    districtSlug: "bien-hoa",
    address: "Số 32 Phan Trung, Tân Tiến, Biên Hòa, Đồng Nai",
    phone: "0901110014",
    email: "ankhang@phaplytaichinh.vn",
    description: "Cung cấp dịch vụ pháp lý, công chứng và tư vấn tài chính cho giao dịch bất động sản.",
  },
  {
    name: "Công ty TNHH Dịch vụ Bất động sản Toàn Cầu",
    industry: "other",
    provinceSlug: "phu-yen",
    districtSlug: "tuy-hoa",
    address: "Số 100 Hùng Vương, Phường 5, Tuy Hòa, Phú Yên",
    phone: "0901110015",
    email: "toancau@dichvubds.vn",
    description: "Dịch vụ tư vấn đầu tư, quản lý vận hành và khai thác bất động sản nghỉ dưỡng tại miền Trung.",
  },
  {
    name: "Trung tâm Tư vấn Đầu tư Bất động sản Việt",
    industry: "other",
    provinceSlug: "da-nang",
    districtSlug: "ngu-hanh-son",
    address: "Số 66 Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0901110016",
    email: "tvdt@batdongsanviet.vn",
    description: "Trung tâm tư vấn đầu tư, định giá và phân tích thị trường bất động sản cho nhà đầu tư cá nhân.",
  },
];

const districtMeta: Record<string, { name: string; fullName: string; provinceSlug: string }> = {
  "cau-giay": { name: "Cầu Giấy", fullName: "Quận Cầu Giấy, Hà Nội", provinceSlug: "ha-noi" },
  "quan-1": { name: "Quận 1", fullName: "Quận 1, TP. Hồ Chí Minh", provinceSlug: "tp-ho-chi-minh" },
  "quan-7": { name: "Quận 7", fullName: "Quận 7, TP. Hồ Chí Minh", provinceSlug: "tp-ho-chi-minh" },
  "thu-duc": { name: "Thủ Đức", fullName: "Thủ Đức, TP. Hồ Chí Minh", provinceSlug: "tp-ho-chi-minh" },
  "can-giuoc": { name: "Cần Giuộc", fullName: "Cần Giuộc, Long An", provinceSlug: "long-an" },
  "ngu-hanh-son": { name: "Ngũ Hành Sơn", fullName: "Quận Ngũ Hành Sơn, Đà Nẵng", provinceSlug: "da-nang" },
  "tuy-hoa": { name: "Tuy Hòa", fullName: "Tuy Hòa, Phú Yên", provinceSlug: "phu-yen" },
  "thuan-an": { name: "Thuận An", fullName: "Thuận An, Bình Dương", provinceSlug: "binh-duong" },
  "bien-hoa": { name: "Biên Hòa", fullName: "Biên Hòa, Đồng Nai", provinceSlug: "dong-nai" },
};

type BrokerSeed = {
  email: string;
  phone: string;
  displayName: string;
  bio: string;
  licenseNumber: string;
  companyName: string;
};

const brokers: BrokerSeed[] = [
  {
    email: "broker.1@anshome.local",
    phone: "0912345601",
    displayName: "Nguyễn Văn Minh",
    bio: "Chuyên môi giới căn hộ chung cư tại Hà Nội với hơn 10 năm kinh nghiệm.",
    licenseNumber: "AN.SLS.2019.0041",
    companyName: "Công ty môi giới Bất động sản Thành Công",
  },
  {
    email: "broker.2@anshome.local",
    phone: "0912345602",
    displayName: "Trần Thị Hương",
    bio: "Tư vấn mua bán nhà phố, biệt thự khu vực TP.HCM.",
    licenseNumber: "AN.SLS.2020.0078",
    companyName: "Công ty môi giới Bất động sản Nam Việt",
  },
  {
    email: "broker.3@anshome.local",
    phone: "0912345603",
    displayName: "Lê Quang Huy",
    bio: "Chuyên phân phối đất nền dự án tại Bình Dương và Đồng Nai.",
    licenseNumber: "AN.SLS.2018.0023",
    companyName: "Công ty môi giới Đất Xanh Miền Nam",
  },
  {
    email: "broker.4@anshome.local",
    phone: "0912345604",
    displayName: "Phạm Thu Trang",
    bio: "Môi giới căn hộ cho thuê và dịch vụ quản lý tài sản.",
    licenseNumber: "AN.SLS.2021.0112",
    companyName: "Công ty môi giới An Cư Phát",
  },
  {
    email: "broker.5@anshome.local",
    phone: "0912345605",
    displayName: "Hoàng Đức Anh",
    bio: "Chuyên môi giới bất động sản nghỉ dưỡng tại Đà Nẵng và Phú Yên.",
    licenseNumber: "AN.SLS.2019.0087",
    companyName: "Công ty môi giới Biển Xanh Resort",
  },
  {
    email: "broker.6@anshome.local",
    phone: "0912345606",
    displayName: "Vũ Thị Lan",
    bio: "Tư vấn mua bán nhà riêng, nhà mặt phố tại Hà Nội.",
    licenseNumber: "AN.SLS.2022.0143",
    companyName: "Công ty môi giới Địa ốc Hà Thành",
  },
  {
    email: "broker.7@anshome.local",
    phone: "0912345607",
    displayName: "Đỗ Văn Tùng",
    bio: "Chuyên phân phối nhanh các dự án mở bán mới tại TP.HCM.",
    licenseNumber: "AN.SLS.2020.0095",
    companyName: "Công ty môi giới Sài Gòn Land",
  },
  {
    email: "broker.8@anshome.local",
    phone: "0912345608",
    displayName: "Bùi Thu Hà",
    bio: "Môi giới đất nền, nhà xưởng khu vực Long An và miền Tây.",
    licenseNumber: "AN.SLS.2021.0166",
    companyName: "Công ty môi giới Tây Nam Bộ",
  },
];

function slugify(value: string): string {
  return value
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findOrUpsertProvince(slug: string) {
  const province = await prisma.location.upsert({
    where: { type_slug: { type: "province", slug } },
    create: {
      type: "province",
      name: slug,
      slug,
      fullName: slug,
      isActive: true,
    },
    update: { isActive: true },
    select: { id: true },
  });
  return province.id;
}

async function findOrUpsertDistrict(slug: string): Promise<string> {
  const meta = districtMeta[slug];
  if (!meta) {
    throw new Error(`Missing district metadata for ${slug}.`);
  }
  const provinceId = await findOrUpsertProvince(meta.provinceSlug);
  const district = await prisma.location.upsert({
    where: { type_slug: { type: "district", slug } },
    create: {
      type: "district",
      name: meta.name,
      slug,
      fullName: meta.fullName,
      parentId: provinceId,
      isActive: true,
    },
    update: {
      name: meta.name,
      fullName: meta.fullName,
      parentId: provinceId,
      isActive: true,
    },
    select: { id: true },
  });
  return district.id;
}

async function main() {
  const provinceIds = new Map<string, string>();
  const districtIds = new Map<string, string>();
  const usedProvinceSlugs = new Set(agencies.map((agency) => agency.provinceSlug));

  for (const slug of usedProvinceSlugs) {
    provinceIds.set(slug, await findOrUpsertProvince(slug));
  }

  const usedDistrictSlugs = new Set(agencies.map((agency) => agency.districtSlug));
  for (const slug of usedDistrictSlugs) {
    districtIds.set(slug, await findOrUpsertDistrict(slug));
  }

  const industryCounts: Record<string, number> = Object.fromEntries(
    industries.map((industry) => [industry.key, 0]),
  );

  for (const [index, agency] of agencies.entries()) {
    const slug = slugify(agency.name);
    const provinceId = provinceIds.get(agency.provinceSlug);
    const districtId = districtIds.get(agency.districtSlug);
    const logoUrl = logoUrls[index % logoUrls.length];

    if (!provinceId || !districtId) {
      throw new Error(`Missing seed location for agency ${agency.name}.`);
    }

    const media = await prisma.media.upsert({
      where: { storageKey: `seed/directory/${slug}-logo.jpg` },
      create: {
        storageKey: `seed/directory/${slug}-logo.jpg`,
        publicUrl: logoUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      update: {
        publicUrl: logoUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      select: { id: true },
    });

    await prisma.agency.upsert({
      where: { slug },
      create: {
        name: agency.name,
        slug,
        industry: agency.industry,
        description: agency.description,
        provinceId,
        districtId,
        address: agency.address,
        phone: agency.phone,
        email: agency.email,
        logoMediaId: media.id,
        verificationStatus: "verified",
        status: "active",
      },
      update: {
        name: agency.name,
        industry: agency.industry,
        description: agency.description,
        provinceId,
        districtId,
        address: agency.address,
        phone: agency.phone,
        email: agency.email,
        logoMediaId: media.id,
        verificationStatus: "verified",
        status: "active",
      },
    });

    industryCounts[agency.industry] = (industryCounts[agency.industry] ?? 0) + 1;
  }

  const agentRole = await prisma.role.findUniqueOrThrow({
    where: { code: "agent" },
    select: { id: true },
  });

  for (const broker of brokers) {
    const user = await prisma.user.upsert({
      where: { email: broker.email },
      create: {
        email: broker.email,
        phone: broker.phone,
        passwordHash: null,
        status: "active",
        profile: {
          create: {
            displayName: broker.displayName,
            bio: broker.bio,
            licenseNumber: broker.licenseNumber,
            companyName: broker.companyName,
            verificationStatus: "verified",
          },
        },
      },
      update: {
        phone: broker.phone,
        status: "active",
        profile: {
          upsert: {
            create: {
              displayName: broker.displayName,
              bio: broker.bio,
              licenseNumber: broker.licenseNumber,
              companyName: broker.companyName,
              verificationStatus: "verified",
            },
            update: {
              displayName: broker.displayName,
              bio: broker.bio,
              licenseNumber: broker.licenseNumber,
              companyName: broker.companyName,
              verificationStatus: "verified",
            },
          },
        },
      },
      select: {
        id: true,
        profile: {
          select: {
            publicSlug: true,
          },
        },
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId_scopeType_scopeId: {
          userId: user.id,
          roleId: agentRole.id,
          scopeType: "",
          scopeId: "",
        },
      },
      create: {
        userId: user.id,
        roleId: agentRole.id,
        scopeType: "",
        scopeId: "",
      },
      update: {},
    });

    const publicSlug = slugify(broker.displayName);
    if (!user.profile?.publicSlug) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { publicSlug },
      });
    }
    console.log(`- Broker ${broker.displayName} (${broker.email}) -> publicSlug: ${user.profile?.publicSlug ?? publicSlug}`);
  }

  const brokerUser = await prisma.user.findUniqueOrThrow({
    where: { email: "broker.1@anshome.local" },
    select: { id: true },
  });

  const saleApartmentCategory = await prisma.category.findUniqueOrThrow({
    where: { code: "sale_apartment" },
    select: { id: true },
  });
  const saleHouseCategory = await prisma.category.findUniqueOrThrow({
    where: { code: "sale_house" },
    select: { id: true },
  });
  const haNoiProvince = await prisma.location.findUniqueOrThrow({
    where: { type_slug: { type: "province", slug: "ha-noi" } },
    select: { id: true },
  });
  const cauGiayDistrict = await prisma.location.findUniqueOrThrow({
    where: { type_slug: { type: "district", slug: "cau-giay" } },
    select: { id: true },
  });

  const brokerListings = [
    {
      publicId: "ANBROKER01",
      title: "Môi giới nhà đất chuyên nghiệp - Bán căn hộ chung cư 2PN 75m2 tại Cầu Giấy, Hà Nội",
      slug: "moi-gioi-nha-dat-chuyen-nghiep-ban-can-ho-2pn-cau-giay-ha-noi",
      description:
        "Chính chủ gửi bán căn hộ chung cư 2 phòng ngủ, 2 vệ sinh tại khu vực Cầu Giấy, Hà Nội. Nhà mới, nội thất đẹp, sổ hồng trao tay, hỗ trợ vay ngân hàng 70%. Liên hệ môi giới chuyên nghiệp để được tư vấn và xem nhà 24/7.",
      categoryId: saleApartmentCategory.id,
      price: "3500000000",
      pricePerSqm: "46660000",
      area: "75",
      addressText: "Khu đô thị Trung Hòa Nhân Chính, Cầu Giấy, Hà Nội",
      contactName: "Nguyễn Văn Minh",
      contactPhone: "0912345601",
      bedrooms: 2,
      bathrooms: 2,
      legalStatus: "Sổ hồng riêng",
      interiorStatus: "Hoàn thiện cơ bản",
      direction: "Đông Nam",
      isVerified: true,
      isFeatured: true,
      imageUrls: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=82",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=82",
      ],
      publishedAgoMinutes: 5,
    },
    {
      publicId: "ANBROKER02",
      title: "Môi giới nhà đất chuyên nghiệp - Bán nhà riêng 3 tầng 45m2 mặt ngõ ô tô tại Cầu Giấy",
      slug: "moi-gioi-nha-dat-chuyen-nghiep-ban-nha-rieng-3-tang-cau-giay",
      description:
        "Bán nhà riêng 3 tầng diện tích 45m2, mặt ngõ rộng ô tô vào tận cửa tại quận Cầu Giấy, Hà Nội. Nhà xây mới 2023, thiết kế hiện đại, gần chợ và trường học. Sổ đỏ chính chủ, công chứng trong ngày.",
      categoryId: saleHouseCategory.id,
      price: "5200000000",
      pricePerSqm: "115550000",
      area: "45",
      addressText: "Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
      contactName: "Nguyễn Văn Minh",
      contactPhone: "0912345601",
      bedrooms: 3,
      bathrooms: 3,
      legalStatus: "Sổ đỏ chính chủ",
      interiorStatus: "Mới hoàn thiện",
      direction: "Tây Bắc",
      isVerified: true,
      isFeatured: true,
      imageUrls: [
        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=82",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=82",
      ],
      publishedAgoMinutes: 15,
    },
    {
      publicId: "ANBROKER03",
      title: "Môi giới nhà đất chuyên nghiệp - Bán căn hộ chung cư 1PN 52m2 view thoáng tại Cầu Giấy",
      slug: "moi-gioi-nha-dat-chuyen-nghiep-ban-can-ho-1pn-52m2-cau-giay",
      description:
        "Bán căn hộ chung cư 1 phòng ngủ diện tích 52m2 tại Cầu Giấy, Hà Nội. Căn góc, view thoáng, không gian yên tĩnh, phù hợp đầu tư hoặc an cư. Sổ hồng vĩnh viễn, hỗ trợ thủ tục vay vốn trọn gói.",
      categoryId: saleApartmentCategory.id,
      price: "2600000000",
      pricePerSqm: "50000000",
      area: "52",
      addressText: "Trần Duy Hưng, Cầu Giấy, Hà Nội",
      contactName: "Nguyễn Văn Minh",
      contactPhone: "0912345601",
      bedrooms: 1,
      bathrooms: 1,
      legalStatus: "Sổ hồng riêng",
      interiorStatus: "Nội thất đầy đủ",
      direction: "Nam",
      isVerified: false,
      isFeatured: false,
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=82",
      ],
      publishedAgoMinutes: 25,
    },
  ];

  for (const listing of brokerListings) {
    const publishedAt = new Date(Date.now() - listing.publishedAgoMinutes * 60 * 1000);
    const record = await prisma.listing.upsert({
      where: { publicId: listing.publicId },
      create: {
        publicId: listing.publicId,
        ownerUserId: brokerUser.id,
        projectId: null,
        transactionType: "sale",
        categoryId: listing.categoryId,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: "VND",
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId: haNoiProvince.id,
        districtId: cauGiayDistrict.id,
        addressText: listing.addressText,
        contactName: listing.contactName,
        contactPhone: listing.contactPhone,
        contactZalo: listing.contactPhone,
        isVerified: listing.isVerified,
        isFeatured: listing.isFeatured,
        publishedAt,
        expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      update: {
        ownerUserId: brokerUser.id,
        projectId: null,
        transactionType: "sale",
        categoryId: listing.categoryId,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: "VND",
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId: haNoiProvince.id,
        districtId: cauGiayDistrict.id,
        addressText: listing.addressText,
        contactName: listing.contactName,
        contactPhone: listing.contactPhone,
        contactZalo: listing.contactPhone,
        isVerified: listing.isVerified,
        isFeatured: listing.isFeatured,
        publishedAt,
        expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      select: { id: true },
    });

    await prisma.listingAttribute.upsert({
      where: { listingId: record.id },
      create: {
        listingId: record.id,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        legalStatus: listing.legalStatus,
        interiorStatus: listing.interiorStatus,
        direction: listing.direction,
      },
      update: {
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        legalStatus: listing.legalStatus,
        interiorStatus: listing.interiorStatus,
        direction: listing.direction,
      },
    });

    for (let n = 0; n < listing.imageUrls.length; n += 1) {
      const storageKey = `seed/directory/${listing.publicId}-${n}.jpg`;
      const media = await prisma.media.upsert({
        where: { storageKey },
        create: {
          ownerUserId: brokerUser.id,
          storageKey,
          publicUrl: listing.imageUrls[n],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 800,
          status: "approved",
        },
        update: {
          ownerUserId: brokerUser.id,
          publicUrl: listing.imageUrls[n],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 800,
          status: "approved",
        },
        select: { id: true },
      });

      await prisma.listingMedia.upsert({
        where: {
          listingId_mediaId: {
            listingId: record.id,
            mediaId: media.id,
          },
        },
        create: {
          listingId: record.id,
          mediaId: media.id,
          type: "image",
          sortOrder: n,
          caption: listing.title,
          moderationStatus: "approved",
        },
        update: {
          type: "image",
          sortOrder: n,
          caption: listing.title,
          moderationStatus: "approved",
        },
      });
    }

    console.log(`Upserted broker listing ${listing.publicId} (${listing.title})`);
  }

  const brokerageAgency = await prisma.agency.findFirst({
    where: { industry: "brokerage" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (brokerageAgency) {
    for (const publicId of ["ANVINHOMES01", "ANVINHOMES02"]) {
      await prisma.listing.update({
        where: { publicId },
        data: { agencyId: brokerageAgency.id },
      });
    }
  }

  console.log("=== Seed directory summary ===");
  for (const industry of industries) {
    console.log(`- ${industry.label}: ${industryCounts[industry.key] ?? 0} agencies`);
  }
  console.log(`- Cá nhân môi giới: ${brokers.length} brokers`);
  const brokerListingCount = await prisma.listing.count({
    where: { ownerUserId: brokerUser.id, status: "published" },
  });
  console.log(`- Tin đăng của môi giới đầu tiên: ${brokerListingCount} listings`);
  console.log(
    `- Vinhomes listings agencyId -> ${brokerageAgency ? `${brokerageAgency.name} (${brokerageAgency.id})` : "NOT ASSIGNED"}`
  );
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
