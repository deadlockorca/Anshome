import Link from "next/link";
import { HomeAuthModal } from "@/components/auth/home-auth-modal";
import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import { MobileStickySearch } from "@/components/mobile-sticky-search";

type HeaderSubmenuItem = {
  label: string;
  href: string;
  children?: HeaderSubmenuItem[];
};

type HeaderMenuItem = {
  label: string;
  href: string;
  submenu?: HeaderSubmenuItem[];
};

const leftMenu: HeaderMenuItem[] = [
  {
    label: "Nhà đất bán",
    href: "/nha-dat-ban",
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
  { label: "Tin tức", href: "/tin-tuc" },
  {
    label: "Wiki BĐS",
    href: "/wiki",
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
    submenu: [
      { label: "Nhà môi giới", href: "/danh-ba/nha-moi-gioi" },
      { label: "Doanh nghiệp", href: "/danh-ba/doanh-nghiep-bat-dong-san" },
    ],
  },
];

function LogoMark() {
  return (
    <svg
      aria-hidden
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark"
    >
      <path d="M8 24L23 10L38 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21V38H34V21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 38V29H26V38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="heart-icon"
    >
      <path
        d="M20.2 4.9C18.2 2.9 15 2.9 13 4.9L12 5.9L11 4.9C9 2.9 5.8 2.9 3.8 4.9C1.7 6.9 1.7 10.2 3.8 12.2L12 20.4L20.2 12.2C22.3 10.2 22.3 6.9 20.2 4.9Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function SiteHeader({ mobileBackHref }: { mobileBackHref?: string } = {}) {
  const menuItems = leftMenu;

  return (
    <header className={`stage-header${mobileBackHref ? " has-mobile-back" : ""}`}>
      <div className="stage-shell stage-header-inner">
        {mobileBackHref ? (
          <Link href={mobileBackHref} className="mobile-header-back" aria-label="Quay lại">
            <BackIcon />
          </Link>
        ) : null}
        <div className="header-left">
          <Link href="/" className="brand-wrap" aria-label="Anshome">
            <LogoMark />
            <div className="brand-text">
              <p className="brand-main">Anshome</p>
              <p className="brand-sub">nền tảng BĐS</p>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Điều hướng chính">
            {menuItems.map((item) => {
              const submenu = item.submenu ?? [];
              const hasSubmenu = submenu.length > 0;
              const hasGroups = submenu.some((subItem) => (subItem.children?.length ?? 0) > 0);

              return (
                <div key={item.label} className="nav-item">
                  <Link href={item.href} className="nav-link" aria-haspopup={hasSubmenu ? "menu" : undefined}>
                    <span>{item.label}</span>
                  </Link>

                  {hasSubmenu ? (
                    <div className={`nav-dropdown${hasGroups ? " is-wide" : ""}`} role="menu" aria-label={item.label}>
                      {submenu.map((subItem) =>
                        subItem.children && subItem.children.length > 0 ? (
                          <div key={subItem.label} className="nav-dropdown-group" role="group" aria-label={subItem.label}>
                            <span className="nav-dropdown-group-title">{subItem.label}</span>
                            {subItem.children.map((child) => (
                              <Link key={child.label} href={child.href} className="nav-dropdown-group-link" role="menuitem">
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link key={subItem.label} href={subItem.href} className="nav-dropdown-link" role="menuitem">
                            {subItem.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <MobileStickySearch />

        <div className="header-right">
          <button type="button" className="icon-btn" aria-label="Yêu thích">
            <HeartIcon />
          </button>
          <HomeAuthModal />
          <Link href="/sellernet/trang-dang-nhap?redirect=true&returnurl=%2Ftai-khoan%2Ftin-dang%2Ftao-moi" className="post-btn">
            Đăng tin
          </Link>
          <MobileMenuDrawer />
        </div>
      </div>
    </header>
  );
}
