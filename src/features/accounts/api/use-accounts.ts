import { useQuery } from '@tanstack/react-query';
import type { AccountListQuery, AccountListResponse, PaginatedResponse } from '@/types/api';
export type { AccountListQuery, AccountListResponse, PaginatedResponse };
import { AccountsService } from '../services/accounts.service';

export function useAccounts(query: AccountListQuery = {}) {
    return useQuery({
        queryKey: ['accounts', query],
        queryFn: async () => {
            const data = await AccountsService.getAccounts(query);
            
            // Backend returns: { success: true, data: { data: [...accounts], pagination: { total, page, limit, totalPages } } }
            const resData = data as any;
            const rawItems = resData.data || resData.items || [];
            const pagination = resData?.pagination || {};

            const mappedItems: AccountListResponse[] = rawItems.map((item: Record<string, unknown>) => ({
                id: item.id as string,
                name: item.accountName as string,
                email: item.accountEmail as string,
                phone: (item.accountPhone as string) || null,
                status: item.status as 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CLOSED',
                plan: (item.plan as Record<string, unknown>)?.name as string || (item.planId as string) || 'Free',
                churnRiskScore: (item.churnRiskScore as number) || null,
                createdAt: item.createdAt as string,
                propertyCount: (item._count as Record<string, number>)?.properties || 0,
                tenantCount: (item._count as Record<string, number>)?.tenants || 0,
            }));

            return {
                items: mappedItems,
                total: pagination.total ?? rawItems.length,
                page: pagination.page ?? (query.page || 1),
                limit: pagination.limit ?? (query.limit || 10),
                totalPages: pagination.totalPages ?? 1,
            } as PaginatedResponse<AccountListResponse>;
        },
        staleTime: 60 * 1000, // 1 minute
    });
}
