# MVP Scope

Audit date: 2026-05-24

The MVP is the first production-grade slice toward Batdongsan-level functional parity. It does not include every enterprise feature on day one, but it must prove the core marketplace loop:

```text
seller posts listing -> admin moderates -> buyer searches -> buyer views detail -> buyer sends lead
```

## MVP Objectives

- Launch a functional public real-estate marketplace.
- Validate listing supply, search demand, and lead conversion.
- Build the data model correctly enough to support SEO and future monetization.
- Give internal operations a usable moderation and CMS workflow.

## MVP User Flows

## 1. Browse and Search Listings

Flow:

```text
home -> choose sale/rent -> search result -> filter/sort -> listing detail -> contact
```

Required features:

- Sale and rent tabs.
- Keyword search.
- Location selector.
- Property type filter.
- Price filter.
- Area filter.
- Verified listing toggle.
- Sort selector.
- Pagination.

MVP sort options:

- Default.
- Newest.
- Verified first.
- Price low to high.
- Price high to low.
- Price per square meter low to high.
- Price per square meter high to low.
- Area low to high.
- Area high to low.

## 2. Listing Detail

Required sections:

- Media gallery.
- Title.
- Price.
- Area.
- Price per square meter.
- Address summary.
- Main attributes.
- Description.
- Legal and interior information.
- Map preview.
- Seller/agent box.
- Phone reveal.
- Contact form.
- Similar listings.
- Breadcrumb.

Tracking events:

- `listing_viewed`
- `listing_phone_revealed`
- `listing_contact_submitted`
- `listing_saved`

## 3. Post Listing

Flow:

```text
login -> create draft -> add property data -> upload media -> preview -> submit for review
```

Required fields:

- Transaction type.
- Property type.
- Province, district, ward, street.
- Address text.
- Price.
- Area.
- Title.
- Description.
- Contact name.
- Contact phone.
- Media gallery.

Validation:

- Price and area must be positive.
- Contact phone must be verified or confirmed.
- Listing must have at least one image.
- Location must resolve to a supported province.
- Title and description must meet length limits.

## 4. Moderation

Flow:

```text
submitted listing -> moderator reviews -> approve or reject -> notify owner
```

Required moderation actions:

- Approve.
- Reject with reason.
- Request edit.
- Hide published listing.
- Mark duplicate.
- Mark suspicious.

Moderation reasons:

- Missing required information.
- Invalid price.
- Invalid location.
- Duplicate listing.
- Spam or misleading content.
- Prohibited content.
- Bad media quality.

## 5. CMS Publishing

Required content types:

- Article.
- Category.
- Tag.
- Author.

MVP article fields:

- Title.
- Slug.
- Excerpt.
- Body.
- Cover image.
- Category.
- Tags.
- Author.
- Status: draft, scheduled, published, archived.
- SEO title.
- SEO description.
- Canonical URL.
- Noindex flag.

## 6. Admin Foundation

Admin areas:

- Dashboard.
- Listings.
- Users.
- Locations.
- Categories.
- Articles.
- Leads.
- Audit logs.

Admin requirements:

- Role-based access.
- Search and filter records.
- View record detail.
- Edit controlled fields.
- Record audit logs.

## MVP Routes

Public routes:

```text
/
/nha-dat-ban
/nha-dat-cho-thue
/ban-[property-type]-[location]
/cho-thue-[property-type]-[location]
/tin-dang/[slug]-[id]
/du-an
/du-an/[slug]-[id]
/tin-tuc
/tin-tuc/[slug]
/wiki
/wiki/[slug]
```

Account routes:

```text
/dang-nhap
/dang-ky
/tai-khoan
/tai-khoan/tin-dang
/tai-khoan/tin-dang/tao-moi
/tai-khoan/khach-hang
/tai-khoan/cai-dat
```

Admin routes:

```text
/admin
/admin/listings
/admin/listings/[id]
/admin/users
/admin/locations
/admin/categories
/admin/articles
/admin/leads
/admin/audit-logs
```

## MVP Data Entities

Must have:

- `users`
- `roles`
- `user_roles`
- `profiles`
- `locations`
- `categories`
- `listings`
- `listing_attributes`
- `listing_media`
- `leads`
- `articles`
- `article_categories`
- `article_tags`
- `audit_logs`

Can wait:

- `orders`
- `payments`
- `wallet_transactions`
- `agency_members`
- `project_blocks`
- `project_units`
- `recommendations`

## MVP Release Criteria

Functional:

- User can create a listing and submit it.
- Moderator can approve/reject a listing.
- Approved listing appears on public listing pages.
- User can search/filter listings.
- Visitor can send a lead.
- Editor can publish an article.
- Sitemap and metadata are generated.

Operational:

- Admin can inspect core records.
- Every moderation action is audited.
- Images are stored outside the database.
- Search pages are crawlable.
- Invalid filter combinations are canonicalized or noindexed.

Performance:

- Listing index loads under 2 seconds for normal traffic.
- Detail page supports CDN caching for static assets.
- Search query uses indexed columns.
- Sitemap generation runs as a background job or build step.

## Non-Goals For MVP

- Full payment system.
- Wallet and membership plans.
- Advanced agency hierarchy.
- Native mobile app.
- AI-generated listing content.
- Automated valuation.
- Real-time chat.
- Complex geographic polygon search.
- Public partner API.

## Suggested MVP Team

- 1 Product Manager.
- 1 Tech Lead.
- 1 Backend Engineer.
- 1 Frontend Engineer.
- 1 UI/UX Designer.
- 1 QA Engineer part-time.
- 1 Content/Ops person.
- 1 DevOps support part-time.

## Suggested Build Order

1. Repository, environment, deployment, database, storage.
2. Auth, roles, admin shell.
3. Taxonomy: locations and categories.
4. Listing CRUD.
5. Media upload.
6. Moderation workflow.
7. Public listing index.
8. Listing detail.
9. Search filters.
10. Lead capture and notification.
11. CMS.
12. SEO routes, metadata, sitemap, schema.
13. QA, seed data, launch checklist.
