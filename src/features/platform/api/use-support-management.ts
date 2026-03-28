import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface SupportItem {
    id: string;
    queryNumber: string;
    accountId: string;
    queryType: string;
    queryDescription: string;
    status: string;
    responseMessage: string | null;
    respondedAt: string | null;
    assignedTo: string | null;
    createdAt: string;
}

export interface SupportKPIs { totalQueries: number; pending: number; resolved: number }

export interface ListSupportResponse {
    data: SupportItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: SupportKPIs;
}

export function useSupportQueries(params?: { page?: number; limit?: number; status?: string; queryType?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'support', params],
        queryFn: async () => {
            return await PlatformService.getSupportQueries(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useRespondToSupport() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; responseMessage: string }) => {
            return await PlatformService.respondToSupport(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'support'] }),
    });
}

export function useCloseSupport() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; note?: string }) => {
            return await PlatformService.closeSupport(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'support'] }),
    });
}

export function useAssignSupport() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; assignedTo: string }) => {
            return await PlatformService.assignSupport(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'support'] }),
    });
}
