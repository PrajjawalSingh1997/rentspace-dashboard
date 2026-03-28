// src/features/admin/services/admin.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { AdminUserItem, AuditLogItem } from '../api/use-admin-management';

export const AdminService = {
    async getUsers(params?: { page?: number; limit?: number; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString();
        if (params?.limit) qp.limit = params.limit.toString();
        if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<{ data: AdminUserItem[]; pagination: Record<string, unknown> }>>('/admin/api/users', { params: qp });
        return data.data;
    },

    async getAuditLogs(params?: { page?: number; limit?: number; action?: string; targetType?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString();
        if (params?.limit) qp.limit = params.limit.toString();
        if (params?.action) qp.action = params.action;
        if (params?.targetType) qp.targetType = params.targetType;
        const { data } = await api.get<ApiResponse<{ data: AuditLogItem[]; pagination: Record<string, unknown> }>>('/admin/api/audit-logs', { params: qp });
        return data.data;
    },

    async createUser(payload: { email: string; password: string; name: string; role?: string }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/users', payload);
        return data.data;
    }
};
