# Product Blueprint

Audit date: 2026-05-24

This document defines the product shape for a real-estate marketplace targeting functional parity with the public structure of Batdongsan.com.vn. In this project, "clone" means matching module coverage, data domains, user flows, admin workflows, search/filter behavior, SEO surface, and monetization flows. Brand identity, UI visual skin, public copywriting, assets, listing data, project data, broker data, and company data must be original to our platform.

## Public Reference Signals

Public pages reviewed:

- `https://batdongsan.com.vn/`
- `https://batdongsan.com.vn/trang-sitemap`
- `https://batdongsan.com.vn/nha-dat-ban`
- `https://batdongsan.com.vn/nha-dat-cho-thue`
- `https://batdongsan.com.vn/du-an-bat-dong-san`
- `https://wiki.batdongsan.com.vn/tin-tuc`
- `https://wiki.batdongsan.com.vn/wiki`
- `https://batdongsan.com.vn/robots.txt`

Observed product areas:

- Marketplace for sale listings and rental listings.
- Project directory for real-estate developments.
- Content ecosystem: news, wiki, market analysis, reports, expert views.
- Directory ecosystem: brokers and companies.
- Seller/agent workspace: post listing, manage listings, manage customers, membership packages, wallet/top-up, account settings.
- Search-heavy public experience with category, location, price, area, verified listing, map, and sort controls.
- SEO-heavy taxonomy with category pages, location pages, project pages, article pages, and sitemap indexes.

## Functional Parity Map

| Public surface | Our equivalent module | Parity target |
| --- | --- | --- |
| Home page | Discovery home | Search entry, featured listings, featured projects, content blocks, location discovery |
| Nhà đất bán | Sale marketplace | Sale taxonomy, sale filters, sale listing cards, sale SEO landing pages |
| Nhà đất cho thuê | Rental marketplace | Rent taxonomy, rent filters, rent listing cards, rent SEO landing pages |
| Listing detail | Listing detail | Gallery, price, area, location, attributes, seller contact, phone reveal, lead form, related listings |
| Dự án | Project directory | Project index, project filters, project detail, developer relation, project leads |
| Tin tức | News CMS | News categories, article pages, authoring, SEO metadata, internal links |
| Wiki BĐS | Knowledge hub | Guide categories, evergreen articles, topic landing pages |
| Phân tích đánh giá | Market insights | reports, expert views, chart pages, video reviews in later phases |
| Danh bạ nhà môi giới | Broker directory | Public broker profiles, verification, profile leads |
| Danh bạ doanh nghiệp | Company directory | Agency/developer/company profiles |
| Đăng tin | Listing post flow | Draft, validation, media upload, preview, submit for moderation |
| Quản lý tin đăng | Seller dashboard | Listing inventory, status, edit, renew, promote |
| Quản lý khách hàng | Lead CRM | Lead inbox, lead status, notes, assignment in enterprise phase |
| Môi giới chuyên nghiệp | Verified agent program | Verification, badges, profile quality, package benefits |
| Gói hội viên | Subscription/packages | Listing quotas, promotions, membership pricing |
| Nạp tiền | Wallet/payment | Wallet balance, transactions, orders, invoices |
| Sitemap/robots | SEO infrastructure | Sitemap indexes, shards, robots, canonical, noindex strategy |

## Product Goal

Build a real-estate platform that can:

- Aggregate, publish, moderate, and rank property listings.
- Support buyers, renters, owners, agents, agencies, developers, moderators, editors, and operators.
- Generate scalable SEO landing pages from structured taxonomy.
- Convert search traffic into leads.
- Monetize via listing packages, promotion, agency subscriptions, project pages, and data products.

## Core User Segments

### Guest

- Search and browse listings.
- View listing detail pages.
- View project pages.
- Read news, wiki, and market content.
- Save listings after login prompt.
- Contact seller or agent.

### Registered Seeker

- Save listings.
- Save searches.
- Subscribe to new listing alerts.
- Submit contact requests.
- Manage profile and notification preferences.

### Owner

- Create property listings.
- Upload media.
- Submit listings for review.
- Manage listing status, renewal, and visibility.
- Receive leads.

### Agent

- Manage a larger listing inventory.
- Receive and manage leads.
- Buy promotion packages.
- Build verified profile.
- Join agency workspace if invited.

### Agency Admin

- Manage agency profile.
- Invite and manage agents.
- Assign listing quota and leads.
- Track package usage and performance.

### Developer / Project Owner

- Manage developer profile.
- Publish project information.
- Submit project media, location, phases, blocks, units, and pricing ranges.
- Receive project leads.

### Moderator

- Review pending listings.
- Approve, reject, hide, or expire listings.
- Handle reports.
- Mark duplicates or suspicious posts.
- Escalate policy cases.

### Content Editor

- Manage articles, categories, tags, authors, and SEO metadata.
- Publish market reports, wiki guides, and project reviews.
- Manage internal links and redirects.

### Sales / Operations

- Manage packages, orders, invoices, wallet balance, and customer support notes.
- Review agency and developer accounts.
- Monitor lead quality and seller behavior.

### Super Admin

- Manage roles, permissions, system configuration, audit logs, taxonomy, and global settings.

## Primary Product Modules

## 1. Public Marketplace

Pages:

- Home page.
- Sale listing index.
- Rental listing index.
- Category landing pages.
- Location landing pages.
- Category + location landing pages.
- Search results.
- Listing detail.
- Project directory.
- Project detail.
- Broker directory.
- Company directory.

Key capabilities:

- Search by keyword and structured location.
- Filter by transaction type, property type, price, area, verified status, project, bedroom count, legal status, direction, and media availability.
- Sort by default ranking, verified first, newest, price, price per square meter, and area.
- Show listing cards with title, price, area, price per square meter, location, media, seller, phone reveal, and posted date.
- Support list and map entry points.

## 2. Listing Management

Listing lifecycle:

```text
draft -> submitted -> pending_review -> approved -> published -> expired
                         |                 |
                         v                 v
                      rejected           hidden
```

Required listing fields:

- Transaction type: sale or rent.
- Property type.
- Title.
- Description.
- Price and price unit.
- Area.
- Address components.
- Coordinates.
- Project reference when applicable.
- Legal status.
- Interior status.
- Number of bedrooms, bathrooms, floors.
- Direction, balcony direction.
- Media gallery.
- Contact person and phone.
- Source metadata and verification flags.

## 3. Search & Discovery

Core search modes:

- Free-text keyword search.
- Structured category + location search.
- Faceted filters.
- Saved search.
- New listing alert.
- Map search later.

MVP search should use database-backed filters plus optional full-text search. Scale search should move to OpenSearch, Elasticsearch, or Meilisearch.

## 4. CMS & Knowledge Hub

Content areas:

- News.
- Wiki / guides.
- Market analysis.
- Reports.
- Expert views.
- Video reviews.
- Interactive stories later.

CMS features:

- Article CRUD.
- Category and tag management.
- Author profiles.
- SEO title, description, canonical URL, and noindex flag.
- Related articles.
- Internal link suggestions.
- Publish scheduling.
- Redirect manager.

## 5. Projects

Project pages should be separate from normal listings.

Project entity:

- Name.
- Slug.
- Developer.
- Address and coordinates.
- Province, district, ward.
- Project type.
- Status: planning, upcoming, selling, handed over, paused.
- Scale, land area, blocks, units.
- Price range.
- Legal information.
- Facilities.
- Media.
- Related listings.
- Project leads.

## 6. Lead Management

Lead sources:

- Phone reveal.
- Contact form.
- Save listing.
- Saved search subscription.
- Project inquiry.
- Broker profile inquiry.

Lead lifecycle:

```text
new -> contacted -> qualified -> won
                 -> lost
                 -> spam
```

MVP should store leads and notify listing owner. Enterprise phase should add CRM-like lead assignment, notes, reminders, and lead source analytics.

## 7. Monetization

Initial revenue surfaces:

- Paid listing packages.
- Featured listings.
- Listing boost / refresh.
- Agency subscriptions.
- Developer/project promotion pages.

Later revenue surfaces:

- Verified broker badge.
- Market data reports.
- API/data subscription.
- Ad placements.

## 8. Admin & Operations

Admin domains:

- Listings.
- Users.
- Agencies.
- Developers.
- Projects.
- Leads.
- Locations.
- Categories.
- CMS.
- Packages.
- Orders and payments.
- Reports.
- Settings.
- Audit logs.

Every sensitive admin action must create an audit log.

## Role Matrix

| Capability | Guest | Seeker | Owner | Agent | Agency Admin | Moderator | Editor | Ops | Super Admin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Browse public pages | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| Save listing | no | yes | yes | yes | yes | yes | yes | yes | yes |
| Create listing | no | no | yes | yes | yes | no | no | no | yes |
| Manage own listings | no | no | yes | yes | yes | no | no | no | yes |
| Manage agency listings | no | no | no | limited | yes | no | no | no | yes |
| Moderate listings | no | no | no | no | no | yes | no | no | yes |
| Manage CMS | no | no | no | no | no | no | yes | no | yes |
| Manage packages | no | no | no | no | no | no | no | yes | yes |
| Manage roles | no | no | no | no | no | no | no | no | yes |

## MVP Boundaries

MVP includes:

- Auth and roles.
- Listing creation and moderation.
- Public listing index and detail pages.
- Basic search and filters.
- Location and category taxonomy.
- CMS article publishing.
- SEO routes, metadata, schema, and sitemap.

MVP excludes:

- Payment gateway.
- Wallet.
- Advanced CRM.
- AI moderation.
- Native mobile app.
- Public data API.
- Complex map search.

## Open Product Decisions

- Which market niche comes first: broad national marketplace or one city/segment.
- Whether listing supply is user-generated only or seeded from internal data.
- Verification standard for "owner", "agent", and "verified listing".
- Monetization launch timing.
- Required compliance around phone numbers, personal data, and listing ownership.
