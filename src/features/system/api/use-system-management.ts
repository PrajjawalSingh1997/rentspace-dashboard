import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemService } from '../services/system.service';

// --- System Health ---
export interface SystemHealthData {
    server: { status: string; uptime: number; memoryUsage: Record<string, unknown> };
    database: { status: string };
    redis: { status: string };
}

export function useSystemHealth() {
    return useQuery({
        queryKey: ['system', 'health'],
        queryFn: async () => { return await SystemService.getHealth(); },
        refetchInterval: 30 * 1000,
    });
}

// --- Background Jobs ---
export interface QueueInfo { name: string; active: number; waiting: number; completed: number; failed: number }

export function useBackgroundJobs() {
    return useQuery({
        queryKey: ['system', 'jobs'],
        queryFn: async () => { return await SystemService.getJobs(); },
        staleTime: 30 * 1000,
    });
}

// --- Security Events ---
export interface SecurityEventItem { id: string; action: string; ipAddress: string | null; createdAt: string; admin: { name: string; email: string }; }

export function useSecurityEvents(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['system', 'security', params],
        queryFn: async () => {
            return await SystemService.getSecurityEvents(params);
        },
        staleTime: 30 * 1000,
    });
}

// --- API Performance ---
export function useApiPerformance() {
    return useQuery({
        queryKey: ['system', 'api-performance'],
        queryFn: async () => { return await SystemService.getApiPerformance(); },
        staleTime: 60 * 1000,
    });
}

// --- Queue Stats ---
export function useQueueStats() {
    return useQuery({
        queryKey: ['system', 'queue'],
        queryFn: async () => { return await SystemService.getQueueStats(); },
        staleTime: 30 * 1000,
    });
}

// --- Cache Clear ---
export function useClearCache() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => { return await SystemService.clearCache(); },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['system'] }),
    });
}

// --- Maintenance Schedule ---
export function useScheduleMaintenance() {
    return useMutation({
        mutationFn: async (payload: { startTime: string; endTime: string; message: string }) => {
            return await SystemService.scheduleMaintenance(payload);
        },
    });
}
