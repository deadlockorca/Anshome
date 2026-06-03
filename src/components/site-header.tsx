import Link from "next/link";
import { headers } from "next/headers";
import { HomeAuthModal } from "@/components/auth/home-auth-modal";

type HeaderSubmenuItem = {
  label: string;
  href: string;
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
      { label: "Bán chung cư mini, căn hộ dịch vụ", href: "/ban-chung-cu-mini" },
      { label: "Bán nhà riêng", href: "/ban-nha-rieng" },
      { label: "Bán nhà biệt thự, liền kề", href: "/ban-biet-thu-lien-ke" },
      { label: "Bán nhà mặt phố", href: "/ban-nha-mat-pho" },
      { label: "Bán shophouse, nhà phố thương mại", href: "/ban-shophouse" },
      { label: "Bán đất nền dự án", href: "/ban-dat-nen-du-an" },
      { label: "Bán đất", href: "/ban-dat" },
      { label: "Bán trang trại, khu nghỉ dưỡng", href: "/ban-trang-trai" },
      { label: "Bán condotel", href: "/ban-condotel" },
      { label: "Bán kho, nhà xưởng", href: "/ban-kho-xuong" },
      { label: "Bán loại bất động sản khác", href: "/ban-bat-dong-san-khac" },
    ],
  },
  {
    label: "Nhà đất cho thuê",
    href: "/nha-dat-cho-thue",
    submenu: [
      { label: "Cho thuê căn hộ chung cư", href: "/cho-thue-can-ho-chung-cu" },
      { label: "Cho thuê chung cư mini, căn hộ dịch vụ", href: "/cho-thue-chung-cu-mini" },
      { label: "Cho thuê nhà riêng", href: "/cho-thue-nha-rieng" },
      { label: "Cho thuê nhà biệt thự, liền kề", href: "/cho-thue-biet-thu-lien-ke" },
      { label: "Cho thuê nhà mặt phố", href: "/cho-thue-nha-mat-pho" },
      { label: "Cho thuê shophouse, nhà phố thương mại", href: "/cho-thue-shophouse" },
      { label: "Cho thuê nhà trọ, phòng trọ", href: "/cho-thue-phong-tro" },
      { label: "Cho thuê văn phòng", href: "/cho-thue-van-phong" },
      { label: "Cho thuê, sang nhượng cửa hàng, ki ốt", href: "/cho-thue-cua-hang-ki-ot" },
      { label: "Cho thuê kho, nhà xưởng, đất", href: "/cho-thue-kho-xuong-dat" },
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
  {
    label: "Tin tức",
    href: "/tin-tuc",
  },
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
      { label: "Báo cáo thị trường", href: "/phan-tich-danh-gia/bao-cao-thi-truong" },
      { label: "Phân tích khu vực", href: "/phan-tich-danh-gia/phan-tich-khu-vuc" },
      { label: "Tư vấn đầu tư", href: "/phan-tich-danh-gia/tu-van-dau-tu" },
      { label: "So sánh dự án", href: "/phan-tich-danh-gia/so-sanh-du-an" },
    ],
  },
  {
    label: "Danh bạ",
    href: "/danh-ba",
    submenu: [
      { label: "Nhà môi giới", href: "/danh-ba/nha-moi-gioi" },
      { label: "Doanh nghiệp BĐS", href: "/danh-ba/doanh-nghiep-bat-dong-san" },
      { label: "Chủ đầu tư", href: "/danh-ba/chu-dau-tu" },
      { label: "Đơn vị thiết kế", href: "/danh-ba/don-vi-thiet-ke" },
    ],
  },
];

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function resolveWikiOrigin(requestHeaders: Headers): string {
  const envOrigin = process.env.NEXT_PUBLIC_WIKI_ORIGIN?.trim();
  if (envOrigin) {
    return normalizeOrigin(envOrigin);
  }

  const rawHost =
    requestHeaders.get("x-forwarded-host")?.split(",")[0].trim() ??
    requestHeaders.get("host")?.split(",")[0].trim() ??
    "localhost:3000";

  const rawProto =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim().replace(/:$/, "") ?? "http";

  let hostname = "localhost";
  let port = "";

  try {
    const parsed = new URL(`http://${rawHost}`);
    hostname = parsed.hostname;
    port = parsed.port ? `:${parsed.port}` : "";
  } catch {
    const [fallbackHost = "localhost", fallbackPort] = rawHost.split(":");
    hostname = fallbackHost;
    port = fallbackPort ? `:${fallbackPort}` : "";
  }

  const baseHost = hostname.startsWith("wiki.") ? hostname.slice(5) : hostname;
  const wikiHost =
    baseHost === "localhost" || baseHost === "127.0.0.1" || baseHost === "::1" ? "wiki.localhost" : `wiki.${baseHost}`;

  return `${rawProto}://${wikiHost}${port}`;
}

function buildWikiHref(href: string, wikiOrigin: string): string {
  const path = href === "/wiki" ? "/" : href.replace(/^\/wiki(?=\/|$)/, "");
  return `${wikiOrigin}${path}`;
}

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
      <path d="M8 22L23 8L38 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 31L23 17L38 31" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 40L23 26L38 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="nav-caret"
    >
      <path d="M3 5.25L7 9.25L11 5.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function SiteHeader() {
  const requestHeaders = await headers();
  const wikiOrigin = resolveWikiOrigin(requestHeaders);
  const menuItems = leftMenu.map((item) => {
    if (item.label !== "Wiki BĐS") {
      return item;
    }

    return {
      ...item,
      href: buildWikiHref(item.href, wikiOrigin),
      submenu: item.submenu?.map((subItem) => ({
        ...subItem,
        href: buildWikiHref(subItem.href, wikiOrigin),
      })),
    };
  });

  return (
    <header className="stage-header">
      <div className="stage-shell stage-header-inner">
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

              return (
                <div key={item.label} className="nav-item">
                  <Link href={item.href} className="nav-link" aria-haspopup={hasSubmenu ? "menu" : undefined}>
                    <span>{item.label}</span>
                    {hasSubmenu ? <ChevronDownIcon /> : null}
                  </Link>

                  {hasSubmenu ? (
                    <div className="nav-dropdown" role="menu" aria-label={item.label}>
                      {submenu.map((subItem) => (
                        <Link key={subItem.label} href={subItem.href} className="nav-dropdown-link" role="menuitem">
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="header-right">
          <button type="button" className="icon-btn" aria-label="Yêu thích">
            <HeartIcon />
          </button>
          <HomeAuthModal />
          <Link href="/sellernet/trang-dang-nhap?redirect=true&returnurl=%2Ftai-khoan%2Ftin-dang%2Ftao-moi" className="post-btn">
            Đăng tin
          </Link>
        </div>
      </div>
    </header>
  );
}
