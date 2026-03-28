# RentSpace — Deep Server Analysis & Tech Stack Recommendation

## Part 1: Your Current Backend — What We Have

### Core Stack

| Layer | Technology | Version | Details |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 20 (Alpine) | ESM modules (`"type": "module"`) |
| **Language** | TypeScript | 5.9 | Strict mode, ES2022 target, ESNext modules |
| **Framework** | Express | 5.2 | Latest Express 5 (not the usual 4.x!) |
| **Database** | PostgreSQL | — | Via Prisma adapter |
| **ORM** | Prisma | 7.3 (Client), 7.2 (CLI) | Uses `PrismaPg` driver adapter (not the default Prisma engine) |
| **Cache** | Redis (ioredis) | 5.8 | Caching, rate limiting, session storage, refresh tokens |
| **Queue** | BullMQ | 5.66 | Background job processing with Redis backend |
| **Validation** | Zod | 4.1 | Request body + query validation on every endpoint |
| **Build Tool** | esbuild | 0.27 | Bundles for production; `tsx` for dev |
| **Dev Runner** | tsx | 4.21 | Watch mode for development (`tsx watch`) |

### Security Stack

| Component | Technology | How It's Used |
|-----------|-----------|---------------|
| **Auth (User)** | JWT (jsonwebtoken) | Access token (15min) + Refresh token (7d) in Redis |
| **Auth (Admin)** | Separate JWT secret | `JWT_ADMIN_SECRET` with 12h expiry |
| **Password** | bcrypt 6 | Hash + compare for admin login |
| **OTP** | Custom (Redis-backed) | Sequential cooling pattern (30s→5min→60min), MSG91 provider |
| **HTTP Security** | Helmet 8 | Security headers on all responses |
| **CORS** | cors 2.8 | Configurable via `FRONTEND_URL` env |
| **Rate Limiting** | express-rate-limit + rate-limit-redis | Redis-backed, 100 req/min API, 10 req/min auth |
| **Error Monitoring** | Sentry 10 | With profiling integration |
| **Request Tracing** | Custom UUID-based | [trace.middleware.ts](file:///d:/Techwara/RentSpace-Server/src/middleware/trace.middleware.ts) — adds `traceId` to every request |

### Architecture Pattern

```
src/
├── server.ts           ← Entry point: Sentry init, server start, graceful shutdown
├── app.ts              ← Express app: 30+ route mounts, middleware chain
├── config/             ← Environment (Zod-validated), Redis, JWT, Constants
├── db/index.ts         ← Prisma client with $extends auto-sync middleware
├── middleware/         ← 12 middleware files
│   ├── auth            ← User JWT verification
│   ├── adminAuth       ← Admin JWT verification (separate secret)
│   ├── adminRole       ← RBAC: requireSuperAdmin / allowAllAdmins
│   ├── authorization   ← Account-level ownership checks
│   ├── planFeature     ← Plan limit enforcement (max properties, tenants, etc.)
│   ├── moduleEnabled   ← Feature flag checks (disabled-modules)
│   ├── rateLimiter     ← Redis-backed rate limiting
│   ├── validation      ← Zod schema validation wrapper
│   ├── upload          ← Multer file upload handling
│   ├── trace           ← Request tracing (UUID per request)
│   ├── errorHandler    ← Centralized error formatting
│   └── notFound        ← 404 handler
├── modules/            ← 16 domain modules (see below)
├── jobs/               ← 8 cron jobs + BullMQ queue + workers
├── logs/               ← 7 Pino-based loggers
├── errors/             ← 21 domain-specific error files
├── utils/              ← 15 utility files
└── types/              ← Global type definitions
```

### Module Pattern (Every Module Follows This)

```
modules/[name]/
├── [name].routes.ts       ← Express Router with middleware chain
├── [name].controller.ts   ← Request/Response handling
├── [name].service.ts      ← Business logic (Prisma queries)
├── [name].validation.ts   ← Zod schemas for request validation
└── [name].types.ts        ← TypeScript interfaces (optional)
```

**All 16 modules:**

| # | Module | Files | Purpose |
|---|--------|:-----:|---------|
| 1 | `admin` | 5 | Admin user CRUD, audit logs, admin auth |
| 2 | [auth](file:///d:/Techwara/RentSpace-Server/src/modules/admin/admin.service.ts#15-67) | 4 | User login (phone OTP), register, token refresh |
| 3 | `account` | 4 | Account management, photo uploads |
| 4 | `plans` | 5 | Plan CRUD (admin), public plan listing |
| 5 | `subscriptions` | 5 | Subscription management, plan assignment |
| 6 | `properties` | 10 | Property + Unit + Bed CRUD, complex management |
| 7 | `tenant` | 3 | Tenant management, contracts, documents |
| 8 | [rent](file:///d:/Techwara/RentSpace-Server/src/modules/admin/admin.service.ts#68-92) | 13 | Rent payments, transactions, overdue tracking, revisions |
| 9 | `maintenance` | 6 | Maintenance queries, owner/tenant views |
| 10 | `moveOut` | 4 | Move-out requests, approval/decline |
| 11 | `notifications` | 21 | 5 channels, emitter pattern, templates, devices |
| 12 | `ownerQuery` | 4 | Support tickets from landlords |
| 13 | `suggestions` | 4 | Feature suggestions from landlords |
| 14 | `staff` | 5 | Staff management, assignments, permissions |
| 15 | `system` | 5 | System health, disabled modules, admin system routes |
| 16 | `dashboard` | 3 | Owner dashboard stats |

### Database (Prisma)

| Attribute | Value |
|-----------|-------|
| **Schema file** | [prisma/schema.prisma](file:///d:/Techwara/RentSpace-Server/prisma/schema.prisma) — **891 lines** |
| **Models** | 27 models |
| **Enums** | 40+ enums |
| **ID type** | CUID (`@default(cuid())`) |
| **Timestamps** | `createdAt` + `updatedAt` on all models |
| **Driver** | `PrismaPg` adapter (Prisma 7 driver-based approach) |
| **Auto-sync** | `$extends` middleware syncs denormalized fields (name, phone, property names across related tables) |
| **Migrations** | Standard Prisma migrate (4 migrations so far) |
| **Seeds** | 4 seed files (admin, plans, maintenance data, staff) |

### Background Jobs

| # | Job | Schedule | File |
|---|-----|----------|------|
| 1 | Rent generation | 1st & 15th of month | [rent-generate-monthly.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/rent-generate-monthly.ts) |
| 2 | Overdue rent marking | Daily 6 AM | [rent-update-overdue.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/rent-update-overdue.ts) |
| 3 | Rent due reminders | Daily 8 AM | [rent-due-reminders.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/rent-due-reminders.ts) |
| 4 | Lease renewal check | Daily 9 AM | [lease-renewal-check.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/lease-renewal-check.ts) |
| 5 | Maintenance auto-confirm | Daily 10 AM | [maintenance-auto-confirm.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/maintenance-auto-confirm.ts) |
| 6 | Notification cleanup | Weekly Sunday 2 AM | [notification-cleanup.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/notification-cleanup.ts) |
| 7 | Weekly property summary | Weekly Monday 7 AM | [weekly-property-summary.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/weekly-property-summary.ts) |
| 8 | Move-out completion | TBD | [moveout-complete.ts](file:///d:/Techwara/RentSpace-Server/src/jobs/moveout-complete.ts) |

**Queue:** BullMQ with Redis — used for notification delivery (async, with retries).

### Notification System

| Channel | File | Provider |
|---------|------|----------|
| In-App | [in-app.channel.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/channels/in-app.channel.ts) | Direct DB insert ([Notification](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.service.ts#107-141) model) |
| Push | [push.channel.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/channels/push.channel.ts) | Expo Push SDK (`expo-server-sdk`) |
| Email | [email.channel.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/channels/email.channel.ts) | Nodemailer (SMTP) |
| SMS | [sms.channel.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/channels/sms.channel.ts) | MSG91 API |
| WhatsApp | [whatsapp.channel.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/channels/whatsapp.channel.ts) | Custom integration |

**Event Emitter:** [notification.emitter.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.emitter.ts) (34KB — 30+ event types) — a central pub/sub that fires notifications on business events.

### Logging

| Logger | Purpose |
|--------|---------|
| `app.logger` | General application events |
| `http.logger` | Request/response logging (pino-http) |
| `audit.logger` | Admin action audit trail |
| `error.logger` | Error tracking |
| `performance.logger` | Slow query, response time tracking |
| `security.logger` | Auth failures, rate limits, IP blocks |
| `base.logger` | Shared Pino configuration |

### API Route Structure

```
/api/v1/                    ← User-facing APIs (mobile app)
/admin/api/                  ← Admin-facing APIs (dashboard)
```

**Current admin routes (in [app.ts](file:///d:/Techwara/RentSpace-Server/src/app.ts)):**
- `/admin/api` → Admin user management & audit logs (10 endpoints)
- `/admin/api/plans` → Plan CRUD (4 endpoints)
- `/admin/api/subscriptions` → Subscription management (6 endpoints)
- `/admin/api/system` → System status, disabled modules (3 endpoints)

### Deployment

| Component | Technology |
|-----------|-----------|
| **Container** | Docker (Node 20 Alpine) |
| **Runtime** | `tsx` (TypeScript execution without compile) |
| **DB Migrations** | `prisma migrate deploy` in CMD |
| **Production Build** | esbuild (ESM bundle) |
| **File Storage** | Local (`/uploads`) OR Cloudinary |

---

## Part 2: Tech Stack Recommendation — Matching Your Backend

### Backend (Dashboard APIs) — NO NEW TECH NEEDED

Your backend is already production-grade. New dashboard API endpoints should follow **exactly the same patterns**:

| What | Use | Same As |
|------|-----|---------|
| **New routes** | Express Router under `/admin/api/` | `admin.routes.ts` pattern |
| **Controllers** | Async handlers with `sendSuccessResponse` | Every existing controller |
| **Services** | Prisma queries in service files | Every existing service |
| **Validation** | Zod schemas with `validate()` middleware | Every existing validation |
| **Auth** | `authenticateAdmin` + `requireSuperAdmin` middleware | Already built |
| **Error handling** | Domain-specific AppError classes | `errors/` directory |
| **Logging** | Pino loggers (audit, app, security) | `logs/` directory |
| **Caching** | Redis via ioredis | `config/redis.ts` |
| **Background Jobs** | BullMQ queues + node-cron | `jobs/` directory |
| **Real-time** | Socket.io (**one new addition**) | New — for live event feed |

> [!IMPORTANT]
> **Socket.io is the ONLY new backend dependency.** Everything else is already built and battle-tested.

### Frontend (Dashboard Web App) — NEW

Since the dashboard is a **separate web app** (not part of the mobile app), here's the recommended frontend stack, chosen specifically to match your backend patterns:

| Layer | Technology | Version | Why This Matches |
|-------|-----------|---------|-----------------|
| **Framework** | **Next.js** | 14+ (App Router) | Server-side rendering for admin dashboards, built-in API routes, file-based routing — matches your Express route structure |
| **Language** | **TypeScript** | 5.x | Same as backend — strict mode, shared type safety |
| **UI Library** | **Shadcn/UI** | Latest | Pre-built, accessible components (tables, modals, buttons, cards) — no heavy UI framework |
| **Styling** | **TailwindCSS** | 3.x | Utility-first CSS — rapid development, consistent design system |
| **Charts** | **Recharts** | 2.x | React-native chart library — line, bar, pie, gauge, area, radar — covers all 14 chart types in the plan |
| **Tables** | **TanStack Table** | 8.x | Advanced data tables — sorting, filtering, pagination, column visibility — matches your Prisma pagination pattern |
| **Data Fetching** | **TanStack Query** | 5.x | Server state management — auto caching, refetching, loading/error states — matches your Redis caching pattern |
| **Forms** | **React Hook Form + Zod** | Latest | Zod validation on frontend TOO — **same schemas can be shared** with backend |
| **Icons** | **Lucide React** | Latest | Clean, consistent icons — same family used in most Shadcn/UI setups |
| **Dates** | **date-fns** | 3.x | Lightweight date formatting — matches your existing JS date patterns |
| **HTTP Client** | **Axios** or **fetch** | — | Call your Express `/admin/api/*` endpoints |
| **Auth State** | **JWT in httpOnly cookies** | — | Matches your backend JWT auth — automatic token management |
| **Real-time** | **Socket.io Client** | 4.x | Connects to new Socket.io server for live event feed |
| **Toasts** | **Sonner** | Latest | Notification toasts — comes with Shadcn/UI |
| **State Mgmt** | **Zustand** | 4.x | Lightweight client-side state (sidebar state, filters, preferences) — no Redux overhead |

### Why This Stack? — Compatibility Matrix

| Backend Pattern | Frontend Match | Why |
|----------------|---------------|-----|
| Express routes (`/admin/api/*`) | Next.js API calls via TanStack Query | Direct HTTP calls, same URL structure |
| Zod validation (backend) | Zod + React Hook Form (frontend) | **Same validation library** — can share schemas |
| TypeScript strict mode | TypeScript strict mode | Identical type safety |
| Prisma pagination (page, limit) | TanStack Table pagination | Same parameters, same pattern |
| Redis caching (TTL-based) | TanStack Query caching (staleTime) | Both use time-based cache invalidation |
| JWT admin tokens | httpOnly cookies | Browser-safe token storage |
| Pino structured logging | Console + error boundary | Errors route to Sentry (already in backend) |
| BullMQ job events | Socket.io real-time | Backend emits → frontend receives |
| Prisma models/types | Shared TypeScript interfaces | Can generate types from Prisma schema |

### Development Tools

| Tool | Purpose | Why |
|------|---------|-----|
| **ESLint** | Code linting | Same as backend code quality |
| **Prettier** | Code formatting | Consistent style |
| **Vitest** | Unit testing | Fast, Vite-native — for testing API services |
| **Playwright** | E2E browser testing | Test full dashboard flows in real browser |
| **Storybook** (optional) | Component development | Isolate and test UI components |

### Deployment

| Option | Best For | Details |
|--------|----------|---------|
| **Vercel** | Fastest setup | Next.js native hosting, automatic previews, edge functions |
| **Docker** (alongside backend) | Self-hosted | Add frontend container to existing Docker setup |
| **Railway/Render** | Simple PaaS | Deploy both backend + frontend on same platform |

---

## Part 3: Dependencies Summary

### Backend — Add ONLY 1 New Package

```json
{
  "socket.io": "^4.x"    // Real-time event feed (ADDON #19)
}
```

**Everything else is already installed and working.**

### Frontend — New Project Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-table": "^8.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^4.x",
    "recharts": "^2.x",
    "axios": "^1.x",
    "zustand": "^4.x",
    "date-fns": "^3.x",
    "lucide-react": "latest",
    "sonner": "latest",
    "socket.io-client": "^4.x",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "eslint": "^8.x",
    "prettier": "latest",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```

> [!NOTE]
> **Shadcn/UI is NOT a package** — it's a CLI that generates component files directly into your project. You run `npx shadcn-ui@latest init` and then add components individually. This means zero dependency bloat.

---

## Part 4: Folder Structure — Dashboard Frontend

```
rentspace-dashboard/
├── src/
│   ├── app/                    ← Next.js App Router pages
│   │   ├── (auth)/             ← Login page (public)
│   │   ├── (dashboard)/        ← Protected dashboard pages
│   │   │   ├── overview/       ← Page 2: Overview
│   │   │   ├── alerts/         ← Page 3: Alerts Center
│   │   │   ├── growth/         ← Page 4: Growth Analytics
│   │   │   ├── revenue/        ← Page 5: Revenue & Billing
│   │   │   ├── subscriptions/  ← Page 6: Subscription Analytics
│   │   │   ├── platform/       ← Page 7: Platform Analytics (9 tabs)
│   │   │   ├── accounts/       ← Page 8: Landlords
│   │   │   ├── users/          ← Page 9: Users
│   │   │   ├── plans/          ← Page 10: Plans & Subscriptions
│   │   │   ├── rent/           ← Page 11: Rent Management
│   │   │   ├── properties/     ← Page 12: Properties
│   │   │   ├── tenants/        ← Page 13: Tenants
│   │   │   ├── maintenance/    ← Page 14: Maintenance Ops
│   │   │   ├── move-outs/      ← Page 15: Move-Out Ops
│   │   │   ├── support/        ← Page 16: Support & Suggestions
│   │   │   ├── notifications/  ← Page 17: Notifications
│   │   │   ├── admin-users/    ← Page 18: Admin & Audit
│   │   │   ├── staff/          ← Page 19: Staff Overview
│   │   │   ├── settings/       ← Page 20: System Settings
│   │   │   ├── reports/        ← Page 21: Reports Builder
│   │   │   └── layout.tsx      ← Dashboard shell (sidebar + header)
│   │   └── layout.tsx          ← Root layout
│   ├── components/
│   │   ├── ui/                 ← Shadcn/UI components (auto-generated)
│   │   ├── charts/             ← Recharts wrappers
│   │   ├── tables/             ← TanStack Table wrappers
│   │   └── shared/             ← KPI cards, alert badges, etc.
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/                    ← API client, auth helpers, utils
│   ├── types/                  ← TypeScript interfaces (mirrors Prisma models)
│   └── stores/                 ← Zustand stores (sidebar, filters, preferences)
├── public/                     ← Static assets
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Part 5: What We DON'T Need

| Technology | Why NOT |
|-----------|---------|
| **Redux** | Overkill — TanStack Query handles server state, Zustand handles client state |
| **GraphQL** | Backend is REST — no need to add a new API paradigm |
| **MongoDB** | Already on PostgreSQL — no reason to add a second database |
| **Prisma on frontend** | Frontend calls APIs, doesn't touch the database directly |
| **Docker for frontend** | Vercel handles deployment better for Next.js |
| **Material UI / Ant Design** | Heavy libraries — Shadcn/UI is lighter and more customizable |
| **Webpack** | Next.js uses Turbopack — no manual bundler config |
| **Express for frontend** | Next.js has built-in server — no need for a separate one |
