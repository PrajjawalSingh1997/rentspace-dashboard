// src/types/api.ts
// Shared TypeScript interfaces for API responses

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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
    name: string | null;
    email: string | null;
    phone: string | null;
    status: AccountStatus;
    propertyCount: number;
    tenantCount: number;
    totalRentAmount?: number;
    churnRiskScore: number | null;
    createdAt: string;
    closedAt?: string | null;
    plan: {
        id: string;
        name: string;
        code: string;
    } | string | null;
}

/**
 * Response type for accounts list
 */
export type AccountListResponse = AccountSummary;

export interface UserListQuery extends ListParams {
    role?: string | 'ALL';
    isActive?: boolean | string;
}

export interface UserListResponse {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: string;
    membershipCount: number;
    tenantCount: number;
}

export interface AlertListQuery extends ListParams {
    status?: 'UNREAD' | 'READ' | 'RESOLVED' | 'ALL';
    severity?: AlertSeverity | 'ALL';
}

export interface AlertResponse {
    id: string;
    title: string;
    description: string;
    message?: string;
    source: string;
    severity: AlertSeverity;
    status: 'UNREAD' | 'READ' | 'RESOLVED';
    createdAt: string;
    timestamp: string;
    targetUrl?: string;
    metadata?: Record<string, any>;
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
/**
 * Query parameters for fetching accounts list
 */
export interface AccountListQuery extends ListParams {
    status?: string | 'ALL';
    planId?: string | 'ALL';
    minUsers?: number;
    maxUsers?: number;
    minProperties?: number;
    maxProperties?: number;
}
