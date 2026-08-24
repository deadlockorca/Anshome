import { db } from "@/lib/db";

export async function publishDueScheduledArticles(): Promise<void> {
  await db.article.updateMany({
    where: {
      status: "scheduled",
      publishedAt: {
        lte: new Date(),
      },
    },
    data: { status: "published" },
  });
}
