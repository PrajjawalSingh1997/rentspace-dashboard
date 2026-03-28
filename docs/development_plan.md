# RentSpace Dashboard — Day-by-Day Development Plan

> **Approach:** Vertical Slices — build each page end-to-end (Backend API → Frontend UI → Done) before moving to the next. Never build more than 1 page ahead on either side.

---

## Phase 0 — Backend Prep + Frontend Setup (Days 1-3)

No pages yet — just lay the foundation.

### Day 1: Schema + Backend Shared Utils
| Time | Task | Details |
|------|------|---------|
| AM | Schema migration | Add `closedAt`, `churnRiskScore` to [Account](file:///d:/Techwara/RentSpace-Server/src/modules/account/account.service.ts#38-454). Add `source`, `assignedTo` to `OwnerQuery` |
| AM | Enable compression | Add `app.use(compression())` in [app.ts](file:///d:/Techwara/RentSpace-Server/src/app.ts) |
| PM | Create `admin/shared/pagination.util.ts` | Standardized paginated response: `{ data, meta: { total, page, limit, totalPages, hasNext, hasPrev } }` |
| PM | Create `admin/shared/analytics-cache.util.ts` | Redis caching wrapper for analytics queries (5-10 min TTL) |
| PM | Create `admin/shared/analytics-base.service.ts` | Reusable helpers: `countByGroup()`, `sumByPeriod()`, `dateRangeFilter()` |

### Day 2: Frontend Project Setup
| Time | Task | Details |
|------|------|---------|
| AM | Initialize Next.js | `npx create-next-app@latest rentspace-dashboard` — TypeScript, TailwindCSS, App Router |
| AM | Install deps | TanStack Table, TanStack Query, Recharts, Zod, Zustand, React Hook Form, date-fns, Axios, Lucide, Sonner |
| AM | Setup Shadcn/UI | `npx shadcn-ui@latest init` + add core components: Button, Card, Input, Table, Dialog, Sheet, Tabs, Badge, Alert |
| PM | Create design system | Color palette, typography, spacing tokens in `tailwind.config.ts` — match to Stitch designs |
| PM | API client setup | `lib/api.ts` — Axios instance with base URL, JWT interceptor, error handling |
| PM | Auth store | `stores/auth.ts` — Zustand store for JWT token, admin profile, login/logout |

### Day 3: Dashboard Shell (No Data Yet)
| Time | Task | Details |
|------|------|---------|
| AM | Sidebar component | 4 sections, 22 nav items, collapsible, active state highlight, role-based visibility |
| AM | Header component | Logo, bell icon (placeholder), admin name dropdown, logout button |
| PM | Layout wrapper | [(dashboard)/layout.tsx](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) — sidebar + header + main content area |
| PM | Auth guard | Redirect to login if no JWT token, protect all [(dashboard)/*](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76) routes |
| PM | 404 page | Catch-all for unknown routes inside dashboard |

**✅ Milestone:** Empty dashboard shell running locally — sidebar, header, navigation works, but all pages show "Coming Soon"

---

## Phase 1 — Core Pages (Days 4-12)

### Day 4-5: 🔐 Login (Page 1)
| Side | Task | Details |
|------|------|---------|
| Backend | None needed | Login API already exists: `POST /admin/api/auth/login` ✅ |
| Frontend (Day 4) | Login page UI | Email + password form, validation, error display |
| Frontend (Day 4) | Auth flow | Call login API → store JWT → redirect to overview |
| Frontend (Day 5) | OTP login option | Phone number input → OTP verification flow |
| Frontend (Day 5) | Token refresh | Auto-refresh before expiry, logout on 401 |

**✅ Milestone:** Working login → redirects to dashboard

### Day 6-8: 🏠 Overview Dashboard (Page 2)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 6) | `GET /admin/api/analytics/overview` | Returns all KPI data: user count, account count, properties, units, tenants, rent, MRR, signups, churn |
| Backend (Day 6) | KPI queries | 7 COUNT/SUM queries with Prisma, cached in Redis 5 min |
| Frontend (Day 7) | Row 1: KPI cards | 7 big number cards with trend arrows |
| Frontend (Day 7) | Row 2: Status cards | MRR, signups, churned, churn rate, active/inactive donut |
| Frontend (Day 8) | Row 3: Charts | Rent collection gauge, signup sparkline, health score bar |
| Frontend (Day 8) | Row 4: Activity | DAU area chart, login trend line, API volume area |
| Frontend (Day 8) | Row 0: Alert banner | Red/amber strip (static placeholder — real alerts in Page 3) |

**✅ Milestone:** Overview dashboard with REAL data from your database

### Day 9-10: 👤 Landlords (Page 8)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 9) | `GET /admin/api/platform/accounts` | Paginated account list with search, filters, churn risk column |
| Backend (Day 9) | `GET /admin/api/platform/accounts/:id` | Full account profile: properties, tenants, subscription, rent stats |
| Frontend (Day 10) | List view | Data table: sortable, filterable, searchable, click-to-profile |
| Frontend (Day 10) | Profile view | Header + churn card + properties + tenants + subscription + actions panel |
| Frontend (Day 10) | Write actions | Status override, extend trial, notes (connect existing + new APIs) |

**✅ Milestone:** Can browse all landlords, view profiles, take actions

### Day 11-12: 🚨 Alerts Center (Page 3)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 11) | `GET /admin/api/alerts` | Alert generation logic — scan for 12 alert types, return sorted by severity |
| Backend (Day 11) | `PATCH /admin/api/alerts/:id` | Mark as read, resolve |
| Backend (Day 11) | `PATCH /admin/api/alerts/bulk-read` | Bulk mark all as read |
| Frontend (Day 12) | Alert list | Table with severity icons, filters (Critical/Warning/Info), status tabs |
| Frontend (Day 12) | Action buttons | Click-through to affected item, resolve, bulk actions |
| Frontend (Day 12) | Header bell icon | Connect to real alert count, dropdown with top 5 |

**✅ Milestone:** Working alert system — bell icon shows count, click to see all alerts

---

## Phase 2 — Analytics Pages (Days 13-24)

### Day 13-14: 💳 Plans & Subscriptions (Page 10)
| Side | Task | Details |
|------|------|---------|
| Backend | None needed | All 10 plan + subscription APIs already exist ✅ |
| Frontend (Day 13) | Plans section | Plan table, create/edit modals, deactivate |
| Frontend (Day 14) | Subscription section | View/assign/change/extend/cancel — connect to existing APIs |
| Frontend (Day 14) | Billing write actions | Refund + discount forms (new APIs) |

### Day 15-16: 👥 Users (Page 9)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 15) | `GET /admin/api/platform/users` | Paginated user list with role filters |
| Backend (Day 15) | User write action APIs | Reset password, force logout, change phone/email, edit name, merge |
| Frontend (Day 16) | User table | Search, filter by role, click-to-profile |
| Frontend (Day 16) | Write action modals | Password reset, phone change (with OTP flow), merge duplicate |

### Day 17-18: 📈 Growth Analytics (Page 4)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 17) | `GET /admin/api/analytics/growth` | Growth data with period toggle (daily/weekly/monthly) |
| Backend (Day 17) | `GET /admin/api/analytics/cohorts` | Cohort retention/revenue/churn matrices |
| Frontend (Day 18) | Tab 1: Growth trends | Line charts with period toggle, date range picker |
| Frontend (Day 18) | Tab 2: Cohort heatmap | Retention matrix, color-coded cells |
| Frontend (Day 18) | Tab 3-4: Multi-account + Trial conversion | Additional analytics tabs |

### Day 19-21: 💰 Revenue & Billing (Page 5)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 19) | `GET /admin/api/analytics/revenue` | Revenue KPIs, rent per month, payment methods |
| Backend (Day 19) | `GET /admin/api/analytics/payments` | Payment gateway analytics |
| Backend (Day 19) | `GET /admin/api/analytics/rent-revisions` | Revision analytics |
| Frontend (Day 20) | KPI row + charts | Revenue cards, rent bar chart, payment pie, rent status donut |
| Frontend (Day 20) | Tables | Top properties, revenue by landlord, failed payments |
| Frontend (Day 21) | Addon tabs | Payment gateway, rent revision, reconciliation, prorated, rent cycle |

### Day 22: 📋 Subscription Analytics (Page 6)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | `GET /admin/api/analytics/subscriptions` | Plan distribution, trial/paid, billing cycles |
| Frontend (PM) | Full page | KPI cards, pie/donut charts, plan usage tab, expiration alert table |

### Day 23-24: 🏢 Platform Analytics (Page 7 — 9 tabs)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 23) | 4 analytics endpoints | Properties, tenants, maintenance, move-out analytics |
| Backend (Day 23) | 3 addon endpoints | Bed occupancy, lease health, property comparison |
| Frontend (Day 24) | 9 tabs | Property, tenant, maintenance, move-out, bed, lease, co-tenant, commercial, property comparison |

**✅ Phase 2 Milestone:** All analytics pages working with real data, all charts rendering

---

## Phase 3 — Operations Pages (Days 25-36)

### Day 25-26: 💵 Rent Management (Page 11)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 25) | `GET /admin/api/platform/rent` | Platform-wide rent data with filters |
| Backend (Day 25) | Rent write APIs | Record manual payment, waive overdue, mark as paid |
| Frontend (Day 26) | Full page | KPI cards, bar chart, payment table, overdue list, write action modals |

### Day 27: 🏠 Properties (Page 12)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | Browse endpoint + transfer API | Property list with filters + ownership transfer |
| Frontend (PM) | Full page | KPI row, data table, click-through, add/edit/delete, transfer modal |

### Day 28: 👤 Tenants (Page 13)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | Browse endpoint + write APIs | Tenant list, edit details, extend lease, adjust rent |
| Frontend (PM) | Full page | KPI cards, distribution chart, data table, detail view, write action modals |

### Day 29: 🔧 Maintenance Ops (Page 14)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | `GET /admin/api/platform/maintenance` | Cross-platform maintenance queries |
| Frontend (PM) | Full page | Query table, filters, detail view, status update actions |

### Day 30: 🚪 Move-Out Ops (Page 15)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | `GET /admin/api/platform/move-outs` | Cross-platform move-out requests |
| Frontend (PM) | Full page | Request table, pending queue, approve/decline actions |

### Day 31-32: 📩 Support & Suggestions (Page 16)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 31) | Support APIs | List queries, respond, close, assign |
| Backend (Day 31) | Suggestion APIs | List, update status pipeline |
| Frontend (Day 32) | Tab 1: Support | KPI cards, ticket table, detail slide-over, respond form |
| Frontend (Day 32) | Tab 2: Suggestions | Kanban pipeline, table view, category chart |

### Day 33-34: 🔔 Notifications (Page 17)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 33) | Broadcast + template APIs | Send, recall, create templates |
| Backend (Day 33) | Delivery analytics API | Channel stats, failure rates |
| Frontend (Day 34) | Broadcast form | Title, message, target filters, channel selection |
| Frontend (Day 34) | Analytics + history | Delivery health tab, device engagement tab, notification log |

### Day 35: 👷 Staff Overview (Page 19)
| Side | Task | Details |
|------|------|---------|
| Backend (AM) | `GET /admin/api/platform/staff` | Cross-platform staff data |
| Frontend (PM) | Full page | Staff table, detail view, permissions heatmap, CRUD actions |

### Day 36: 📊 Admin Users & Audit (Page 18)
| Side | Task | Details |
|------|------|---------|
| Backend | None needed | All admin user + audit log APIs already exist ✅ |
| Frontend | Full page | Admin table, create/edit modals, audit log timeline, entity audit trail tab |

**✅ Phase 3 Milestone:** All operations pages working — full CRUD across the platform

---

## Phase 4 — System & Advanced (Days 37-44)

### Day 37-38: ⚙️ System Settings (Page 20)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 37) | System APIs | Jobs monitor, security monitor, API performance, BullMQ stats, cache clear, maintenance schedule |
| Frontend (Day 38) | System health | Server/DB/Redis status indicators, error logs, API volume chart |
| Frontend (Day 38) | Feature flags | Module toggles, maintenance message |
| Frontend (Day 38) | 4 addon tabs | Job monitor, security, API performance, BullMQ queue |

### Day 39-40: 📑 Reports Builder (Page 21)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 39) | `POST /admin/api/reports/generate` | Dynamic report query builder, PDF/CSV/Excel export |
| Backend (Day 39) | `GET /admin/api/reports/templates` | Saved report templates, scheduling |
| Frontend (Day 40) | Report builder UI | Metric selector, date range, grouping, live preview, export buttons, save/schedule |

### Day 41-42: 🔴 Real-Time Event Feed (Overview Addon)
| Side | Task | Details |
|------|------|---------|
| Backend (Day 41) | Socket.io server setup | Emit events from [notification.emitter.ts](file:///d:/Techwara/RentSpace-Server/src/modules/notifications/notification.emitter.ts) to WebSocket |
| Backend (Day 41) | Event types | New signup, payment, churn, ticket, job failure |
| Frontend (Day 42) | Live feed on Overview | Scrolling event list, color-coded, pause/resume, filter chips |
| Frontend (Day 42) | Socket.io client | Connect, reconnect, error handling |

### Day 43-44: 🧮 Churn Risk Engine + Health Score
| Side | Task | Details |
|------|------|---------|
| Backend (Day 43) | Churn risk calculation job | 7-signal model, compute scores, cache in `churnRiskScore` field |
| Backend (Day 43) | `GET /admin/api/platform/accounts/:id/churn` | Detailed signal breakdown |
| Frontend (Day 44) | Churn risk card on landlord profile | Traffic light badge, 7-signal breakdown table |
| Frontend (Day 44) | At-Risk tab on landlords page | Filtered view, sorted by risk score |
| Frontend (Day 44) | Account health score algorithm | Compute and display on all account views |

**✅ Phase 4 Milestone:** System monitoring, reports, real-time feed, and churn prediction all working

---

## Phase 5 — Polish & Ship (Days 45-50)

### Day 45-46: Testing & Bug Fixes
| Task | Details |
|------|---------|
| E2E test critical flows | Login → Overview → Landlord Profile → Action → Audit Log |
| Fix UI issues | Responsive breakpoints, loading states, empty states, error states |
| Performance | Lazy load heavy chart pages, optimize API queries |

### Day 47-48: Role-Based Access
| Task | Details |
|------|---------|
| SUPER_ADMIN | Full access to everything |
| SUPPORT | Only support tickets, notifications, read-only analytics |
| READ_ONLY | Analytics pages only, no write actions |
| Test each role | Login as each role, verify sidebar + page access |

### Day 49-50: Final Polish
| Task | Details |
|------|---------|
| Loading skeletons | Shimmer effects on all pages during data load |
| Empty states | Friendly messages when tables have no data |
| Keyboard shortcuts | `Cmd+K` global search (optional) |
| Deploy | Vercel or Docker — set up CI/CD |

**✅ FINAL MILESTONE:** Dashboard fully deployed and accessible

---

## Summary Timeline

| Phase | Days | Calendar | What's Done After |
|-------|:----:|----------|-------------------|
| **Phase 0** | 1-3 | Week 0 | Setup done, empty shell running |
| **Phase 1** | 4-12 | Week 1-2 | Login + Overview + Landlords + Alerts = **core dashboard working** |
| **Phase 2** | 13-24 | Week 3-5 | All analytics pages with real data |
| **Phase 3** | 25-36 | Week 6-8 | All operations pages with CRUD |
| **Phase 4** | 37-44 | Week 9-10 | System settings, reports, real-time, churn engine |
| **Phase 5** | 45-50 | Week 11-12 | Polish, testing, roles, deploy |

> [!TIP]
> **After Day 12 (end of Phase 1), you already have a USABLE dashboard** with login, overview, landlord management, and alerts. Everything after that is adding more pages to an already-working product.
