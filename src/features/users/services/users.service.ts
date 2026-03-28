// src/features/users/services/users.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { UserListQuery } from '@/types/api';

export const UsersService = {
    async getUsers(query: UserListQuery = {}) {
        const params: Record<string, string> = {};
        if (query.page) params.page = String(query.page);
        if (query.limit) params.limit = String(query.limit);
        if (query.isActive !== undefined) params.isActive = String(query.isActive);
        if (query.search) params.search = query.search;
        const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/admin/api/platform/users', { params });
        return data.data as Record<string, unknown>;
    },
    async forceLogout(userId: string) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>(`/admin/api/platform/users/${userId}/force-logout`);
        return data.data;
    },
    async mergeUsers(payload: { sourceUserId: string; targetUserId: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>('/admin/api/platform/users/merge', payload);
        return data.data;
    },
    async resetPassword(userId: string) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>(`/admin/api/platform/users/${userId}/reset-password`);
        return data.data;
    },
    async updateUser(userId: string, field: 'phone' | 'email' | 'name', value: string) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/users/${userId}/${field}`, { [field]: value });
        return data.data;
    }
};
