import { useQuery } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import type { UserListQuery, UserListResponse, PaginatedResponse } from '@/types/api';
export type { UserListQuery, UserListResponse, PaginatedResponse };

export function useUsers(query: UserListQuery = {}) {
    return useQuery({
        queryKey: ['users', query],
        queryFn: async () => {
            const resData = await UsersService.getUsers(query);

            // Backend returns: { success: true, data: { data: [...users], pagination: { total, page, limit, totalPages } } }
            const rawItems = (resData.data || resData.items || []) as Array<Record<string, unknown> & { _count?: { memberships?: number; tenants?: number } }>;
            const pagination = (resData.pagination || {}) as Record<string, number>;

            const mappedItems: UserListResponse[] = rawItems.map((item) => ({
                id: item.id as string,
                name: (item.name as string) || null,
                email: (item.email as string) || null,
                phone: (item.phone as string) || null,
                isActive: item.isActive as boolean,
                createdAt: item.createdAt as string,
                membershipCount: item._count?.memberships || 0,
                tenantCount: item._count?.tenants || 0,
            }));

            return {
                items: mappedItems,
                total: pagination.total ?? rawItems.length,
                page: pagination.page ?? (query.page || 1),
                limit: pagination.limit ?? (query.limit || 10),
                totalPages: pagination.totalPages ?? 1,
            } as PaginatedResponse<UserListResponse>;
        },
        staleTime: 60 * 1000,
    });
}
