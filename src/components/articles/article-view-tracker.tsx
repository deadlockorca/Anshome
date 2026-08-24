"use client";

import { useEffect, useRef } from "react";
import { incrementArticleView } from "@/app/tin-tuc/article-actions";

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    void incrementArticleView(articleId);
  }, [articleId]);

  return null;
}
