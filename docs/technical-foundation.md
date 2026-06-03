# Technical Foundation

Date: 2026-05-24

This document records the initial implementation stack and foundation decisions for Phase 1.

## Stack

- Framework: Next.js 16 App Router.
- Database: MySQL.
- ORM: Prisma 7 with `@prisma/adapter-mariadb`.
- Auth: custom session-based auth with role checks.
- Session storage: database-backed sessions with HTTP-only cookie.
- Search MVP: MySQL indexed queries first.
- Search scale target: OpenSearch, Elasticsearch, or Meilisearch.
- Storage target: S3-compatible object storage.

## Prisma

Prisma 7 uses `prisma.config.ts` for the datasource URL. The schema datasource declares the provider only.
The generated Prisma Client is written to `src/generated/prisma` and ignored by git. `postinstall` runs `prisma generate` so a fresh install recreates it.

Key files:

- `prisma.config.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `.env`
- `src/lib/db.ts`

Commands:

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
npm run mysql:local:start
npm run mysql:local:stop
npm run mysql:local:status
```

Local `.env`:

```env
DATABASE_URL="mysql://anshome:anshome_password@127.0.0.1:3307/anshome"
SESSION_COOKIE_NAME="anshome_session"
SESSION_TTL_DAYS="30"
SEED_SUPER_ADMIN_EMAIL="admin@anshome.local"
SEED_SUPER_ADMIN_PASSWORD="password123"
SEED_SUPER_ADMIN_NAME="Anshome Admin"
```

The local repo MySQL helper runs an isolated MySQL instance on port `3307` with data in `.mysql/`, because developer machines may already have another MySQL server on `3306`.

## Auth Foundation

Auth is custom and role-based.

Key files:

- `src/lib/auth/password.ts`
- `src/lib/auth/session.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`

Session behavior:

- Session token is generated with `crypto.randomBytes`.
- Only a SHA-256 token hash is stored in the database.
- Raw token is stored in an HTTP-only cookie.
- Cookie is `secure` in production and `sameSite=lax`.
- `cookies()` is async in Next 16.
- Cookie set/delete only happens from Route Handlers or Server Functions.

Initial role codes:

- `seeker`
- `owner`
- `agent`
- `agency_admin`
- `developer`
- `moderator`
- `editor`
- `ops`
- `super_admin`

## Domain Coverage

The initial schema covers:

- Identity and roles.
- Sessions.
- Profiles.
- Agencies and agency members.
- Locations.
- Categories.
- Listings.
- Listing attributes.
- Listing media.
- Listing moderation events.
- Media.
- Developers and projects.
- Leads and lead events.
- Favorites and saved searches.
- CMS article categories, tags, and articles.
- Notifications.
- Audit logs.
- Domain events.

## Next Implementation Order

1. Create local MySQL database and `.env`.
2. Run Prisma generate and push.
3. Run seed.
4. Add auth route handlers: register, login, logout, current user.
5. Add admin route guard.
6. Add location/category admin CRUD.
7. Add listing draft CRUD.
