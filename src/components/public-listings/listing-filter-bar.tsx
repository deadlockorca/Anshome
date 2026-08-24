"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type ListingFilterBarProps = {
  actionPath: string;
  params: {
    q?: string;
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    verified?: string;
    sort?: string;
    bedrooms?: string;
    direction?: string;
    bathrooms?: string;
    balconyDirection?: string;
    projectId?: string;
    price?: string;
    area?: string;
    agent?: string;
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    page?: string;
  };
  categoryOptions: Array<{ slug: string; label: string; isActive: boolean }>;
  pricePresets: Array<{ label: string; min?: string; max?: string }>;
  areaPresets: Array<{ label: string; min?: string; max?: string }>;
  provinces?: Array<{ id: string; fullName: string }>;
  districts?: Array<{ id: string; fullName: string; parentId: string | null }>;
  projects?: Array<{ id: string; name: string; provinceId: string | null }>;
};

const BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-[#cfd1d4] bg-white px-3 text-[13px] font-bold text-[#5e6269] transition hover:border-[#9da2aa] hover:text-[#20242d]";
const BUTTON_ACTIVE_CLASS = " border-brand bg-brand-soft text-brand";
const PANEL_CLASS =
  "fixed z-[120] w-72 overflow-y-auto rounded-md border border-[#e1e4ea] bg-white p-2 shadow-[0_12px_32px_rgba(20,28,45,0.14)]";
const OPTION_CLASS =
  "block rounded-md px-3 py-2 text-[13px] font-bold text-[#303743] hover:bg-[#f4f5f7] hover:text-brand";
const CHIP_CLASS =
  "inline-flex items-center gap-1 rounded-md border border-[#d8dce3] px-3 py-1.5 text-[13px] font-extrabold text-[#303743] transition hover:border-brand hover:text-brand";
const CHIP_ACTIVE_CLASS = " border-brand bg-brand-soft text-brand";

function buildHref(
  actionPath: string,
  params: ListingFilterBarProps["params"],
  overrides: Record<string, string | undefined>,
): string {
  const merged: Record<string, string | undefined> = { ...params, ...overrides };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (key === "page" || key === "transactionType") {
      continue;
    }
    if (value !== undefined && value !== "") {
      query.set(key, value);
    }
  }
  const queryString = query.toString();
  return queryString ? `${actionPath}?${queryString}` : actionPath;
}

function CheckIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand">
      <path d="M5 12.5 9.8 17.3 19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-1 shrink-0 text-[#8f9399]">
      <path d="m5.5 8.5 6.5 6.5 6.5-6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#30343d]">
      <path d="M3 5h18l-7 8v5.5l-4 2V13L3 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded bg-[#07935f] text-white">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="m5.5 12.5 4 4L18.5 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function AgentBadgeIcon() {
  return (
    <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0aa6aa] text-[10px] text-white shadow-[inset_0_-2px_0_#f2b840]">
      ★
    </span>
  );
}

function Dropdown({
  label,
  active,
  panelClassName,
  children,
}: {
  label: ReactNode;
  active: boolean;
  panelClassName?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{ left: number; top: number; maxHeight: number; openAbove: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function updatePanelPosition() {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const panelWidth = 288;
    const viewportGap = 12;
    const spaceBelow = window.innerHeight - rect.bottom - viewportGap;
    const spaceAbove = rect.top - viewportGap;
    const openAbove = spaceBelow < 240 && spaceAbove > spaceBelow;

    setPanelPosition({
      left: Math.max(viewportGap, Math.min(rect.left, window.innerWidth - panelWidth - viewportGap)),
      top: openAbove ? rect.top - 4 : rect.bottom + 4,
      maxHeight: Math.max(160, Math.min(360, openAbove ? spaceAbove : spaceBelow)),
      openAbove,
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    function handleViewportChange() {
      updatePanelPosition();
    }
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (!open) updatePanelPosition();
          setOpen((value) => !value);
        }}
        className={`${BUTTON_CLASS}${active ? BUTTON_ACTIVE_CLASS : ""}`}
      >
        {label}
        <ChevronIcon />
      </button>
      {open && panelPosition
        ? createPortal(
            <div
              ref={panelRef}
              className={panelClassName ?? PANEL_CLASS}
              role="dialog"
              style={{
                left: panelPosition.left,
                top: panelPosition.top,
                maxHeight: panelPosition.maxHeight,
                transform: panelPosition.openAbove ? "translateY(-100%)" : undefined,
              }}
            >
              {children(() => setOpen(false))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
function OptionRow({
  href,
  active,
  onSelect,
  children,
}: {
  href: string;
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={onSelect} className={`${OPTION_CLASS} ${active ? "text-brand" : ""}`}>
      <span className="flex items-center justify-between gap-2">
        <span>{children}</span>
        {active ? <CheckIcon /> : null}
      </span>
    </Link>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <div className="text-[13px] font-extrabold text-[#20242d]">{children}</div>;
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full cursor-pointer rounded-md border border-[#d8dce3] bg-white px-3 py-1.5 text-[13px] font-bold text-[#303743] focus:border-brand focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ListingFilterBar({
  actionPath,
  params,
  categoryOptions,
  pricePresets,
  areaPresets,
  provinces = [],
  districts = [],
  projects = [],
}: ListingFilterBarProps) {
  const router = useRouter();
  const activeFilterCount = [
    params.bedrooms,
    params.direction,
    params.bathrooms,
    params.balconyDirection,
    params.projectId,
    params.verified,
    params.agent,
    params.price,
    params.area,
    params.minPrice,
    params.maxPrice,
    params.minArea,
    params.maxArea,
    params.categoryId,
  ].filter((value): value is string => value !== undefined && value !== "").length;

  const activeCategory = categoryOptions.find((option) => option.isActive);
  const activePricePreset = pricePresets.find(
    (preset) => params.price === `${preset.min ?? ""}-${preset.max ?? ""}`,
  );
  const activeAreaPreset = areaPresets.find(
    (preset) => params.area === `${preset.min ?? ""}-${preset.max ?? ""}`,
  );

  const push = (href: string) => router.push(href);

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (!openFilter) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenFilter(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [openFilter]);

  const visibleDistricts = params.provinceId
    ? districts.filter((district) => district.parentId === params.provinceId)
    : districts;
  const visibleProjects = params.provinceId
    ? projects.filter((project) => project.provinceId === params.provinceId)
    : projects;

  return (
    <>
      <button
        type="button"
        aria-expanded={openFilter}
        onClick={() => setOpenFilter(true)}
        className={`${BUTTON_CLASS}${activeFilterCount > 0 ? BUTTON_ACTIVE_CLASS : ""}`}
      >
        <FilterIcon />
        Lọc
        {activeFilterCount > 0 ? (
          <span className="rounded bg-brand px-1.5 py-0.5 text-[11px] leading-none text-white">{activeFilterCount}</span>
        ) : null}
      </button>

      {openFilter ? <div className="fixed inset-0 z-[100] bg-black/50" onClick={() => setOpenFilter(false)} /> : null}
      {openFilter ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-[101] w-[760px] max-w-[calc(100vw-32px)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[#e1e4ea] bg-white p-4 shadow-[0_24px_64px_rgba(20,28,45,0.25)]"
        >
          <div className="relative">
            <button
              type="button"
              aria-label="Đóng bộ lọc"
              onClick={() => setOpenFilter(false)}
              className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[#8a8f99] transition hover:bg-[#f4f5f7] hover:text-[#303743]"
            >
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="space-y-4">
                <div>
                  <SectionHeading>Khu vực & Dự án</SectionHeading>
                  <div className="mt-2 space-y-2">
                    <SelectField
                      value={params.provinceId ?? ""}
                      onChange={(provinceId) => push(buildHref(actionPath, params, { provinceId: provinceId || undefined, districtId: undefined }))}
                      options={provinces.map((province) => ({ value: province.id, label: province.fullName }))}
                      placeholder="Tất cả khu vực"
                    />
                    <SelectField
                      value={params.districtId ?? ""}
                      onChange={(districtId) => push(buildHref(actionPath, params, { districtId: districtId || undefined }))}
                      options={visibleDistricts.map((district) => ({ value: district.id, label: district.fullName }))}
                      placeholder="Tất cả quận/huyện"
                    />
                    <SelectField
                      value={params.projectId ?? ""}
                      onChange={(projectId) => push(buildHref(actionPath, params, { projectId: projectId || undefined }))}
                      options={visibleProjects.map((project) => ({ value: project.id, label: project.name }))}
                      placeholder="Tất cả dự án"
                    />
                  </div>
                </div>

                <div>
                  <SectionHeading>Khoảng giá</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pricePresets.map((preset) => {
                      const value = `${preset.min ?? ""}-${preset.max ?? ""}`;
                      const active = value === "" ? !params.price : params.price === value;
                      return (
                        <Link
                          key={preset.label}
                          href={buildHref(actionPath, params, { price: value || undefined, minPrice: undefined, maxPrice: undefined })}
                          className={`${CHIP_CLASS}${active ? CHIP_ACTIVE_CLASS : ""}`}
                        >
                          {preset.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <SectionHeading>Diện tích</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {areaPresets.map((preset) => {
                      const value = `${preset.min ?? ""}-${preset.max ?? ""}`;
                      const active = value === "" ? !params.area : params.area === value;
                      return (
                        <Link
                          key={preset.label}
                          href={buildHref(actionPath, params, { area: value || undefined, minArea: undefined, maxArea: undefined })}
                          className={`${CHIP_CLASS}${active ? CHIP_ACTIVE_CLASS : ""}`}
                        >
                          {preset.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <SectionHeading>Uy tín và chất lượng</SectionHeading>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold text-[#303743]">Tin xác thực</span>
                      <Link
                        href={buildHref(actionPath, params, { verified: params.verified === "true" ? undefined : "true" })}
                        aria-pressed={params.verified === "true"}
                        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                          params.verified === "true" ? "bg-brand" : "bg-[#d8dce3]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            params.verified === "true" ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </Link>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold text-[#303743]">Môi giới chuyên nghiệp</span>
                      <Link
                        href={buildHref(actionPath, params, { agent: params.agent === "true" ? undefined : "true" })}
                        aria-pressed={params.agent === "true"}
                        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                          params.agent === "true" ? "bg-brand" : "bg-[#d8dce3]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            params.agent === "true" ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </Link>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionHeading>Số phòng ngủ</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5"].map((bedrooms) => (
                      <Link
                        key={bedrooms}
                        href={buildHref(actionPath, params, { bedrooms })}
                        className={`${CHIP_CLASS}${params.bedrooms === bedrooms ? CHIP_ACTIVE_CLASS : ""}`}
                      >
                        {bedrooms === "5" ? "5+" : bedrooms}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeading>Số phòng tắm, WC</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5"].map((bathrooms) => (
                      <Link
                        key={bathrooms}
                        href={buildHref(actionPath, params, { bathrooms })}
                        className={`${CHIP_CLASS}${params.bathrooms === bathrooms ? CHIP_ACTIVE_CLASS : ""}`}
                      >
                        {bathrooms === "5" ? "5+" : bathrooms}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeading>Hướng nhà</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"].map((direction) => (
                      <Link
                        key={direction}
                        href={buildHref(actionPath, params, { direction })}
                        className={`${CHIP_CLASS}${params.direction === direction ? CHIP_ACTIVE_CLASS : ""}`}
                      >
                        {direction}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeading>Hướng ban công</SectionHeading>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"].map((balconyDirection) => (
                      <Link
                        key={balconyDirection}
                        href={buildHref(actionPath, params, { balconyDirection })}
                        className={`${CHIP_CLASS}${params.balconyDirection === balconyDirection ? CHIP_ACTIVE_CLASS : ""}`}
                      >
                        {balconyDirection}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#e1e4ea] pt-3">
              <Link href={actionPath} onClick={() => setOpenFilter(false)} className="text-[13px] font-extrabold text-brand hover:underline">
                Đặt lại tất cả
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <Link
        href={buildHref(actionPath, params, { verified: params.verified === "true" ? undefined : "true" })}
        aria-pressed={params.verified === "true"}
        className={`inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-md border bg-white px-3 text-[13px] font-bold transition hover:border-[#9da2aa] hover:text-[#20242d] ${
          params.verified === "true" ? "border-brand text-brand" : "border-[#cfd1d4] text-[#8b8f96]"
        }`}
      >
        <VerifiedIcon />
        <span>Tin xác thực</span>
        <span
          aria-hidden
          className={`relative inline-block h-4 w-8 shrink-0 rounded-full transition-colors ${params.verified === "true" ? "bg-brand" : "bg-[#c8c9cb]"}`}
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${params.verified === "true" ? "left-[18px]" : "left-0.5"}`}
          />
        </span>
      </Link>

      <Dropdown label={activeCategory?.label ?? "Loại nhà đất"} active={Boolean(activeCategory)}>
        {(close) => (
          <>
            <OptionRow
              href={buildHref(actionPath, params, { categoryId: undefined })}
              active={!activeCategory}
              onSelect={close}
            >
              Tất cả loại nhà đất
            </OptionRow>
            {categoryOptions.map((option) => (
              <OptionRow
                key={option.slug}
                href={buildHref(actionPath, params, { categoryId: option.slug })}
                active={option.isActive}
                onSelect={close}
              >
                {option.label}
              </OptionRow>
            ))}
          </>
        )}
      </Dropdown>

      <Dropdown label={activePricePreset?.label ?? "Khoảng giá"} active={Boolean(activePricePreset)}>
        {(close) => (
          <>
            {pricePresets.map((preset) => {
              const value = `${preset.min ?? ""}-${preset.max ?? ""}`;
              const active = value === "" ? !params.price : params.price === value;
              return (
                <OptionRow
                  key={preset.label}
                  href={buildHref(actionPath, params, { price: value || undefined })}
                  active={active}
                  onSelect={close}
                >
                  {preset.label}
                </OptionRow>
              );
            })}
          </>
        )}
      </Dropdown>

      <Dropdown label={activeAreaPreset?.label ?? "Diện tích"} active={Boolean(activeAreaPreset)}>
        {(close) => (
          <>
            {areaPresets.map((preset) => {
              const value = `${preset.min ?? ""}-${preset.max ?? ""}`;
              const active = value === "" ? !params.area : params.area === value;
              return (
                <OptionRow
                  key={preset.label}
                  href={buildHref(actionPath, params, { area: value || undefined })}
                  active={active}
                  onSelect={close}
                >
                  {preset.label}
                </OptionRow>
              );
            })}
          </>
        )}
      </Dropdown>

      <Link
        href={buildHref(actionPath, params, { agent: params.agent === "true" ? undefined : "true" })}
        aria-pressed={params.agent === "true"}
        className={`inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-md border bg-white px-3 text-[13px] font-bold transition hover:border-[#9da2aa] hover:text-[#20242d] ${
          params.agent === "true" ? "border-brand text-brand" : "border-[#cfd1d4] text-[#8b8f96]"
        }`}
      >
        <AgentBadgeIcon />
        <span>Môi giới chuyên nghiệp</span>
        <span
          aria-hidden
          className={`relative inline-block h-4 w-8 shrink-0 rounded-full transition-colors ${params.agent === "true" ? "bg-brand" : "bg-[#c8c9cb]"}`}
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${params.agent === "true" ? "left-[18px]" : "left-0.5"}`}
          />
        </span>
      </Link>
    </>
  );
}

export default ListingFilterBar;
