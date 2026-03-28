// src/features/system/services/system.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { SystemHealthData, QueueInfo, SecurityEventItem } from '../api/use-system-management';

export const SystemService = {
    async getHealth() {
        const { data } = await api.get<ApiResponse<SystemHealthData>>('/admin/api/system/health');
        return data.data;
    },
    async getJobs() {
        const { data } = await api.get<ApiResponse<{ queues: QueueInfo[] }>>('/admin/api/system/jobs');
        return data.data;
    },
    async getSecurityEvents(params?: { page?: number; limit?: number }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString();
        if (params?.limit) qp.limit = params.limit.toString();
        const { data } = await api.get<ApiResponse<{ data: SecurityEventItem[]; pagination: any }>>('/admin/api/system/security', { params: qp });
        return data.data;
    },
    async getApiPerformance() {
        const { data } = await api.get<ApiResponse<any>>('/admin/api/system/api-performance');
        return data.data;
    },
    async getQueueStats() {
        const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/admin/api/system/queue');
        return data.data;
    },
    async clearCache() {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/system/cache-clear');
        return data; // res.data was expected
    },
    async scheduleMaintenance(payload: { startTime: string; endTime: string; message: string }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/system/maintenance-schedule', payload);
        return data; // res.data was expected
    }
};
