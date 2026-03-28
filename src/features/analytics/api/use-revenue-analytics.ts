import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';

// --- Revenue Analytics ---

export interface RevenueKPIs {
    totalCollected: number;
    totalDue: number;
    mrr: number;
    overdueAmount: number;
    overdueCount: number;
    collectionRate: number;
}

export interface RentPerMonth {
    period: string;
    amount: number;
}

export interface RevenueAnalyticsResponse {
    kpis: RevenueKPIs;
    rentPerMonth: RentPerMonth[];
}

export function useRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    return useQuery({
        queryKey: ['analytics', 'revenue', { period }],
        queryFn: async () => {
            return await AnalyticsService.getRevenue(period);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Payment Analytics ---

export interface PaymentMode {
    mode: string;
    count: number;
    amount: number;
}

export interface OrderStatus {
    status: string;
    count: number;
    amount: number;
}

export interface PaymentProvider {
    provider: string;
    count: number;
    amount: number;
}

export interface PaymentAnalyticsResponse {
    paymentModes: PaymentMode[];
    orderStatuses: OrderStatus[];
    providers: PaymentProvider[];
    rates: {
        successRate: number;
        failureRate: number;
        totalOrders: number;
    };
}

export function usePaymentAnalytics(provider?: string) {
    return useQuery({
        queryKey: ['analytics', 'payments', { provider }],
        queryFn: async () => {
            return await AnalyticsService.getPayments(provider);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Rent Revisions ---

export interface RentRevisionItem {
    id: string;
    accountId: string;
    contractId: string;
    previousAmount: number;
    newAmount: number;
    effectiveFrom: string;
    reason: string | null;
    createdAt: string;
    contract: {
        id: string;
        tenant: { id: string; name: string | null };
        unit: { id: string; unitNumber: string | null };
    };
}

export interface RentRevisionsResponse {
    data: RentRevisionItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: {
        totalRevisions: number;
        avgRevisionPct: number;
    };
}

export function useRentRevisions(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ['analytics', 'rent-revisions', { page, limit }],
        queryFn: async () => {
            return await AnalyticsService.getRentRevisions(page, limit);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Reconciliation ---

export interface ReconciliationItem {
    rentPaymentId: string;
    tenantName: string | null;
    propertyName: string | null;
    unitNumber: string | null;
    expectedAmount: number;
    paidAmount: number;
    transactionTotal: number;
    difference: number;
    status: string;
    transactionCount: number;
}

export interface ReconciliationResponse {
    month: number;
    year: number;
    summary: { total: number; matched: number; mismatched: number; pending: number };
    items: ReconciliationItem[];
}

export function useReconciliation(month?: number, year?: number) {
    return useQuery({
        queryKey: ['analytics', 'reconciliation', { month, year }],
        queryFn: async () => {
            return await AnalyticsService.getReconciliation(month, year);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Rent Cycle ---

export interface RentCycleStatus {
    status: string;
    count: number;
    totalRent: number;
    totalPaid: number;
}

export interface RentCycleResponse {
    cycle: { month: number; year: number };
    totalPayments: number;
    proratedCount: number;
    statusBreakdown: RentCycleStatus[];
    overdueAging: Record<string, number>;
}

export function useRentCycle(period: 'current' | 'previous' = 'current') {
    return useQuery({
        queryKey: ['analytics', 'rent-cycle', { period }],
        queryFn: async () => {
            return await AnalyticsService.getRentCycle(period);
        },
        staleTime: 5 * 60 * 1000,
    });
}
