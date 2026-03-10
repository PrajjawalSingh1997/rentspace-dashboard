// src/types/api.ts
// Shared TypeScript interfaces for API responses

/**
 * Standard paginated response from backend
 * Matches admin/shared/pagination.util.ts format
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Account status enum (matches Prisma AccountStatus)
 */
export type AccountStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "CLOSED";

/**
 * Admin role enum (matches Prisma AdminRole)
 */
export type AdminRole = "SUPER_ADMIN" | "SUPPORT" | "READ_ONLY";

/**
 * Property type enum (matches Prisma PropertyType)
 */
export type PropertyType = "COMMERCIAL" | "APARTMENT" | "PG" | "HOSTEL";

/**
 * Rent status enum (matches Prisma RentStatus)
 */
export type RentStatus = "DUE" | "OVERDUE" | "PARTIALLY_PAID" | "PAID" | "PENDING_APPROVAL";

/**
 * Subscription status enum
 */
export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "PAST_DUE" | "CANCELLED" | "EXPIRED";

/**
 * Maintenance query status enum
 */
export type MaintenanceQueryStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/**
 * Owner query status enum
 */
export type OwnerQueryStatus = "PENDING" | "RESOLVED" | "CANCELLED";

/**
 * Move out request status enum
 */
export type MoveOutRequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED";

/**
 * Alert severity levels
 */
export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO";

/**
 * Date range filter params (used across analytics pages)
 */
export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
    period?: "daily" | "weekly" | "monthly" | "yearly";
}

/**
 * Common list filter params
 */
export interface ListParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

/**
 * Account summary (used in lists and profiles)
 */
export interface AccountSummary {
    id: string;
    accountName: string | null;
    accountEmail: string | null;
    accountPhone: string | null;
    status: AccountStatus;
    totalProperties: number;
    totalTenants: number;
    totalRentAmount: number;
    churnRiskScore: number | null;
    createdAt: string;
    closedAt: string | null;
    plan: {
        id: string;
        name: string;
        code: string;
    } | null;
}

/**
 * Overview KPI data (from GET /admin/api/analytics/overview)
 */
export interface OverviewKPIs {
    totalUsers: number;
    totalAccounts: number;
    totalProperties: number;
    totalUnits: number;
    totalTenants: number;
    totalRentCollected: number;
    mrr: number;
    newSignups: number;
    previousSignups: number;
    churnRate: number;
    activeAccounts: number;
    inactiveAccounts: number;
}
