import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '../services/notifications.service';

// --- Types ---
export interface DeliveryItem {
    id: string;
    channel: string;
    status: string;
    queuedAt: string | null;
    sentAt: string | null;
    deliveredAt: string | null;
    failedAt: string | null;
    failureReason: string | null;
    retryCount: number;
    createdAt: string;
    notification: { title: string; type: string; category: string };
}

export interface DeliveryKPIs { total: number; sent: number; delivered: number; failed: number; pending: number }
export interface ChannelBreakdown { channel: string; count: number }

export interface DeliveryAnalyticsResponse {
    data: DeliveryItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: DeliveryKPIs;
    channelBreakdown: ChannelBreakdown[];
}

export interface HistoryItem {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    category: string;
    severity: string;
    groupKey: string | null;
    isRead: boolean;
    sentAt: string | null;
    createdAt: string;
    _count: { deliveries: number };
}

export interface HistoryResponse {
    data: HistoryItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

// --- Hooks ---
export function useDeliveryAnalytics(params?: { page?: number; limit?: number; channel?: string; status?: string }) {
    return useQuery({
        queryKey: ['notifications', 'delivery', params],
        queryFn: async () => {
            return await NotificationsService.getDeliveryAnalytics(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useNotificationHistory(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    return useQuery({
        queryKey: ['notifications', 'history', params],
        queryFn: async () => {
            return await NotificationsService.getHistory(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useSendBroadcast() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: {
            title: string; message: string;
            channels: string[]; category?: string; severity?: string;
            targetAccountIds?: string[]; targetUserIds?: string[];
            scheduledFor?: string;
        }) => {
            return await NotificationsService.sendBroadcast(payload);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useRecallBroadcast() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { groupKey: string; reason: string }) => {
            return await NotificationsService.recallBroadcast(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    });
}
