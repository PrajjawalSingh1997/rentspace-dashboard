// src/features/alerts/services/alerts.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { AlertListQuery, AlertResponse, PaginatedResponse } from '@/types/api';

export const AlertsService = {
    async getAlerts(query: AlertListQuery = {}) {
        const { data } = await api.get<ApiResponse<{ data?: AlertResponse[]; items?: AlertResponse[]; [key: string]: unknown }>>('/admin/api/alerts', { params: query });
        const resData = data.data;
        const items = resData.data || resData.items || [];
        return { ...resData, items } as PaginatedResponse<AlertResponse>;
    },

    async updateStatus(id: string, status: 'READ' | 'RESOLVED') {
        const { data } = await api.patch<ApiResponse<Record<string, unknown>>>(`/admin/api/alerts/${id}`, { status });
        return data.data;
    },

    async bulkUpdate(alertIds: string[], action: 'MARK_READ' | 'RESOLVE') {
        const { data } = await api.patch<ApiResponse<{ count?: number }>>('/admin/api/alerts/bulk-update', { alertIds, action });
        return data.data;
    }
};
