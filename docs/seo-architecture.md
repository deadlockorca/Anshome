# SEO Architecture

Audit date: 2026-05-24

This document defines the SEO architecture for the platform. The goal is to build scalable, crawlable, high-quality landing pages from our own structured data.

## Public Reference Signals

Observed public patterns:

- Main navigation groups sale listings, rental listings, projects, news, wiki, market analysis, broker directory, and company directory.
- Listing index pages expose category, location, price, area, verified listing, map entry, and sort controls.
- Public sitemap includes sale categories, rent categories, popular sale/rent locations, projects, companies, brokers, and support pages.
- Robots file declares sitemap indexes for the main domain, wiki, news, and analysis sections.
- News and wiki live as a content ecosystem with topic/category navigation and search.

Reference URLs:

- `https://batdongsan.com.vn/trang-sitemap`
- `https://batdongsan.com.vn/nha-dat-ban`
- `https://batdongsan.com.vn/nha-dat-cho-thue`
- `https://batdongsan.com.vn/du-an-bat-dong-san`
- `https://wiki.batdongsan.com.vn/tin-tuc`
- `https://wiki.batdongsan.com.vn/wiki`
- `https://batdongsan.com.vn/robots.txt`

## SEO Goals

- Make category and location pages crawlable.
- Prevent duplicate content from uncontrolled filters.
- Keep listing detail URLs stable.
- Generate sitemap indexes at scale.
- Provide structured data for listings, articles, breadcrumbs, organization, and projects.
- Support administrative location changes through redirects and aliases.

## URL Strategy

## Primary Public URLs

```text
/
/nha-dat-ban
/nha-dat-cho-thue
/du-an
/tin-tuc
/wiki
/nha-moi-gioi
/doanh-nghiep
```

## Category URLs

Sale:

```text
/ban-can-ho-chung-cu
/ban-nha-rieng
/ban-nha-biet-thu-lien-ke
/ban-nha-mat-pho
/ban-shophouse
/ban-dat-nen-du-an
/ban-dat
/ban-kho-nha-xuong
```

Rent:

```text
/cho-thue-can-ho-chung-cu
/cho-thue-nha-rieng
/cho-thue-nha-biet-thu-lien-ke
/cho-thue-nha-mat-pho
/cho-thue-phong-tro
/cho-thue-van-phong
/cho-thue-cua-hang-ki-ot
/cho-thue-kho-nha-xuong
```

## Location URLs

```text
/nha-dat-ban-ha-noi
/nha-dat-ban-tp-hcm
/nha-dat-cho-thue-ha-noi
/nha-dat-cho-thue-tp-hcm
```

## Category + Location URLs

```text
/ban-can-ho-chung-cu-ha-noi
/ban-can-ho-chung-cu-quan-cau-giay
/ban-nha-rieng-quan-1
/cho-thue-van-phong-quan-3
/cho-thue-phong-tro-thu-duc
```

Canonical location depth for MVP:

- Province pages: indexable.
- District pages: indexable when inventory is sufficient.
- Ward and street pages: noindex by default until content quality threshold is met.

## Listing Detail URLs

```text
/tin-dang/[slug]-[public_id]
```

Rules:

- Include immutable public ID.
- Slug can change, ID resolves canonical record.
- If slug changes, redirect old slug to canonical URL.
- Deleted or expired listing should return a useful status page, not a soft 404.

## Project URLs

```text
/du-an
/du-an/[province]
/du-an/[project-type]
/du-an/[slug]-[id]
```

Project detail pages should be evergreen and can outlive individual listings.

## Content URLs

```text
/tin-tuc
/tin-tuc/[category]
/tin-tuc/[slug]
/wiki
/wiki/[category]
/wiki/[slug]
/bao-cao-thi-truong
/goc-nhin-chuyen-gia
```

Content should support canonical URLs, author pages, related content, and internal links to listing/category/location pages.

## Indexing Rules

Indexable by default:

- Home.
- Main sale/rent pages.
- Category pages.
- Province and strong district landing pages.
- Project index and project detail.
- Published article pages.
- Broker/company public profile pages when verified.

Noindex by default:

- Search pages with arbitrary keyword query.
- Thin filter combinations.
- Sort-only variations.
- Pagination beyond configured depth if quality is low.
- User account pages.
- Admin pages.
- Draft, rejected, hidden, and expired listing management URLs.

Conditional index:

- Ward/street pages only when they meet inventory and content thresholds.
- Filter pages only when they are explicitly configured as SEO landing pages.

## Canonical Strategy

Canonical URL rules:

- Sort parameters do not change canonical.
- Tracking parameters are removed.
- Empty filters redirect to base category/location URL.
- Equivalent locations from old administrative names redirect to the current canonical slug.
- Listing detail canonical includes current slug and public ID.

Allowed query parameters:

- `page`
- `gia`
- `dien-tich`
- `phong-ngu`
- `huong`

Indexable query parameters should be rare. Prefer prebuilt landing URLs for important combinations.

## Sitemap Architecture

Root:

```text
/sitemap.xml
```

Sitemap indexes:

```text
/sitemaps/listings-index.xml
/sitemaps/categories.xml
/sitemaps/locations.xml
/sitemaps/projects.xml
/sitemaps/articles-index.xml
/sitemaps/brokers.xml
/sitemaps/companies.xml
```

Listing sitemap shards:

```text
/sitemaps/listings-0001.xml
/sitemaps/listings-0002.xml
/sitemaps/listings-0003.xml
```

Rules:

- Max 50,000 URLs per sitemap file.
- Include only published and indexable URLs.
- Use `lastmod` from `updated_at` or `published_at`.
- Remove hidden, rejected, deleted, and noindex URLs.
- Generate sitemap from database, not hardcoded route lists.

## Structured Data

Use JSON-LD.

Sitewide:

- `Organization`
- `WebSite`
- `SearchAction`

Navigation:

- `BreadcrumbList`

Listing detail:

- Use `Product` or real-estate-oriented schema where supported.
- Include price, area, address, image, description, availability, and seller organization/person where appropriate.

Article:

- `Article`
- `NewsArticle` for news content when appropriate.
- `Person` or `Organization` author.

Project:

- `Place`
- `Organization`
- `Product` for sales-focused project pages when appropriate.

## Metadata Templates

## Main Sale Page

```text
Title: Mua bán nhà đất [location] giá tốt, mới nhất [month/year]
Description: Cập nhật tin mua bán nhà đất [location] với giá, diện tích, vị trí, pháp lý và thông tin liên hệ rõ ràng.
H1: Mua bán nhà đất [location]
```

## Main Rent Page

```text
Title: Cho thuê nhà đất [location] giá tốt, mới nhất [month/year]
Description: Tìm tin cho thuê nhà đất [location] theo loại hình, giá thuê, diện tích, vị trí và tiện ích phù hợp.
H1: Cho thuê nhà đất [location]
```

## Category + Location Page

```text
Title: [Transaction] [property type] [location] giá tốt, mới nhất [month/year]
Description: Danh sách [transaction] [property type] tại [location], cập nhật mới với bộ lọc giá, diện tích và vị trí.
H1: [Transaction] [property type] tại [location]
```

## Listing Detail

```text
Title: [Listing title] | [price] | [location]
Description: [Short description] Diện tích [area], giá [price], vị trí [location]. Liên hệ để biết thêm thông tin.
H1: [Listing title]
```

## Internal Linking

Every listing detail should link to:

- Category page.
- Province page.
- District page.
- Project page if available.
- Similar listings.

Every category/location landing page should include:

- Related districts.
- Related property types.
- Related price ranges.
- Latest listings.
- Useful content links.

Every article should link to:

- Relevant category pages.
- Relevant location pages.
- Relevant project pages.
- Related guides.

## Landing Page Quality Rules

An indexable landing page should have:

- Enough active listings.
- Unique H1 and metadata.
- Crawlable listing cards.
- Introductory content generated from taxonomy, not copied from another page.
- Internal links to nearby categories and locations.
- No broken filter state.

Suggested thresholds:

- Province page: at least 20 listings.
- District page: at least 10 listings.
- Category + district page: at least 5 listings.
- Ward/street page: manual approval or at least 10 listings plus unique content.

## Robots Rules

Recommended:

```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /tai-khoan/
Disallow: /api/
Disallow: /dang-nhap
Disallow: /dang-ky

Sitemap: https://example.com/sitemap.xml
```

Do not block public listing/category pages. Use canonical/noindex for duplicate filter combinations instead of blocking all filtered URLs in robots.

## Redirect Rules

Permanent redirects:

- Old listing slug -> current listing slug.
- Old location slug -> current administrative location slug.
- Removed category slug -> replacement category slug.
- HTTP -> HTTPS in production.
- Non-www -> canonical host or opposite, depending brand decision.

Temporary redirects:

- Unauthenticated account access -> login.

## SEO Risks

- Generating too many thin filter pages.
- Letting sort and tracking parameters become indexable.
- Publishing duplicate listings.
- Changing location slugs without redirects.
- Rendering listing cards only client-side.
- Blocking important pages in robots.
- Building content pages without internal links to marketplace pages.

## SEO Implementation Checklist

- Server-render public pages.
- Generate stable slugs.
- Add canonical tags.
- Add metadata templates.
- Add JSON-LD.
- Add breadcrumbs.
- Add sitemap generator.
- Add robots.txt.
- Add redirect manager.
- Add noindex controls.
- Add internal link blocks.
- Add search parameter canonicalization.
- Add analytics for organic landing pages.
