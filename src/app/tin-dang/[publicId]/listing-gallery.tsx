"use client";

import { useMemo, useState } from "react";

export type ListingGalleryImage = {
  id: string;
  url: string;
  alt: string;
};

export function ListingGallery({ images }: { images: ListingGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];
  const thumbnails = useMemo(() => images.slice(0, 5), [images]);
  const total = Math.max(images.length, 1);
  const canNavigate = images.length > 1;

  function showPrevious() {
    if (!canNavigate) {
      return;
    }

    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    if (!canNavigate) {
      return;
    }

    setActiveIndex((current) => (current + 1) % images.length);
  }

  return (
    <section>
      <div className="relative h-[320px] overflow-hidden rounded-md bg-[#828a82]">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage.url} alt={activeImage.alt} className="mx-auto h-full w-full object-cover md:w-[470px]" />
        ) : (
          <div className="grid h-full place-items-center text-sm font-extrabold text-white">Chưa có ảnh tin đăng</div>
        )}
        <button
          type="button"
          aria-label="Ảnh trước"
          disabled={!canNavigate}
          onClick={showPrevious}
          className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-sm bg-white/85 text-[#59606b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Ảnh sau"
          disabled={!canNavigate}
          onClick={showNext}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-sm bg-white/85 text-[#59606b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRightIcon />
        </button>
        <div className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-extrabold text-white">
          {activeImage ? activeIndex + 1 : 0} / {total}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }, (_, index) => thumbnails[index]).map((item, index) => (
          item ? (
            <button
              key={item.id}
              type="button"
              aria-label={`Xem ảnh ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-[58px] overflow-hidden rounded-sm border ${index === activeIndex ? "border-[#2f97a0]" : "border-[#d8dde5]"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
            </button>
          ) : (
            <div key={`gallery-placeholder-${index}`} className="h-[58px] rounded-sm border border-[#d8dde5] bg-[#edf0f2]" />
          )
        ))}
      </div>
    </section>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
