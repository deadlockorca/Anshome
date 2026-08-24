"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type MobileMenuItem = {
  label: string;
  href: string;
  icon: "saved" | "sale" | "rent" | "project" | "news" | "wiki" | "analysis" | "directory";
  submenu?: {
    label: string;
    href: string;
  }[];
};

const mobileMenuItems: MobileMenuItem[] = [
  { label: "Tin đăng đã lưu", href: "/tin-da-luu", icon: "saved" },
  {
    label: "Nhà đất bán",
    href: "/nha-dat-ban",
    icon: "sale",
    submenu: [
      { label: "Bán căn hộ chung cư", href: "/ban-can-ho-chung-cu" },
      { label: "Bán chung cư mini, căn hộ dịch vụ", href: "/ban-chung-cu-mini-can-ho-dich-vu" },
      { label: "Bán nhà riêng", href: "/ban-nha-rieng" },
      { label: "Bán nhà biệt thự, liền kề", href: "/ban-nha-biet-thu-lien-ke" },
      { label: "Bán nhà mặt phố", href: "/ban-nha-mat-pho" },
      { label: "Bán shophouse, nhà phố thương mại", href: "/ban-shophouse-nha-pho-thuong-mai" },
      { label: "Bán đất nền dự án", href: "/ban-dat-nen-du-an" },
      { label: "Bán đất", href: "/ban-dat" },
      { label: "Bán trang trại, khu nghỉ dưỡng", href: "/ban-trang-trai-khu-nghi-duong" },
      { label: "Bán condotel", href: "/ban-condotel" },
      { label: "Bán kho, nhà xưởng", href: "/ban-kho-nha-xuong" },
      { label: "Bán loại bất động sản khác", href: "/ban-bat-dong-san-khac" },
    ],
  },
  {
    label: "Nhà đất cho thuê",
    href: "/nha-dat-cho-thue",
    icon: "rent",
    submenu: [
      { label: "Cho thuê căn hộ chung cư", href: "/cho-thue-can-ho-chung-cu" },
      { label: "Cho thuê chung cư mini, căn hộ dịch vụ", href: "/cho-thue-chung-cu-mini-can-ho-dich-vu" },
      { label: "Cho thuê nhà riêng", href: "/cho-thue-nha-rieng" },
      { label: "Cho thuê nhà biệt thự, liền kề", href: "/cho-thue-nha-biet-thu-lien-ke" },
      { label: "Cho thuê nhà mặt phố", href: "/cho-thue-nha-mat-pho" },
      { label: "Cho thuê shophouse, nhà phố thương mại", href: "/cho-thue-shophouse-nha-pho-thuong-mai" },
      { label: "Cho thuê nhà trọ, phòng trọ", href: "/cho-thue-nha-tro-phong-tro" },
      { label: "Cho thuê văn phòng", href: "/cho-thue-van-phong" },
      { label: "Cho thuê, sang nhượng cửa hàng, ki ốt", href: "/cho-thue-cua-hang-ki-ot" },
      { label: "Cho thuê kho, nhà xưởng, đất", href: "/cho-thue-kho-nha-xuong-dat" },
      { label: "Cho thuê loại bất động sản khác", href: "/cho-thue-bat-dong-san-khac" },
    ],
  },
  {
    label: "Dự án",
    href: "/du-an",
    icon: "project",
    submenu: [
      { label: "Căn hộ chung cư", href: "/du-an-can-ho-chung-cu" },
      { label: "Cao ốc văn phòng", href: "/du-an-cao-oc-van-phong" },
      { label: "Trung tâm thương mại", href: "/du-an-trung-tam-thuong-mai" },
      { label: "Khu đô thị mới", href: "/du-an-khu-do-thi-moi" },
      { label: "Khu phức hợp", href: "/du-an-khu-phuc-hop" },
      { label: "Nhà ở xã hội", href: "/du-an-nha-o-xa-hoi" },
      { label: "Khu nghỉ dưỡng, sinh thái", href: "/du-an-nghi-duong-sinh-thai" },
      { label: "Khu công nghiệp", href: "/du-an-khu-cong-nghiep" },
      { label: "Biệt thự, liền kề", href: "/du-an-biet-thu-lien-ke" },
      { label: "Shophouse", href: "/du-an-shophouse" },
      { label: "Nhà mặt phố", href: "/du-an-nha-mat-pho" },
      { label: "Dự án khác", href: "/du-an-khac" },
    ],
  },
  { label: "Tin tức", href: "/tin-tuc", icon: "news" },
  {
    label: "Wiki BĐS",
    href: "/wiki",
    icon: "wiki",
    submenu: [
      { label: "Mua BĐS", href: "/wiki/mua-bat-dong-san" },
      { label: "Bán BĐS", href: "/wiki/ban-bat-dong-san" },
      { label: "Thuê BĐS", href: "/wiki/thue-bat-dong-san" },
      { label: "Tài chính BĐS", href: "/wiki/tai-chinh-bat-dong-san" },
      { label: "Quy hoạch - Pháp lý", href: "/wiki/quy-hoach-phap-ly" },
      { label: "Nội - Ngoại thất", href: "/wiki/noi-ngoai-that" },
      { label: "Phong tục", href: "/wiki/phong-tuc" },
    ],
  },
  {
    label: "Phân tích đánh giá",
    href: "/phan-tich-danh-gia",
    icon: "analysis",
    submenu: [
      { label: "Biểu đồ giá", href: "/phan-tich-danh-gia/bieu-do-gia" },
      { label: "Video đánh giá", href: "/phan-tich-danh-gia/video-danh-gia" },
      { label: "Báo cáo thị trường", href: "/phan-tich-danh-gia/bao-cao-thi-truong" },
      { label: "Góc nhìn chuyên gia", href: "/phan-tich-danh-gia/goc-nhin-chuyen-gia" },
      { label: "Interkative Story", href: "/phan-tich-danh-gia/interkative-story" },
    ],
  },
  {
    label: "Danh bạ",
    href: "/danh-ba",
    icon: "directory",
    submenu: [
      { label: "Nhà môi giới", href: "/danh-ba/nha-moi-gioi" },
      { label: "Doanh nghiệp", href: "/danh-ba/doanh-nghiep-bat-dong-san" },
    ],
  },
];

function HamburgerIcon() {
  return (
    <svg aria-hidden width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M5 9H27M5 16H27M5 23H27" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function DrawerChevronIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" className={`mobile-drawer-chevron${isOpen ? " is-open" : ""}`}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileMenuIcon({ icon }: { icon: MobileMenuItem["icon"] }) {
  if (icon === "saved") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M16 26.5L5.8 16.3C2.4 12.9 3.7 7 8.4 5.8C11.2 5.1 14 6.3 16 8.6C18 6.3 20.8 5.1 23.6 5.8C28.3 7 29.6 12.9 26.2 16.3L16 26.5Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "sale") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M4 16L16 7L28 16V27H20V20H12V27H4V16Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M10 27V18H22V27" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  if (icon === "rent") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M5 26V10H15V26H5ZM17 26V5H27V26H17Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M9 15H12M9 20H12M21 10H24M21 15H24M21 20H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "project") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M5 26V6L18 10V26H5ZM18 26V14L27 17V26H18Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M10 12H12M10 17H12M10 22H12M22 21H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "news") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <rect x="6" y="9" width="20" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M10 14H22M10 19H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "wiki") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M8 5H24V27H8C6.3 27 5 25.7 5 24V8C5 6.3 6.3 5 8 5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M9 22H21M10 11H20M10 16H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "analysis") {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
        <path d="M6 24V18H11V24H6ZM14 24V12H19V24H14ZM22 24V8H27V24H22Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    );
  }


  return (
    <svg aria-hidden viewBox="0 0 32 32" className="mobile-drawer-icon">
      <rect x="7" y="5" width="18" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M11 23C12 20.8 13.8 19.7 16 19.7C18.2 19.7 20 20.8 21 23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MobileMenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeDrawer = useCallback(() => {
    if (!shouldRender || isClosing) {
      return;
    }

    setIsOpen(false);
    setIsClosing(true);
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      setExpandedLabel(null);
      closeTimerRef.current = null;
    }, 340);
  }, [isClosing, shouldRender]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    }

    document.body.classList.add("mobile-drawer-lock");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("mobile-drawer-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeDrawer, isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openDrawer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShouldRender(true);
    setIsClosing(false);
    setIsOpen(true);
  }

  return (
    <>
      <button type="button" className="mobile-menu-button" aria-label="Mở menu" aria-expanded={isOpen} onClick={openDrawer}>
        <HamburgerIcon />
      </button>

      {shouldRender
        ? createPortal(
            <div className={`mobile-drawer-layer${isClosing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
              <button type="button" className="mobile-drawer-backdrop" aria-label="Đóng menu" onClick={closeDrawer} />
              <aside className="mobile-drawer-panel">
                <div className="mobile-drawer-actions">
                  <Link href="/dang-nhap" className="mobile-drawer-auth is-login" onClick={closeDrawer}>
                    Đăng nhập
                  </Link>
                  <Link href="/dang-nhap?mode=register" className="mobile-drawer-auth is-register" onClick={closeDrawer}>
                    Đăng ký
                  </Link>
                  <Link href="/sellernet/trang-dang-nhap?redirect=true&returnurl=%2Ftai-khoan%2Ftin-dang%2Ftao-moi" className="mobile-drawer-post" onClick={closeDrawer}>
                    Đăng tin
                  </Link>
                </div>

                <nav className="mobile-drawer-nav" aria-label="Menu mobile">
                  {mobileMenuItems.map((item, index) => {
                    const submenu = item.submenu ?? [];
                    const hasSubmenu = submenu.length > 0;
                    const isExpanded = expandedLabel === item.label;
                    const submenuId = `mobile-submenu-${index}`;

                    return (
                      <div key={item.label} className="mobile-drawer-item">
                        {hasSubmenu ? (
                          <button
                            type="button"
                            className="mobile-drawer-toggle"
                            aria-expanded={isExpanded}
                            aria-controls={submenuId}
                            onClick={() => setExpandedLabel(isExpanded ? null : item.label)}
                          >
                            <MobileMenuIcon icon={item.icon} />
                            <span>{item.label}</span>
                            <DrawerChevronIcon isOpen={isExpanded} />
                          </button>
                        ) : (
                          <Link href={item.href} className="mobile-drawer-link" onClick={closeDrawer}>
                            <MobileMenuIcon icon={item.icon} />
                            <span>{item.label}</span>
                          </Link>
                        )}

                        {hasSubmenu && isExpanded ? (
                          <div id={submenuId} className="mobile-drawer-submenu">
                            {submenu.map((subItem) => (
                              <Link key={subItem.label} href={subItem.href} className="mobile-drawer-submenu-link" onClick={closeDrawer}>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </nav>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
