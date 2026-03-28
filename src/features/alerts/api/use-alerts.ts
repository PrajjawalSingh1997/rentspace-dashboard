import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertsService } from '../services/alerts.service';
import { toast } from 'sonner';
import type { AlertListQuery, AlertResponse, PaginatedResponse } from '@/types/api';

export function useAlerts(query: AlertListQuery = {}) {
    return useQuery({
        queryKey: ['alerts', query],
        queryFn: async () => {
            return await AlertsService.getAlerts(query);
        },
        staleTime: 60 * 1000, // 1 min (alerts can be semi-realtime)
    });
}

export function useUpdateAlertStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'READ' | 'RESOLVED' }) => {
            return await AlertsService.updateStatus(id, status);
        },
        onSuccess: (_, variables) => {
            toast.success(`Alert marked as ${variables.status.toLowerCase()}`);
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to update alert');
        }
    });
}

export function useBulkUpdateAlerts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ alertIds, action }: { alertIds: string[]; action: 'MARK_READ' | 'RESOLVE' }) => {
            return await AlertsService.bulkUpdate(alertIds, action);
        },
        onSuccess: (data, variables) => {
            const parsedAction = variables.action === 'MARK_READ' ? 'read' : 'resolved';
            toast.success(`${data.count || variables.alertIds.length} alerts marked as ${parsedAction}`);
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to bulk update alerts');
        }
    });
}
