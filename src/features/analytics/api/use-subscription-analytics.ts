import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';

export interface SubscriptionKPIs {
    total: number;
    active: number;
    trial: number;
    expired: number;
    cancelled: number;
    totalRevenue: number;
}

export interface PlanStat {
    planId: string;
    planName: string;
    planCode: string;
    subscribers: number;
    revenue: number;
}

export interface StatusStat {
    status: string;
    count: number;
    revenue: number;
}

export interface CycleStat {
    cycle: string;
    count: number;
}

export interface ExpiringSub {
    id: string;
    status: string;
    endsAt: string;
    billingCycle: string;
    priceAtPurchase: number;
    totalAmount: number;
    account: { id: string; accountName: string | null; accountEmail: string | null };
    plan: { id: string; name: string; code: string };
}

export interface SubscriptionAnalyticsResponse {
    kpis: SubscriptionKPIs;
    planDistribution: PlanStat[];
    statusBreakdown: StatusStat[];
    billingCycles: CycleStat[];
    expiringSoon: ExpiringSub[];
}

export function useSubscriptionAnalytics(billingCycle?: string) {
    return useQuery({
        queryKey: ['analytics', 'subscriptions', { billingCycle }],
        queryFn: async () => {
            return await AnalyticsService.getSubscriptions(billingCycle);
        },
        staleTime: 5 * 60 * 1000,
    });
}
