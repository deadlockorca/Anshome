"use client";

import type { CSSProperties, FocusEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const searchTabs = [
  { label: "Mua bán", href: "/tin-dang", transactionType: "sale" },
  { label: "Cho thuê", href: "/tin-dang", transactionType: "rent" },
  { label: "Dự án", href: "/du-an" },
] as const;

export function HomeSearch() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeTab = searchTabs[activeIndex] ?? searchTabs[0];
  const indicatorStyle = { "--search-tab-index": activeIndex } as CSSProperties;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("q")?.toString().trim();
    const params = new URLSearchParams();

    if (keyword) {
      params.set("q", keyword);
    }

    if ("transactionType" in activeTab) {
      params.set("transactionType", activeTab.transactionType);
    }

    const query = params.toString();
    router.push(query ? `${activeTab.href}?${query}` : activeTab.href);
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setIsPanelOpen(false);
    }
  }

  return (
    <section className="search-card" aria-label="Tìm kiếm bất động sản">
      <div className="search-tabs" role="tablist" aria-label="Loại tìm kiếm">
        {searchTabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className="search-tab"
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
        <div className="tab-indicator" aria-hidden style={indicatorStyle} />
      </div>

      <form className="search-row" onSubmit={handleSubmit} onFocus={() => setIsPanelOpen(true)} onBlur={handleBlur}>
        <label className="input-wrap" aria-label="Tìm kiếm">
          <span className="input-icon">
            <SearchIcon />
          </span>
          <input name="q" type="text" placeholder="VD: Bán nhà Bình Thạnh dưới 5 tỷ" className="search-input" />
        </label>
        <button type="submit" className="search-btn">
          Tìm kiếm
        </button>

        {isPanelOpen ? (
          <div className="search-suggest-panel">
            <div className="search-address-row">
              <span>Tìm theo địa chỉ mới sau sáp nhập</span>
              <button type="button" className="search-toggle" aria-label="Tìm theo địa chỉ mới sau sáp nhập" aria-pressed="false">
                <span />
              </button>
            </div>
            <div className="search-help">
              <span className="search-help-icon" aria-hidden>
                i
              </span>
              <div>
                <p>Nhập từ khóa bạn muốn tìm. Ví dụ:</p>
                <ul>
                  <li>Bán chung cư Vinhomes giá 5 tỷ</li>
                  <li>Bán chung cư Quận Bình Thạnh 2 phòng ngủ</li>
                  <li>Bán đất nền dự án</li>
                  <li>Cho thuê nhà trọ dưới 10 triệu</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
