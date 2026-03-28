---
trigger: always_on
---

# RentSpace Dashboard — Page Completion Checklist

> **MANDATORY:** Every dashboard page MUST pass ALL checks in this checklist before it is marked as complete.
> After checking each check, make a artifact marking whereall each checks are implemented.
> Follow this checklist in exact order, page by page, starting from Login.

---

## WORKFLOW (Per Page)

```
Step 1 → Manual Verification (all components working?)
Step 2 → UI Polish (user-requested changes)
Step 3 → Final Touchup (this checklist — every rule below)
Step 4 → Documentation Update (README, Postman)
```

---

## SECTION A: FUNCTIONAL VERIFICATION

- **A1 — Component Check:** Manually visit the page and verify every interactive element works (buttons, modals, filters, search, pagination, tabs, dropdowns, form submissions).
- **A2 — API Workflow Audit:** Trace each API call on the page — verify where data comes from, which service function is called, which Prisma query runs, and what data is returned. Document the flow.
- **A3 — Rate Limit Check:** Verify rate limiting is applied on every API endpoint used by the page. Test by sending rapid requests and confirming `429 Too Many Requests` fires.
- **A4 — Migration Check:** Verify if the page requires any Prisma schema changes. If yes, run `npx prisma migrate dev` and confirm the migration succeeds before proceeding.

---

## SECTION B: BACKEND QUALITY

- **B1 — Error Handling:** Every API endpoint MUST have proper `try/catch`, use `AppError` for business errors, and return structured error responses via `sendErrorResponse`. No raw `res.json()` errors.
- **B2 — Logging:** Every controller MUST use `log.error(error, { service, action })` in catch blocks. Every write action MUST call `logAdminAction()` for audit trail. Zero `console.log` usage.
- **B3 — Centralized Constants:** All error codes, messages, status codes, and magic numbers MUST come from centralized constant files (`src/errors/`, `src/config/constants.ts`). No hardcoded strings or numbers in controllers/services.
- **B4 — Folder Structure:** Verify the module follows the exact structure: `[name].routes.ts`, `[name].controller.ts`, `[name].service.ts`, `[name].validation.ts`. No loose files, no alternative patterns.
- **B5 — No Code Repetition:** Check for duplicated logic across services. Extract shared patterns into `admin/shared/` utilities. If two services do the same query pattern, abstract it.
- **B6 — DB Optimization:** Verify Prisma queries use `select` (not full model returns), `orderBy` is present on list queries, `Promise.all` is used for parallel queries, and appropriate indexes exist for filtered/sorted columns.
- **B7 — Security Audit:** Check for data leakage — ensure API responses don't expose passwords, tokens, internal IDs, or sensitive fields. Verify `select` explicitly picks safe fields. Verify RBAC middleware is applied (GET → `allowAllAdmins`, POST/PATCH/DELETE → `requireSuperAdmin`).
- **B8 — Validation:** Every POST/PATCH endpoint MUST have Zod validation via `validate()` middleware. Every GET with query params MUST use `validateQuery()`. No manual validation in controllers.
- **B9 — Global Rate Security Check:** Verify that the API routes are covered by the Global API Rate Limiter (e.g., 500 req/min per IP) to prevent data scraping. Evaluate if any specific endpoint requires an even stricter custom rate limit (like auth routes) and apply it.
- **B10 — Redis Analytics Caching:** Evaluate the nature of the GET endpoint's data. If it returns aggregated metrics, charts, or heavy dashboard analytics, it MUST implement Redis caching with a 5-10 minute TTL. If it returns real-time operational data (e.g., viewing a specific tenant profile or active support ticket), verify it explicitly BYPASSES caching to remain strictly real-time.
- **B11 — BullMQ Bulk Operations:** Evaluate the weight of the POST/PATCH/DELETE endpoint. If it performs a heavy "bulk" action or massive data export (e.g., exporting 10,000 users to CSV, bulk generating rent invoices), the controller MUST NOT process it synchronously. It MUST dispatch a job to BullMQ and immediately return a `202 Accepted` response. The frontend must then handle this async state (e.g., showing a "Processing..." toast/bar). Standard, single-record actions remain synchronous.


---

## SECTION C: FRONTEND QUALITY

- **C1 — API Calls Centralized:** All API calls for a page MUST be in one file (e.g., `features/[domain]/api/use-[name].ts`). No scattered `axios.get()` calls across components. All use TanStack Query (`useQuery` / `useMutation`).
- **C2 — Reusable UI Components:** Use Shadcn/UI components (Button, Card, Dialog, Table, etc.) — no custom implementations of standard UI patterns. Shared components go in `components/shared/`.
- **C3 — Reusable Code:** Extract repeated logic into custom hooks or utility functions. If the same data transformation appears in 2+ components, move it to a shared utility.
- **C4 — Global CSS:** All styling MUST use TailwindCSS utility classes. No inline `style={}` attributes. No separate `.css` files except `globals.css`. Use `cn()` for conditional classes.
- **C5 — Responsiveness & Adaptiveness:** Page MUST render correctly on desktop (1440px), laptop (1024px), and tablet (768px). Tables scroll horizontally on narrow screens. Cards stack vertically on mobile. Sidebar collapses. Layout adapts to content size dynamically.
- **C6 — Structured State Constants:** Use constants/enums for status values, filter options, tab names, and dropdown options. No hardcoded strings like `"ACTIVE"` scattered in JSX — use `STATUS.ACTIVE` pattern.
- **C7 — Error Crash Prevention:** Every page MUST have error boundaries. Every data-dependent component MUST handle `null`/`undefined` gracefully with optional chaining (`?.`). No unhandled promise rejections.
- **C8 — Loading & Empty States:** Every data-fetching section MUST show skeleton loaders during load and a friendly empty state when no data exists. No blank white screens or raw "undefined" text.
- **C9 — Export Button:** Every page MUST have an export/download button (CSV at minimum). Verify export produces valid output.
- **C10 — Consistency:** Verify visual consistency with other completed pages — same card styles, same table patterns, same button placement, same color scheme, same spacing, same font sizes.
- **C11 — Toast Notifications:** Every mutation (create/update/delete) MUST show a success toast on completion and an error toast on failure. Use `sonner` (`toast.success()` / `toast.error()`).
- **C12 — TypeScript Strict:** No `any` types in components or hooks. All props MUST have TypeScript interfaces. All API response types MUST be defined.
- **C13 — Code Optimization:** Avoid unnecessary re-renders — use `React.memo`, `useMemo`, `useCallback` where appropriate. Lazy load heavy components (`React.lazy` + `Suspense`). No expensive computations inside render. Minimize bundle size.
- **C14 — Debounced Search:** All search inputs MUST be debounced (300ms) to prevent excessive API calls on every keystroke. Use `useDeferredValue` or a custom `useDebounce` hook.
- **C15 — Confirmation Dialogs:** All destructive actions (delete, suspend, bulk operations) MUST show a confirmation dialog before executing. No single-click destructive actions.
- **C16 — Accessibility:** All interactive elements MUST be keyboard accessible. All form fields MUST have labels. All icon-only buttons MUST have `aria-label` or `sr-only` text.
- **C17 — Zero Console Errors:** Page MUST have zero red errors in Chrome DevTools Console. React hydration warnings in dev mode are acceptable but should be noted.
- **C18 — Button Disabled During Mutation:** All submit/action buttons MUST be disabled while a mutation is in-flight (`isPending`). Show spinner or loading text to indicate processing. Prevents double-click duplicate submissions.
- **C19 — URL-Persisted Filters:** Filter state (search, status, page number) SHOULD be persisted in URL query params (`?status=ACTIVE&page=2`) so the page state is shareable and survives refresh.

---

## SECTION D: DOCUMENTATION & FINALIZATION

- **D1 — README Update:** Add all new/modified API endpoints for this page to the backend README with method, path, description, and required auth.
- **D2 — Postman Collection:** Add/update all API endpoints in the Postman collection with example request body, query params, and expected response.
- **D3 — Environment Variables:** If any new env vars were added, document them in the README and `.env.example`.

---

## CHECKLIST TEMPLATE (Copy Per Page)

```markdown
### Page: [PAGE NAME]

**A — Functional**
- [ ] A1: All components manually verified
- [ ] A2: API workflow documented
- [ ] A3: Rate limits verified
- [ ] A4: Migration check done

**B — Backend**
- [ ] B1: Error handling verified
- [ ] B2: Logging verified
- [ ] B3: Constants centralized
- [ ] B4: Folder structure correct
- [ ] B5: No code repetition
- [ ] B6: DB optimized
- [ ] B7: Security audit passed
- [ ] B8: Validation complete
- [ ] B9: Global rate limits enforced
- [ ] B10: Redis caching applied to analytics
- [ ] B11: BullMQ used for heavy bulk actions


**C — Frontend**
- [ ] C1: API calls centralized
- [ ] C2: Reusable UI components
- [ ] C3: Reusable code/hooks
- [ ] C4: Global CSS only
- [ ] C5: Responsive & adaptive
- [ ] C6: State constants used
- [ ] C7: Error crashes prevented
- [ ] C8: Loading & empty states
- [ ] C9: Export button present
- [ ] C10: Visual consistency
- [ ] C11: Toast notifications
- [ ] C12: TypeScript strict
- [ ] C13: Code optimized
- [ ] C14: Search debounced
- [ ] C15: Confirmation dialogs
- [ ] C16: Accessibility
- [ ] C17: Zero console errors
- [ ] C18: Buttons disabled during mutation
- [ ] C19: URL-persisted filters

**D — Documentation**
- [ ] D1: README updated
- [ ] D2: Postman updated
- [ ] D3: Env vars documented
```