import { useQuery } from '@tanstack/react-query';
import { PlansService } from '../services/plans.service';

export interface Plan {
    id: string;
    name: string;
    code: string;
    maxProperties: number | null;
    pricePerTenant: number;
    isActive: boolean;
}

export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            return await PlansService.getPlans();
        },
        staleTime: 5 * 60 * 1000,
    });
}
