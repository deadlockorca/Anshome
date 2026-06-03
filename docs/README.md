# Bộ tài liệu nền tảng BĐS

Ngày audit: 2026-05-24

Bộ tài liệu này được tạo sau khi phân tích cấu trúc public của Batdongsan.com.vn ở mức sản phẩm, SEO, listing, dự án, CMS và sitemap. Mục tiêu là đạt functional parity: clone chức năng, luồng nghiệp vụ, cấu trúc dữ liệu, cấu trúc SEO, admin workflow và cách các module liên kết với nhau. Brand, UI visual, content, assets, wording public và dữ liệu listing sẽ là của riêng dự án.

## Tài liệu chính

- [Product Blueprint](./product-blueprint.md): bản đồ sản phẩm, module, role, workflow, admin, monetization.
- [MVP Scope](./mvp-scope.md): phạm vi MVP, flow bắt buộc, route, entity, release criteria.
- [Data Architecture](./data-architecture.md): domain dữ liệu, bảng database, search index, media, event, audit, scale path.
- [SEO Architecture](./seo-architecture.md): URL strategy, canonical, noindex, sitemap, schema, internal linking.
- [Platform Roadmap](./roadmap.md): roadmap Phase 1 đến Phase 5, team, priority, dependencies, exit criteria.
- [Technical Foundation](./technical-foundation.md): stack kỹ thuật đã chốt, Prisma/MySQL, auth/session foundation và lệnh vận hành.

## Định nghĩa "clone" trong dự án này

Clone:

- Module coverage.
- User flow.
- Listing workflow.
- Search/filter behavior.
- SEO surface.
- Database/domain structure.
- Admin/CMS structure.
- Monetization workflow.

Không clone:

- Logo, brand identity, UI visual skin.
- Copywriting public.
- Article/listing content.
- Hình ảnh, icon, asset độc quyền.
- Dữ liệu listing/project/broker/company từ bên thứ ba.

## Nguồn public đã tham khảo

- `https://batdongsan.com.vn/`
- `https://batdongsan.com.vn/trang-sitemap`
- `https://batdongsan.com.vn/nha-dat-ban`
- `https://batdongsan.com.vn/nha-dat-cho-thue`
- `https://batdongsan.com.vn/du-an-bat-dong-san`
- `https://wiki.batdongsan.com.vn/tin-tuc`
- `https://wiki.batdongsan.com.vn/wiki`
- `https://batdongsan.com.vn/robots.txt`

## Cách đọc đề xuất

1. Đọc `product-blueprint.md` để hiểu toàn bộ hệ thống.
2. Đọc `mvp-scope.md` để chốt phạm vi bản đầu tiên.
3. Đọc `data-architecture.md` trước khi thiết kế database hoặc API.
4. Đọc `seo-architecture.md` trước khi làm routing, listing pages hoặc CMS.
5. Dùng `roadmap.md` để chia sprint, team và milestone.

## Quyết định cần chốt tiếp

- Thị trường đầu tiên: toàn quốc hay một vài tỉnh/thành trọng điểm.
- Nguồn listing ban đầu: user-generated, seed nội bộ, agency onboarding hay hybrid.
- Chính sách xác thực: chính chủ, môi giới, agency, tin xác thực.
- Thời điểm bật payment và gói đăng tin.
- Stack backend/search/payment chính thức.
