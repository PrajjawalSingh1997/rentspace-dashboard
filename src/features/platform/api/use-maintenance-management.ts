import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface MaintenanceItem {
    id: string;
    accountId: string;
    tenantName: string | null;
    propertyName: string | null;
    unitNumber: string | null;
    issueType: string;
    issueName: string;
    issueDescription: string;
    issuePhoto: string | null;
    status: string;
    resolvedAt: string | null;
    createdAt: string;
}

export interface MaintenanceKPIs {
    totalQueries: number;
    pending: number;
    inProgress: number;
    completed: number;
}

export interface ListMaintenanceResponse {
    data: MaintenanceItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: MaintenanceKPIs;
}

// --- Hooks ---
export function useMaintenanceQueries(params?: { page?: number; limit?: number; status?: string; issueType?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'maintenance', params],
        queryFn: async () => {
            return await PlatformService.getMaintenanceQueries(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useUpdateMaintenanceStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; status: string; note?: string }) => {
            return await PlatformService.updateMaintenanceStatus(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'maintenance'] }),
    });
}
