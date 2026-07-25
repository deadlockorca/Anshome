import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, type CategoryTransactionType, type LocationType, type ProjectStatus, type RoleCode } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const roles: Array<{ code: RoleCode; name: string; description: string }> = [
  { code: "seeker", name: "Seeker", description: "Browse, save listings, and submit leads." },
  { code: "owner", name: "Owner", description: "Post and manage own property listings." },
  { code: "agent", name: "Agent", description: "Manage professional listing inventory and leads." },
  { code: "agency_admin", name: "Agency Admin", description: "Manage agency members, listings, and package usage." },
  { code: "developer", name: "Developer", description: "Manage project and developer profile data." },
  { code: "moderator", name: "Moderator", description: "Review, approve, reject, hide, and flag listings." },
  { code: "editor", name: "Editor", description: "Manage CMS articles, categories, and SEO metadata." },
  { code: "ops", name: "Operations", description: "Manage packages, orders, support, and operational reports." },
  { code: "super_admin", name: "Super Admin", description: "Full system access and role management." },
];

const categories: Array<{
  transactionType: CategoryTransactionType;
  code: string;
  name: string;
  slug: string;
  sortOrder: number;
}> = [
  { transactionType: "sale", code: "sale_apartment", name: "Ban can ho chung cu", slug: "ban-can-ho-chung-cu", sortOrder: 10 },
  { transactionType: "sale", code: "sale_serviced_apartment", name: "Ban chung cu mini, can ho dich vu", slug: "ban-chung-cu-mini-can-ho-dich-vu", sortOrder: 20 },
  { transactionType: "sale", code: "sale_house", name: "Ban nha rieng", slug: "ban-nha-rieng", sortOrder: 30 },
  { transactionType: "sale", code: "sale_villa", name: "Ban nha biet thu, lien ke", slug: "ban-nha-biet-thu-lien-ke", sortOrder: 40 },
  { transactionType: "sale", code: "sale_street_house", name: "Ban nha mat pho", slug: "ban-nha-mat-pho", sortOrder: 50 },
  { transactionType: "sale", code: "sale_shophouse", name: "Ban shophouse, nha pho thuong mai", slug: "ban-shophouse-nha-pho-thuong-mai", sortOrder: 60 },
  { transactionType: "sale", code: "sale_project_land", name: "Ban dat nen du an", slug: "ban-dat-nen-du-an", sortOrder: 70 },
  { transactionType: "sale", code: "sale_land", name: "Ban dat", slug: "ban-dat", sortOrder: 80 },
  { transactionType: "sale", code: "sale_farm_resort", name: "Ban trang trai, khu nghi duong", slug: "ban-trang-trai-khu-nghi-duong", sortOrder: 90 },
  { transactionType: "sale", code: "sale_condotel", name: "Ban condotel", slug: "ban-condotel", sortOrder: 100 },
  { transactionType: "sale", code: "sale_warehouse", name: "Ban kho, nha xuong", slug: "ban-kho-nha-xuong", sortOrder: 110 },
  { transactionType: "sale", code: "sale_other", name: "Ban loai bat dong san khac", slug: "ban-bat-dong-san-khac", sortOrder: 120 },
  { transactionType: "rent", code: "rent_apartment", name: "Cho thue can ho chung cu", slug: "cho-thue-can-ho-chung-cu", sortOrder: 10 },
  { transactionType: "rent", code: "rent_serviced_apartment", name: "Cho thue chung cu mini, can ho dich vu", slug: "cho-thue-chung-cu-mini-can-ho-dich-vu", sortOrder: 20 },
  { transactionType: "rent", code: "rent_house", name: "Cho thue nha rieng", slug: "cho-thue-nha-rieng", sortOrder: 30 },
  { transactionType: "rent", code: "rent_villa", name: "Cho thue nha biet thu, lien ke", slug: "cho-thue-nha-biet-thu-lien-ke", sortOrder: 40 },
  { transactionType: "rent", code: "rent_street_house", name: "Cho thue nha mat pho", slug: "cho-thue-nha-mat-pho", sortOrder: 50 },
  { transactionType: "rent", code: "rent_room", name: "Cho thue nha tro, phong tro", slug: "cho-thue-nha-tro-phong-tro", sortOrder: 60 },
  { transactionType: "rent", code: "rent_shophouse", name: "Cho thue shophouse, nha pho thuong mai", slug: "cho-thue-shophouse-nha-pho-thuong-mai", sortOrder: 70 },
  { transactionType: "rent", code: "rent_office", name: "Cho thue van phong", slug: "cho-thue-van-phong", sortOrder: 80 },
  { transactionType: "rent", code: "rent_shop", name: "Cho thue, sang nhuong cua hang, ki ot", slug: "cho-thue-cua-hang-ki-ot", sortOrder: 90 },
  { transactionType: "rent", code: "rent_warehouse_land", name: "Cho thue kho, nha xuong, dat", slug: "cho-thue-kho-nha-xuong-dat", sortOrder: 100 },
  { transactionType: "rent", code: "rent_other", name: "Cho thue loai bat dong san khac", slug: "cho-thue-bat-dong-san-khac", sortOrder: 110 },
  { transactionType: "both", code: "project_apartment", name: "Du an can ho chung cu", slug: "du-an-can-ho-chung-cu", sortOrder: 210 },
  { transactionType: "both", code: "project_office", name: "Du an cao oc van phong", slug: "du-an-cao-oc-van-phong", sortOrder: 220 },
  { transactionType: "both", code: "project_urban_area", name: "Du an khu do thi moi", slug: "du-an-khu-do-thi-moi", sortOrder: 230 },
  { transactionType: "both", code: "project_social_housing", name: "Du an nha o xa hoi", slug: "du-an-nha-o-xa-hoi", sortOrder: 240 },
  { transactionType: "both", code: "project_industrial", name: "Du an khu cong nghiep", slug: "du-an-khu-cong-nghiep", sortOrder: 250 },
];

const articleCategories = [
  { name: "Tin tuc", slug: "tin-tuc", description: "Market news and real-estate updates." },
  { name: "Wiki BDS", slug: "wiki", description: "Evergreen real-estate guides." },
  { name: "Mua BDS", slug: "mua-bat-dong-san", description: "Buying guides." },
  { name: "Ban BDS", slug: "ban-bat-dong-san", description: "Selling guides." },
  { name: "Thue BDS", slug: "thue-bat-dong-san", description: "Renting guides." },
  { name: "Tai chinh BDS", slug: "tai-chinh-bat-dong-san", description: "Finance and mortgage topics." },
  { name: "Quy hoach - Phap ly", slug: "quy-hoach-phap-ly", description: "Planning and legal topics." },
  { name: "Noi - Ngoai that", slug: "noi-ngoai-that", description: "Interior and exterior topics." },
  { name: "Bao cao thi truong", slug: "bao-cao-thi-truong", description: "Market reports." },
  { name: "Goc nhin chuyen gia", slug: "goc-nhin-chuyen-gia", description: "Expert views." },
];

const locations: Array<{
  type: LocationType;
  name: string;
  slug: string;
  fullName: string;
  code?: string;
  parentSlug?: string;
  latitude?: string;
  longitude?: string;
}> = [
  { type: "country", name: "Viet Nam", slug: "viet-nam", fullName: "Viet Nam", code: "VN", latitude: "14.0583240", longitude: "108.2771990" },
  { type: "province", name: "Ha Noi", slug: "ha-noi", fullName: "Thanh pho Ha Noi", parentSlug: "viet-nam", latitude: "21.0277644", longitude: "105.8341598" },
  { type: "province", name: "TP. Ho Chi Minh", slug: "tp-ho-chi-minh", fullName: "Thanh pho Ho Chi Minh", parentSlug: "viet-nam", latitude: "10.8230990", longitude: "106.6296640" },
  { type: "province", name: "Da Nang", slug: "da-nang", fullName: "Thanh pho Da Nang", parentSlug: "viet-nam", latitude: "16.0544068", longitude: "108.2021667" },
  { type: "province", name: "Binh Duong", slug: "binh-duong", fullName: "Binh Duong", parentSlug: "viet-nam", latitude: "11.3254024", longitude: "106.4770170" },
  { type: "province", name: "Dong Nai", slug: "dong-nai", fullName: "Dong Nai", parentSlug: "viet-nam", latitude: "11.0686305", longitude: "107.1675976" },
  { type: "province", name: "Long An", slug: "long-an", fullName: "Long An", parentSlug: "viet-nam", latitude: "10.6955720", longitude: "106.2431205" },
  { type: "province", name: "Phu Yen", slug: "phu-yen", fullName: "Phu Yen", parentSlug: "viet-nam", latitude: "13.0881861", longitude: "109.0928764" },
  { type: "district", name: "Cau Giay", slug: "cau-giay", fullName: "Quan Cau Giay, Ha Noi", parentSlug: "ha-noi", latitude: "21.0362368", longitude: "105.7905825" },
  { type: "district", name: "Quan 1", slug: "quan-1", fullName: "Quan 1, TP. Ho Chi Minh", parentSlug: "tp-ho-chi-minh", latitude: "10.7756587", longitude: "106.7004238" },
  { type: "district", name: "Quan 7", slug: "quan-7", fullName: "Quan 7, TP. Ho Chi Minh", parentSlug: "tp-ho-chi-minh", latitude: "10.7340344", longitude: "106.7215787" },
  { type: "district", name: "Thu Duc", slug: "thu-duc", fullName: "Thu Duc, TP. Ho Chi Minh", parentSlug: "tp-ho-chi-minh", latitude: "10.8494094", longitude: "106.7537055" },
  { type: "district", name: "Can Giuoc", slug: "can-giuoc", fullName: "Can Giuoc, Long An", parentSlug: "long-an", latitude: "10.6081300", longitude: "106.6712500" },
  { type: "district", name: "Tuy Hoa", slug: "tuy-hoa", fullName: "Tuy Hoa, Phu Yen", parentSlug: "phu-yen", latitude: "13.0954636", longitude: "109.3209404" },
  { type: "district", name: "Ngu Hanh Son", slug: "ngu-hanh-son", fullName: "Quan Ngu Hanh Son, Da Nang", parentSlug: "da-nang", latitude: "16.0038536", longitude: "108.2646719" },
];

const featuredProjects: Array<{
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  provinceSlug: string;
  districtSlug: string;
  landArea: string | null;
  priceMin: string | null;
  priceUnit: string;
  addressText: string;
  imageUrl: string;
  mediaCount: number;
}> = [
  {
    name: "The Royal - Five Star Eco City",
    slug: "the-royal-five-star-eco-city",
    description: "Khu do thi sinh thai quy mo lon tai cua ngo phia Nam TP.HCM, phat trien theo mo hinh do thi xanh tich hop tien ich.",
    status: "selling",
    provinceSlug: "long-an",
    districtSlug: "can-giuoc",
    landArea: "395000",
    priceMin: null,
    priceUnit: "VND/m2",
    addressText: "Can Giuoc, Long An",
    imageUrl: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82",
    mediaCount: 17,
  },
  {
    name: "The Peak Garden",
    slug: "the-peak-garden",
    description: "Du an can ho cao tang tai khu Nam Sai Gon, ket noi nhanh Phu My Hung, Quan 7 va cac tien ich thuong mai.",
    status: "selling",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "quan-7",
    landArea: "52600",
    priceMin: "75000000",
    priceUnit: "VND/m2",
    addressText: "Quan 7, Ho Chi Minh",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82",
    mediaCount: 10,
  },
  {
    name: "Cloud Icon L' Avenir",
    slug: "cloud-icon-l-avenir",
    description: "To hop can ho ven bien tai Tuy Hoa, dinh vi dong san pham nghi duong do thi voi tam nhin huong bien.",
    status: "planning",
    provinceSlug: "phu-yen",
    districtSlug: "tuy-hoa",
    landArea: null,
    priceMin: null,
    priceUnit: "VND/m2",
    addressText: "Tuy Hoa, Phu Yen",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
    mediaCount: 5,
  },
  {
    name: "Prosper Pho Dong",
    slug: "prosper-pho-dong",
    description: "Du an can ho tai khu Dong TP.HCM, phu hop nhu cau o thuc voi muc gia vua tam va tien ich noi khu day du.",
    status: "selling",
    provinceSlug: "tp-ho-chi-minh",
    districtSlug: "thu-duc",
    landArea: "5951.4",
    priceMin: "51000000",
    priceUnit: "VND/m2",
    addressText: "Thu Duc, Ho Chi Minh",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82",
    mediaCount: 8,
  },
];

const projectListings: Array<{
  publicId: string;
  projectSlug: string;
  categoryCode: string;
  transactionType: "sale" | "rent";
  title: string;
  slug: string;
  description: string;
  price: string;
  priceUnit: string;
  area: string;
  pricePerSqm: string;
  bedrooms: number | null;
  bathrooms: number | null;
  legalStatus: string;
  interiorStatus: string;
  imageUrl: string;
  latitude: string;
  longitude: string;
}> = [
  {
    publicId: "ANROYAL001",
    projectSlug: "the-royal-five-star-eco-city",
    categoryCode: "sale_villa",
    transactionType: "sale",
    title: "Bán biệt thự song lập The Royal Five Star Eco City, khu thấp tầng ven công viên",
    slug: "ban-biet-thu-song-lap-the-royal-five-star-eco-city-khu-thap-tang-ven-cong-vien",
    description: "Biệt thự song lập tại The Royal Five Star Eco City, vị trí nội khu yên tĩnh, phù hợp gia đình cần không gian sống xanh và kết nối nhanh về TP.HCM.",
    price: "13700000000",
    priceUnit: "VND",
    area: "180",
    pricePerSqm: "76111111",
    bedrooms: 4,
    bathrooms: 4,
    legalStatus: "Sổ hồng lâu dài",
    interiorStatus: "Bàn giao thô",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=82",
    latitude: "10.6081300",
    longitude: "106.6712500",
  },
  {
    publicId: "ANROYAL002",
    projectSlug: "the-royal-five-star-eco-city",
    categoryCode: "sale_shophouse",
    transactionType: "sale",
    title: "Chuyển nhượng shophouse The Royal Five Star Eco City mặt trục thương mại",
    slug: "chuyen-nhuong-shophouse-the-royal-five-star-eco-city-mat-truc-thuong-mai",
    description: "Shophouse mặt trục thương mại dự án The Royal Five Star Eco City, phù hợp khai thác kinh doanh hoặc giữ tài sản dài hạn.",
    price: "19800000000",
    priceUnit: "VND",
    area: "120",
    pricePerSqm: "165000000",
    bedrooms: 3,
    bathrooms: 4,
    legalStatus: "Hợp đồng mua bán",
    interiorStatus: "Bàn giao thô",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=82",
    latitude: "10.6088200",
    longitude: "106.6720400",
  },
  {
    publicId: "ANROYAL003",
    projectSlug: "the-royal-five-star-eco-city",
    categoryCode: "sale_project_land",
    transactionType: "sale",
    title: "Bán nền biệt thự The Royal Five Star Eco City, diện tích 200m2, đường nội khu rộng",
    slug: "ban-nen-biet-thu-the-royal-five-star-eco-city-dien-tich-200m2-duong-noi-khu-rong",
    description: "Nền biệt thự trong khu đô thị sinh thái The Royal Five Star Eco City, pháp lý rõ ràng, hạ tầng nội khu đang hoàn thiện.",
    price: "9200000000",
    priceUnit: "VND",
    area: "200",
    pricePerSqm: "46000000",
    bedrooms: null,
    bathrooms: null,
    legalStatus: "Hợp đồng mua bán",
    interiorStatus: "Đất nền",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82",
    latitude: "10.6075100",
    longitude: "106.6706200",
  },
  {
    publicId: "ANROYAL004",
    projectSlug: "the-royal-five-star-eco-city",
    categoryCode: "sale_villa",
    transactionType: "sale",
    title: "Bán nhà phố vườn The Royal Five Star Eco City, gần tiện ích trung tâm",
    slug: "ban-nha-pho-vuon-the-royal-five-star-eco-city-gan-tien-ich-trung-tam",
    description: "Nhà phố vườn thuộc phân khu thấp tầng The Royal Five Star Eco City, thiết kế tối ưu cho ở thật, gần công viên và cụm tiện ích trung tâm.",
    price: "11200000000",
    priceUnit: "VND",
    area: "150",
    pricePerSqm: "74666667",
    bedrooms: 4,
    bathrooms: 3,
    legalStatus: "Sổ hồng lâu dài",
    interiorStatus: "Hoàn thiện cơ bản",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82",
    latitude: "10.6093400",
    longitude: "106.6719200",
  },
];

const listingMarketInsights: Array<{
  code: string;
  transactionType: "sale" | "rent";
  categoryCode: string;
  provinceSlug: string;
  districtSlug: string;
  title: string;
  summary: string;
  changePercent: string;
  periodLabel: string;
  currentPricePerSqm: string;
  lowPricePerSqm: string;
  highPricePerSqm: string;
  ctaLabel: string;
  ctaHref: string;
}> = [
  {
    code: "sale-villa-can-giuoc-price-2026",
    transactionType: "sale",
    categoryCode: "sale_villa",
    provinceSlug: "long-an",
    districtSlug: "can-giuoc",
    title: "Giá bán khu vực Cần Giuộc",
    summary: "Giá tại khu vực này đã tăng trong vòng 1 năm qua",
    changePercent: "12.00",
    periodLabel: "1 năm",
    currentPricePerSqm: "76111111",
    lowPricePerSqm: "70000000",
    highPricePerSqm: "83500000",
    ctaLabel: "Xem lịch sử giá",
    ctaHref: "#gia",
  },
];

const listingDetailLinks: Array<{
  code: string;
  group: "area_market" | "popular_property" | "utility";
  label: string;
  href: string;
  count?: number;
  categoryCode?: string;
  locationSlug?: string;
  sortOrder: number;
}> = [
  { code: "area-can-giuoc", group: "area_market", label: "Can Giuoc, Long An", href: "/tin-dang?district=can-giuoc", count: 80, categoryCode: "sale_villa", locationSlug: "can-giuoc", sortOrder: 10 },
  { code: "area-can-giuoc-phuong-1", group: "area_market", label: "Phường 1", href: "/tin-dang?district=can-giuoc&ward=phuong-1", count: 75, categoryCode: "sale_villa", locationSlug: "can-giuoc", sortOrder: 20 },
  { code: "area-can-giuoc-phuong-7", group: "area_market", label: "Phường 7", href: "/tin-dang?district=can-giuoc&ward=phuong-7", count: 71, categoryCode: "sale_villa", locationSlug: "can-giuoc", sortOrder: 30 },
  { code: "area-can-giuoc-phuong-4", group: "area_market", label: "Phường 4", href: "/tin-dang?district=can-giuoc&ward=phuong-4", count: 61, categoryCode: "sale_villa", locationSlug: "can-giuoc", sortOrder: 40 },
  { code: "area-can-giuoc-phuong-3", group: "area_market", label: "Phường 3", href: "/tin-dang?district=can-giuoc&ward=phuong-3", count: 59, categoryCode: "sale_villa", locationSlug: "can-giuoc", sortOrder: 50 },
  { code: "popular-saigon-intela", group: "popular_property", label: "Căn hộ Sài Gòn Intela", href: "/du-an/saigon-intela", sortOrder: 10 },
  { code: "popular-new-city-thu-thiem", group: "popular_property", label: "Căn hộ New City Thủ Thiêm", href: "/du-an/new-city-thu-thiem", sortOrder: 20 },
  { code: "popular-green-river", group: "popular_property", label: "Căn hộ Green River", href: "/du-an/green-river", sortOrder: 30 },
  { code: "popular-kingdom-101", group: "popular_property", label: "Căn hộ Kingdom 101", href: "/du-an/kingdom-101", sortOrder: 40 },
  { code: "popular-midtown-phu-my-hung", group: "popular_property", label: "Căn hộ Midtown Phú Mỹ Hưng", href: "/du-an/midtown-phu-my-hung", sortOrder: 50 },
  { code: "popular-sunshine-avenue", group: "popular_property", label: "Căn hộ Sunshine Avenue", href: "/du-an/sunshine-avenue", sortOrder: 60 },
  { code: "utility-feng-shui", group: "utility", label: "Tư vấn phong thủy", href: "/wiki/phong-thuy", sortOrder: 10 },
  { code: "utility-build-cost", group: "utility", label: "Dự tính chi phí làm nhà", href: "/wiki/du-tinh-chi-phi-lam-nha", sortOrder: 20 },
  { code: "utility-interest", group: "utility", label: "Tính lãi suất", href: "/wiki/tai-chinh-bat-dong-san", sortOrder: 30 },
  { code: "utility-building-process", group: "utility", label: "Quy trình xây nhà", href: "/wiki/quy-trinh-xay-nha", sortOrder: 40 },
  { code: "utility-age-check", group: "utility", label: "Xem tuổi làm nhà", href: "/wiki/xem-tuoi-lam-nha", sortOrder: 50 },
];

const newsArticles: Array<{
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  imageUrl: string;
}> = [
  {
    title: "Vietnam Land mở rộng hợp tác phát triển đại đô thị phía Nam TP.HCM",
    slug: "vietnam-land-mo-rong-hop-tac-phat-trien-dai-do-thi-phia-nam-tphcm",
    excerpt: "Các chủ đầu tư tiếp tục tăng tốc hợp tác chiến lược tại những khu đô thị quy mô lớn, nơi hạ tầng và tiện ích đang định hình lại nhu cầu an cư.",
    body: "Thị trường bất động sản phía Nam ghi nhận xu hướng hợp tác giữa các đơn vị phát triển dự án, môi giới và vận hành nhằm tăng tốc bán hàng, hoàn thiện trải nghiệm khách mua và nâng chất lượng dịch vụ sau bàn giao.",
    imageUrl: "https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Giới nhà giàu Hà Nội săn tìm căn hộ diện tích lớn ở lõi nội đô",
    slug: "gioi-nha-giau-ha-noi-san-tim-can-ho-dien-tich-lon-o-loi-noi-do",
    excerpt: "Những căn hộ diện tích lớn, vị trí trung tâm và pháp lý rõ ràng tiếp tục giữ sức hút với nhóm khách mua ở thật lẫn tích sản dài hạn.",
    body: "Nguồn cung căn hộ diện tích lớn tại lõi đô thị không nhiều, trong khi nhu cầu nâng cấp không gian sống của nhóm khách hàng có tài chính tốt vẫn ổn định. Điều này khiến phân khúc cao cấp có vị trí đẹp duy trì mặt bằng quan tâm cao.",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Hạ tầng cửa ngõ phía Đông mở thêm cơ hội đầu tư chu kỳ mới",
    slug: "ha-tang-cua-ngo-phia-dong-mo-them-co-hoi-dau-tu-chu-ky-moi",
    excerpt: "Các tuyến kết nối liên vùng giúp thị trường phía Đông được quan tâm hơn, đặc biệt ở nhóm sản phẩm có thể khai thác cho thuê hoặc tích sản.",
    body: "Khi hạ tầng giao thông được cải thiện, biên độ di chuyển giữa trung tâm và các đô thị vệ tinh rút ngắn đáng kể. Nhà đầu tư bắt đầu chọn lọc kỹ hơn, ưu tiên dự án có pháp lý, tiện ích và khả năng vận hành thực tế.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82",
  },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: role,
      update: { name: role.name, description: role.description },
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { code: category.code },
      create: category,
      update: {
        transactionType: category.transactionType,
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
  }

  const locationIds = new Map<string, string>();
  for (const location of locations) {
    const parentId = location.parentSlug ? locationIds.get(location.parentSlug) : undefined;
    const record = await prisma.location.upsert({
      where: { type_slug: { type: location.type, slug: location.slug } },
      create: {
        type: location.type,
        name: location.name,
        slug: location.slug,
        fullName: location.fullName,
        code: location.code,
        parentId,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      update: {
        name: location.name,
        fullName: location.fullName,
        code: location.code,
        parentId,
        latitude: location.latitude,
        longitude: location.longitude,
        isActive: true,
      },
    });
    locationIds.set(location.slug, record.id);
  }

  for (const insight of listingMarketInsights) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { code: insight.categoryCode },
      select: { id: true },
    });
    const provinceId = locationIds.get(insight.provinceSlug);
    const districtId = locationIds.get(insight.districtSlug);

    await prisma.listingMarketInsight.upsert({
      where: { code: insight.code },
      create: {
        code: insight.code,
        transactionType: insight.transactionType,
        categoryId: category.id,
        provinceId,
        districtId,
        title: insight.title,
        summary: insight.summary,
        changePercent: insight.changePercent,
        periodLabel: insight.periodLabel,
        currentPricePerSqm: insight.currentPricePerSqm,
        lowPricePerSqm: insight.lowPricePerSqm,
        highPricePerSqm: insight.highPricePerSqm,
        ctaLabel: insight.ctaLabel,
        ctaHref: insight.ctaHref,
      },
      update: {
        transactionType: insight.transactionType,
        categoryId: category.id,
        provinceId,
        districtId,
        title: insight.title,
        summary: insight.summary,
        changePercent: insight.changePercent,
        periodLabel: insight.periodLabel,
        currentPricePerSqm: insight.currentPricePerSqm,
        lowPricePerSqm: insight.lowPricePerSqm,
        highPricePerSqm: insight.highPricePerSqm,
        ctaLabel: insight.ctaLabel,
        ctaHref: insight.ctaHref,
        isActive: true,
      },
    });
  }

  for (const detailLink of listingDetailLinks) {
    const categoryId = detailLink.categoryCode
      ? (await prisma.category.findUniqueOrThrow({ where: { code: detailLink.categoryCode }, select: { id: true } })).id
      : undefined;
    const locationId = detailLink.locationSlug ? locationIds.get(detailLink.locationSlug) : undefined;

    await prisma.listingDetailLink.upsert({
      where: { code: detailLink.code },
      create: {
        code: detailLink.code,
        group: detailLink.group,
        label: detailLink.label,
        href: detailLink.href,
        count: detailLink.count,
        categoryId,
        locationId,
        sortOrder: detailLink.sortOrder,
      },
      update: {
        group: detailLink.group,
        label: detailLink.label,
        href: detailLink.href,
        count: detailLink.count,
        categoryId,
        locationId,
        sortOrder: detailLink.sortOrder,
        isActive: true,
      },
    });
  }

  for (const category of articleCategories) {
    await prisma.articleCategory.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        description: category.description,
      },
    });
  }

  const newsCategory = await prisma.articleCategory.findUniqueOrThrow({
    where: { slug: "tin-tuc" },
    select: { id: true },
  });

  for (const [index, article] of newsArticles.entries()) {
    const media = await prisma.media.upsert({
      where: { storageKey: `seed/news/${article.slug}.jpg` },
      create: {
        storageKey: `seed/news/${article.slug}.jpg`,
        publicUrl: article.imageUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      update: {
        publicUrl: article.imageUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 675,
        status: "approved",
      },
      select: { id: true },
    });

    await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        categoryId: newsCategory.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        coverMediaId: media.id,
        status: "published",
        seoTitle: article.title,
        seoDescription: article.excerpt,
        publishedAt: new Date(Date.now() - index * 2 * 60 * 60 * 1000),
      },
      update: {
        categoryId: newsCategory.id,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        coverMediaId: media.id,
        status: "published",
        seoTitle: article.title,
        seoDescription: article.excerpt,
        publishedAt: new Date(Date.now() - index * 2 * 60 * 60 * 1000),
      },
    });
  }

  const projectCategory = await prisma.category.findUniqueOrThrow({
    where: { code: "project_apartment" },
    select: { id: true },
  });

  const projectIds = new Map<string, string>();

  for (const [index, project] of featuredProjects.entries()) {
    const provinceId = locationIds.get(project.provinceSlug);
    const districtId = locationIds.get(project.districtSlug);

    if (!provinceId || !districtId) {
      throw new Error(`Missing seed location for project ${project.slug}.`);
    }

    const publishedAt = new Date(Date.now() - index * 60 * 1000);
    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        name: project.name,
        slug: project.slug,
        description: project.description,
        status: project.status,
        categoryId: projectCategory.id,
        provinceId,
        districtId,
        addressText: project.addressText,
        landArea: project.landArea,
        priceMin: project.priceMin,
        priceMax: project.priceMin,
        priceUnit: project.priceUnit,
        legalStatus: project.status === "selling" ? "Dang mo ban" : "Dang cap nhat",
        publishedAt,
      },
      update: {
        name: project.name,
        description: project.description,
        status: project.status,
        categoryId: projectCategory.id,
        provinceId,
        districtId,
        addressText: project.addressText,
        landArea: project.landArea,
        priceMin: project.priceMin,
        priceMax: project.priceMin,
        priceUnit: project.priceUnit,
        legalStatus: project.status === "selling" ? "Dang mo ban" : "Dang cap nhat",
        publishedAt,
      },
      select: { id: true },
    });
    projectIds.set(project.slug, record.id);

    for (let sortOrder = 0; sortOrder < project.mediaCount; sortOrder += 1) {
      const storageKey =
        sortOrder === 0
          ? `seed/featured-projects/${project.slug}.jpg`
          : `seed/featured-projects/${project.slug}-${sortOrder}.jpg`;
      const media = await prisma.media.upsert({
        where: { storageKey },
        create: {
          storageKey,
          publicUrl: project.imageUrl,
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        update: {
          publicUrl: project.imageUrl,
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        select: { id: true },
      });

      await prisma.projectMedia.upsert({
        where: {
          projectId_mediaId: {
            projectId: record.id,
            mediaId: media.id,
          },
        },
        create: {
          projectId: record.id,
          mediaId: media.id,
          type: "image",
          sortOrder,
        },
        update: {
          type: "image",
          sortOrder,
        },
      });
    }
  }

  const agentRole = await prisma.role.findUniqueOrThrow({
    where: { code: "agent" },
    select: { id: true },
  });
  const listingOwner = await prisma.user.upsert({
    where: { email: "seed.agent@anshome.local" },
    create: {
      email: "seed.agent@anshome.local",
      profile: {
        create: {
          displayName: "Anshome Project Agent",
        },
      },
    },
    update: {
      status: "active",
      profile: {
        upsert: {
          create: {
            displayName: "Anshome Project Agent",
          },
          update: {
            displayName: "Anshome Project Agent",
          },
        },
      },
    },
    select: { id: true },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId_scopeType_scopeId: {
        userId: listingOwner.id,
        roleId: agentRole.id,
        scopeType: "",
        scopeId: "",
      },
    },
    create: {
      userId: listingOwner.id,
      roleId: agentRole.id,
      scopeType: "",
      scopeId: "",
    },
    update: {},
  });

  for (const [index, listing] of projectListings.entries()) {
    const projectId = projectIds.get(listing.projectSlug);
    const category = await prisma.category.findUniqueOrThrow({
      where: { code: listing.categoryCode },
      select: { id: true },
    });

    if (!projectId) {
      throw new Error(`Missing seed project for listing ${listing.publicId}.`);
    }

    const project = featuredProjects.find((item) => item.slug === listing.projectSlug);
    const provinceId = project ? locationIds.get(project.provinceSlug) : undefined;
    const districtId = project ? locationIds.get(project.districtSlug) : undefined;

    if (!provinceId || !districtId) {
      throw new Error(`Missing seed location for listing ${listing.publicId}.`);
    }

    const publishedAt = new Date(Date.now() - (index + 1) * 60 * 60 * 1000);
    const record = await prisma.listing.upsert({
      where: { publicId: listing.publicId },
      create: {
        publicId: listing.publicId,
        ownerUserId: listingOwner.id,
        projectId,
        transactionType: listing.transactionType,
        categoryId: category.id,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: listing.priceUnit,
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId,
        districtId,
        addressText: "The Royal Five Star Eco City, Can Giuoc, Long An",
        latitude: listing.latitude,
        longitude: listing.longitude,
        contactName: "Anshome Project Agent",
        contactPhone: "0909000000",
        contactZalo: "0909000000",
        isVerified: true,
        isFeatured: index < 2,
        publishedAt,
        expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      update: {
        projectId,
        transactionType: listing.transactionType,
        categoryId: category.id,
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        status: "published",
        moderationStatus: "approved",
        price: listing.price,
        priceUnit: listing.priceUnit,
        area: listing.area,
        pricePerSqm: listing.pricePerSqm,
        provinceId,
        districtId,
        addressText: "The Royal Five Star Eco City, Can Giuoc, Long An",
        latitude: listing.latitude,
        longitude: listing.longitude,
        contactName: "Anshome Project Agent",
        contactPhone: "0909000000",
        contactZalo: "0909000000",
        isVerified: true,
        isFeatured: index < 2,
        publishedAt,
        expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      select: { id: true },
    });

    await prisma.listingAttribute.upsert({
      where: { listingId: record.id },
      create: {
        listingId: record.id,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        legalStatus: listing.legalStatus,
        interiorStatus: listing.interiorStatus,
        landArea: listing.area,
      },
      update: {
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        legalStatus: listing.legalStatus,
        interiorStatus: listing.interiorStatus,
        landArea: listing.area,
      },
    });

    const media = await prisma.media.upsert({
      where: { storageKey: `seed/project-listings/${listing.publicId}.jpg` },
      create: {
        ownerUserId: listingOwner.id,
        storageKey: `seed/project-listings/${listing.publicId}.jpg`,
        publicUrl: listing.imageUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 800,
        status: "approved",
      },
      update: {
        ownerUserId: listingOwner.id,
        publicUrl: listing.imageUrl,
        mimeType: "image/jpeg",
        sizeBytes: 600000,
        width: 1200,
        height: 800,
        status: "approved",
      },
      select: { id: true },
    });

    await prisma.listingMedia.upsert({
      where: {
        listingId_mediaId: {
          listingId: record.id,
          mediaId: media.id,
        },
      },
      create: {
        listingId: record.id,
        mediaId: media.id,
        type: "image",
        sortOrder: 0,
        caption: listing.title,
        moderationStatus: "approved",
      },
      update: {
        type: "image",
        sortOrder: 0,
        caption: listing.title,
        moderationStatus: "approved",
      },
    });
  }

  await prisma.listingView.deleteMany({
    where: {
      source: "seed:detail-page",
    },
  });

  const viewedSeedListings = await prisma.listing.findMany({
    where: {
      publicId: {
        in: projectListings.filter((listing) => listing.publicId !== "ANROYAL001").map((listing) => listing.publicId),
      },
    },
    select: { id: true },
  });

  if (viewedSeedListings.length > 0) {
    await prisma.listingView.createMany({
      data: viewedSeedListings.map((listing, index) => ({
        listingId: listing.id,
        sessionId: "seed-session",
        source: "seed:detail-page",
        viewedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
      })),
    });
  }

  const adminEmail = process.env.SEED_SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;
  const adminName = process.env.SEED_SUPER_ADMIN_NAME ?? "Anshome Admin";

  if (adminEmail && adminPassword) {
    const superAdminRole = await prisma.role.findUniqueOrThrow({
      where: { code: "super_admin" },
      select: { id: true },
    });

    const user = await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      create: {
        email: adminEmail.toLowerCase(),
        passwordHash: await hashPassword(adminPassword),
        profile: {
          create: {
            displayName: adminName,
          },
        },
      },
      update: {
        passwordHash: await hashPassword(adminPassword),
        status: "active",
        profile: {
          upsert: {
            create: {
              displayName: adminName,
            },
            update: {
              displayName: adminName,
            },
          },
        },
      },
      select: { id: true },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId_scopeType_scopeId: {
          userId: user.id,
          roleId: superAdminRole.id,
          scopeType: "",
          scopeId: "",
        },
      },
      create: {
        userId: user.id,
        roleId: superAdminRole.id,
        scopeType: "",
        scopeId: "",
      },
      update: {},
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
