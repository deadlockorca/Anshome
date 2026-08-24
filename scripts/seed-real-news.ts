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

type RealNewsSeed = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  publishedAtOffsetDays: number;
};

const realNewsArticles: RealNewsSeed[] = [
  {
    slug: "suc-hut-tu-phan-khu-limassol",
    title:
      "Sức Hút Từ Phân Khu Limassol – 'Mảnh Ghép' Đầu Tiên Của Siêu Đô Thị Đảo 1.300 ha Tại Vũng Tàu",
    excerpt:
      "Khởi đầu cho hành trình kiến tạo siêu đô thị đảo Gold Coast Vũng Tàu, phân khu Limassol được giới thiệu là mảnh ghép tiên phong, mở ra thế giới nghỉ dưỡng sang trọng và giải trí bất tận.",
    body: "Với tổng diện tích lên đến 1.300 ha, siêu đô thị đảo Gold Coast Vũng Tàu đang dần hình thành như một điểm đến mới cho thị trường bất động sản nghỉ dưỡng phía Nam. Phân khu Limassol, với vị trí đắc địa ven biển, sở hữu tầm nhìn toàn cảnh ra biển Đông, hứa hẹn mang đến không gian sống đẳng cấp cho cư dân và nhà đầu tư. Dự án được phát triển bởi chủ đầu tư uy tín với quy hoạch đồng bộ, tích hợp đầy đủ tiện ích nội khu như hồ bơi vô cực, công viên trung tâm, trung tâm thương mại và khu vui chơi giải trí. Phân khu Limassol được kỳ vọng sẽ trở thành tâm điểm thu hút dòng tiền đầu tư bất động sản nghỉ dưỡng tại khu vực Vũng Tàu trong năm 2026.",
    coverUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82",
    publishedAtOffsetDays: 1,
  },
  {
    slug: "agora-city-tam-diem-thu-hut-dong-tien",
    title: "Agora City - Tâm Điểm Thu Hút Dòng Tiền Khu Tây TP.HCM",
    excerpt:
      "Agora City nổi lên như một điểm sáng trên thị trường bất động sản khu Tây TP.HCM với quy mô lớn và tiềm năng tăng giá vượt trội.",
    body: "Tọa lạc tại cửa ngõ phía Tây thành phố, Agora City là dự án đô thị phức hợp quy mô lớn với tổng vốn đầu tư hàng nghìn tỷ đồng. Dự án được quy hoạch bài bản với các phân khu chức năng gồm căn hộ cao cấp, nhà phố thương mại, trung tâm thương mại và khu văn phòng. Với lợi thế kết nối trực tiếp với các tuyến giao thông huyết mạch như Quốc lộ 1A, cao tốc TP.HCM - Trung Lương, Agora City hứa hẹn trở thành đô thị vệ tinh sầm uất, thu hút cư dân từ nội thành về an cư và đầu tư. Các chuyên gia đánh giá dự án có tiềm năng tăng giá tốt nhờ hạ tầng khu vực đang được đầu tư mạnh mẽ.",
    coverUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82",
    publishedAtOffsetDays: 2,
  },
  {
    slug: "city-rise-do-thi-toan-dien-phong-cach-resort",
    title:
      "City Rise - Đô Thị Toàn Diện Phong Cách Resort Giữa Phổ Yên: Sống Hiện Đại, Kết Nối Tinh Hoa",
    excerpt:
      "City Rise mang đến một không gian sống đô thị hiện đại, tích hợp phong cách resort ngay giữa lòng Phổ Yên, Thái Nguyên.",
    body: "City Rise là dự án khu đô thị phức hợp quy mô lớn tại Phổ Yên, Thái Nguyên, được phát triển bởi chủ đầu tư giàu kinh nghiệm. Với mật độ xây dựng thấp, quỹ cây xanh mặt nước lớn, dự án mang đến không gian sống trong lành, gần gũi thiên nhiên. Dự án bao gồm các sản phẩm nhà phố, biệt thự và căn hộ chung cư cao cấp, đáp ứng đa dạng nhu cầu của khách hàng. Hệ thống tiện ích nội khu đồng bộ với hồ bơi, công viên, trường học, bệnh viện và trung tâm thương mại tạo nên một cộng đồng dân cư văn minh, hiện đại. Với vị trí chiến lược kết nối thuận tiện về Hà Nội, City Rise hứa hẹn là điểm đến lý tưởng cho những gia đình tìm kiếm không gian sống chất lượng.",
    coverUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
    publishedAtOffsetDays: 3,
  },
  {
    slug: "cong-ty-cp-mai-ba-huong-kick-off",
    title: "Công Ty CP Mai Bá Hương Tổ Chức Kick Off Tại ThiskyHall, TP.HCM",
    excerpt:
      "Công ty CP Mai Bá Hương tổ chức thành công sự kiện Kick Off triển khai kế hoạch kinh doanh năm 2026 tại ThiskyHall, TP.HCM.",
    body: "Sự kiện Kick Off của Công ty CP Mai Bá Hương diễn ra trong không khí sôi động tại ThiskyHall, TP.HCM với sự tham gia của đông đảo nhân viên và đối tác. Tại sự kiện, ban lãnh đạo công ty đã công bố chiến lược kinh doanh năm 2026 với mục tiêu mở rộng thị phần và ra mắt các dự án mới tại thị trường phía Nam. Đây là một trong những doanh nghiệp bất động sản có uy tín trên thị trường, sở hữu quỹ đất lớn tại các tỉnh phía Nam và đang triển khai nhiều dự án nhà ở xã hội và thương mại. Sự kiện đánh dấu bước khởi đầu thuận lợi cho một năm kinh doanh mới đầy hứa hẹn.",
    coverUrl:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=82",
    publishedAtOffsetDays: 4,
  },
];

function deterministicPublishedAt(offsetDays: number): Date {
  const date = new Date();
  date.setHours(10 - offsetDays, 0, 0, 0);
  if (date.getTime() > Date.now()) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}

async function main() {
  const newsCategory = await prisma.articleCategory.findUniqueOrThrow({
    where: { slug: "tin-tuc" },
    select: { id: true, name: true },
  });

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let mediaCreatedCount = 0;

  for (const article of realNewsArticles) {
    const storageKey = `seed/news/${article.slug}.jpg`;

    const existingMedia = await prisma.media.findUnique({
      where: { storageKey },
      select: { id: true },
    });

    const media = await prisma.media.upsert({
      where: { storageKey },
      create: {
        storageKey,
        publicUrl: article.coverUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      update: {
        publicUrl: article.coverUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      select: { id: true },
    });
    if (!existingMedia) {
      mediaCreatedCount += 1;
    }

    const publishedAt = deterministicPublishedAt(article.publishedAtOffsetDays);

    const existingArticle = await prisma.article.findUnique({
      where: { slug: article.slug },
      select: {
        id: true,
        categoryId: true,
        title: true,
        excerpt: true,
        body: true,
        coverMediaId: true,
        status: true,
        seoTitle: true,
        seoDescription: true,
        publishedAt: true,
      },
    });

    const data = {
      categoryId: newsCategory.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body: article.body,
      coverMediaId: media.id,
      status: "published" as const,
      seoTitle: article.title,
      seoDescription: article.excerpt,
      publishedAt,
    };

    if (existingArticle) {
      const unchanged =
        existingArticle.categoryId === data.categoryId &&
        existingArticle.title === data.title &&
        existingArticle.excerpt === data.excerpt &&
        existingArticle.body === data.body &&
        existingArticle.coverMediaId === data.coverMediaId &&
        existingArticle.status === data.status &&
        existingArticle.seoTitle === data.seoTitle &&
        existingArticle.seoDescription === data.seoDescription &&
        existingArticle.publishedAt?.getTime() === data.publishedAt.getTime();

      if (unchanged) {
        skippedCount += 1;
        console.log(`article unchanged: ${article.slug} (id=${existingArticle.id})`);
        continue;
      }

      await prisma.article.update({
        where: { id: existingArticle.id },
        data,
      });
      updatedCount += 1;
      console.log(`article updated: ${article.slug} (id=${existingArticle.id})`);
    } else {
      await prisma.article.create({ data });
      createdCount += 1;
      console.log(`article created: ${article.slug}`);
    }
  }

  const newsArticles = await prisma.article.findMany({
    where: { category: { slug: "tin-tuc" } },
    orderBy: { publishedAt: "desc" },
    select: { title: true, publishedAt: true },
  });

  console.log(`category: ${newsCategory.name} (id=${newsCategory.id})`);
  console.log(`articles created: ${createdCount}, updated: ${updatedCount}, unchanged: ${skippedCount}`);
  console.log(`media created: ${mediaCreatedCount}`);
  console.log(`total tin-tuc articles in DB: ${newsArticles.length}`);
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
