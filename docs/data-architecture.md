# Data Architecture

Audit date: 2026-05-24

This document defines the data foundation for the real-estate platform. The design favors a modular monolith first, with clear domain boundaries so high-load domains can be separated later.

## Architecture Principles

- Keep transactional truth in PostgreSQL.
- Keep media in object storage, never in the relational database.
- Keep search indexes derived from canonical listing data.
- Store audit trails for moderation, payment, and admin changes.
- Normalize stable taxonomies such as locations and categories.
- Use append-only events for business actions that trigger workflows.
- Match the functional data domains of a mature real-estate portal while using our own source data.
- Do not import third-party listing, project, broker, company, article, image, or proprietary datasets without explicit rights.

## Core Domains

```text
Identity
Marketplace Listings
Locations
Projects
Search
Leads
CMS
Moderation
Payments
Notifications
Analytics
```

## Storage Layers

## 1. OLTP Database

Recommended: PostgreSQL.

Stores:

- Users and roles.
- Listings.
- Locations.
- Projects.
- Leads.
- CMS.
- Orders and packages.
- Audit logs.
- Workflow state.

## 2. Search Index

MVP:

- PostgreSQL indexed filters and full-text search.

Scale:

- OpenSearch, Elasticsearch, or Meilisearch.

Search index documents should be denormalized:

```json
{
  "listing_id": "uuid",
  "transaction_type": "sale",
  "property_type": "apartment",
  "title": "...",
  "description": "...",
  "price": 5000000000,
  "area": 72,
  "price_per_sqm": 69444444,
  "province_slug": "ha-noi",
  "district_slug": "cau-giay",
  "ward_slug": "dich-vong",
  "project_slug": "example-project",
  "is_verified": true,
  "published_at": "2026-05-24T00:00:00Z"
}
```

## 3. Object Storage

Recommended: S3-compatible storage.

Stores:

- Listing photos.
- Project photos.
- Article covers.
- Floor plans.
- Broker avatars.
- Company logos.

Media records in database should store URL, storage key, content type, size, width, height, checksum, sort order, and moderation status.

## 4. Cache

Recommended: Redis.

Uses:

- Session cache if needed.
- Rate limiting.
- Hot listing pages.
- Popular location/category aggregations.
- Search facet cache.
- Notification throttling.

## 5. Analytics Warehouse

Later phase:

- BigQuery, ClickHouse, Snowflake, or Postgres analytical replica.

Stores:

- Page views.
- Search queries.
- Listing impressions.
- Phone reveals.
- Contact leads.
- Package usage.
- Revenue events.

## Entity Overview

## Identity

### `users`

Primary account table.

Fields:

- `id`
- `email`
- `phone`
- `password_hash`
- `status`
- `email_verified_at`
- `phone_verified_at`
- `last_login_at`
- `created_at`
- `updated_at`

### `roles`

Fields:

- `id`
- `code`
- `name`
- `description`

Role codes:

- `guest`
- `seeker`
- `owner`
- `agent`
- `agency_admin`
- `developer`
- `moderator`
- `editor`
- `ops`
- `super_admin`

### `user_roles`

Fields:

- `user_id`
- `role_id`
- `scope_type`
- `scope_id`

`scope_type` allows permissions inside an agency, project, or global admin area.

### `profiles`

Fields:

- `user_id`
- `display_name`
- `avatar_media_id`
- `bio`
- `license_number`
- `company_name`
- `verification_status`
- `public_slug`

## Organization

### `agencies`

Fields:

- `id`
- `name`
- `slug`
- `logo_media_id`
- `phone`
- `email`
- `address`
- `verification_status`
- `status`

### `agency_members`

Fields:

- `agency_id`
- `user_id`
- `role`
- `status`
- `joined_at`

## Taxonomy

### `locations`

Hierarchical location table.

Fields:

- `id`
- `parent_id`
- `type`: country, province, district, ward, street.
- `name`
- `slug`
- `full_name`
- `old_name`
- `new_name`
- `code`
- `latitude`
- `longitude`
- `is_active`

The platform should support administrative boundary changes by keeping historical aliases and redirects.

### `categories`

Fields:

- `id`
- `parent_id`
- `transaction_type`: sale, rent, both.
- `code`
- `name`
- `slug`
- `is_active`
- `sort_order`

Initial sale categories:

- Apartment.
- Mini apartment / serviced apartment.
- House.
- Villa / townhouse.
- Street-front house.
- Shophouse.
- Project land.
- Land.
- Farm / resort.
- Condotel.
- Warehouse / factory.
- Other.

Initial rent categories:

- Apartment.
- Mini apartment / serviced apartment.
- House.
- Villa / townhouse.
- Street-front house.
- Room.
- Shophouse.
- Office.
- Shop / kiosk.
- Warehouse / land.
- Other.

## Listings

### `listings`

Canonical listing table.

Fields:

- `id`
- `public_id`
- `owner_user_id`
- `agency_id`
- `project_id`
- `transaction_type`
- `category_id`
- `title`
- `slug`
- `description`
- `status`
- `moderation_status`
- `price`
- `price_unit`
- `area`
- `price_per_sqm`
- `province_id`
- `district_id`
- `ward_id`
- `street_id`
- `address_text`
- `latitude`
- `longitude`
- `contact_name`
- `contact_phone`
- `is_verified`
- `is_featured`
- `published_at`
- `expired_at`
- `created_at`
- `updated_at`

Suggested statuses:

- `draft`
- `submitted`
- `pending_review`
- `published`
- `rejected`
- `hidden`
- `expired`
- `deleted`

### `listing_attributes`

Flexible one-to-one extension for property-specific fields.

Fields:

- `listing_id`
- `bedrooms`
- `bathrooms`
- `floors`
- `frontage_width`
- `road_width`
- `direction`
- `balcony_direction`
- `legal_status`
- `interior_status`
- `handover_status`
- `usable_area`
- `land_area`

### `listing_media`

Fields:

- `id`
- `listing_id`
- `media_id`
- `type`: image, video, floor_plan.
- `sort_order`
- `caption`
- `moderation_status`

### `listing_moderation_events`

Fields:

- `id`
- `listing_id`
- `actor_user_id`
- `action`
- `reason_code`
- `note`
- `before_status`
- `after_status`
- `created_at`

## Media

### `media`

Fields:

- `id`
- `owner_user_id`
- `storage_key`
- `public_url`
- `mime_type`
- `size_bytes`
- `width`
- `height`
- `checksum`
- `status`
- `created_at`

## Projects

### `developers`

Fields:

- `id`
- `name`
- `slug`
- `description`
- `logo_media_id`
- `website`
- `phone`
- `email`
- `verification_status`

### `projects`

Fields:

- `id`
- `developer_id`
- `name`
- `slug`
- `description`
- `status`
- `category_id`
- `province_id`
- `district_id`
- `ward_id`
- `street_id`
- `address_text`
- `latitude`
- `longitude`
- `land_area`
- `total_units`
- `price_min`
- `price_max`
- `price_unit`
- `legal_status`
- `published_at`

### `project_media`

Fields:

- `project_id`
- `media_id`
- `type`
- `sort_order`

Later:

- `project_blocks`
- `project_units`
- `project_facilities`
- `project_timeline_events`

## Leads

### `leads`

Fields:

- `id`
- `source_type`: listing, project, profile, saved_search.
- `source_id`
- `recipient_user_id`
- `sender_user_id`
- `name`
- `phone`
- `email`
- `message`
- `status`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `created_at`

### `lead_events`

Fields:

- `id`
- `lead_id`
- `actor_user_id`
- `event_type`
- `note`
- `created_at`

## Saved Discovery

### `favorites`

Fields:

- `user_id`
- `listing_id`
- `created_at`

### `saved_searches`

Fields:

- `id`
- `user_id`
- `name`
- `query_json`
- `frequency`
- `last_sent_at`
- `is_active`

## CMS

### `articles`

Fields:

- `id`
- `author_user_id`
- `title`
- `slug`
- `excerpt`
- `body`
- `cover_media_id`
- `status`
- `seo_title`
- `seo_description`
- `canonical_url`
- `noindex`
- `published_at`
- `created_at`
- `updated_at`

### `article_categories`

Fields:

- `id`
- `parent_id`
- `name`
- `slug`
- `description`
- `seo_title`
- `seo_description`

Initial content categories:

- News.
- Wiki.
- Buy.
- Sell.
- Rent.
- Finance.
- Legal / planning.
- Interior / exterior.
- Market report.
- Expert view.
- Video review.

### `article_tags`

Fields:

- `id`
- `name`
- `slug`

### `article_tag_links`

Fields:

- `article_id`
- `tag_id`

## Payments

Later phase.

Tables:

- `packages`
- `package_features`
- `orders`
- `order_items`
- `payments`
- `wallet_transactions`
- `listing_promotions`

## Notifications

### `notifications`

Fields:

- `id`
- `user_id`
- `channel`: in_app, email, sms, zalo, push.
- `template_code`
- `payload_json`
- `status`
- `scheduled_at`
- `sent_at`
- `created_at`

Trigger events:

- Listing submitted.
- Listing approved.
- Listing rejected.
- Listing expiring.
- Lead received.
- Saved search match.
- Payment completed.

## Audit

### `audit_logs`

Fields:

- `id`
- `actor_user_id`
- `entity_type`
- `entity_id`
- `action`
- `before_json`
- `after_json`
- `ip_address`
- `user_agent`
- `created_at`

## Business Events

Use an append-only event table for reliable workflows.

### `domain_events`

Fields:

- `id`
- `event_type`
- `entity_type`
- `entity_id`
- `payload_json`
- `status`
- `created_at`
- `processed_at`

Important events:

- `listing.created`
- `listing.submitted`
- `listing.approved`
- `listing.rejected`
- `listing.published`
- `listing.expired`
- `lead.created`
- `article.published`
- `payment.completed`
- `saved_search.matched`

## Indexing Strategy

PostgreSQL indexes:

- `listings(status, transaction_type, category_id)`
- `listings(province_id, district_id, ward_id)`
- `listings(price)`
- `listings(area)`
- `listings(price_per_sqm)`
- `listings(published_at)`
- `listings(is_verified)`
- `locations(parent_id, type)`
- `locations(slug)`
- `categories(slug)`
- `articles(slug, status, published_at)`

Search index refresh:

```text
listing approved/published -> enqueue indexing job -> update search document
listing hidden/expired -> enqueue indexing job -> remove or mark inactive
```

## Data Quality Rules

Listing validation:

- Price and area must be valid for the category.
- `price_per_sqm` is calculated, not manually entered.
- Location hierarchy must be valid.
- A listing cannot be published without approved media.
- Duplicate detection should compare title, phone, location, price, area, and media checksum.

Location validation:

- Slugs must be unique within location type.
- Old administrative names must redirect to new canonical pages.

Content validation:

- Article slug must be unique.
- Published articles need title, excerpt, body, category, and SEO metadata.

## Scalability Path

Start:

```text
Next.js app + PostgreSQL + object storage + Redis
```

Scale:

```text
Modular monolith
  -> Search service
  -> Notification workers
  -> Payment workers
  -> Analytics pipeline
  -> Read replicas
  -> Domain services when bottlenecks are proven
```

Avoid premature microservices. The first real split is usually search indexing or notification delivery, not listing CRUD.
