import { useQuery } from '@tanstack/react-query';
import api, { type ApiResponse } from '@/lib/api';

// Matches the backend getOverviewKPIs response type
export interface AnalyticsOverview {
    users: {
        total: number;
    };
    accounts: {
        total: number;
        active: number;
        churned: number;
        churnRate: number;
        activeRatio: number;
    };
    portfolio: {
        properties: number;
        units: number;
        tenants: number;
    };
    financials: {
        totalRentCollected: number;
        mrr: number;
    };
}

export function useOverview(period?: 'daily' | 'weekly' | 'monthly') {
    return useQuery({
        queryKey: ['analytics', 'overview', { period }],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<AnalyticsOverview>>('/admin/api/analytics/overview', {
                params: { period }
            });
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes (matches backend Redis TTL)
    });
}
