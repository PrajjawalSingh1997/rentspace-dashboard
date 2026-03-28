---
trigger: always_on
glob:
description: RentSpace Super Admin Dashboard development rules and project brain
---

# RentSpace Super Admin Dashboard — AI Development Brain

This repository contains the **RentSpace Super Admin Dashboard**.

The project consists of:

- 22 dashboard pages
- ~96 backend APIs
- 67 admin write actions
- analytics dashboards and platform control panels

The AI must always follow the architecture and rules defined in the project documentation.

Project documentation is located in:

docs/implementation_plan.md
docs/techstack_analysis.md
docs/development_plan.md
docs/development_rules.md
docs/tasks.md

Before generating any code the AI should reference these documents.

---

# DEVELOPMENT APPROACH

This project follows **Vertical Slice Development**.

For every feature:

1. Implement backend API
2. Implement service logic
3. Implement validation
4. Implement frontend UI
5. Connect API to frontend
6. Verify functionality

Never build frontend UI before the backend API exists.

---

# PROJECT ARCHITECTURE

## Backend

Backend stack:

Node.js  
Express 5  
TypeScript  
Prisma ORM  
PostgreSQL  
Redis  
BullMQ  

The backend already contains a large modular architecture.

New dashboard APIs must be placed under:

src/modules/admin/

Submodules allowed:

analytics/
platform/
alerts/
reports/
notifications/
shared/

Never create new modules outside this structure.

Existing modules must not be modified unless explicitly requested.

---

# MODULE STRUCTURE RULE

Every admin module must contain exactly these files:

[name].routes.ts  
[name].controller.ts  
[name].service.ts  
[name].validation.ts  

Example:

src/modules/admin/analytics/

analytics.routes.ts  
analytics.controller.ts  
analytics.service.ts  
analytics.validation.ts  

Never introduce alternative structures.

---

# CONTROLLER RULES

Controllers handle HTTP logic only.

Every controller must:

• be an async arrow function  
• use try/catch  
• call service functions for logic  
• return responses via sendSuccessResponse  
• return errors via sendErrorResponse  

Controllers must also:

• log errors using log.error  
• include audit logging for write actions  
• include JSDoc describing route and function  

Controllers must never:

• perform Prisma queries  
• contain business logic  
• access database directly.

---

# SERVICE RULES

Services handle business logic.

Services must:

• perform Prisma queries  
• return typed results  
• throw AppError for business failures  
• use Promise.all for parallel queries  
• select only required fields  

Services must never:

• use Request or Response objects  
• return HTTP responses  
• contain Express logic.

---

# VALIDATION RULES

All input validation must use **Zod**.

Validation schemas must be placed in:

[name].validation.ts

Rules:

• use z.object() schemas  
• use z.nativeEnum for Prisma enums  
• transform query parameters to numbers when needed  
• export inferred types using z.infer  

Controllers must not perform manual validation.

---

# ROUTE RULES

All dashboard APIs must live under:

/admin/api/

Route structure example:

GET /admin/api/analytics/overview  
GET /admin/api/platform/accounts  
PATCH /admin/api/alerts/:id  

Every route must include middleware chain:

authenticateAdmin  
validation middleware  
RBAC middleware  
controller handler

---

# DATABASE RULES

Database access must always use **Prisma**.

Rules:

• avoid raw SQL unless necessary  
• always select only required fields  
• always include orderBy when listing data  
• use indexes when querying large tables  

Prisma schema must not be modified unless explicitly instructed.

---

# FRONTEND ARCHITECTURE

Frontend stack:

Next.js 14 (App Router)  
TypeScript  
TailwindCSS  
Shadcn UI  
TanStack Query  
TanStack Table  
Recharts  
Zustand  

Dashboard pages are located in:

src/app/(dashboard)/

Examples:

overview/  
alerts/  
growth/  
revenue/  
subscriptions/  
platform/  
accounts/  
users/  
plans/  
rent/  
properties/  
tenants/  
maintenance/  
move-outs/  
support/  
notifications/  
admin-users/  
staff/  
settings/  
reports/

---

# FRONTEND DEVELOPMENT RULES

All pages must:

• use React Server Components where possible  
• fetch data via TanStack Query  
• use reusable UI components  
• display loading skeletons  
• include error states  
• use charts via Recharts  
• use tables via TanStack Table  

Frontend must not directly call database logic.

---

# ADMIN SECURITY RULES

Admin routes require authentication.

Use middleware:

authenticateAdmin

RBAC rules:

GET endpoints → allowAllAdmins  
POST/PATCH/DELETE → requireSuperAdmin  

All write actions must create audit logs.

---

# PERFORMANCE RULES

Analytics queries should:

• use Redis caching (5–10 minute TTL)  
• avoid full table scans  
• aggregate using Prisma groupBy  

Heavy operations should use background jobs when needed.

---

# LOGGING RULES

Never use console.log.

Use project loggers:

log.error  
log.app.info  
log.security  
log.performance  

All write actions must create an audit log entry.

---

# IMPORTANT DEVELOPMENT SAFETY RULES

The AI must never:

• rewrite large sections of existing code without request  
• refactor existing working modules  
• change project architecture  
• create duplicate modules  
• invent new API patterns  

When unsure, the AI should ask for clarification.

---

# HOW NEW FEATURES SHOULD BE BUILT

When asked to build a feature:

1. Read implementation_plan.md
2. Read development_plan.md
3. Identify the correct module
4. Create backend API
5. Create service logic
6. Create validation schema
7. Implement frontend page
8. connect APIs to UI
9. verify the feature works

---

# EXPECTED AI BEHAVIOR

The AI should behave like a **senior full-stack engineer** responsible for maintaining the architecture of the RentSpace platform.

It should prioritize:

code quality  
maintainability  
clear architecture  
strict rule adherence.

