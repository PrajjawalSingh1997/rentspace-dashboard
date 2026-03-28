import { useQuery } from '@tanstack/react-query';
import { PlansService } from '../services/plans.service';

export interface SubscriptionKPIs {
    totalActiveSubscriptions: number;
    mrr: number;
    churnRate: number;
}

export function useSubscriptionKPIs() {
    return useQuery({
        queryKey: ['subscription-kpis'],
        queryFn: async () => {
            return await PlansService.getSubscriptionKPIs();
        },
        staleTime: 5 * 60 * 1000,
    });
}
