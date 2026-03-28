---
trigger: always_on
description: RentSpace dashboard global development rules
---

# RentSpace Dashboard Brain

This repository contains the RentSpace Super Admin Dashboard.

The AI must understand the project using the following documents:

docs/implementation_plan.md
docs/techstack_analysis.md
docs/development_plan.md
docs/development_rules.md
docs/tasks.md

Always read these documents before generating code.

---

## CURRENT DEVELOPMENT PHASE: CYCLE 2 (OPTIMIZATION & CORRECTION)

**CRITICAL CONTEXT FOR AI:**
The basic structure, UI layout, and backend APIs for all 22 dashboard pages are **ALREADY BUILT**. We are no longer building these features from scratch. 

When instructed to move to a new page or build a feature, the AI MUST assume the base code already exists. The AI must:
1. First, `view_file` the existing backend API controllers/services and the frontend UI components for that specific page.
2. Evaluate them strictly against the `page-completion-checklist.md`.
3. Refactor, optimize, and correct the existing code to achieve 100% compliance with the checklist (e.g., adding Redis caching, fixing Prisma `select` queries, adding Skeleton loaders).

*Note: The original "Development Strategy" and "How New Features Should Be Built" rules below still apply if we actually need to invent a brand new, non-existent module/feature.*

---

---

## Development Strategy

Follow vertical slice development:

Backend API → Frontend UI → Completed feature.

Never build UI without API.

---

## Project Structure

Backend:

src/modules/admin/

analytics
platform
alerts
reports
notifications
shared

Frontend:

src/app/(dashboard)/

overview
alerts
growth
revenue
subscriptions
platform
accounts
users
plans
rent
properties
tenants
maintenance
move-outs
support
notifications
admin-users
staff
settings
reports

---

## Coding Rules

Follow the rules defined in:

docs/development_rules.md

These rules are mandatory.


---

## Important Instructions

1 Never break existing folder structure.

2 Never modify working modules unless explicitly requested.

3 Always implement backend before frontend.

4 Always follow Prisma schema.

5 Always use Zod validation.

6 Always follow controller/service architecture.

---

## When generating new features

Process:

1 Read implementation_plan.md
2 Read development_plan.md
3 Identify the next page to implement
4 Generate backend API
5 Generate frontend UI
6 Connect APIs
7 Verify functionality