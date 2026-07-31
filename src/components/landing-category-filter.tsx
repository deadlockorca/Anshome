"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useRef } from "react";

type CategoryFilterOption = {
  label: string;
  kind: "option" | "group";
  icon?: "all" | "apartment" | "building" | "house" | "land" | "farm" | "warehouse" | "other";
  selected?: boolean;
};

const dropdownPanelWidth = 380;

function useDropdownPosition(isOpen: boolean, align: "left" | "right" = "left") {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ left: 8, top: 0, width: dropdownPanelWidth });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const width = Math.min(dropdownPanelWidth, window.innerWidth - 16);
      const preferredLeft = align === "right" ? rect.right - width : rect.left;
      const left = Math.min(Math.max(8, preferredLeft), window.innerWidth - width - 8);

      setPosition({
        left,
        top: rect.bottom + 10,
        width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, isOpen]);

  return {
    buttonRef,
    panelStyle: {
      left: position.left,
      top: position.top,
      width: position.width,
    },
  };
}

const priceOptions = [
  "Tất cả khoảng giá",
  "Dưới 500 triệu",
  "500 - 800 triệu",
  "800 triệu - 1 tỷ",
  "1 - 2 tỷ",
  "2 - 3 tỷ",
  "3 - 5 tỷ",
  "5 - 7 tỷ",
  "7 - 10 tỷ",
  "10 - 20 tỷ",
  "20 - 30 tỷ",
  "30 - 40 tỷ",
  "40 - 60 tỷ",
  "Trên 60 tỷ",
  "Thỏa thuận",
];

const areaOptions = [
  "Tất cả diện tích",
  "Dưới 30 m²",
  "30 - 50 m²",
  "50 - 80 m²",
  "80 - 100 m²",
  "100 - 150 m²",
  "150 - 200 m²",
  "200 - 250 m²",
  "250 - 300 m²",
  "300 - 500 m²",
  "Trên 500 m²",
];

const categoryOptions: CategoryFilterOption[] = [
  { label: "Tất cả nhà đất", kind: "option", icon: "all" },
  { label: "Căn hộ chung cư", kind: "option", icon: "apartment", selected: true },
  { label: "Chung cư mini, căn hộ dịch vụ", kind: "option", icon: "building" },
  { label: "Các loại nhà bán", kind: "group", icon: "house" },
  { label: "Nhà riêng", kind: "option" },
  { label: "Nhà biệt thự, liền kề", kind: "option" },
  { label: "Nhà mặt phố", kind: "option" },
  { label: "Shophouse, nhà phố thương mại", kind: "option" },
  { label: "Các loại đất bán", kind: "group", icon: "land" },
  { label: "Đất nền dự án", kind: "option" },
  { label: "Bán đất", kind: "option" },
  { label: "Trang trại, khu nghỉ dưỡng", kind: "option", icon: "farm" },
  { label: "Condotel", kind: "option" },
  { label: "Kho, nhà xưởng", kind: "option", icon: "warehouse" },
  { label: "Bất động sản khác", kind: "option", icon: "other" },
];

export function LandingCategoryFilter({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { buttonRef, panelStyle } = useDropdownPosition(isOpen, "left");
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative shrink-0 ${isOpen ? "z-[230]" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex h-9 min-w-[164px] shrink-0 items-center justify-between gap-2 rounded-md border bg-white px-2 shadow-[0_1px_1px_rgba(20,28,45,0.04)] ${
          isOpen ? "border-[#4a4a4a]" : "border-[#cfd1d4]"
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen
        ? createPortal(
            <>
          <button type="button" className="fixed inset-0 z-[210] cursor-default bg-white/70" aria-label="Đóng bộ lọc loại nhà đất" onClick={() => setIsOpen(false)} />
          <section
            className="fixed z-[230] grid h-[340px] max-w-[calc(100vw-24px)] grid-rows-[48px_minmax(0,1fr)_52px] overflow-hidden rounded-b-lg bg-white text-[#333333] shadow-[0_14px_30px_rgba(20,28,45,0.18)]"
            style={panelStyle}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
          >
            <header className="relative grid place-items-center border-b border-[#ececec]">
              <h2 id={titleId} className="text-[18px] font-black leading-none">
                Loại nhà đất
              </h2>
              <button type="button" className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#8e8e8e]" aria-label="Đóng" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </header>

            <div className="overflow-y-auto py-0.5">
              {categoryOptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="grid min-h-9 w-full grid-cols-[34px_minmax(0,1fr)_36px] items-center bg-white text-left text-[14px] font-semibold leading-tight hover:bg-[#efefef] focus-visible:bg-[#efefef] focus-visible:outline-none"
                >
                  <span className="grid place-items-center text-[#333333]">{item.icon ? <CategoryIcon icon={item.icon} /> : null}</span>
                  <span className={item.kind === "option" && !item.icon ? "pl-4" : ""}>{item.label}</span>
                  <span className="grid place-items-center">
                    <CheckBoxIcon selected={item.selected} />
                  </span>
                </button>
              ))}
            </div>

            <footer className="flex items-center justify-between border-t border-[#ececec] bg-white px-5">
              <button type="button" className="text-[14px] font-black text-[#333333]">
                Đặt lại
              </button>
              <button type="button" className="rounded-md bg-[#e83b35] px-4 py-2 text-[14px] font-black text-white" onClick={() => setIsOpen(false)}>
                Áp dụng
              </button>
            </footer>
          </section>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}

export function LandingPriceFilter() {
  return (
    <LandingRangeFilter
      buttonLabel="Khoảng giá"
      title="Khoảng giá"
      minLabel="Giá thấp nhất"
      maxLabel="Giá cao nhất"
      options={priceOptions}
      closeLabel="Đóng bộ lọc khoảng giá"
    />
  );
}

export function LandingAreaFilter() {
  return (
    <LandingRangeFilter
      buttonLabel="Diện tích"
      title="Diện tích"
      minLabel="Diện tích nhỏ nhất"
      maxLabel="Diện tích lớn nhất"
      options={areaOptions}
      closeLabel="Đóng bộ lọc diện tích"
      buttonClassName="min-w-[98px]"
    />
  );
}

function LandingRangeFilter({
  buttonLabel,
  title,
  minLabel,
  maxLabel,
  options,
  closeLabel,
  buttonClassName = "min-w-[108px]",
}: {
  buttonLabel: string;
  title: string;
  minLabel: string;
  maxLabel: string;
  options: string[];
  closeLabel: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { buttonRef, panelStyle } = useDropdownPosition(isOpen, "right");
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative shrink-0 ${isOpen ? "z-[230]" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex h-9 shrink-0 items-center justify-between gap-2 rounded-md border bg-white px-2 text-[#9a9a9a] shadow-[0_1px_1px_rgba(20,28,45,0.04)] ${buttonClassName} ${
          isOpen ? "border-[#4a4a4a]" : "border-[#cfd1d4]"
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="whitespace-nowrap">{buttonLabel}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen
        ? createPortal(
            <>
          <button type="button" className="fixed inset-0 z-[210] cursor-default bg-white/70" aria-label={closeLabel} onClick={() => setIsOpen(false)} />
          <section
            className="fixed z-[230] grid h-[340px] max-w-[calc(100vw-24px)] grid-rows-[48px_116px_minmax(0,1fr)_52px] overflow-hidden rounded-b-lg bg-white text-[#333333] shadow-[0_14px_30px_rgba(20,28,45,0.18)]"
            style={panelStyle}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
          >
            <header className="relative grid place-items-center border-b border-[#ececec]">
              <h2 id={titleId} className="text-[18px] font-black leading-none">
                {title}
              </h2>
              <button type="button" className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#8e8e8e]" aria-label="Đóng" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </header>

            <div className="border-b border-[#ececec] px-5 py-4">
              <div className="relative grid grid-cols-2 items-end gap-9">
                <label className="grid min-w-0 gap-2 text-[14px] font-black">
                  <span>{minLabel}</span>
                  <input type="text" inputMode="numeric" placeholder="Từ" className="h-10 min-w-0 rounded-md border border-[#cfd1d4] px-3 text-center text-[14px] font-bold text-[#777777] outline-none focus:border-[#0aa6ad]" />
                </label>
                <span className="pointer-events-none absolute bottom-0 left-1/2 grid h-10 w-9 -translate-x-1/2 place-items-center bg-white text-[22px] leading-none">→</span>
                <label className="grid min-w-0 gap-2 text-[14px] font-black">
                  <span>{maxLabel}</span>
                  <input type="text" inputMode="numeric" placeholder="Đến" className="h-10 min-w-0 rounded-md border border-[#cfd1d4] px-3 text-center text-[14px] font-bold text-[#777777] outline-none focus:border-[#0aa6ad]" />
                </label>
              </div>
              <div className="relative mt-5 h-6">
                <span className="absolute left-3 right-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#08a5aa]" />
                <span className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-[#9adadd] bg-[#09a7ae]" />
                <span className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-[#9adadd] bg-[#09a7ae]" />
              </div>
            </div>

            <div className="overflow-y-auto py-0.5">
              {options.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className="grid min-h-9 w-full grid-cols-[minmax(0,1fr)_42px] items-center bg-white px-5 text-left text-[14px] font-semibold leading-tight hover:bg-[#efefef] focus-visible:bg-[#efefef] focus-visible:outline-none"
                >
                  <span>{item}</span>
                  <span className="grid place-items-center">
                    <PriceRadioIcon selected={index === 0} />
                  </span>
                </button>
              ))}
            </div>

            <footer className="flex items-center justify-between border-t border-[#ececec] bg-white px-5">
              <button type="button" className="text-[14px] font-black text-[#333333]">
                Đặt lại
              </button>
              <button type="button" className="rounded-md bg-[#e83b35] px-4 py-2 text-[14px] font-black text-white" onClick={() => setIsOpen(false)}>
                Áp dụng
              </button>
            </footer>
          </section>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}

function ChevronDownIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className={`shrink-0 text-[#8e8e8e] ${isOpen ? "rotate-180" : ""}`}>
      <path d="M6.5 9L12 14.5L17.5 9" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckBoxIcon({ selected = false }: { selected?: boolean }) {
  return (
    <span className={`grid h-4 w-4 place-items-center rounded border-2 ${selected ? "border-[#e23d35] bg-[#e23d35] text-white" : "border-[#cfcfcf] bg-white text-transparent"}`}>
      <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M6 12.4L10 16.4L18.4 7.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PriceRadioIcon({ selected = false }: { selected?: boolean }) {
  return (
    <span className={`grid h-4 w-4 place-items-center rounded-full border-2 ${selected ? "border-[#e23d35]" : "border-[#cfcfcf]"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-[#e23d35]" : "bg-transparent"}`} />
    </span>
  );
}

function CategoryIcon({ icon }: { icon: NonNullable<CategoryFilterOption["icon"]> }) {
  if (icon === "apartment" || icon === "building") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
        <path d="M6 28V9L18 5V28M18 13H26V28" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M10 13H13M10 18H13M10 23H13M21 18H24M21 23H24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "house" || icon === "all") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
        <path d="M5 15L16 6L27 15V28H20V20H12V28H5V15Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M13 28V23H19V28" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  if (icon === "land") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
        <path d="M6 25V10L13 13L19 8L26 11V26L19 23L13 28L6 25Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M13 13V28M19 8V23M10 9.5A3 3 0 1 0 10 3.5A3 3 0 0 0 10 9.5ZM10 9.5V14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "farm") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
        <path d="M6 28V14L16 7L26 14V28H6Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M11 28V20H21V28M10 16H13M19 16H22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "other") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
        <path d="M8 22C11 18 14 18 16 21C18 18 21 18 24 22L21 27H11L8 22Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M11 14L18 7L25 14M13 13V19M23 13V19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 32 32" fill="none">
      <path d="M6 27V10L16 5L26 10V27H6Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M11 15H14M18 15H21M11 20H14M18 20H21M12 27V23H20V27" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}
