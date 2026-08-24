"use client";

import { useCallback, useEffect, useState } from "react";

const bannerProjects = [
  { name: "Vinhomes Global Gate", address: "Đường Cổ Loa, Xã Đông Hội, Đông Anh, Hà Nội", status: "selling", image: "/banners/du-an-banner-01-vinhomes-global-gate.jpg" },
  { name: "Vinhomes Wonder City", address: "Xã Tân Hội và Liên Trung, huyện Đan Phượng, Hà Nội", status: "selling", image: "/banners/du-an-banner-02-vinhomes-wonder-city.jpg" },
  { name: "The Queen", address: "360 Đường Giải Phóng, Phường Phương Liệt, Quận Thanh Xuân, Hà Nội", status: "selling", image: "/banners/du-an-banner-03-the-queen.jpg" },
  { name: "La Pura", address: "Đường Quốc Lộ 13, Phường Bình Hòa, Thuận An, Bình Dương", status: "selling", image: "/banners/du-an-banner-04-la-pura.jpg" },
  { name: "The Emerald Garden View", address: "Đường Nguyễn Chí Thanh, Phường Thuận An, TP. Hồ Chí Minh", status: "upcoming", image: "/banners/du-an-banner-05-emerald-garden.jpg" },
  { name: "Centa Riverside", address: "Đường Hữu Nghị, Phường Phù Chẩn, TP. Từ Sơn, Bắc Ninh", status: "selling", image: "/banners/du-an-banner-06-centa-riverside.jpg" },
  { name: "Dragon Eden", address: "Xã Lương Hòa, Huyện Bến Lức, Long An", status: "upcoming", image: "/banners/du-an-banner-07-dragon-eden.jpg" },
] as const;

const statusBadge = {
  selling: { label: "Đang mở bán", className: "bg-[#dcfff1] text-[#04a56a]" },
  upcoming: { label: "Sắp mở bán", className: "bg-[#fff3d6] text-[#e8a200]" },
} as const;

const AUTO_ADVANCE_MS = 5000;

export function FeaturedProjectsBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % bannerProjects.length) + bannerProjects.length) % bannerProjects.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % bannerProjects.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const active = bannerProjects[current];
  const badge = statusBadge[active.status];

  return (
    <section aria-label="Dự án nổi bật" className="border-b border-[#e1e4ea] bg-white">
      <div
        className="relative h-[260px] w-full overflow-hidden sm:h-[340px] lg:h-[420px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {bannerProjects.map((project, index) => (
          <div
            key={project.name}
            aria-hidden={index !== current}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={index === current ? project.name : ""} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-6 pb-12 sm:p-10 sm:pb-12">
          <span className={`inline-flex w-fit rounded px-2 py-1 text-[12px] font-black ${badge.className}`}>
            {badge.label}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{active.name}</h2>
          <p className="mt-2 max-w-2xl text-[14px] font-medium text-white/85">{active.address}</p>
        </div>

        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="Dự án trước"
          className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5L8 12L15 19" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="Dự án tiếp theo"
          className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5L16 12L9 19" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {bannerProjects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              aria-label={`Dự án ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${index === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
