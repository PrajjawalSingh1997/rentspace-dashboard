import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface MoveOutItem {
    id: string;
    accountId: string;
    contractId: string;
    moveOutDate: string;
    reason: string;
    note: string | null;
    status: string;
    declineReason: string | null;
    declineNote: string | null;
    completedAt: string | null;
    createdAt: string;
    contract: { tenantName: string | null; propertyName: string | null; unitNumber: string | null };
}

export interface MoveOutKPIs {
    totalRequests: number;
    pending: number;
    approved: number;
    declined: number;
}

export interface ListMoveOutsResponse {
    data: MoveOutItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: MoveOutKPIs;
}

// --- Hooks ---
export function useMoveOutRequests(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'move-outs', params],
        queryFn: async () => {
            return await PlatformService.getMoveOutRequests(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useApproveMoveOut() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; note?: string }) => {
            return await PlatformService.approveMoveOut(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'move-outs'] }),
    });
}

export function useDeclineMoveOut() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; declineReason: string; declineNote?: string }) => {
            return await PlatformService.declineMoveOut(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'move-outs'] }),
    });
}
