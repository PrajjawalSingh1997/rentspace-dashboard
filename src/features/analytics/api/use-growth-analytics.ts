import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';

// --- Growth Trends ---

export interface GrowthTrend {
    period: string;
    signups: number;
    churns: number;
    net: number;
}

export interface GrowthAnalyticsResponse {
    trends: GrowthTrend[];
    totals: Record<string, number>;
}

export function useGrowthAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly', startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['analytics', 'growth', { period, startDate, endDate }],
        queryFn: async () => {
            return await AnalyticsService.getGrowth(period, startDate, endDate);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Cohort Analysis ---

export interface CohortRetention {
    month: number;
    retained: number;
    rate: number;
}

export interface CohortRow {
    cohort: string;
    size: number;
    retention: CohortRetention[];
}

export interface CohortAnalysisResponse {
    type: string;
    months: number;
    matrix: CohortRow[];
}

export function useCohortAnalysis(cohortType: 'retention' | 'revenue' | 'churn' = 'retention', months: number = 6) {
    return useQuery({
        queryKey: ['analytics', 'cohorts', { cohortType, months }],
        queryFn: async () => {
            return await AnalyticsService.getCohorts(cohortType, months);
        },
        staleTime: 15 * 60 * 1000, // 15 min — matches LONG TTL
    });
}

// --- Trial Conversion ---

export interface TrialConversionResponse {
    funnel: {
        totalSignups: number;
        onTrial: number;
        converted: number;
        churned: number;
    };
    rates: {
        conversionRate: number;
        churnRate: number;
        trialRate: number;
    };
}

export function useTrialConversion(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['analytics', 'trial-conversion', { startDate, endDate }],
        queryFn: async () => {
            return await AnalyticsService.getTrialConversion(startDate, endDate);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Multi-Account ---

export interface MultiAccountUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
    _count: { memberships: number };
}

export interface MultiAccountResponse {
    data: MultiAccountUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useMultiAccountUsers(page: number = 1, limit: number = 10, minAccounts: number = 2) {
    return useQuery({
        queryKey: ['analytics', 'multi-account', { page, limit, minAccounts }],
        queryFn: async () => {
            return await AnalyticsService.getMultiAccounts(page, limit, minAccounts);
        },
        staleTime: 5 * 60 * 1000,
    });
}
