// src/features/notifications/services/notifications.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { DeliveryAnalyticsResponse, HistoryResponse } from '../api/use-notifications-management';

export const NotificationsService = {
    async getDeliveryAnalytics(params?: { page?: number; limit?: number; channel?: string; status?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString();
        if (params?.limit) qp.limit = params.limit.toString();
        if (params?.channel) qp.channel = params.channel;
        if (params?.status) qp.status = params.status;
        const { data } = await api.get<ApiResponse<DeliveryAnalyticsResponse>>('/admin/api/notifications/delivery', { params: qp });
        return data.data;
    },

    async getHistory(params?: { page?: number; limit?: number; category?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString();
        if (params?.limit) qp.limit = params.limit.toString();
        if (params?.category) qp.category = params.category;
        if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<HistoryResponse>>('/admin/api/notifications/history', { params: qp });
        return data.data;
    },

    async sendBroadcast(payload: { title: string; message: string; channels: string[]; category?: string; severity?: string; targetAccountIds?: string[]; targetUserIds?: string[]; scheduledFor?: string; }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/notifications/broadcast', payload);
        return data.data;
    },

    async recallBroadcast({ groupKey, reason }: { groupKey: string; reason: string }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/notifications/recall', { groupKey, reason });
        return data.data;
    }
};
