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

const districts = [
  {
    name: "Binh Thanh",
    slug: "binh-thanh",
    fullName: "Binh Thanh, TP. Ho Chi Minh",
    latitude: "10.8033930",
    longitude: "106.7066090",
  },
  {
    name: "Quan 2",
    slug: "quan-2",
    fullName: "Quan 2, TP. Ho Chi Minh",
    latitude: "10.7750000",
    longitude: "106.7490000",
  },
];

const listings = [
  {
    publicId: "ANECOGREEN01",
    title:
      "Săn hàng giá tốt tại Eco Green Q7 sổ hồng trao tay - 1PN, 2PN, 3PN giá từ 3,4 tỷ hỗ trợ vay 70%",
    slug: "san-hang-gia-tot-tai-eco-green-q7-so-hong-trao-tay",
    description:
      "Tổng hợp quỹ căn hộ có sổ được quan tâm nhất tại Eco Green Sài Gòn, Quận 7 TP.HCM. LH em tư vấn nhanh, nắm key hầu hết các căn rao bán - xem nhà 24/7.",
    price: "4500000000",
    pricePerSqm: "67160000",
    area: "67",
    districtSlug: "quan-7",
    addressText: "Eco Green Saigon, Quan 7, TP. Ho Chi Minh",
    contactName: "FiveStars Plus",
    contactPhone: "0899121000",
    bedrooms: 2,
    bathrooms: 2,
    legalStatus: "Sổ hồng riêng",
    interiorStatus: "Hoàn thiện cao cấp",
    direction: "Đông Nam",
    isVerified: true,
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=82",
    publishedAgoMinutes: 0,
  },
  {
    publicId: "ANVINHOMES01",
    title:
      "Bán căn hộ Vinhomes Central Park 1,2,3,4 PN giá tốt nhất thị trường. Khánh Huyền 0901 692 000",
    slug: "ban-can-ho-vinhomes-central-park-1-2-3-4-pn-gia-tot-nhat",
    description:
      "Kính gửi quý khách hàng danh sách các căn hộ đang rao bán tại Vinhomes Central Park: căn 1PN DT 53,7m full nội thất giá 4,2 tỷ; các căn 2-3-4PN view sông và Landmark 81.",
    price: "6500000000",
    pricePerSqm: "75580000",
    area: "86",
    districtSlug: "binh-thanh",
    addressText: "Vinhomes Central Park, Binh Thanh, TP. Ho Chi Minh",
    contactName: "Ngô Khánh Huyền",
    contactPhone: "0901692000",
    bedrooms: 2,
    bathrooms: 2,
    legalStatus: "Sổ hồng riêng",
    interiorStatus: "Bàn giao hoàn thiện",
    direction: "Nam",
    isVerified: true,
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=82",
    publishedAgoMinutes: 10,
  },
  {
    publicId: "ANVINHOMES02",
    title:
      "Giỏ hàng bán 1PN 4.5 tỷ, 2PN 6.5 tỷ, 3PN 10 tỷ, 4PN 13.8 tỷ tại Vinhomes Central Park",
    slug: "gio-hang-ban-1pn-2pn-3pn-4pn-tai-vinhomes-central-park",
    description:
      "Kính chào quý khách hàng, công ty chúng tôi chuyên chuyển nhượng, cho thuê chung cư cao cấp tại Vinhomes Central Park và Landmark 81 với giỏ hàng đa dạng diện tích.",
    price: "10000000000",
    pricePerSqm: "78120000",
    area: "128",
    districtSlug: "binh-thanh",
    addressText: "Vinhomes Central Park, Binh Thanh, TP. Ho Chi Minh",
    contactName: "Cozy Home",
    contactPhone: "0931441000",
    bedrooms: 3,
    bathrooms: 2,
    legalStatus: "Sổ hồng riêng",
    interiorStatus: "Bàn giao hoàn thiện",
    direction: "Đông Bắc",
    isVerified: false,
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=82",
    publishedAgoMinutes: 20,
  },
  {
    publicId: "ANMASTERI01",
    title:
      "Chuyên CH Masteri Thảo Điền - cam kết báo giá thật - bao giá thấp nhất thị trường - hỗ trợ vay 80%",
    slug: "chuyen-ch-masteri-thao-dien-cam-ket-bao-gia-that",
    description:
      "Giỏ hàng chuyển nhượng dự án Masteri Thảo Điền 1 - 2 - 3 - 4PN, penthouse, shophouse với giá tốt nhất thị trường, hỗ trợ vay 80%.",
    price: null,
    pricePerSqm: null,
    area: "74",
    districtSlug: "quan-2",
    addressText: "Masteri Thao Dien, Quan 2, TP. Ho Chi Minh",
    contactName: "Bảo Bảo",
    contactPhone: "0946867000",
    bedrooms: 2,
    bathrooms: 2,
    legalStatus: "Sổ hồng riêng",
    interiorStatus: "Bàn giao hoàn thiện",
    direction: "Tây Nam",
    isVerified: false,
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=82",
    publishedAgoMinutes: 30,
  },
];

async function main() {
  const province = await prisma.location.findUniqueOrThrow({
    where: { type_slug: { type: "province", slug: "tp-ho-chi-minh" } },
    select: { id: true },
  });

  const districtIds = new Map<string, string>();
  for (const district of districts) {
    const record = await prisma.location.upsert({
      where: { type_slug: { type: "district", slug: district.slug } },
      create: {
        type: "district",
        name: district.name,
        slug: district.slug,
        fullName: district.fullName,
        parentId: province.id,
        latitude: district.latitude,
        longitude: district.longitude,
      },
      update: {
        name: district.name,
        fullName: district.fullName,
        parentId: province.id,
        latitude: district.latitude,
        longitude: district.longitude,
        isActive: true,
      },
      select: { id: true },
    });
    districtIds.set(district.slug, record.id);
  }

  const quan7 = await prisma.location.findUniqueOrThrow({
    where: { type_slug: { type: "district", slug: "quan-7" } },
    select: { id: true },
  });
  districtIds.set("quan-7", quan7.id);

  const owner = await prisma.user.findUniqueOrThrow({
    where: { email: "seed.agent@anshome.local" },
    select: { id: true },
  });

  const category = await prisma.category.findUniqueOrThrow({
    where: { code: "sale_apartment" },
    select: { id: true },
  });

  for (const [index, listing] of listings.entries()) {
    const districtId = districtIds.get(listing.districtSlug);
    if (!districtId) {
      throw new Error(`Missing seed location for listing ${listing.publicId}.`);
    }

    const publishedAt = new Date(Date.now() - listing.publishedAgoMinutes * 60 * 1000);
    const record = await prisma.listing.upsert({
      where: { publicId: listing.publicId },
      create: {
        publicId: listing.publicId,
        ownerUserId: owner.id,
        projectId: null,
        transactionType: "sale",
        categoryId: category.id,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: "VND",
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId: province.id,
        districtId,
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
        ownerUserId: owner.id,
        projectId: null,
        transactionType: "sale",
        categoryId: category.id,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: "VND",
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId: province.id,
        districtId,
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

    for (let n = 0; n < 5; n += 1) {
      const storageKey = `seed/chung-cu/${listing.publicId}-${n}.jpg`;
      const media = await prisma.media.upsert({
        where: { storageKey },
        create: {
          ownerUserId: owner.id,
          storageKey,
          publicUrl: listing.imageUrl,
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 800,
          status: "approved",
        },
        update: {
          ownerUserId: owner.id,
          publicUrl: listing.imageUrl,
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

    console.log(
      `Upserted listing ${listing.publicId} (price: ${listing.price ?? "null"}, verified: ${listing.isVerified}, featured: ${listing.isFeatured})`
    );
  }

  const count = await prisma.listing.count({
    where: {
      publicId: { in: listings.map((listing) => listing.publicId) },
    },
  });
  console.log(`Total chung cu listings: ${count}`);
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
