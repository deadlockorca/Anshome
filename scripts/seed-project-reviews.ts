import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const projectNames = [
  "The Royal - Five Star Eco City",
  "The Peak Garden",
  "Cloud Icon L' Avenir",
  "Prosper Phố Đông",
];

const reviewTemplates: Array<{ rating: number; title: string; content: string }> = [
  {
    rating: 5,
    title: "Dự án đáng sống, hạ tầng tốt",
    content: "Mình đã khảo sát khu vực nhiều lần, hạ tầng xung quanh khá hoàn thiện, giao thông thuận tiện và tiện ích nội khu đầy đủ.",
  },
  {
    rating: 4,
    title: "Vị trí đẹp, tiện ích đầy đủ",
    content: "Vị trí dự án rất tốt, gần trung tâm. Tiện ích nội khu như hồ bơi, gym đều đã đưa vào vận hành. Giá bán hơi cao so với mặt bằng chung.",
  },
  {
    rating: 4,
    title: "Chất lượng xây dựng ổn định",
    content: "Theo dõi dự án từ giai đoạn mở bán, tiến độ thi công đúng cam kết. Chủ đầu tư uy tín, hỗ trợ khách hàng nhiệt tình.",
  },
  {
    rating: 5,
    title: "Khu đô thị xanh, đáng đầu tư",
    content: "Không gian xanh thoáng mát, mật độ xây dựng hợp lý. Pháp lý rõ ràng, tiềm năng tăng giá tốt trong dài hạn.",
  },
  {
    rating: 4,
    title: "Phù hợp cho gia đình trẻ",
    content: "Thiết kế căn hộ thông minh, phù hợp gia đình nhỏ. An ninh tốt, có trường học và siêu thị trong khu.",
  },
  {
    rating: 4,
    title: "Môi trường sống lý tưởng",
    content: "Không khí trong lành, yên tĩnh nhưng vẫn gần các tiện ích lớn. Bàn giao đúng tiến độ, nội thất đạt chất lượng.",
  },
  {
    rating: 5,
    title: "Đầu tư sinh lời tốt",
    content: "Thanh khoản tốt, giá thuê ổn định. Hạ tầng khu vực đang phát triển mạnh, dự kiến giá trị tiếp tục tăng.",
  },
  {
    rating: 4,
    title: "Ban quản lý chuyên nghiệp",
    content: "Đội ngũ bán hàng tư vấn rõ ràng, ban quản lý vận hành chuyên nghiệp. Dịch vụ khách hàng phản hồi nhanh.",
  },
  {
    rating: 5,
    title: "Thiết kế hiện đại, đẳng cấp",
    content: "Kiến trúc sang trọng, sảnh đón rộng rãi, thang máy tốc độ cao. Cảm giác sống ở đây rất thoải mái.",
  },
  {
    rating: 4,
    title: "Tiến độ xây dựng minh bạch",
    content: "Chủ đầu tư cập nhật tiến độ thường xuyên, chất lượng công trình được kiểm soát tốt. Đáng tin cậy để xuống tiền.",
  },
];

function normalizeName(name: string): string {
  return name.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function recalculateProjectRating(projectId: string): Promise<void> {
  const grouped = await prisma.projectReview.groupBy({
    by: ["rating"],
    where: { projectId, status: "approved" },
    _count: { _all: true },
  });

  const total = grouped.reduce((sum, item) => sum + item._count._all, 0);
  if (total === 0) {
    await prisma.project.update({
      where: { id: projectId },
      data: { ratingAverage: null, ratingCount: 0, ratingBreakdown: Prisma.DbNull },
    });
    return;
  }

  const weightedSum = grouped.reduce((sum, item) => sum + item.rating * item._count._all, 0);
  const breakdown: Record<string, number> = {};
  for (let star = 5; star >= 1; star -= 1) {
    breakdown[String(star)] = grouped.find((item) => item.rating === star)?._count._all ?? 0;
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      ratingAverage: Math.round((weightedSum / total) * 100) / 100,
      ratingCount: total,
      ratingBreakdown: breakdown,
    },
  });
}

async function main() {
  const projects = await prisma.project.findMany({ select: { id: true, slug: true, name: true } });
  const projectByNormalizedName = new Map(projects.map((project) => [normalizeName(project.name), project]));
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

  const agentUsers = await prisma.user.findMany({
    where: { roles: { some: { role: { code: "agent" } } } },
    orderBy: { createdAt: "asc" },
    take: 9,
    select: { id: true, profile: { select: { displayName: true } } },
  });

  if (agentUsers.length < 3) {
    throw new Error("Not enough agent users to seed project reviews (need at least 3).");
  }

  let created = 0;
  let skipped = 0;

  for (let projectIndex = 0; projectIndex < projectNames.length; projectIndex += 1) {
    const name = projectNames[projectIndex];
    const project = projectByNormalizedName.get(normalizeName(name)) ?? projectBySlug.get(name);

    if (!project) {
      console.warn(`project not found: ${name} (skipped)`);
      continue;
    }

    for (let reviewIndex = 0; reviewIndex < 3; reviewIndex += 1) {
      const user = agentUsers[(projectIndex * 3 + reviewIndex) % agentUsers.length];
      const template = reviewTemplates[(projectIndex * 3 + reviewIndex) % reviewTemplates.length];

      const existing = await prisma.projectReview.findUnique({
        where: { projectId_userId: { projectId: project.id, userId: user.id } },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
        console.log(`project: ${name} -> review by ${user.profile?.displayName ?? user.id} already exists (skipped)`);
        continue;
      }

      await prisma.projectReview.create({
        data: {
          projectId: project.id,
          userId: user.id,
          rating: template.rating,
          title: template.title,
          content: template.content,
          status: "approved",
        },
      });
      created += 1;
      console.log(`project: ${name} -> review ${template.rating}★ by ${user.profile?.displayName ?? user.id} created`);
    }
  }

  for (const project of projects) {
    await recalculateProjectRating(project.id);
  }

  console.log(`created: ${created}, skipped: ${skipped}, recalculated ratings for ${projects.length} projects`);
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
