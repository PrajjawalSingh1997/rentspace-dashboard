# RentSpace Dashboard — Development Rules

> **These rules are MANDATORY.** Read this file + implementation plan + development plan BEFORE writing any code each day. No exceptions.

---

## 📋 Pre-Coding Checklist (EVERY DAY)

Before writing a single line of code:

- [ ] Read today's tasks from [development_plan.md](file:///C:/Users/Prajjawal%20Singh/.gemini/antigravity/brain/05b829dc-e60c-43b2-abb2-305fe4864d87/development_plan.md)
- [ ] Read relevant page section from [implementation_plan.md](file:///C:/Users/Prajjawal%20Singh/.gemini/antigravity/brain/9d3e792c-97e5-456b-b15a-7df230a443ae/implementation_plan.md)
- [ ] Read this entire rules file
- [ ] Check the existing folder structure — don't create new patterns
- [ ] If any improvisation is needed — **ASK FIRST, code later**

---

## 🔴 BACKEND RULES

### Rule B1: Follow the Exact Folder Structure

```
src/modules/admin/
├── [existing files]       ← DO NOT TOUCH
├── analytics/             ← New subfolder
├── platform/              ← New subfolder
├── alerts/                ← New subfolder
├── reports/               ← New subfolder
├── notifications/         ← New subfolder
└── shared/                ← New subfolder
```

Each subfolder MUST have:
```
[name].routes.ts
[name].controller.ts
[name].service.ts
[name].validation.ts
```

> [!CAUTION]
> **NEVER** create files outside this structure. No `helpers/`, no `lib/`, no loose files.

---

### Rule B2: Controller Pattern

Every controller function MUST follow this exact template:

```typescript
/**
 * [Description of what it does]
 * [HTTP_METHOD] [full route path]
 */
export const functionName = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Auth check (if write action)
        if (!req.admin) {
            throw new AppError(AUTH_ERRORS.UNAUTHORIZED);
        }

        // 2. Extract + validate params
        const { id } = req.params;
        if (!id) {
            throw new AppError({
                ...SYSTEM_ERRORS.MISSING_REQUIRED_FIELD,
                details: { field: 'id' },
            });
        }

        // 3. Extract body (for POST/PATCH)
        const data = req.body as TypedInput;

        // 4. Call service
        const result = await serviceFunction(data);

        // 5. Audit log (for write actions)
        await logAdminAction(req.admin.id, 'ACTION_NAME', 'TargetType', id, { key: 'value' }, req);

        // 6. Send response
        sendSuccessResponse(req, res, result, 'Success message', 200, 'SUCCESS_CODE');
    } catch (error: any) {
        log.error(error, { service: 'ControllerName', action: 'functionName' });
        sendErrorResponse(req, res, error, 500, 'INTERNAL_ERROR', 'Failed to do X');
    }
};
```

**Mandatory rules:**
- ✅ Always `async` arrow function, returns `Promise<void>`
- ✅ Always JSDoc with HTTP method + full route path
- ✅ Always wrap entire body in `try/catch`
- ✅ Always `log.error(error, { service: 'X', action: 'Y' })` in catch
- ✅ Always [sendErrorResponse(req, res, error, ...)](file:///d:/Techwara/RentSpace-Server/src/utils/errorResponse.util.ts#7-93) in catch
- ✅ Always audit log for write actions (POST/PATCH/DELETE)
- ✅ Always use [sendSuccessResponse()](file:///d:/Techwara/RentSpace-Server/src/utils/successResponse.util.ts#3-41) for responses
- ❌ Never use `console.log` — use `log.error`, `log.app.info`, `log.audit`
- ❌ Never return raw `res.json()` — always use [sendSuccessResponse](file:///d:/Techwara/RentSpace-Server/src/utils/successResponse.util.ts#3-41)
- ❌ Never swallow errors silently

---

### Rule B3: Service Pattern

```typescript
// Every service function:
// 1. Takes typed parameters
// 2. Does Prisma queries
// 3. Returns typed results
// 4. Throws AppError for business logic failures
// 5. Does NOT handle HTTP (no req/res)

export const getAccounts = async (filters: AccountFilters): Promise<PaginatedResult> => {
    const where: any = {};

    // Build where clause dynamically
    if (filters.status) where.status = filters.status;
    if (filters.search) {
        where.OR = [
            { accountName: { contains: filters.search, mode: 'insensitive' } },
            { accountEmail: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    // Always use Promise.all for parallel queries
    const [data, total] = await Promise.all([
        prisma.account.findMany({
            where,
            select: { ... },             // Always use select, not raw findMany
            orderBy: { createdAt: 'desc' },
            take: filters.limit,
            skip: filters.offset,
        }),
        prisma.account.count({ where }),
    ]);

    return { data, total, ... };
};
```

**Mandatory rules:**
- ✅ Services handle business logic ONLY — no [req](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#67-76), [res](file:///d:/Techwara/RentSpace-Server/src/logs/http.logger.ts#76-90), or HTTP concepts
- ✅ Use `Promise.all` for parallel queries (e.g., data + count)
- ✅ Always use `select` to limit returned fields — never return full models
- ✅ Always `orderBy: { createdAt: 'desc' }` unless specified otherwise
- ✅ Throw [AppError](file:///d:/Techwara/RentSpace-Server/src/errors/AppError.ts#31-70) for business validation (not 500s)
- ✅ Use constants from [config/constants.ts](file:///d:/Techwara/RentSpace-Server/src/config/constants.ts) — no magic numbers
- ❌ Never import [Request](file:///d:/Techwara/RentSpace-Server/src/middleware/validation.middleware.ts#8-11)/[Response](file:///d:/Techwara/RentSpace-Server/src/utils/errorResponse.util.ts#7-93) in services
- ❌ Never catch errors in services unless you need to wrap them

---

### Rule B4: Validation Pattern

```typescript
// File: [name].validation.ts
import { z } from 'zod';
import { SomeEnum } from '../../../../generated/prisma/client.js';

// Body schemas
export const createSomethingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.nativeEnum(SomeEnum),              // Use nativeEnum for Prisma enums
    amount: z.number().positive('Must be positive'),
    note: z.string().optional(),
});

// Query schemas (strings transformed to real types)
export const listSomethingQuerySchema = z.object({
    status: z.nativeEnum(SomeEnum).optional(),
    search: z.string().optional(),
    page: z.string().transform(val => parseInt(val, 10)).optional(),
    limit: z.string().transform(val => parseInt(val, 10)).optional(),
    startDate: z.string().optional(),          // ISO date string
    endDate: z.string().optional(),
});

// ALWAYS export inferred types at bottom
export type CreateSomethingInput = z.infer<typeof createSomethingSchema>;
export type ListSomethingQuery = z.infer<typeof listSomethingQuerySchema>;
```

**Mandatory rules:**
- ✅ One validation file per subfolder
- ✅ Use `z.nativeEnum()` for all Prisma enum fields
- ✅ Query params are always strings → use `.transform()` for numbers/booleans
- ✅ Always export `z.infer<typeof schema>` types at bottom
- ✅ Always include human-readable error messages: `z.string().min(1, 'Name is required')`
- ❌ Never validate in controllers — use [validate()](file:///d:/Techwara/RentSpace-Server/src/middleware/validation.middleware.ts#14-29) middleware in routes

---

### Rule B5: Error Pattern

```typescript
// File: src/errors/[domain].errors.ts
import { ErrorType, ErrorSeverity, type ErrorDefinition } from './errorTypes.js';

export const ANALYTICS_ERRORS = {
    INVALID_DATE_RANGE: {
        status: 400,
        code: 'ANALYTICS_INVALID_DATE_RANGE',
        message: 'Start date must be before end date',
        userMessage: 'Please select a valid date range.',
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.INFO,
    },

    DATA_NOT_AVAILABLE: {
        status: 404,
        code: 'ANALYTICS_DATA_NOT_AVAILABLE',
        message: 'No analytics data found for the given period',
        userMessage: 'No data available for this time period.',
        type: ErrorType.NOT_FOUND,
        severity: ErrorSeverity.INFO,
    },
} as const satisfies Record<string, ErrorDefinition>;
```

**Mandatory rules:**
- ✅ Create new error file in `src/errors/` for each new domain
- ✅ Register it in `src/errors/index.ts` exports
- ✅ Error codes follow format: `DOMAIN_SPECIFIC_ERROR` (e.g., `ANALYTICS_INVALID_DATE_RANGE`)
- ✅ Always include `userMessage` (human-friendly, shown in UI)
- ✅ Always use `as const satisfies Record<string, ErrorDefinition>`
- ✅ Use `ErrorSeverity.INFO` for expected errors, `.WARN` for auth/limits, `.ERROR` for system
- ❌ Never hardcode error messages in controllers — use error constants
- ❌ Never use generic "Something went wrong" — be specific

---

### Rule B6: Route Pattern

```typescript
// File: [name].routes.ts
import { Router } from 'express';
import { authenticateAdmin } from '../../../middleware/adminAuth.middleware.js';
import { requireSuperAdmin, allowAllAdmins } from '../../../middleware/adminRole.middleware.js';
import { validate, validateQuery } from '../../../middleware/validation.middleware.js';
import { someSchema, someQuerySchema } from './[name].validation.js';
import { handler1, handler2 } from './[name].controller.js';

const router = Router();

// ALL routes require admin auth
router.use(authenticateAdmin);

// READ routes — all admins can access
router.get('/', validateQuery(someQuerySchema), allowAllAdmins, handler1);
router.get('/:id', allowAllAdmins, handler2);

// WRITE routes — super admin only
router.post('/', validate(someSchema), requireSuperAdmin, handler3);
router.patch('/:id', validate(updateSchema), requireSuperAdmin, handler4);
router.delete('/:id', requireSuperAdmin, handler5);

export default router;
```

**Mandatory rules:**
- ✅ Middleware chain order: `authenticateAdmin` → `validate/validateQuery` → `RBAC` → `handler`
- ✅ `router.use(authenticateAdmin)` at the top — all dashboard routes are protected
- ✅ GET routes use `allowAllAdmins` — all roles can view
- ✅ POST/PATCH/DELETE routes use `requireSuperAdmin` — only super can write
- ✅ Body validation uses `validate(schema)`
- ✅ Query validation uses `validateQuery(schema)`
- ❌ Never skip authentication middleware
- ❌ Never skip validation middleware for POST/PATCH

---

### Rule B7: Logging

| When | Logger | Example |
|------|--------|---------|
| Error in catch block | `log.error(error, { service, action })` | `log.error(error, { service: 'AnalyticsCtrl', action: 'getGrowth' })` |
| Info about operations | `log.app.info(message, { service, ... })` | `log.app.info('Cache cleared', { service: 'SystemCtrl' })` |
| Audit trail | `logAdminAction(adminId, action, ...)` | Every write operation MUST be audited |
| Security events | `log.security(message, { ... })` | Failed auth, rate limits, suspicious activity |
| Performance | `log.performance(message, { ... })` | Slow queries, long operations |

**Mandatory rules:**
- ✅ Always include `{ service: 'Name', action: 'functionName' }` context
- ✅ Every write action MUST call `logAdminAction()` for audit trail
- ✅ Audit log includes: adminId, action name, target type, target ID, metadata, request
- ❌ Never use `console.log`, `console.error`, `console.warn`

---

### Rule B8: Response Format

Every API response MUST use `sendSuccessResponse`:

```typescript
// Success
sendSuccessResponse(req, res, data, 'Accounts fetched successfully', 200, 'ACCOUNTS_FETCHED');

// Creates
sendSuccessResponse(req, res, newItem, 'Account created', 201, 'ACCOUNT_CREATED');

// Deletes/Actions
sendSuccessResponse(req, res, null, 'Account suspended', 200, 'ACCOUNT_SUSPENDED');
```

Output format:
```json
{
    "success": true,
    "status": 200,
    "code": "ACCOUNTS_FETCHED",
    "message": "Accounts fetched successfully",
    "traceId": "req_abc123",
    "timestamp": "2026-03-09T...",
    "path": "/admin/api/platform/accounts",
    "data": { ... }
}
```

---

### Rule B9: Import Order

Always follow this order in every file, with blank line separators:

```typescript
// 1. Node.js built-ins
import path from 'path';

// 2. External packages
import { Request, Response } from 'express';
import { z } from 'zod';

// 3. Internal - config
import { PAGINATION } from '../../../config/constants.js';

// 4. Internal - errors
import { AppError, AUTH_ERRORS } from '../../../errors/index.js';

// 5. Internal - utils
import { sendSuccessResponse } from '../../../utils/successResponse.util.js';
import { logAdminAction } from '../../../utils/auditLog.util.js';

// 6. Internal - logs
import { log } from '../../../logs/index.js';

// 7. Internal - db
import { prisma } from '../../../db/index.js';

// 8. Local imports
import { someService } from './[name].service.js';
import type { SomeInput } from './[name].validation.js';
```

**Mandatory rules:**
- ✅ Always use `.js` extension in imports (ESM requirement)
- ✅ Use `import type` for type-only imports
- ✅ Always import Prisma types from `generated/prisma/client.js`

---

### Rule B10: Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | `kebab-case` or `camelCase.category.ts` | `analytics.service.ts`, `analytics-cache.util.ts` |
| Functions | `camelCase` | `getGrowthAnalytics`, `listAccounts` |
| Constants | `UPPER_SNAKE_CASE` | `ANALYTICS_ERRORS`, `PAGINATION` |
| Error codes | `DOMAIN_SPECIFIC_ERROR` | `ANALYTICS_INVALID_DATE_RANGE` |
| Interfaces/Types | `PascalCase` | `AccountFilters`, `GrowthData` |
| Route paths | `kebab-case` | `/admin/api/analytics/rent-revisions` |
| Audit actions | `UPPER_SNAKE_CASE` | `ACCOUNT_SUSPENDED`, `RENT_WAIVED` |

---

### Rule B11: Caching

```typescript
import { redis } from '../../../config/redis.js';

// Cache key format: admin:domain:identifier
const CACHE_KEY = `admin:analytics:growth:${period}:${startDate}:${endDate}`;
const CACHE_TTL = 300; // 5 minutes

// Check cache first
const cached = await redis.get(CACHE_KEY);
if (cached) return JSON.parse(cached);

// Query DB
const result = await queryDatabase();

// Set cache
await redis.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL);

return result;
```

**Mandatory rules:**
- ✅ Cache key format: `admin:[domain]:[identifier]:[params]`
- ✅ Use 5 min TTL for analytics, 1 min for real-time data
- ✅ Always `JSON.parse`/`JSON.stringify` cached data
- ✅ Invalidate cache on write operations that affect cached data

---

### Rule B12: Documentation

After completing each page's backend:

- [ ] Update `README.md` — add new endpoints to API section
- [ ] Update Postman collection — add request with example body/params
- [ ] Update `API_TESTING_GUIDE.md` if new testing scenarios needed
- [ ] Add JSDoc comments on every exported function

---

## 🔵 FRONTEND RULES

### Rule F1: Page Structure

Every page MUST follow this structure:

```
src/app/(dashboard)/[page-name]/
├── page.tsx              ← Main page component (server component by default)
├── components/           ← Page-specific components
│   ├── data-table.tsx    ← Table for this page
│   ├── kpi-cards.tsx     ← KPI cards for this page
│   └── filters.tsx       ← Filter panel for this page
└── hooks/                ← Page-specific hooks (optional)
    └── use-page-data.ts  ← TanStack Query hook for this page's API
```

---

### Rule F2: Data Fetching

ALL API calls MUST use TanStack Query:

```typescript
// hooks/use-accounts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// READ — always useQuery
export function useAccounts(filters: AccountFilters) {
    return useQuery({
        queryKey: ['accounts', filters],      // Cache key includes filters
        queryFn: () => api.get('/admin/api/platform/accounts', { params: filters }),
        staleTime: 5 * 60 * 1000,            // Match backend cache TTL
    });
}

// WRITE — always useMutation
export function useSuspendAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.patch(`/admin/api/platform/accounts/${id}/status`, { status: 'SUSPENDED' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });  // Refetch after mutation
            toast.success('Account suspended');
        },
        onError: (error) => {
            toast.error(error.response?.data?.userMessage || 'Failed to suspend account');
        },
    });
}
```

**Mandatory rules:**
- ✅ Every API call goes through TanStack Query — no raw `useEffect` + `fetch`
- ✅ `queryKey` must include all filter parameters for proper caching
- ✅ `staleTime` must match backend Redis cache TTL (5 min for analytics)
- ✅ Mutations must `invalidateQueries` on success to refetch affected data
- ✅ Mutations must show toast on success/error
- ✅ Error display uses `userMessage` from backend response
- ❌ Never call API in `useEffect` — always use `useQuery`/`useMutation`
- ❌ Never store API data in `useState` — TanStack Query IS the state

---

### Rule F3: Component Pattern

```tsx
// Shadcn/UI-based component
'use client'; // Only if component needs interactivity

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;       // Percentage change
    icon: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>{change}%</span>}
            </CardContent>
        </Card>
    );
}
```

**Mandatory rules:**
- ✅ TypeScript interfaces for ALL props — no `any`
- ✅ Server Components by default — add `'use client'` ONLY when needed (state, onClick, etc.)
- ✅ Use Shadcn/UI components — don't build custom buttons, cards, dialogs
- ✅ All components must handle: loading state, error state, empty state
- ❌ Never use inline styles — use TailwindCSS classes
- ❌ Never hardcode strings — use constants or props

---

### Rule F4: Error Handling

```tsx
// Every page must handle 3 states:
function AccountsPage() {
    const { data, isLoading, isError, error } = useAccounts(filters);

    // Loading state
    if (isLoading) return <PageSkeleton />;

    // Error state
    if (isError) return <ErrorAlert message={error.response?.data?.userMessage || 'Failed to load accounts'} />;

    // Empty state
    if (!data?.data?.length) return <EmptyState message="No accounts found" icon={<Users />} />;

    // Normal render
    return <AccountsTable data={data.data} />;
}
```

**Mandatory rules:**
- ✅ Every page handles: loading (skeleton), error (alert), empty (friendly message)
- ✅ Use backend's `userMessage` for error display — not technical messages
- ✅ Loading skeletons must match the page layout shape
- ❌ Never show raw error objects or stack traces to users

---

### Rule F5: Forms & Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAccountSchema, type CreateAccountInput } from '@/types/validation';

function CreateAccountForm() {
    const form = useForm<CreateAccountInput>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: { name: '', email: '' },
    });

    const mutation = useCreateAccount();

    const onSubmit = (data: CreateAccountInput) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Form fields with Shadcn/UI Form components */}
            </form>
        </Form>
    );
}
```

**Mandatory rules:**
- ✅ Always use React Hook Form + Zod resolver
- ✅ Validation schemas should mirror backend Zod schemas (can share types)
- ✅ Always disable submit button during mutation (`mutation.isPending`)
- ✅ Show field-level errors from Zod, toast-level errors from API
- ❌ Never skip client-side validation — double validation (client + server)

---

### Rule F6: State Management

| State Type | Tool | Example |
|-----------|------|---------|
| Server state (API data) | TanStack Query | Account list, analytics data |
| UI state (sidebar, modals) | Zustand | `useSidebarStore`, `useFilterStore` |
| Form state | React Hook Form | Create/edit forms |
| URL state (filters, page) | `useSearchParams` | `?page=2&status=ACTIVE` |

- ❌ Never use `useState` for API data
- ❌ Never use Redux — use Zustand for client state
- ✅ Persist filter selections in URL params for shareable links

---

### Rule F7: Styling

- ✅ Use TailwindCSS utility classes ONLY
- ✅ Dark mode: use `dark:` prefix for all color classes
- ✅ Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- ✅ Use `cn()` utility (from Shadcn) for conditional classes
- ❌ Never use inline styles (`style={{ }}`)
- ❌ Never create separate `.css` files except `globals.css`
- ❌ Never use `!important`

---

### Rule F8: Accessibility

- ✅ All interactive elements must be keyboard accessible
- ✅ All images must have `alt` attributes
- ✅ All form fields must have labels
- ✅ Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`)
- ✅ Color contrast must meet WCAG AA standard
- ✅ Loading/error states must have `aria-live` announcements

---

### Rule F9: Naming Conventions (Frontend)

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | `PascalCase` | `AccountsTable.tsx`, `KPICard.tsx` |
| Hooks | `camelCase` with `use` prefix | `useAccounts.ts`, `useSidebarStore.ts` |
| Utils/lib | `camelCase` | `formatCurrency.ts`, `api.ts` |
| Types | `PascalCase` | `AccountFilters`, `GrowthData` |
| Page folders | `kebab-case` | `admin-users/`, `move-outs/` |
| CSS classes | TailwindCSS only | `className="flex items-center gap-2"` |

---

### Rule F10: Frontend Documentation

- [ ] Every reusable component must have JSDoc with props description
- [ ] Every custom hook must have JSDoc with usage example
- [ ] Page-level components don't need JSDoc (self-documenting via file name)

---

## 🟡 SHARED RULES (Both Backend & Frontend)

### Rule S1: Git Commits

```
feat(admin-analytics): add growth analytics API endpoint
fix(accounts): correct churn score calculation
style(dashboard): fix sidebar alignment on mobile
docs(api): update postman collection for new endpoints
```

Format: `type(scope): description`

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`

---

### Rule S2: Code Completion Checklist

Before marking ANY page as ✅ complete:

**Backend:**
- [ ] All endpoints have Zod validation
- [ ] All endpoints have proper error handling with domain errors
- [ ] All write actions have audit logging
- [ ] All responses use `sendSuccessResponse`
- [ ] Error file created and registered in `errors/index.ts`
- [ ] Endpoints tested manually (Postman or curl)
- [ ] README updated with new endpoints
- [ ] Postman collection updated

**Frontend:**
- [ ] Page handles loading, error, and empty states
- [ ] All data fetching uses TanStack Query
- [ ] All forms use React Hook Form + Zod
- [ ] All mutations show success/error toasts
- [ ] Responsive on desktop and tablet
- [ ] No TypeScript errors
- [ ] No console warnings

---

### Rule S3: When Unsure

> **When in doubt about ANY pattern, convention, or design decision — ASK FIRST.**
>
> It's better to ask a "dumb question" than to write code that breaks consistency.
> Inconsistent code is worse than no code.
