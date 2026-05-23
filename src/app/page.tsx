import Link from "next/link";
import { headers } from "next/headers";
import SpotlightNews, { type SpotlightSection } from "@/components/spotlight-news";

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

const tabs = ["Mua bán", "Cho thuê", "Dự án"];
const spotlightSections: SpotlightSection[] = [
  {
    label: "Tin nổi bật",
    moreHref: "/tin-tuc",
    featured: {
      title: "Bất Động Sản Mũi Vịnh - Tích Sản Của Giới Thượng Lưu Trong Mọi Chu Kỳ Kinh Tế...",
      href: "/tin-tuc/bat-dong-san-mui-vinh",
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1500&q=80",
      published: "6 giờ trước",
    },
    items: [
      {
        title: "Thị Trường Bất Động Sản Đầu Năm 2026: Nhịp Điều Chỉnh Và Cơ Hội Cho Nhu Cầu Ở Thực",
        href: "/tin-tuc/thi-truong-bat-dong-san-dau-nam-2026",
      },
      {
        title: "Vân Đồn Hứa Hẹn Là Điểm Đến Hàng Đầu Của Làn Sóng Dịch Chuyển Du Lịch",
        href: "/tin-tuc/van-don-hua-hen-diem-den-du-lich",
      },
      {
        title: "Bất Động Sản Mũi Vịnh - Tích Sản Của Giới Thượng Lưu Trong Mọi Chu Kỳ Kinh Tế",
        href: "/tin-tuc/bat-dong-san-mui-vinh-tich-san",
      },
      {
        title: "Nghệ Thuật Chế Tác Không Gian Từ Những Vật Liệu Tinh Tuyển Tại Noble Crystal Long Biên",
        href: "/tin-tuc/nghe-thuat-che-tac-khong-gian",
      },
      {
        title: "Sunshine Bay Retreat: Từ Trải Nghiệm Sống “Không Chạm” Đến Mô Hình Tài Sản Tự Vận Hành",
        href: "/tin-tuc/sunshine-bay-retreat",
      },
      {
        title: "Metro Số 2: \"Trục Xương Sống\" Thúc Đẩy Giá Trị Bất Động Sản Tây Hồ Tây",
        href: "/tin-tuc/metro-so-2-tay-ho-tay",
      },
    ],
  },
  {
    label: "Tin tức",
    moreHref: "/tin-tuc/thi-truong",
    featured: {
      title: "Hạ Tầng Khu Đông Tăng Tốc, Nhà Đầu Tư Dài Hạn Dịch Chuyển Về Các Trục Kết Nối Mới",
      href: "/tin-tuc/ha-tang-khu-dong-tang-toc",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1500&q=80",
      published: "8 giờ trước",
    },
    items: [
      {
        title: "Mặt Bằng Lãi Suất Ổn Định Mở Rộng Cửa Cho Nhóm Người Mua Ở Thực",
        href: "/tin-tuc/mat-bang-lai-suat-on-dinh",
      },
      {
        title: "Nguồn Cung Căn Hộ Trung Cấp Trở Lại Tại Nhiều Đô Thị Vệ Tinh",
        href: "/tin-tuc/nguon-cung-can-ho-trung-cap",
      },
      {
        title: "Đô Thị Hóa Dọc Tuyến Vành Đai Đang Tái Định Nghĩa Giá Trị Bất Động Sản",
        href: "/tin-tuc/do-thi-hoa-doc-tuyen-vanh-dai",
      },
      {
        title: "Nhà Phố Khai Thác Dòng Tiền Từ Kinh Doanh Dịch Vụ Tăng Nhiệt",
        href: "/tin-tuc/nha-pho-khai-thac-dong-tien",
      },
      {
        title: "Người Mua Nhà Ưu Tiên Dự Án Có Pháp Lý Rõ Ràng Và Tiến Độ Thi Công Tốt",
        href: "/tin-tuc/nguoi-mua-nha-uu-tien-phap-ly",
      },
      {
        title: "Bài Toán Tối Ưu Diện Tích Khi Chọn Căn Hộ Cho Gia Đình Trẻ",
        href: "/tin-tuc/toi-uu-dien-tich-can-ho",
      },
    ],
  },
  {
    label: "BĐS TPHCM",
    moreHref: "/tin-tuc/tphcm",
    featured: {
      title: "Nguồn Hàng Ven Sông TPHCM Hút Mạnh Nhu Cầu Ở Thực Nhờ Tiện Ích Hoàn Chỉnh",
      href: "/tin-tuc/nguon-hang-ven-song-tphcm",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1500&q=80",
      published: "10 giờ trước",
    },
    items: [
      {
        title: "Khu Đông Tiếp Tục Dẫn Sóng Với Loạt Dự Án Mới Mở Bán Trong Quý II",
        href: "/tin-tuc/khu-dong-dan-song-quy-ii",
      },
      {
        title: "Thanh Khoản Nhà Phố Trung Tâm Cải Thiện Khi Du Lịch Và Dịch Vụ Phục Hồi",
        href: "/tin-tuc/thanh-khoan-nha-pho-trung-tam",
      },
      {
        title: "Nhu Cầu Thuê Căn Hộ Gần Metro Tăng, Tỷ Suất Khai Thác Cho Thuê Ổn Định",
        href: "/tin-tuc/nhu-cau-thue-can-ho-gan-metro",
      },
      {
        title: "Thủ Đức Hình Thành Thêm Cụm Tiện Ích Giáo Dục Và Y Tế Quy Mô Lớn",
        href: "/tin-tuc/thu-duc-them-cum-tien-ich",
      },
      {
        title: "Mức Giá Sơ Cấp Duy Trì Mặt Bằng Cao Ở Nhóm Dự Án Có Pháp Lý Hoàn Thiện",
        href: "/tin-tuc/muc-gia-so-cap-tphcm",
      },
      {
        title: "Nhà Đầu Tư Chọn Sản Phẩm Có Thể Vận Hành Cho Thuê Ngay Sau Bàn Giao",
        href: "/tin-tuc/nha-dau-tu-chon-san-pham-cho-thue",
      },
    ],
  },
  {
    label: "BĐS Hà Nội",
    moreHref: "/tin-tuc/ha-noi",
    featured: {
      title: "Bất Động Sản Phía Tây Hà Nội Hưởng Lợi Từ Hệ Trục Giao Thông Kết Nối Liên Vùng",
      href: "/tin-tuc/bat-dong-san-phia-tay-ha-noi",
      image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1500&q=80",
      published: "11 giờ trước",
    },
    items: [
      {
        title: "Cầu Và Đường Vành Đai Mới Tác Động Rõ Nét Tới Giá Bất Động Sản Khu Vực",
        href: "/tin-tuc/duong-vanh-dai-moi-tac-dong-gia",
      },
      {
        title: "Nguồn Cầu Căn Hộ Quanh Tây Hồ Tây Tăng Đều Ở Nhóm Khách Mua Ở Thực",
        href: "/tin-tuc/nguon-cau-can-ho-tay-ho-tay",
      },
      {
        title: "Nhà Liền Kề Trong Khu Đô Thị Hoàn Thiện Vẫn Là Lựa Chọn Giữ Giá Tốt",
        href: "/tin-tuc/nha-lien-ke-khu-do-thi-hoan-thien",
      },
      {
        title: "Phân Khúc Cho Thuê Cao Cấp Ổn Định Nhờ Nguồn Khách Chuyên Gia Nước Ngoài",
        href: "/tin-tuc/cho-thue-cao-cap-on-dinh-ha-noi",
      },
      {
        title: "Khu Bắc Sông Hồng Đón Sóng Hạ Tầng, Thanh Khoản Tăng Ở Nhiều Dự Án",
        href: "/tin-tuc/khu-bac-song-hong-don-song-ha-tang",
      },
      {
        title: "Người Mua Quan Tâm Nhiều Hơn Đến Chất Lượng Quản Lý Vận Hành Sau Bàn Giao",
        href: "/tin-tuc/nguoi-mua-quan-tam-van-hanh-sau-ban-giao",
      },
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

function SearchIcon() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
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

export default async function Home() {
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
    <div className="stage-root">
      <header className="stage-header">
        <div className="stage-shell stage-header-inner">
          <div className="header-left">
            <Link href="/" className="brand-wrap" aria-label="Anshome">
              <LogoMark />
              <div className="brand-text">
                <p className="brand-main">Anshome</p>
                <p className="brand-sub">by PropertyGuru</p>
              </div>
            </Link>

            <nav className="main-nav" aria-label="Main">
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
            <a href="#" className="auth-link">
              Đăng nhập
            </a>
            <span className="auth-divider" aria-hidden>
              |
            </span>
            <a href="#" className="auth-link">
              Đăng ký
            </a>
            <a href="#" className="post-btn">
              Đăng tin
            </a>
          </div>
        </div>
      </header>

      <main className="hero-zone">
        <section className="search-card" aria-label="Tìm kiếm bất động sản">
          <div className="search-tabs" role="tablist" aria-label="Loại giao dịch">
            {tabs.map((tab, index) => (
              <button key={tab} type="button" role="tab" aria-selected={index === 0} className="search-tab">
                {tab}
              </button>
            ))}
            <div className="tab-indicator" aria-hidden />
          </div>

          <div className="search-row">
            <label className="input-wrap" aria-label="Tìm kiếm">
              <span className="input-icon">
                <SearchIcon />
              </span>
              <input type="text" placeholder="Nhà riêng Thủ Đức" className="search-input" />
            </label>
            <button type="button" className="search-btn">
              Tìm kiếm
            </button>
          </div>
        </section>
      </main>

      <SpotlightNews sections={spotlightSections} />
    </div>
  );
}
