import { useQuery } from '@tanstack/react-query';
import { AccountsService, type ChurnBreakdown, type ChurnSignal } from '../services/accounts.service';
export type { ChurnBreakdown, ChurnSignal };
export function useChurnBreakdown(accountId: string | undefined) {
    return useQuery({
        queryKey: ['churn', accountId],
        queryFn: async () => {
            return await AccountsService.getChurnBreakdown(accountId!);
        },
        enabled: !!accountId,
        staleTime: 5 * 60 * 1000,
    });
}
