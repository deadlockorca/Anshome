"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

const propertyGuideItems = [
  {
    title: "Bất động sản bán",
    icon: "sale",
    content: (
      <>
        Khám phá nguồn tin mua bán nhà đất đa dạng trên Anshome, từ <Link href="/ban-nha-rieng">nhà riêng</Link>,{" "}
        <Link href="/ban-nha-mat-pho">nhà mặt tiền</Link>, căn hộ, biệt thự, đất nền đến <Link href="/ban-shophouse">shophouse</Link> và nhiều loại hình khác.
      </>
    ),
  },
  {
    title: "Bất động sản cho thuê",
    icon: "rent",
    content: (
      <>
        Cập nhật thường xuyên các lựa chọn <Link href="/nha-dat-cho-thue">bất động sản cho thuê</Link> như phòng trọ, căn hộ, nhà riêng,{" "}
        <Link href="/cho-thue-biet-thu-lien-ke">biệt thự</Link>, văn phòng, kho xưởng và mặt bằng kinh doanh.
      </>
    ),
  },
  {
    title: "Đánh giá dự án",
    icon: "review",
    content: (
      <>
        Theo dõi các <Link href="/phan-tich-danh-gia">video đánh giá</Link>, phân tích vị trí, tiện ích và tiềm năng dự án để có thêm góc nhìn trước khi chọn nơi an cư lý tưởng hoặc cơ hội đầu tư sinh lời.
      </>
    ),
  },
  {
    title: "Wiki BĐS",
    icon: "wiki",
    content: (
      <>
        Tổng hợp kiến thức mua bán, cho thuê, vay mua nhà, pháp lý, thiết kế và <Link href="/wiki/phong-tuc">phong tục</Link>, giúp hành trình tìm nhà bớt rối và có cơ sở hơn.
      </>
    ),
  },
] as const;

type PropertyGuideItem = (typeof propertyGuideItems)[number];

function PropertyGuideIllustration({ icon }: { icon: PropertyGuideItem["icon"] }) {
  if (icon === "sale") {
    return (
      <svg aria-hidden viewBox="0 0 180 150" className="property-guide-icon">
        <path d="M35 116V47L62 32L88 47V116" fill="#ff7872" />
        <path d="M78 116V13H135V116" fill="#ffffff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M98 33H113V50H98ZM122 33H137V50H122ZM98 62H113V79H98ZM122 62H137V79H122Z" fill="#ff7872" />
        <path d="M145 116V71L174 58L203 71V116" transform="translate(-42 0)" fill="#ffffff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M108 116V88H133V116M71 67H86V82M71 93H86V108" fill="none" stroke="#e63c32" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 116H160" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 116V94C28 79 45 79 45 94V116M62 116V84C62 69 79 69 79 84V116" fill="#ffffff" stroke="currentColor" strokeWidth="4" />
        <path d="M28 104L20 96M28 101L37 92M62 98L51 88M62 95L73 82" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "rent") {
    return (
      <svg aria-hidden viewBox="0 0 180 150" className="property-guide-icon">
        <path d="M58 119V45H70V119" fill="#ffc6c1" />
        <path d="M42 119C47 102 60 96 76 103C88 108 94 104 104 98V119Z" fill="#ff7872" />
        <path d="M33 119H151" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M53 83H128" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <rect x="84" y="28" width="67" height="35" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="4" />
        <text x="117.5" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fill="#ff7872">THUE</text>
        <path d="M77 83L113 63L148 83V119H77Z" fill="#ffffff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M90 77L113 64L136 77" fill="none" stroke="#ff7872" strokeWidth="6" strokeLinecap="round" />
        <rect x="97" y="93" width="20" height="26" rx="4" fill="#e63c32" />
        <rect x="124" y="94" width="20" height="25" rx="4" fill="#e63c32" />
        <circle cx="143" cy="106" r="2.4" fill="#ffffff" />
      </svg>
    );
  }

  if (icon === "review") {
    return (
      <svg aria-hidden viewBox="0 0 180 150" className="property-guide-icon">
        <path d="M31 119V39L56 28L82 39V119" fill="#ff9b94" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M84 119V15H132L138 119" fill="#ffffff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M145 119V58H175V119" transform="translate(-24 0)" fill="#ffffff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M44 54H56V68H44ZM44 80H56V94H44ZM68 52H80V66H68ZM95 34H106V49H95ZM116 34H126V49H116ZM95 60H106V75H95ZM116 60H126V75H116ZM95 86H106V101H95Z" fill="#ff7872" />
        <rect x="111" y="91" width="55" height="32" rx="8" fill="#e63c32" />
        <path d="M134 100L150 107L134 115Z" fill="#ffffff" />
        <path d="M32 119H160" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M75 119V96C75 81 92 81 92 96V119M75 107L65 97M75 104L85 91" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 180 150" className="property-guide-icon">
      <path d="M35 119H145" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <rect x="50" y="83" width="72" height="30" rx="3" fill="#ffd0cc" stroke="currentColor" strokeWidth="4" />
      <path d="M65 83V113M91 83V113M122 83V113" stroke="currentColor" strokeWidth="4" />
      <path d="M71 70H132C137 70 140 75 137 80L134 84H69L66 80C63 75 66 70 71 70Z" fill="#ffffff" stroke="currentColor" strokeWidth="4" />
      <path d="M70 52H132C137 52 140 57 137 62L134 67H69L66 62C63 57 66 52 70 52Z" fill="#ffffff" stroke="currentColor" strokeWidth="4" />
      <path d="M76 50V24L108 9L141 24V50" fill="#ffd0cc" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 28L108 11L144 28" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <rect x="89" y="34" width="18" height="16" rx="4" fill="#e63c32" />
      <rect x="116" y="34" width="18" height="30" rx="5" fill="#e63c32" />
      <circle cx="129" cy="50" r="2.2" fill="#ffffff" />
      <path d="M140 41L163 35L177 112L153 117Z" fill="#ffd0cc" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M153 82L171 77M157 100L175 95" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function PropertyGuideCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % propertyGuideItems.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className="property-guide-zone" aria-label="Thông tin bất động sản Anshome">
      <div className="stage-shell property-guide-shell">
        <div className="property-guide-viewport">
          <div
            className="property-guide-grid"
            style={{ "--property-guide-index": activeIndex } as CSSProperties}
          >
            {propertyGuideItems.map((item) => (
              <article key={item.title} className="property-guide-card">
                <PropertyGuideIllustration icon={item.icon} />
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="property-guide-dots" role="tablist" aria-label="Chọn nội dung hướng dẫn">
          {propertyGuideItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`property-guide-dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Xem ${item.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
