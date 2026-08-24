"use server";

import { db } from "@/lib/db";

export async function incrementArticleView(articleId: string): Promise<void> {
  try {
    await db.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // silently ignore: view counting must never break the page
  }
}
