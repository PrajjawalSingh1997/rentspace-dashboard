# RentSpace Super Admin Dashboard — Full Project Tasks

> **Total: 6 Phases | 50 Days | 22 Pages | 96 API Endpoints | 67 Write Actions | 30 Addons**

---

## Pre-Development (Planning & Analysis) ✅

- [x] Analyze all 66 analytics metrics + 47 admin controls from Prisma schema
- [x] Create implementation plan with full UI flow (22 pages, 4 sections)
- [x] Completeness audit #1 — found and fixed 7 gaps
- [x] Completeness audit #2 — found and fixed 5 more gaps
- [x] Deep server code analysis — identified 30 addon suggestions (3 tiers)
- [x] Integrate all 30 addons into implementation plan
- [x] Create dashboard walkthrough with flowcharts and diagrams
- [x] Add 22 new write actions (67 total)
- [x] Final deep review — fixed 5 consistency issues
- [x] Deep server codebase analysis (28 deps, 16 modules, 12 middleware)
- [x] Create tech stack analysis document
- [x] Add Phase 0 + backend module structure + frontend structure to plan
- [x] Create day-by-day development plan (vertical slices)
- [x] Create development rules (30 rules: B1-B15, F1-F12, S1-S3)

---

## Phase 0 — Backend Prep + Frontend Setup (Days 1-3)

### Day 1: Schema + Backend Shared Utils

**Schema Migration:**
- [ ] Add `closedAt DateTime?` to [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454) model
- [ ] Add `churnRiskScore Float? @default(0)` to [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454) model
- [ ] Add `source String?` to `OwnerQuery` model
- [ ] Add `assignedTo String?` to `OwnerQuery` model
- [ ] Add database indexes (Rule B15):
  - [ ] `@@index([status])` on [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454)
  - [ ] `@@index([createdAt])` on [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454)
  - [ ] `@@index([churnRiskScore])` on [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454)
  - [ ] `@@index([status])` on [RentPayment](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.emitter.ts#309-327)
  - [ ] `@@index([monthYear])` on [RentPayment](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.emitter.ts#309-327)
  - [ ] `@@index([status])` on `TenantContract`
  - [ ] `@@index([leaseStartDate])` on `TenantContract`
  - [ ] `@@index([status])` on `MaintenanceQuery`
  - [ ] `@@index([status])` on `OwnerQuery`
  - [ ] `@@index([createdAt])` on [Notification](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.service.ts#107-141)
  - [ ] `@@index([createdAt])` on `AdminAuditLog`
- [ ] Run `npx prisma migrate dev` — verify migration succeeds
- [ ] Verify Prisma client regenerated with new fields

**Backend Config:**
- [ ] Enable `compression()` middleware in [app.ts](file:///d:/Techwara/RentSpace-Server/src/app.ts)
- [ ] Create admin subfolder structure:
  - [ ] `src/modules/admin/analytics/`
  - [ ] `src/modules/admin/platform/`
  - [ ] `src/modules/admin/alerts/`
  - [ ] `src/modules/admin/reports/`
  - [ ] `src/modules/admin/notifications/`
  - [ ] `src/modules/admin/shared/`

**Shared Utils (inside `admin/shared/`):**
- [ ] `pagination.util.ts` — `paginatedResponse(data, total, page, limit)` function
- [ ] `analytics-cache.util.ts` — `cachedQuery(key, ttl, queryFn)` Redis wrapper
- [ ] `analytics-base.service.ts` — shared helpers:
  - [ ] `countByGroup(model, groupField, dateFilter)` — GROUP BY with count
  - [ ] `sumByPeriod(model, sumField, period, dateFilter)` — SUM grouped by time
  - [ ] `trendData(model, dateField, period, dateFilter)` — time-series data
  - [ ] `dateRangeFilter(startDate, endDate)` — Prisma where clause builder

**Error Files:**
- [ ] `src/errors/analytics.errors.ts` — ANALYTICS_ERRORS constants
- [ ] `src/errors/platform.errors.ts` — PLATFORM_ERRORS constants
- [ ] `src/errors/alerts.errors.ts` — ALERT_ERRORS constants
- [ ] `src/errors/reports.errors.ts` — REPORT_ERRORS constants
- [ ] Register all new error files in [src/errors/index.ts](file:///d:/Techwara/RentSpace-Server/src/errors/index.ts)

**Documentation:**
- [ ] Update [README.md](file:///d:/Techwara/RentSpace-Server/README.md) — add Phase 0 changes section

---

### Day 2: Frontend Project Setup

**Project Init:**
- [ ] `npx create-next-app@latest rentspace-dashboard` (TypeScript, TailwindCSS, App Router)
- [ ] Install core dependencies:
  - [ ] `@tanstack/react-query`, `@tanstack/react-table`
  - [ ] `recharts`
  - [ ] `zod`, `react-hook-form`, `@hookform/resolvers`
  - [ ] `zustand`
  - [ ] `axios`
  - [ ] `date-fns`
  - [ ] `lucide-react`
  - [ ] `sonner`
  - [ ] `socket.io-client`
  - [ ] `class-variance-authority`, `clsx`, `tailwind-merge`
- [ ] `npx shadcn-ui@latest init` — configure Shadcn/UI
- [ ] Add Shadcn components: Button, Card, Input, Table, Dialog, Sheet, Tabs, Badge, Alert, Select, Dropdown, Tooltip, Skeleton

**Config & Foundation:**
- [ ] `tailwind.config.ts` — design system (colors, fonts, spacing)
- [ ] `globals.css` — CSS variables for dark/light mode
- [ ] `lib/api.ts` — Axios instance with baseURL, JWT interceptor, error handler
- [ ] `lib/query-client.ts` — TanStack Query config (Rule F12)
- [ ] `app/providers.tsx` — QueryClientProvider + Toaster wrapper
- [ ] `stores/auth.ts` — Zustand store (JWT token, admin profile, login/logout)
- [ ] `types/api.ts` — Shared TypeScript interfaces for API responses

---

### Day 3: Dashboard Shell

**Components:**
- [ ] Sidebar component — 4 sections, 22 nav items, collapsible, active highlight, role-based visibility
- [ ] Header component — logo, bell icon (placeholder), admin dropdown, logout
- [ ] [(dashboard)/layout.tsx](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) — sidebar + header + main content area
- [ ] [(auth)/layout.tsx](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) — centered layout for login page

**Auth & Navigation:**
- [ ] Auth guard middleware — redirect to login if no JWT
- [ ] [(dashboard)/error.tsx](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) — error boundary (Rule F11)
- [ ] [(auth)/error.tsx](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) — error boundary for auth pages
- [ ] 404 page — catch-all for unknown routes

**✅ Milestone: Empty dashboard shell running locally**

---

## Phase 1 — Core Pages (Days 4-12)

### Day 4-5: Page 1 — Login 🔐

**Backend:** *(Already exists — no work needed)*

**Frontend:**
- [ ] Login page UI — email + password form
- [ ] Zod validation schema for login form
- [ ] API integration — call `POST /admin/api/auth/login`
- [ ] JWT storage + redirect to overview on success
- [ ] Error display — invalid credentials, rate limit messages
- [ ] OTP login option — phone input → OTP verification flow
- [ ] Token refresh logic — auto-refresh before expiry
- [ ] Auto-logout on 401 response

**Testing:**
- [ ] Login with valid credentials → redirects to overview
- [ ] Login with wrong password → shows error
- [ ] Logout → clears token → redirects to login

---

### Day 6-8: Page 2 — Overview Dashboard 🏠

**Backend (Day 6):**
- [ ] `analytics.routes.ts` — mount GET `/admin/api/analytics/overview`
- [ ] `analytics.controller.ts` — `getOverview` handler
- [ ] `analytics.service.ts` — `getOverviewKPIs()`:
  - [ ] Total users count
  - [ ] Total accounts count
  - [ ] Total properties count
  - [ ] Total units count
  - [ ] Total tenants count
  - [ ] Total rent collected (current month)
  - [ ] MRR (Monthly Recurring Revenue)
  - [ ] New signups (this month vs last month)
  - [ ] Churn rate
  - [ ] Active vs inactive account ratio
- [ ] `analytics.validation.ts` — overview query schema (period filter)
- [ ] Redis caching for overview KPIs (5 min TTL)
- [ ] Test endpoint manually

**Frontend (Day 7-8):**
- [ ] Row 0: Alert banner — red/amber strip (placeholder, real in Page 3)
- [ ] Row 1: 7 KPI cards with trend arrows (up/down + %)
- [ ] Row 2: Status cards — MRR, signups, churned, churn rate, active/inactive donut
- [ ] Row 3: Charts — rent collection gauge, signup sparkline, health score bar
- [ ] Row 4: Activity — DAU area chart, login trend line, API volume area
- [ ] Date range picker component (reusable)
- [ ] Loading skeletons for all sections
- [ ] Empty/error states

**Testing:**
- [ ] Overview loads with real data from database
- [ ] KPI cards show correct numbers
- [ ] Charts render properly

---

### Day 9-10: Page 8 — Landlords (Accounts) 👤

**Backend (Day 9):**
- [ ] `platform.routes.ts` — mount routes
- [ ] `GET /admin/api/platform/accounts` — paginated list with search, filters
- [ ] `GET /admin/api/platform/accounts/:id` — full profile with related data
- [ ] `PATCH /admin/api/platform/accounts/:id/status` — status override
- [ ] `PATCH /admin/api/platform/accounts/:id/notes` — admin notes
- [ ] `PATCH /admin/api/platform/accounts/:id/churn-override` — churn score override
- [ ] `POST /admin/api/platform/accounts/:id/impersonate` — impersonation token
- [ ] `POST /admin/api/platform/accounts/bulk-action` — bulk operations
- [ ] `POST /admin/api/platform/accounts/import` — CSV import
- [ ] `platform.validation.ts` — all Zod schemas
- [ ] `platform.service.ts` — account queries with joins (properties, tenants, subscription)
- [ ] Audit logging for all write actions
- [ ] Test all endpoints

**Frontend (Day 10):**
- [ ] List view — data table (sortable, filterable, searchable)
- [ ] Churn risk column with color-coded badges
- [ ] Click-to-profile navigation
- [ ] Profile page — header + details + churn card
- [ ] Profile: properties section
- [ ] Profile: tenants section
- [ ] Profile: subscription section
- [ ] Profile: actions panel (status override, notes, impersonate)
- [ ] Bulk action toolbar (select multiple → action dropdown)
- [ ] CSV import modal
- [ ] Loading/error/empty states

**Testing:**
- [ ] Can search and filter accounts
- [ ] Can view account profile with all sections
- [ ] Write actions work and show in audit log

---

### Day 11-12: Page 3 — Alerts Center 🚨

**Backend (Day 11):**
- [ ] `alerts.routes.ts` — mount routes
- [ ] `GET /admin/api/alerts` — generate + list alerts (12 types)
- [ ] `PATCH /admin/api/alerts/:id` — mark as read/resolved
- [ ] `PATCH /admin/api/alerts/bulk-read` — bulk mark as read
- [ ] `alerts.service.ts` — alert generation logic:
  - [ ] Payment failure spike
  - [ ] High churn rate
  - [ ] Subscription expiring
  - [ ] System error spike
  - [ ] Overdue rent threshold
  - [ ] Inactive accounts
  - [ ] Storage limit approaching
  - [ ] Plan limit exceeded
  - [ ] Support ticket SLA breach
  - [ ] Failed job alerts
  - [ ] Security alerts
  - [ ] Database performance alerts
- [ ] `alerts.validation.ts` — filter schemas
- [ ] Audit logging for alert resolution
- [ ] Test all endpoints

**Frontend (Day 12):**
- [ ] Alert list — table with severity icons
- [ ] Filters — Critical/Warning/Info severity tabs
- [ ] Status tabs — Active/Resolved/All
- [ ] Action buttons — click-through, resolve, bulk actions
- [ ] Header bell icon — connect to real alert count
- [ ] Bell dropdown — show top 5 alerts
- [ ] Loading/error/empty states

**Testing:**
- [ ] Alerts generate from real data conditions
- [ ] Can resolve alerts, count updates in bell icon

**✅ Milestone: Core dashboard working — Login + Overview + Landlords + Alerts**

---

## Phase 2 — Analytics & Management Pages (Days 13-24)

### Day 13-14: Page 10 — Plans & Subscriptions 💳

**Backend:** *(10 APIs already exist — minimal new work)*
- [ ] `POST /admin/api/platform/billing/refund` — issue refund
- [ ] `POST /admin/api/platform/billing/discount` — apply discount/coupon
- [ ] Audit logging for billing write actions

**Frontend:**
- [ ] Plans section — plan table, create/edit modals, deactivate toggle
- [ ] Subscription section — view/assign/change/extend/cancel
- [ ] Billing write actions — refund form, discount form
- [ ] Loading/error/empty states

---

### Day 15-16: Page 9 — Users 👥

**Backend (Day 15):**
- [ ] `GET /admin/api/platform/users` — paginated user list with role filters
- [ ] `POST /admin/api/platform/users/:id/reset-password` — force password reset
- [ ] `POST /admin/api/platform/users/:id/force-logout` — invalidate all sessions
- [ ] `PATCH /admin/api/platform/users/:id/phone` — change phone number
- [ ] `PATCH /admin/api/platform/users/:id/email` — change email
- [ ] `PATCH /admin/api/platform/users/:id/name` — edit display name
- [ ] `POST /admin/api/platform/users/merge` — merge duplicate accounts
- [ ] Validation schemas + audit logging

**Frontend (Day 16):**
- [ ] User data table — search, filter by role
- [ ] Click-to-profile
- [ ] Write action modals — password reset, phone change, email change
- [ ] Merge duplicate wizard — select source/target accounts
- [ ] Loading/error/empty states

---

### Day 17-18: Page 4 — Growth Analytics 📈

**Backend (Day 17):**
- [ ] `GET /admin/api/analytics/growth` — growth data with period toggle
- [ ] `GET /admin/api/analytics/cohorts` — cohort retention/revenue/churn matrices
- [ ] `GET /admin/api/analytics/trial-conversion` — trial-to-paid funnel
- [ ] `GET /admin/api/analytics/multi-account` — users with multiple accounts
- [ ] Validation schemas + Redis caching

**Frontend (Day 18):**
- [ ] Tab 1: Growth trends — line charts + period toggle + date range
- [ ] Tab 2: Cohort analysis — retention heatmap matrix
- [ ] Tab 3: Multi-account analytics
- [ ] Tab 4: Trial conversion funnel
- [ ] Loading/error/empty states

---

### Day 19-21: Page 5 — Revenue & Billing 💰

**Backend (Day 19):**
- [ ] `GET /admin/api/analytics/revenue` — revenue KPIs, rent per month
- [ ] `GET /admin/api/analytics/payments` — payment gateway analytics
- [ ] `GET /admin/api/analytics/rent-revisions` — revision analytics
- [ ] `GET /admin/api/analytics/reconciliation` — payment reconciliation
- [ ] `GET /admin/api/analytics/rent-cycle` — rent cycle analytics
- [ ] Validation schemas + Redis caching

**Frontend (Day 20-21):**
- [ ] KPI row — total revenue, MRR, collection rate, overdue
- [ ] Chart: Rent collected per month (bar chart)
- [ ] Chart: Payment method distribution (pie)
- [ ] Chart: Rent status breakdown (donut)
- [ ] Table: Top properties by revenue
- [ ] Table: Revenue by landlord
- [ ] Table: Failed payments
- [ ] Tab: Payment gateway analytics
- [ ] Tab: Rent revision analytics
- [ ] Tab: Reconciliation
- [ ] Tab: Prorated rent
- [ ] Tab: Rent cycle analytics
- [ ] Loading/error/empty states

---

### Day 22: Page 6 — Subscription Analytics 📋

**Backend (AM):**
- [ ] `GET /admin/api/analytics/subscriptions` — plan distribution, trial/paid, billing cycles
- [ ] Validation + caching

**Frontend (PM):**
- [ ] KPI cards — total subs, active, trial, expired
- [ ] Chart: Plan distribution pie/donut
- [ ] Chart: Trial vs paid over time
- [ ] Tab: Plan usage & limits
- [ ] Table: Expiring subscriptions alert
- [ ] Loading/error/empty states

---

### Day 23-24: Page 7 — Platform Analytics 🏢

**Backend (Day 23):**
- [ ] `GET /admin/api/analytics/properties` — property type distribution, occupancy
- [ ] `GET /admin/api/analytics/tenants` — tenant stats, demographics
- [ ] `GET /admin/api/analytics/maintenance` — maintenance query stats
- [ ] `GET /admin/api/analytics/move-outs` — move-out request stats
- [ ] `GET /admin/api/analytics/bed-occupancy` — bed-level analytics
- [ ] `GET /admin/api/analytics/lease-health` — lease status analytics
- [ ] `GET /admin/api/analytics/property-comparison` — compare properties
- [ ] Validation schemas + Redis caching

**Frontend (Day 24):**
- [ ] Tab 1: Property analytics — type distribution, occupancy rates
- [ ] Tab 2: Tenant analytics — demographics, contract status
- [ ] Tab 3: Maintenance analytics — status distribution, resolution time
- [ ] Tab 4: Move-out analytics — trends, reasons
- [ ] Tab 5: Bed occupancy — bed-level heatmap
- [ ] Tab 6: Lease renewal — lease health tracker
- [ ] Tab 7: Co-tenant sharing
- [ ] Tab 8: Commercial analytics
- [ ] Tab 9: Property comparison tool
- [ ] Loading/error/empty states

**✅ Milestone: All analytics pages working with real data**

---

## Phase 3 — Operations Pages (Days 25-36)

### Day 25-26: Page 11 — Rent Management 💵

**Backend (Day 25):**
- [ ] `GET /admin/api/platform/rent` — platform-wide rent data
- [ ] `POST /admin/api/platform/rent/manual-payment` — record manual payment
- [ ] `PATCH /admin/api/platform/rent/:id/waive` — waive overdue charges
- [ ] `PATCH /admin/api/platform/rent/:id/mark-paid` — mark as paid
- [ ] Validation + audit logging + transactions (Rule B14)

**Frontend (Day 26):**
- [ ] KPI cards — total collected, overdue, pending
- [ ] Bar chart — rent collection by month
- [ ] Payment table — sortable, filterable
- [ ] Overdue list — highlighted rows
- [ ] Write action modals — manual payment, waive, mark paid
- [ ] Loading/error/empty states

---

### Day 27: Page 12 — Properties 🏠

**Backend (AM):**
- [ ] `GET /admin/api/platform/properties` — property list with filters
- [ ] `POST /admin/api/platform/properties/:id/transfer` — ownership transfer
- [ ] Validation + audit logging + transaction

**Frontend (PM):**
- [ ] KPI row — total properties, units, beds, occupancy rate
- [ ] Data table — search, filter, sort
- [ ] Property detail slide-over
- [ ] Transfer ownership modal
- [ ] Loading/error/empty states

---

### Day 28: Page 13 — Tenants 👤

**Backend (AM):**
- [ ] `GET /admin/api/platform/tenants` — tenant list with filters
- [ ] `PATCH /admin/api/platform/tenants/:id` — edit tenant details
- [ ] `PATCH /admin/api/platform/tenants/:id/extend-lease` — extend lease
- [ ] `PATCH /admin/api/platform/tenants/:id/adjust-rent` — adjust rent amount
- [ ] Validation + audit logging + transactions

**Frontend (PM):**
- [ ] KPI cards — total tenants, active, moved out
- [ ] Distribution chart — by property type
- [ ] Data table — search, filter
- [ ] Tenant detail view
- [ ] Write action modals — edit, extend lease, adjust rent
- [ ] Loading/error/empty states

---

### Day 29: Page 14 — Maintenance Ops 🔧

**Backend (AM):**
- [ ] `GET /admin/api/platform/maintenance` — cross-platform queries
- [ ] Validation + pagination

**Frontend (PM):**
- [ ] Query table — filters by status, property, priority
- [ ] Detail view — images, timeline, status updates
- [ ] Status update actions
- [ ] Loading/error/empty states

---

### Day 30: Page 15 — Move-Out Ops 🚪

**Backend (AM):**
- [ ] `GET /admin/api/platform/move-outs` — cross-platform requests
- [ ] Validation + pagination

**Frontend (PM):**
- [ ] Request table — pending queue
- [ ] Approve/decline actions
- [ ] Detail view
- [ ] Loading/error/empty states

---

### Day 31-32: Page 16 — Support & Suggestions 📩

**Backend (Day 31):**
- [ ] `GET /admin/api/platform/support` — list support queries
- [ ] `POST /admin/api/platform/support/:id/respond` — respond to ticket
- [ ] `PATCH /admin/api/platform/support/:id/close` — close ticket
- [ ] `PATCH /admin/api/platform/support/:id/assign` — assign to admin
- [ ] `GET /admin/api/platform/suggestions` — list suggestions
- [ ] `PATCH /admin/api/platform/suggestions/:id/status` — update pipeline status
- [ ] Validation + audit logging

**Frontend (Day 32):**
- [ ] Tab 1 — Support: KPI cards, ticket table, detail slide-over, respond form
- [ ] Tab 2 — Suggestions: kanban pipeline, table view, category chart
- [ ] Loading/error/empty states

---

### Day 33-34: Page 17 — Notifications 🔔

**Backend (Day 33):**
- [ ] `POST /admin/api/notifications/broadcast` — send broadcast
- [ ] `POST /admin/api/notifications/recall` — recall broadcast
- [ ] `POST /admin/api/notifications/templates` — create template
- [ ] `GET /admin/api/notifications/delivery` — delivery analytics
- [ ] Validation + audit logging

**Frontend (Day 34):**
- [ ] Broadcast form — title, message, target filters, channel selection
- [ ] Tab: Delivery health — channel stats, failure rates
- [ ] Tab: Device engagement — platform breakdown
- [ ] Notification history log
- [ ] Loading/error/empty states

---

### Day 35: Page 19 — Staff Overview 👷

**Backend (AM):**
- [ ] `GET /admin/api/platform/staff` — cross-platform staff data
- [ ] Validation + pagination

**Frontend (PM):**
- [ ] Staff table — filter by property, role, status
- [ ] Detail view — assigned duties, activity
- [ ] Permissions heatmap
- [ ] Loading/error/empty states

---

### Day 36: Page 18 — Admin Users & Audit 📊

**Backend:** *(Already exists — no work needed)*

**Frontend:**
- [ ] Admin table — list all admin users
- [ ] Create/edit admin modals
- [ ] Audit log timeline — filterable, searchable
- [ ] Entity audit trail tab (tab within this page)
- [ ] Loading/error/empty states

**✅ Milestone: All operations pages working with full CRUD**

---

## Phase 4 — System & Advanced (Days 37-44)

### Day 37-38: Page 20 — System Settings ⚙️

**Backend (Day 37):**
- [ ] `GET /admin/api/system/jobs` — background job monitor
- [ ] `GET /admin/api/system/security` — security events monitor
- [ ] `GET /admin/api/system/api-performance` — API response times
- [ ] `GET /admin/api/system/queue` — BullMQ queue stats
- [ ] `POST /admin/api/system/cache-clear` — clear Redis cache
- [ ] `POST /admin/api/system/maintenance-schedule` — schedule maintenance
- [ ] Validation + audit logging

**Frontend (Day 38):**
- [ ] System health — server/DB/Redis status indicators
- [ ] Feature flags — module toggles, maintenance message
- [ ] Tab: Background job monitor
- [ ] Tab: Security monitor
- [ ] Tab: API performance
- [ ] Tab: BullMQ queue viewer
- [ ] Cache clear button + maintenance schedule form
- [ ] Loading/error/empty states

---

### Day 39-40: Page 21 — Reports Builder 📑

**Backend (Day 39):**
- [ ] `POST /admin/api/reports/generate` — dynamic query + PDF/CSV/Excel export
- [ ] `GET /admin/api/reports/templates` — saved templates + scheduling
- [ ] Report generation service — metric selection, grouping, filtering
- [ ] Validation + audit logging

**Frontend (Day 40):**
- [ ] Metric selector UI — checkboxes for available metrics
- [ ] Date range + grouping options
- [ ] Live preview of report data
- [ ] Export buttons — PDF, CSV, Excel
- [ ] Save template + schedule modal
- [ ] Loading/error/empty states

---

### Day 41-42: Real-Time Event Feed 🔴

**Backend (Day 41):**
- [ ] `npm install socket.io` on backend
- [ ] Socket.io server setup in [server.ts](file:///d:/Techwara/RentSpace-Server/src/server.ts)
- [ ] Hook into [notification.emitter.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.emitter.ts) — emit events to WebSocket
- [ ] Event types: new signup, payment, churn, ticket, job failure
- [ ] Admin authentication for WebSocket connections

**Frontend (Day 42):**
- [ ] `npm install socket.io-client` (already installed Day 2)
- [ ] Socket.io client hook — connect, reconnect, error handling
- [ ] Live feed component on Overview page — scrolling event list
- [ ] Color-coded events by type
- [ ] Pause/resume toggle
- [ ] Filter chips by event type

---

### Day 43-44: Churn Risk Engine + Health Score 🧮

**Backend (Day 43):**
- [ ] Churn risk calculation job — 7-signal model:
  - [ ] Login frequency decline
  - [ ] Rent collection rate drop
  - [ ] Support ticket increase
  - [ ] Feature usage decline
  - [ ] Property vacancy increase
  - [ ] Payment failures
  - [ ] Time on platform
- [ ] Cron job to compute + cache scores in `churnRiskScore` field
- [ ] `GET /admin/api/platform/accounts/:id/churn` — signal breakdown
- [ ] Account health score algorithm

**Frontend (Day 44):**
- [ ] Churn risk card on landlord profile — traffic light badge
- [ ] 7-signal breakdown table with individual scores
- [ ] At-Risk tab on landlords page — filtered, sorted by risk
- [ ] Health score display on all account views

**✅ Milestone: System monitoring, reports, real-time feed, churn engine working**

---

## Phase 5 — Polish & Ship (Days 45-50)

### Day 45-46: Testing & Bug Fixes

- [ ] E2E test: Login → Overview → Landlord Profile → Action → Audit Log
- [ ] E2E test: Alerts flow — generate → view → resolve
- [ ] E2E test: Create plan → Assign subscription → View analytics
- [ ] Fix responsive breakpoints on all pages
- [ ] Verify loading skeletons on all pages
- [ ] Verify empty states on all pages
- [ ] Verify error states on all pages
- [ ] Performance: lazy load heavy chart pages
- [ ] Performance: optimize slow Prisma queries

### Day 47-48: Role-Based Access

- [ ] SUPER_ADMIN — full access to everything
- [ ] SUPPORT — support tickets, notifications, read-only analytics
- [ ] READ_ONLY — analytics pages only, no write actions
- [ ] Sidebar dynamically shows/hides based on role
- [ ] Write action buttons hidden for non-SUPER_ADMIN
- [ ] API endpoints enforce role checks
- [ ] Test: login as each role, verify access

### Day 49-50: Final Polish & Deploy

- [ ] Loading skeletons — shimmer effects on all pages
- [ ] Empty states — friendly illustrations + messages
- [ ] Keyboard shortcuts — `Cmd+K` global search (optional)
- [ ] Dark mode toggle — verify all pages
- [ ] Final cross-browser testing (Chrome, Firefox, Safari)
- [ ] Deploy to Vercel or Docker
- [ ] Set up CI/CD pipeline
- [ ] Update all documentation (README, Postman, API guide)
- [ ] Create admin user seeder for production

**✅ FINAL MILESTONE: Dashboard fully deployed and accessible**

---

## Documentation Tasks (Ongoing)

- [ ] README.md updated with all new endpoints
- [ ] Postman collection up-to-date
- [ ] API_TESTING_GUIDE.md covers new scenarios
- [ ] Frontend README with setup instructions
- [ ] Environment variables documented for both projects
