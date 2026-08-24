"use client";

import { useState, useActionState } from "react";
import { createProjectReview } from "@/app/du-an/review-actions";

const STAR_LABELS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

function ReviewFields() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const activeStar = hovered || selected;

  return (
    <div className="grid gap-3">
      <div>
        <label className="text-xs font-bold uppercase text-[#6c7280]">Chọn số sao</label>
        <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} sao`}
              onClick={() => setSelected(star)}
              onMouseEnter={() => setHovered(star)}
              className="p-0.5"
            >
              <svg
                aria-hidden
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={star <= activeStar ? "#f5a623" : "none"}
                stroke={star <= activeStar ? "#f5a623" : "#c3c7cf"}
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="transition-colors"
              >
                <path d="M12 2.5l2.94 6.03 6.67.84-4.9 4.61 1.26 6.6L12 17.4l-5.97 3.18 1.26-6.6-4.9-4.61 6.67-.84L12 2.5z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm font-bold text-[#6c7280]">{STAR_LABELS[activeStar]}</span>
        </div>
        <input type="hidden" name="rating" value={selected} />
      </div>
      <input
        name="title"
        required
        minLength={5}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Tiêu đề đánh giá"
        className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]"
      />
      <textarea
        name="content"
        rows={4}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Nội dung nhận xét (tùy chọn)"
        className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]"
      />
    </div>
  );
}

export function ProjectReviewForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(createProjectReview.bind(null, projectId), undefined);

  return (
    <form action={formAction} className="mt-4 grid gap-3">
      <ReviewFields key={state?.status === "success" ? "ok" : "form"} />
      <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#a92a23]">
        Gửi đánh giá
      </button>
      {state?.status === "success" ? (
        <p className="rounded-md bg-[#e8f6ee] px-3 py-2 text-[13px] font-bold text-[#0d7a3f]" role="status">
          {state.message}
        </p>
      ) : null}
      {state?.status === "error" ? (
        <p className="rounded-md bg-[#fdecec] px-3 py-2 text-[13px] font-bold text-[#b42318]" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
