import Link from "next/link";
import { headers } from "next/headers";
import { HomeAuthModal } from "@/components/auth/home-auth-modal";
import { HomeSearch } from "@/components/home-search";
import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import { MobileStickySearch } from "@/components/mobile-sticky-search";
import { PropertyGuideCarousel } from "@/components/property-guide-carousel";
import { SeoLinkGroupColumn } from "@/components/seo-link-group-column";
import SpotlightNews, { type SpotlightSection } from "@/components/spotlight-news";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

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

const footerContacts = [
  {
    label: "Hotline",
    value: "(+84) 901 827 555",
    href: "tel:+84901827555",
    icon: "phone",
  },
  {
    label: "Hỗ trợ khách hàng",
    value: "trogiup.anshome.vn",
    href: "/ho-tro",
    icon: "support",
  },
  {
    label: "Chăm sóc khách hàng",
    value: "hotro@anshome.vn",
    href: "mailto:hotro@anshome.vn",
    icon: "mailbox",
  },
] as const;
const footerGuideLinks = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Báo giá và hỗ trợ", href: "/bao-gia" },
  { label: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" },
  { label: "Góp ý báo lỗi", href: "/gop-y-bao-loi" },
  { label: "Sitemap", href: "/trang-sitemap" },
];
const footerPolicyLinks = [
  { label: "Quy định đăng tin", href: "/quy-dinh-dang-tin" },
  { label: "Quy chế hoạt động", href: "/quy-che-hoat-dong" },
  { label: "Điều khoản thỏa thuận", href: "/dieu-khoan-thoa-thuan" },
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Giải quyết khiếu nại", href: "/giai-quyet-khieu-nai" },
];
const homeListingInclude = {
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  province: {
    select: {
      fullName: true,
    },
  },
  district: {
    select: {
      fullName: true,
    },
  },
  media: {
    where: {
      moderationStatus: "approved",
      media: {
        status: "approved",
      },
    },
    orderBy: [{ sortOrder: "asc" }],
    take: 4,
    include: {
      media: {
        select: {
          publicUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ListingInclude;

type HomeListing = Prisma.ListingGetPayload<{ include: typeof homeListingInclude }>;

type DisplayListing = {
  id: string;
  href: string;
  title: string;
  imageUrl: string | null;
  imageAlt: string;
  price: string;
  area: string | null;
  location: string;
  publishedLabel: string;
  mediaCount?: number;
};

const featuredProjectInclude = {
  province: {
    select: {
      fullName: true,
    },
  },
  district: {
    select: {
      fullName: true,
    },
  },
  media: {
    orderBy: [{ sortOrder: "asc" }],
    take: 4,
    include: {
      media: {
        select: {
          publicUrl: true,
          status: true,
        },
      },
    },
  },
  _count: {
    select: {
      media: true,
    },
  },
} satisfies Prisma.ProjectInclude;

type FeaturedProject = Prisma.ProjectGetPayload<{ include: typeof featuredProjectInclude }>;

type DisplayProject = {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
  status: "Sắp mở bán" | "Đang mở bán" | "Đã bàn giao" | "Tạm dừng" | "Đang cập nhật";
  mediaCount: number;
  priceAndScale: string;
  location: string;
};

const locationHighlights = [
  {
    slug: "tp-ho-chi-minh",
    displayName: "TP. Hồ Chí Minh",
    href: "/nha-dat-ban-tp-ho-chi-minh",
    image: "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?auto=format&fit=crop&w=1400&q=82",
    featured: true,
  },
  {
    slug: "ha-noi",
    displayName: "Hà Nội",
    href: "/nha-dat-ban-ha-noi",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=82",
  },
  {
    slug: "da-nang",
    displayName: "Đà Nẵng",
    href: "/nha-dat-ban-da-nang",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=82",
  },
  {
    slug: "binh-duong",
    displayName: "Bình Dương",
    href: "/nha-dat-ban-binh-duong",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=82",
  },
  {
    slug: "dong-nai",
    displayName: "Đồng Nai",
    href: "/nha-dat-ban-dong-nai",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=82",
  },
];

type LocationHighlight = {
  name: string;
  count: number;
  href: string;
  image: string;
  featured?: boolean;
};

const utilityTools = [
  {
    title: "Xem tuổi xây nhà",
    href: "/ho-tro-tien-ich/xem-tuoi-xay-nha",
    icon: "age",
  },
  {
    title: "Chi phí làm nhà",
    href: "/ho-tro-tien-ich/chi-phi-lam-nha",
    icon: "cost",
  },
  {
    title: "Tính lãi suất",
    href: "/ho-tro-tien-ich/tinh-lai-suat",
    icon: "loan",
  },
  {
    title: "Tư vấn phong thủy",
    href: "/ho-tro-tien-ich/tu-van-phong-thuy",
    icon: "fengshui",
  },
] as const;

type UtilityTool = (typeof utilityTools)[number];

const seoLinkGroups = [
  {
    title: "Chủ đề nổi bật",
    links: [
      { label: "Tin tức bất động sản", href: "/tin-tuc" },
      { label: "Bất động sản Hà Nội", href: "/nha-dat-ban-ha-noi" },
      { label: "Bất động sản Hồ Chí Minh", href: "/nha-dat-ban-tp-ho-chi-minh" },
      { label: "Báo cáo thị trường", href: "/phan-tich-danh-gia/bao-cao-thi-truong" },
      { label: "Mua bất động sản", href: "/wiki/mua-bat-dong-san" },
    ],
    extraLinks: [
      { label: "Kinh nghiệm mua nhà", href: "/wiki/kinh-nghiem-mua-nha" },
      { label: "Pháp lý bất động sản", href: "/wiki/quy-hoach-phap-ly" },
      { label: "Tài chính bất động sản", href: "/wiki/tai-chinh-bat-dong-san" },
    ],
  },
  {
    title: "Bất động sản bán",
    links: [
      { label: "Bán căn hộ chung cư", href: "/ban-can-ho-chung-cu", hasMore: true },
      { label: "Bán chung cư mini, căn hộ dịch vụ", href: "/ban-chung-cu-mini", hasMore: true },
      { label: "Bán nhà riêng", href: "/ban-nha-rieng", hasMore: true },
      { label: "Bán biệt thự, liền kề", href: "/ban-biet-thu-lien-ke", hasMore: true },
      { label: "Bán nhà mặt phố, mặt tiền", href: "/ban-nha-mat-pho", hasMore: true },
    ],
    extraLinks: [
      { label: "Bán shophouse, nhà phố thương mại", href: "/ban-shophouse", hasMore: true },
      { label: "Bán đất nền dự án", href: "/ban-dat-nen-du-an", hasMore: true },
      { label: "Bán condotel", href: "/ban-condotel", hasMore: true },
    ],
  },
  {
    title: "Bất động sản thuê",
    links: [
      { label: "Thuê căn hộ chung cư", href: "/cho-thue-can-ho-chung-cu", hasMore: true },
      { label: "Thuê chung cư mini, căn hộ dịch vụ", href: "/cho-thue-chung-cu-mini", hasMore: true },
      { label: "Thuê nhà riêng", href: "/cho-thue-nha-rieng", hasMore: true },
      { label: "Thuê biệt thự, liền kề", href: "/cho-thue-biet-thu-lien-ke", hasMore: true },
      { label: "Thuê nhà mặt phố, mặt tiền", href: "/cho-thue-nha-mat-pho", hasMore: true },
    ],
    extraLinks: [
      { label: "Thuê phòng trọ", href: "/cho-thue-phong-tro", hasMore: true },
      { label: "Thuê văn phòng", href: "/cho-thue-van-phong", hasMore: true },
      { label: "Thuê mặt bằng kinh doanh", href: "/cho-thue-cua-hang-ki-ot", hasMore: true },
    ],
  },
  {
    title: "Bất động sản toàn quốc",
    links: [
      { label: "Mua bán bất động sản Hà Nội", href: "/nha-dat-ban-ha-noi", hasMore: true },
      { label: "Cho thuê bất động sản Hà Nội", href: "/nha-dat-cho-thue-ha-noi", hasMore: true },
      { label: "Mua bán bất động sản Hồ Chí Minh", href: "/nha-dat-ban-tp-ho-chi-minh", hasMore: true },
      { label: "Cho thuê bất động sản Hồ Chí Minh", href: "/nha-dat-cho-thue-tp-ho-chi-minh", hasMore: true },
    ],
  },
  {
    title: "Dự án nổi bật",
    links: [
      { label: "Căn hộ chung cư", href: "/du-an-can-ho-chung-cu", hasMore: true },
      { label: "Biệt thự liền kề", href: "/du-an-biet-thu-lien-ke", hasMore: true },
      { label: "Khu đô thị mới", href: "/du-an-khu-do-thi-moi", hasMore: true },
      { label: "Khu phức hợp", href: "/du-an-khu-phuc-hop", hasMore: true },
      { label: "Nhà ở xã hội", href: "/du-an-nha-o-xa-hoi", hasMore: true },
    ],
    extraLinks: [
      { label: "Khu nghỉ dưỡng, sinh thái", href: "/du-an-nghi-duong-sinh-thai", hasMore: true },
      { label: "Khu công nghiệp", href: "/du-an-khu-cong-nghiep", hasMore: true },
      { label: "Shophouse", href: "/du-an-shophouse", hasMore: true },
    ],
  },
  {
    title: "Chủ đầu tư nổi bật",
    links: [
      { label: "Bất động sản Vinhomes", href: "/danh-ba/chu-dau-tu/vinhomes", hasMore: true },
      { label: "Bất động sản Sunshine", href: "/danh-ba/chu-dau-tu/sunshine", hasMore: true },
      { label: "Bất động sản Phú Mỹ Hưng", href: "/danh-ba/chu-dau-tu/phu-my-hung", hasMore: true },
      { label: "Bất động sản Masterise Homes", href: "/danh-ba/chu-dau-tu/masterise-homes", hasMore: true },
      { label: "Bất động sản Hưng Thịnh", href: "/danh-ba/chu-dau-tu/hung-thinh", hasMore: true },
    ],
    extraLinks: [
      { label: "Bất động sản Novaland", href: "/danh-ba/chu-dau-tu/novaland", hasMore: true },
      { label: "Bất động sản Ecopark", href: "/danh-ba/chu-dau-tu/ecopark", hasMore: true },
      { label: "Bất động sản Nam Long", href: "/danh-ba/chu-dau-tu/nam-long", hasMore: true },
    ],
  },
  {
    title: "Bất động sản Quận/Huyện",
    links: [
      { label: "Nhà riêng Hồ Chí Minh", href: "/ban-nha-rieng-tp-ho-chi-minh", hasMore: true },
      { label: "Nhà riêng Hà Nội", href: "/ban-nha-rieng-ha-noi", hasMore: true },
      { label: "Căn hộ chung cư Hà Nội", href: "/ban-can-ho-chung-cu-ha-noi", hasMore: true },
      { label: "Căn hộ chung cư Hồ Chí Minh", href: "/ban-can-ho-chung-cu-tp-ho-chi-minh", hasMore: true },
      { label: "Nhà mặt tiền Hồ Chí Minh", href: "/ban-nha-mat-pho-tp-ho-chi-minh", hasMore: true },
    ],
    extraLinks: [
      { label: "Nhà riêng Cầu Giấy", href: "/ban-nha-rieng-cau-giay-ha-noi", hasMore: true },
      { label: "Căn hộ chung cư Quận 7", href: "/ban-can-ho-chung-cu-quan-7-tp-ho-chi-minh", hasMore: true },
      { label: "Nhà mặt tiền Thủ Đức", href: "/ban-nha-mat-pho-thu-duc-tp-ho-chi-minh", hasMore: true },
    ],
  },
  {
    title: "Giá bất động sản toàn quốc",
    links: [
      { label: "Giá căn hộ chung cư", href: "/gia-can-ho-chung-cu", hasMore: true },
      { label: "Giá nhà đất", href: "/gia-nha-dat", hasMore: true },
      { label: "Giá biệt thự, liền kề", href: "/gia-biet-thu-lien-ke", hasMore: true },
      { label: "Giá nhà mặt phố, mặt tiền", href: "/gia-nha-mat-pho", hasMore: true },
      { label: "Giá shophouse, nhà phố", href: "/gia-shophouse-nha-pho", hasMore: true },
    ],
    extraLinks: [
      { label: "Giá đất nền dự án", href: "/gia-dat-nen-du-an", hasMore: true },
      { label: "Giá văn phòng", href: "/gia-van-phong", hasMore: true },
      { label: "Giá bất động sản Hà Nội", href: "/gia-nha-dat-ha-noi", hasMore: true },
    ],
  },
] as const;

const newsArticleInclude = {
  coverMedia: {
    select: {
      publicUrl: true,
    },
  },
} satisfies Prisma.ArticleInclude;

type NewsArticle = Prisma.ArticleGetPayload<{ include: typeof newsArticleInclude }>;

const articleImageFallbacks: Record<string, string> = {
  "vietnam-land-mo-rong-hop-tac-phat-trien-dai-do-thi-phia-nam-tphcm": "/news-vietnam-land.svg",
};

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

function LocationIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21S5.8 15.6 5.8 10.4C5.8 6.8 8.6 4 12 4s6.2 2.8 6.2 6.4C18.2 15.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <circle cx="12" cy="10.4" r="2.1" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg aria-hidden width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.8" y="5" width="16.4" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.6" cy="9.4" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.7 17.2L10.2 13L13.1 15.6L15 13.7L18.4 17.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function FooterIcon({ icon }: { icon: "phone" | "support" | "mailbox" | "pin" }) {
  if (icon === "phone") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.2 4.4L9.1 8.5L6.9 10.1C8 12.6 10 14.6 12.5 15.8L14.2 13.6L18.2 15.5L17.6 18.8C17.5 19.6 16.8 20.2 16 20.2C9.2 20.2 3.8 14.8 3.8 8C3.8 7.2 4.4 6.5 5.2 6.4L7.2 4.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.2 4.4C16.8 4.8 18.8 6.8 19.2 9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M14.2 7.4C15.2 7.7 15.9 8.4 16.2 9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "support") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.8 19.6C4.4 16.5 6.3 14.8 9 14.8C10.3 14.8 11.4 15.2 12.3 15.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15.5 6.3C16.1 5.5 17 5 18.1 5C19.9 5 21.2 6.2 21.2 7.9C21.2 9.5 20.1 10.2 18.9 10.7V12.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.9 15.7V15.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "mailbox") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.2 19V9.4C4.2 7.4 5.8 5.8 7.8 5.8H15.8C17.8 5.8 19.4 7.4 19.4 9.4V19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.2 10.2H19.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8.7 5.8V19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15.4 13.2H22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21S5.7 15.6 5.7 10.3C5.7 6.7 8.5 3.9 12 3.9C15.5 3.9 18.3 6.7 18.3 10.3C18.3 15.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="10.3" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.7 3.7L10.3 14.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.7 3.7L14.1 20.3L10.3 14.1L3.7 10.3L20.7 3.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12H20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.2 5.4 15.4 8.4 15.4 12C15.4 15.6 14.2 18.6 12 21C9.8 18.6 8.6 15.6 8.6 12C8.6 8.4 9.8 5.4 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronSelectIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDecimal(value: HomeListing["price"] | HomeListing["area"]): string | null {
  if (!value) {
    return null;
  }

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatListingPrice(listing: HomeListing): string {
  if (!listing.price) {
    return "Liên hệ";
  }

  const price = Number(listing.price);
  const unit = listing.priceUnit?.trim();

  if (!unit || unit.toLowerCase() === "vnd") {
    if (price >= 1_000_000_000) {
      return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(price / 1_000_000_000)} tỷ`;
    }
    if (price >= 1_000_000) {
      return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(price / 1_000_000)} triệu`;
    }
  }

  return `${formatDecimal(listing.price)} ${unit ?? ""}`.trim();
}

function formatProjectPrice(value: FeaturedProject["priceMin"], unit: string | null): string | null {
  if (!value) {
    return null;
  }

  const price = Number(value);
  const normalizedUnit = unit?.trim() || "VND/m²";

  if (normalizedUnit.toLowerCase().includes("m²") && price >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(price / 1_000_000)} triệu/m²`;
  }

  return `${formatDecimal(value)} ${normalizedUnit}`.trim();
}

function formatProjectScale(value: FeaturedProject["landArea"]): string | null {
  if (!value) {
    return null;
  }

  const area = Number(value);

  if (area >= 10000) {
    return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(area / 10000)} ha`;
  }

  return `${formatDecimal(value)} m²`;
}

function formatPublishedDate(value: Date | null): string {
  if (!value) {
    return "Đã đăng";
  }

  const diffDays = Math.floor((Date.now() - value.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) {
    return "Đăng hôm nay";
  }

  return `Đăng ${diffDays} ngày trước`;
}

function formatNewsPublishedDate(value: Date | null): string {
  if (!value) {
    return "Mới cập nhật";
  }

  const diffDays = Math.floor((Date.now() - value.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays <= 0) {
    return "Hôm nay";
  }

  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} tuần trước`;
}

function formatListingCount(count: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(count)} tin đăng`;
}

function toDisplayListing(listing: HomeListing): DisplayListing {
  const cover = listing.media.find((item) => item.type === "image") ?? listing.media[0];
  const location = [listing.district?.fullName, listing.province?.fullName].filter(Boolean).join(", ") || listing.addressText || "Chưa cập nhật vị trí";
  const area = formatDecimal(listing.area);

  return {
    id: listing.id,
    href: `/tin-dang/${listing.publicId}`,
    title: listing.title,
    imageUrl: cover?.type === "image" ? cover.media.publicUrl : null,
    imageAlt: cover?.caption ?? listing.title,
    price: formatListingPrice(listing),
    area,
    location,
    publishedLabel: formatPublishedDate(listing.publishedAt),
    mediaCount: listing.media.length > 1 ? listing.media.length : undefined,
  };
}

function toDisplayProject(project: FeaturedProject): DisplayProject {
  const cover = project.media.find((item) => item.media.status === "approved") ?? project.media[0];
  const location = [project.district?.fullName, project.province?.fullName].filter(Boolean).join(", ") || project.addressText || "Đang cập nhật";
  const price = formatProjectPrice(project.priceMin, project.priceUnit);
  const scale = formatProjectScale(project.landArea);
  const priceAndScale = [price, scale].filter(Boolean).join(" · ") || location;

  return {
    id: project.id,
    title: project.name,
    href: `/du-an/${project.slug}`,
    imageUrl: cover?.media.publicUrl ?? null,
    status: formatProjectStatus(project.status),
    mediaCount: project._count.media,
    priceAndScale,
    location: priceAndScale === location ? "" : location,
  };
}

function formatProjectStatus(status: FeaturedProject["status"]): DisplayProject["status"] {
  switch (status) {
    case "upcoming":
      return "Sắp mở bán";
    case "selling":
      return "Đang mở bán";
    case "handed_over":
      return "Đã bàn giao";
    case "paused":
      return "Tạm dừng";
    case "planning":
    case "archived":
    default:
      return "Đang cập nhật";
  }
}

function HomeListingCard({ listing }: { listing: DisplayListing }) {
  return (
    <article className="home-listing-card">
      <Link href={listing.href} className="home-listing-image-link">
        {listing.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.imageUrl} alt={listing.imageAlt} className="home-listing-image" loading="lazy" />
        ) : (
          <span className="home-listing-image-placeholder">Chưa có ảnh</span>
        )}
        {listing.mediaCount ? (
          <span className="home-listing-media-count">
            <PhotoIcon />
            {listing.mediaCount}
          </span>
        ) : null}
      </Link>

      <div className="home-listing-body">
        <h3 className="home-listing-title">
          <Link href={listing.href}>{listing.title}</Link>
        </h3>

        <p className="home-listing-metrics">
          <span>{listing.price}</span>
          {listing.area ? (
            <>
              <span className="home-listing-dot">·</span>
              <span>{listing.area} m²</span>
            </>
          ) : null}
        </p>

        <p className="home-listing-location">
          <LocationIcon />
          <span>{listing.location}</span>
        </p>

        <div className="home-listing-footer">
          <span>{listing.publishedLabel}</span>
          <button type="button" className="home-listing-save" aria-label={`Lưu tin ${listing.title}`}>
            <HeartIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function RecommendedListings({ listings }: { listings: HomeListing[] }) {
  const displayListings = listings.map(toDisplayListing);

  return (
    <section className="home-listings-zone" aria-labelledby="home-listings-title">
      <div className="stage-shell">
        <div className="home-listings-head">
          <h2 id="home-listings-title">Bất động sản dành cho bạn</h2>
          <nav className="home-listings-tabs" aria-label="Tin nhà đất mới nhất">
            <Link href="/nha-dat-ban">Tin nhà đất bán mới nhất</Link>
            <span aria-hidden>|</span>
            <Link href="/nha-dat-cho-thue">Tin nhà đất cho thuê mới nhất</Link>
          </nav>
        </div>

        {displayListings.length > 0 ? (
          <>
            <div className="home-listings-grid">
              {displayListings.map((listing) => (
                <HomeListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="home-listings-more-wrap">
              <Link href="/tin-dang" className="home-listings-more">
                Xem tiếp
              </Link>
            </div>
          </>
        ) : (
          <div className="home-listings-empty">Chưa có tin đăng phù hợp để hiển thị.</div>
        )}
      </div>
    </section>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturedProjectCard({ project }: { project: DisplayProject }) {
  return (
    <article className="featured-project-card">
      <Link href={project.href} className="featured-project-image-link">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt={project.title} className="featured-project-image" loading="lazy" />
        ) : (
          <span className="featured-project-image-placeholder">Chưa có ảnh</span>
        )}
        <span className="featured-project-media">
          <PhotoIcon />
          {project.mediaCount}
        </span>
      </Link>
      <div className="featured-project-body">
        <span
          className={`featured-project-status${project.status === "Sắp mở bán" ? " is-upcoming" : ""}${
            project.status === "Đang cập nhật" || project.status === "Đã bàn giao" || project.status === "Tạm dừng" ? " is-muted" : ""
          }`}
        >
          {project.status}
        </span>
        <h3 className="featured-project-title">
          <Link href={project.href}>{project.title}</Link>
        </h3>
        <p className="featured-project-meta">{project.priceAndScale}</p>
        {project.location ? <p className="featured-project-location">{project.location}</p> : null}
      </div>
    </article>
  );
}

function FeaturedProjectsSection({ projects }: { projects: FeaturedProject[] }) {
  const displayProjects = projects.map(toDisplayProject);

  if (displayProjects.length === 0) {
    return null;
  }

  return (
    <section className="featured-projects-zone" aria-labelledby="featured-projects-title">
      <button type="button" className="featured-project-arrow is-left" aria-label="Dự án trước">
        <ArrowLeftIcon />
      </button>
      <div className="stage-shell featured-projects-shell">
        <div className="featured-projects-head">
          <h2 id="featured-projects-title">Dự án bất động sản nổi bật</h2>
          <Link href="/du-an" className="featured-projects-more">
            Xem thêm <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="featured-projects-grid">
          {displayProjects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      <button type="button" className="featured-project-arrow is-right" aria-label="Dự án tiếp theo">
        <ArrowRightIcon />
      </button>
    </section>
  );
}

function LocationHighlightCard({ location }: { location: LocationHighlight }) {
  return (
    <Link href={location.href} className={`location-card${location.featured ? " is-featured" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={location.image} alt={location.name} className="location-card-image" loading="lazy" />
      <span className="location-card-shade" aria-hidden />
      <span className="location-card-content">
        <span className="location-card-name">{location.name}</span>
        <span className="location-card-count">{formatListingCount(location.count)}</span>
      </span>
    </Link>
  );
}

function LocationsSection({ locations }: { locations: LocationHighlight[] }) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="locations-zone" aria-labelledby="locations-title">
      <div className="stage-shell locations-shell">
        <h2 id="locations-title">Bất động sản theo địa điểm</h2>
        <div className="locations-grid">
          {locations.map((location) => (
            <LocationHighlightCard key={location.name} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  const imageUrl = articleImageFallbacks[article.slug] ?? article.coverMedia?.publicUrl;
  const publishedLabel = formatNewsPublishedDate(article.publishedAt);

  return (
    <article className="home-news-card">
      <Link href={`/tin-tuc/${article.slug}`} className="home-news-image-link">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={article.title} className="home-news-image" loading="lazy" />
        ) : (
          <span className="home-news-image-placeholder">Chưa có ảnh</span>
        )}
      </Link>
      <div className="home-news-body">
        <span className="home-news-index">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="home-news-title">
          <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="home-news-date">{publishedLabel}</p>
      </div>
    </article>
  );
}

function NewsSection({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="home-news-zone" aria-labelledby="home-news-title">
      <div className="stage-shell home-news-shell">
        <div className="home-news-head">
          <h2 id="home-news-title">Tin tức bất động sản</h2>
          <Link href="/tin-tuc" className="home-news-more" aria-label="Xem thêm tin tức bất động sản">
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="home-news-grid">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UtilityIcon({ icon }: { icon: UtilityTool["icon"] }) {
  if (icon === "age") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className="utility-icon is-age">
        <circle cx="40" cy="40" r="29" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="12 8" strokeLinecap="round" />
        <circle cx="40" cy="40" r="19" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M40 21C30 22.5 24 31.5 24 40C24 48.5 30.8 56.5 40 59C35.5 54 35.5 46 40 40C44.5 34 44.5 26 40 21Z" fill="currentColor" />
        <path d="M40 21C49.5 22.2 56 31 56 40C56 49 49.5 57 40 59C44.5 54 44.5 46 40 40C35.5 34 35.5 26 40 21Z" fill="#ffffff" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="40" cy="31" r="3.5" fill="#ffffff" />
        <circle cx="40" cy="50" r="3.5" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "cost") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className="utility-icon is-cost">
        <rect x="13" y="14" width="39" height="52" rx="5" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M24 39L32.5 31L41 39" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32.5 32V53" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 56H43" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M57 25H69C71.2 25 73 26.8 73 29V60C73 62.2 71.2 64 69 64H57" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.42" />
        <path d="M60 37H68M60 49H68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.42" />
      </svg>
    );
  }

  if (icon === "loan") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className="utility-icon is-loan">
        <rect x="12" y="13" width="49" height="51" rx="5" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M12 28H61M29 28V64" stroke="currentColor" strokeWidth="4" />
        <path d="M20 42H27M39 42H52M20 54L27 47M27 54L20 47" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="59" cy="58" r="16" fill="currentColor" />
        <text x="59" y="64" textAnchor="middle" fontSize="23" fontWeight="800" fill="#ffffff">đ</text>
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 80 80" className="utility-icon is-fengshui">
      <path d="M18 48C20 32 31 22 40 22C49 22 60 32 62 48" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M15 51H65M25 60H55" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 10V3M25 16L20 9M55 16L60 9M15 32L8 29M65 32L72 29M40 70V76" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function UtilitiesSection() {
  return (
    <section className="utilities-zone" aria-labelledby="utilities-title">
      <div className="stage-shell utilities-shell">
        <h2 id="utilities-title">Hỗ trợ tiện ích</h2>
        <div className="utilities-grid">
          {utilityTools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="utility-card">
              <UtilityIcon icon={tool.icon} />
              <span>{tool.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyGuideSection() {
  return <PropertyGuideCarousel />;
}

function SeoDirectorySection() {
  return (
    <section className="seo-directory-zone" aria-label="Liên kết bất động sản phổ biến">
      <div className="stage-shell seo-directory-shell">
        <div className="seo-directory-copy">
          <p>
            <strong>Anshome</strong> là nền tảng bất động sản dành cho người đang tìm kiếm nơi ở, cơ hội đầu tư và thông tin thị trường đáng tin cậy tại Việt Nam. Chúng tôi tổ chức dữ liệu tin rao theo nhiều loại hình để bạn dễ so sánh, lọc nhanh và chọn đúng nhu cầu.
          </p>
          <p>
            Ở phân khúc nhà đất bán, bạn có thể theo dõi các loại hình nổi bật như <Link href="/ban-can-ho-chung-cu">bán căn hộ chung cư</Link>, <Link href="/ban-nha-rieng">bán nhà riêng</Link>, nhà mặt tiền, biệt thự liền kề, bán đất, <Link href="/ban-dat-nen-du-an">đất nền dự án</Link>, shophouse và khu nghỉ dưỡng. Với bất động sản cho thuê, Anshome cập nhật các danh mục như <Link href="/cho-thue-nha-rieng">cho thuê nhà nguyên căn</Link>, <Link href="/cho-thue-phong-tro">thuê phòng trọ giá rẻ</Link>, thuê văn phòng, mặt bằng kinh doanh... <Link href="/trang-sitemap">Xem thêm</Link>
          </p>
        </div>

        <div className="seo-link-grid">
          {seoLinkGroups.map((group) => (
            <SeoLinkGroupColumn key={group.title} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="stage-shell site-footer-shell">
        <div className="footer-top">
          <Link href="/" className="footer-brand" aria-label="Anshome">
            <LogoMark />
            <div className="footer-brand-text">
              <p className="footer-brand-main">Anshome</p>
              <p className="footer-brand-sub">nền tảng bất động sản</p>
            </div>
          </Link>

          <div className="footer-contact-strip" aria-label="Thông tin liên hệ nhanh">
            {footerContacts.map((contact) => (
              <Link key={contact.label} href={contact.href} className="footer-contact-card">
                <FooterIcon icon={contact.icon} />
                <span>
                  <span className="footer-contact-label">{contact.label}</span>
                  <strong>{contact.value}</strong>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-company">
            <h2>Công ty cổ phần Anshome Việt Nam</h2>
            <ul className="footer-company-list">
              <li>
                <FooterIcon icon="pin" />
                <span>Tầng 31, Keangnam Hanoi Landmark Tower, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam</span>
              </li>
              <li>
                <FooterIcon icon="phone" />
                <a href="tel:+84901827555">(+84) 901 827 555</a>
              </li>
            </ul>

          </div>

          <FooterLinkColumn title="Hướng dẫn" links={footerGuideLinks} />
          <FooterLinkColumn title="Quy định" links={footerPolicyLinks} />

          <div className="footer-actions">
            <section aria-labelledby="footer-newsletter-title">
              <h2 id="footer-newsletter-title">Đăng ký nhận tin</h2>
              <form className="footer-newsletter">
                <label className="sr-only" htmlFor="footer-email">
                  Email nhận tin
                </label>
                <input id="footer-email" type="email" placeholder="Nhập email của bạn" />
                <button type="submit" aria-label="Đăng ký nhận tin">
                  <SendIcon />
                </button>
              </form>
            </section>

            <section aria-labelledby="footer-locale-title">
              <h2 id="footer-locale-title">Quốc gia &amp; ngôn ngữ</h2>
              <button type="button" className="footer-locale-select">
                <GlobeIcon />
                <span>Việt Nam</span>
                <ChevronSelectIcon />
              </button>
            </section>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav className="footer-link-column" aria-label={title}>
      <h2>
        <span>{title}</span>
        <svg aria-hidden viewBox="0 0 24 24" className="footer-link-column-chevron">
          <path d="M9 5L16 12L9 19" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileQuickActions() {
  const actions = [
    { label: "Mua bán", href: "/nha-dat-ban", image: "/mobile-actions/shortcut-for-sell.svg" },
    { label: "Cho thuê", href: "/nha-dat-cho-thue", image: "/mobile-actions/shortcut-for-rent.svg" },
    { label: "Dự án", href: "/du-an", image: "/mobile-actions/shortcut-for-project.svg" },
  ];

  return (
    <nav className="mobile-quick-actions" aria-label="Lối tắt bất động sản">
      {actions.map((action) => (
        <Link key={action.label} href={action.href} className="mobile-action-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={action.image} alt="" className="mobile-action-image" loading="lazy" />
          <span>{action.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default async function Home() {
  const requestHeaders = await headers();
  const wikiOrigin = resolveWikiOrigin(requestHeaders);
  const locationSlugs = locationHighlights.map((location) => location.slug);
  const [listings, projects, provinces, articles] = await Promise.all([
    db.listing.findMany({
      where: {
        status: "published",
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 8,
      include: homeListingInclude,
    }),
    db.project.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 4,
      include: featuredProjectInclude,
    }),
    db.location.findMany({
      where: {
        type: "province",
        slug: {
          in: locationSlugs,
        },
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
      },
    }),
    db.article.findMany({
      where: {
        status: "published",
        publishedAt: {
          not: null,
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: newsArticleInclude,
    }),
  ]);
  const listingCountsByProvince = provinces.length
    ? await db.listing.groupBy({
        by: ["provinceId"],
        where: {
          status: "published",
          provinceId: {
            in: provinces.map((province) => province.id),
          },
        },
        _count: {
          _all: true,
        },
      })
    : [];
  const provinceBySlug = new Map(provinces.map((province) => [province.slug, province]));
  const countByProvinceId = new Map(listingCountsByProvince.map((item) => [item.provinceId, item._count._all]));
  const highlightedLocations = locationHighlights.flatMap<LocationHighlight>((location) => {
    const province = provinceBySlug.get(location.slug);

    if (!province) {
      return [];
    }

    return [
      {
        name: location.displayName,
        count: countByProvinceId.get(province.id) ?? 0,
        href: location.href,
        image: location.image,
        featured: location.featured,
      },
    ];
  });

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

      <main className="hero-zone">
        <HomeSearch />
        <span className="mobile-hero-mark" aria-hidden>
          <LogoMark />
        </span>
      </main>

      <MobileQuickActions />
      <SpotlightNews sections={spotlightSections} />
      <RecommendedListings listings={listings} />
      <FeaturedProjectsSection projects={projects} />
      <LocationsSection locations={highlightedLocations} />
      <NewsSection articles={articles} />
      <UtilitiesSection />
      <PropertyGuideSection />
      <SeoDirectorySection />
      <SiteFooter />
    </div>
  );
}
