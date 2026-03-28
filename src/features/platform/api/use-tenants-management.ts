import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface TenantContractItem {
    id: string;
    accountId: string;
    tenantName: string | null;
    tenantPhone: string | null;
    propertyName: string | null;
    unitNumber: string | null;
    bedNumber: string | null;
    status: string;
    rentShare: number | null;
    startDate: string | null;
    leaseEndDate: string | null;
    tenantMode: string | null;
    createdAt: string;
}

export interface TenantsKPIs { totalContracts: number; activeContracts: number; expiredContracts: number }

export interface ListTenantsResponse {
    data: TenantContractItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: TenantsKPIs;
}

export function useTenantContracts(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'tenants', params],
        queryFn: async () => {
            return await PlatformService.getTenantContracts(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useEditTenant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; tenantName?: string; tenantPhone?: string; businessName?: string; businessType?: string }) => {
            return await PlatformService.editTenant(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }),
    });
}

export function useExtendLease() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; extensionMonths: number; reason: string }) => {
            return await PlatformService.extendLease(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }),
    });
}

export function useAdjustRent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; newRentAmount: number; reason: string }) => {
            return await PlatformService.adjustRent(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }),
    });
}
