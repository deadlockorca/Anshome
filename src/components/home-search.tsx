"use client";

import type { CSSProperties, FocusEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const searchTabs = [
  { label: "Mua bán", href: "/nha-dat-ban", transactionType: "sale" },
  { label: "Cho thuê", href: "/nha-dat-cho-thue", transactionType: "rent" },
  { label: "Dự án", href: "/du-an" },
] as const;

type HomeLocation = { id: string; fullName: string; slug: string; type: string; parentId: string | null };
type HomeCategory = { id: string; slug: string; transactionType: string; name: string };

type Props = { locations: HomeLocation[]; categories: HomeCategory[] };

export function HomeSearch({ locations, categories }: Props) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeTab = searchTabs[activeIndex] ?? searchTabs[0];
  const indicatorStyle = { "--search-tab-index": activeIndex } as CSSProperties;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("q")?.toString().trim() ?? "";

    if (activeTab.href === "/du-an") {
      // Dự án tab: only q
      const params = new URLSearchParams();
      if (keyword) params.set("q", keyword);
      router.push(params.toString() ? `/du-an?${params}` : "/du-an");
      return;
    }

    const parsed = parseSearchKeyword(keyword, activeTab.transactionType, locations, categories);
    const params = new URLSearchParams();

    if (keyword) params.set("q", keyword);
    for (const [key, value] of Object.entries(parsed)) {
      if (value) params.set(key, value);
    }
    if (activeTab.transactionType) {
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
          <input name="q" type="text" placeholder="Nhà riêng Thủ Đức dưới 5 tỷ" className="search-input" />
        </label>
        <button type="submit" className="search-btn">
          <span className="search-btn-label">Tìm kiếm</span>
          <span className="search-btn-icon">
            <SearchIcon />
          </span>
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

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/\p{Mark}/gu, "");
}

function parseNumber(s: string): number {
  return Number(s.replace(/\./g, "").replace(",", "."));
}

function parseSearchKeyword(
  keyword: string,
  transactionType: string | undefined,
  locations: HomeLocation[],
  categories: HomeCategory[],
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [unit, multiplier] of [
    ["tỷ", 1_000_000_000],
    ["triệu", 1_000_000],
  ] as const) {
    let match = keyword.match(new RegExp(`dưới\\s+([\\d.,]+)\\s*${unit}`));
    if (match) {
      result.maxPrice = String(parseNumber(match[1]) * multiplier);
    }

    match = keyword.match(new RegExp(`trên\\s+([\\d.,]+)\\s*${unit}`));
    if (match) {
      result.minPrice = String(parseNumber(match[1]) * multiplier);
    }

    match = keyword.match(new RegExp(`([\\d.,]+)\\s*[-–]\\s*([\\d.,]+)\\s*${unit}`));
    if (match) {
      result.minPrice = String(parseNumber(match[1]) * multiplier);
      result.maxPrice = String(parseNumber(match[2]) * multiplier);
    }
  }

  const bedroomMatch = keyword.match(/(\d+)\s*(?:phòng ngủ|pn|p\.n)/i);
  if (bedroomMatch) {
    const bedrooms = Number.parseInt(bedroomMatch[1], 10);
    result.bedrooms = String(bedrooms > 5 ? 5 : bedrooms);
  }

  const strippedKeyword = stripDiacritics(keyword).toLowerCase();
  const sortedLocations = [...locations].sort((a, b) => b.fullName.length - a.fullName.length);
  let matchedDistrict = false;

  for (const loc of sortedLocations) {
    if (strippedKeyword.includes(stripDiacritics(loc.fullName).toLowerCase())) {
      if (loc.type === "district") {
        result.districtId = loc.id;
        matchedDistrict = true;
      } else if (loc.type === "province" && !matchedDistrict) {
        result.provinceId = loc.id;
      }
      break;
    }
  }

  const keywordToCategory: Record<string, string> = {
    "căn hộ": "can-ho-chung-cu",
    "chung cư": "can-ho-chung-cu",
    "nhà riêng": "nha-rieng",
    "nhà": "nha-rieng",
    "biệt thự": "nha-biet-thu-lien-ke",
    "mặt phố": "nha-mat-pho",
    "đất nền": "dat-nen-du-an",
    "đất": "dat",
    "nhà trọ": "nha-tro-phong-tro",
    "văn phòng": "van-phong",
    "shophouse": "shophouse",
    "trang trại": "trang-trai-khu-nghi-duong",
  };

  const strippedCategoryNameMatches: Array<{ alias: string; slugPart: string }> = [];

  for (const [alias, slugPart] of Object.entries(keywordToCategory)) {
    if (strippedKeyword.includes(stripDiacritics(alias).toLowerCase())) {
      strippedCategoryNameMatches.push({ alias, slugPart });
    }
  }

  for (const category of categories) {
    const strippedName = stripDiacritics(category.name).toLowerCase();
    if (strippedKeyword.includes(strippedName)) {
      strippedCategoryNameMatches.push({ alias: category.name, slugPart: stripDiacritics(category.slug).toLowerCase() });
    }
  }

  const uniqueMatches = [...new Map(strippedCategoryNameMatches.map((match) => [match.slugPart, match])).values()].sort(
    (a, b) => b.slugPart.length - a.slugPart.length,
  );

  const prefix = transactionType === "sale" ? "ban-" : transactionType === "rent" ? "cho-thue-" : null;

  for (const { slugPart } of uniqueMatches) {
    if (prefix) {
      const preferred = categories.find((category) => {
        const stripped = stripDiacritics(category.slug).toLowerCase();
        return stripped.startsWith(prefix) && stripped.includes(slugPart);
      });

      if (preferred) {
        result.categoryId = preferred.slug;
        break;
      }
    }

    const anyMatch = categories.find((category) => stripDiacritics(category.slug).toLowerCase().includes(slugPart));

    if (anyMatch) {
      result.categoryId = anyMatch.slug;
      break;
    }
  }

  return result;
}

function SearchIcon() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
