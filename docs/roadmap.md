# Platform Roadmap

Audit date: 2026-05-24

This roadmap assumes we are building a real-estate marketplace with feature parity against a large property portal. The parity target covers functionality, data domains, workflows, SEO architecture, search behavior, admin/CMS structure, and monetization flows. It does not require copying brand identity, visual UI skin, public wording, assets, or third-party content/data.

## Phase 1 - Foundation

### Functions

- Repository conventions and environments.
- Design system foundations.
- Authentication.
- Role and permission model.
- Admin shell.
- Database setup.
- Object storage setup.
- Core taxonomy: transaction types, property categories, locations.
- Media upload.
- Audit log.
- Basic deployment pipeline.

### Goals

- Create a stable technical base.
- Make future modules share the same identity, authorization, media, audit, and taxonomy foundation.
- Avoid reworking core data structures during MVP build.

### Team

- CTO / Tech Lead.
- Backend Engineer.
- Frontend Engineer.
- Product Manager.
- UI/UX Designer.
- DevOps support.

### Priority

Critical.

### Dependencies

- Product Blueprint.
- MVP Scope.
- Data Architecture.
- Initial location dataset.
- Cloud/storage decision.

### Exit Criteria

- App deploys to staging.
- Admin shell is accessible by role.
- User accounts and roles work.
- Location and category data can be managed.
- Media upload works.
- Audit logs record admin actions.

## Phase 2 - Core Platform

### Functions

- Listing CRUD.
- Listing draft and submit workflow.
- Moderation queue.
- Approve/reject/hide listing.
- Public sale page.
- Public rent page.
- Listing detail page.
- Search and filters.
- Sort options.
- Lead capture.
- Basic notification.
- CMS article publishing.

### Goals

- Ship MVP marketplace loop.
- Let sellers publish inventory under moderation.
- Let buyers search and create leads.
- Let editors publish content.

### Team

- Product Manager.
- Tech Lead.
- Backend Engineer.
- Frontend Engineer.
- QA.
- Content/Ops.

### Priority

Critical.

### Dependencies

- Phase 1.
- Listing policy.
- Moderation rules.
- Initial seed listings or seller onboarding plan.

### Exit Criteria

- User can create and submit listings.
- Moderator can approve/reject listings.
- Approved listings appear publicly.
- Visitor can search/filter listings.
- Visitor can submit a lead.
- Editor can publish articles.
- MVP SEO routes have metadata and canonical tags.

## Phase 3 - Data & SEO Scaling

### Functions

- SEO landing pages for category + location combinations.
- Sitemap indexes and sitemap shards.
- Structured data.
- Redirect manager.
- Canonical/noindex management for filters.
- Search index service.
- Listing duplicate detection.
- Data quality dashboard.
- Internal linking blocks.
- Saved searches and email alerts.
- Project directory and project detail.

### Goals

- Grow organic traffic.
- Keep crawl budget focused on useful pages.
- Improve search speed and relevance.
- Increase listing quality.

### Team

- SEO Lead.
- Backend Engineer.
- Frontend Engineer.
- Data Engineer.
- Content Editor.
- Product Manager.

### Priority

High after MVP.

### Dependencies

- Sufficient listing inventory.
- Stable taxonomy.
- Search logs.
- Content operating cadence.

### Exit Criteria

- Root sitemap references all sitemap indexes.
- Published listing pages are in sitemap.
- Category/location pages are server-rendered.
- Thin filter pages are noindexed or canonicalized.
- Search service updates asynchronously on listing publish/hide.
- SEO dashboard tracks indexed pages, organic sessions, and lead conversion.

## Phase 4 - Enterprise Features

### Functions

- Listing packages.
- Featured listings.
- Listing boost/refresh.
- Orders and payments.
- Wallet/top-up.
- Agency workspace.
- Agency member roles.
- Lead inbox and lead assignment.
- Developer/project owner accounts.
- Verified broker and verified listing workflow.
- Sales/Ops customer management.
- Invoice and package usage reports.

### Goals

- Turn marketplace usage into revenue.
- Serve agents, agencies, and developers.
- Improve trust through verification.
- Give sales and operations teams controlled workflows.

### Team

- Product Manager.
- Tech Lead.
- Backend Engineer.
- Frontend Engineer.
- QA.
- Sales/Ops.
- Finance.
- Legal/Compliance.

### Priority

High after traffic and supply validation.

### Dependencies

- Payment provider.
- Pricing model.
- Package rules.
- Verification policy.
- Customer support process.

### Exit Criteria

- Agents can buy and use listing packages.
- Featured listings affect ranking according to policy.
- Agency admins can manage members and inventory.
- Leads can be assigned and tracked.
- Finance can reconcile orders and payments.
- Verification status is visible and auditable.

## Phase 5 - AI / Automation / Analytics

### Functions

- AI listing assistant.
- AI title and description suggestions.
- Image quality checks.
- Spam and duplicate detection.
- Price anomaly detection.
- Search recommendations.
- Similar listings.
- Saved search matching.
- Lead scoring.
- Market analytics dashboard.
- Data warehouse.
- Event tracking pipeline.

### Goals

- Reduce moderation cost.
- Improve listing quality.
- Increase conversion from search to lead.
- Build proprietary market intelligence.
- Give management visibility into supply, demand, revenue, and conversion.

### Team

- Data Engineer.
- ML/AI Engineer.
- Backend Engineer.
- Product Analyst.
- Product Manager.
- Ops.

### Priority

Medium until enough data exists, then high.

### Dependencies

- Clean listing data.
- Lead event history.
- Search query history.
- Moderation labels.
- Analytics warehouse.

### Exit Criteria

- AI suggestions are optional and auditable.
- Duplicate/spam score is visible to moderators.
- Price anomaly flags improve review quality.
- Analytics dashboard shows traffic, search, lead, and revenue funnels.
- Recommendation modules improve click-through rate or lead rate.

## Recommended Timeline

Indicative timeline for a small focused team:

```text
Phase 1: 3-5 weeks
Phase 2: 6-10 weeks
Phase 3: 4-8 weeks
Phase 4: 8-12 weeks
Phase 5: ongoing after data volume is meaningful
```

## Module Dependency Map

```text
Identity -> Roles -> Admin
Locations -> Categories -> Listings
Listings -> Moderation -> Public Search -> Leads
Listings -> Search Index -> SEO Landing Pages -> Sitemap
CMS -> Content SEO -> Internal Linking
Listings -> Packages -> Payments -> Promotions
Users -> Agencies -> Agency Workspace -> Lead Assignment
Listings + Search Logs + Leads -> Analytics -> AI
```

## Build Order

1. Identity and roles.
2. Admin shell.
3. Locations and categories.
4. Listing CRUD.
5. Media.
6. Moderation.
7. Public listing pages.
8. Search and filters.
9. Lead capture.
10. CMS.
11. SEO routes and sitemap.
12. Projects.
13. Packages and payments.
14. Agency workspace.
15. Analytics and automation.

## Production Readiness Checklist

Security:

- Password hashing.
- Role-based authorization.
- Admin audit logs.
- Rate limits.
- Upload validation.
- CSRF/session protection where applicable.

Operations:

- Error tracking.
- Uptime monitoring.
- Backups.
- Database migration process.
- Staging environment.
- Seed data scripts.

SEO:

- Server-rendered public pages.
- Canonical tags.
- Metadata.
- Structured data.
- Sitemap.
- Robots.
- Redirects.

Performance:

- Indexed search queries.
- CDN for static assets.
- Image optimization.
- Pagination.
- Cache hot landing pages.

Data:

- Duplicate detection.
- Listing quality checks.
- Location alias handling.
- Audit logs.
- Analytics events.
