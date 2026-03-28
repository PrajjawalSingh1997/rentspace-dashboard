import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface RentPaymentItem {
    id: string;
    accountId: string;
    tenantName: string | null;
    propertyName: string | null;
    unitNumber: string | null;
    rentAmount: number;
    paidAmount: number;
    status: string;
    dueDate: string;
    createdAt: string;
}

export interface RentKPIs {
    totalDue: number;
    totalCollected: number;
    totalPayments: number;
    overdueCount: number;
}

export interface ListRentResponse {
    data: RentPaymentItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: RentKPIs;
}

// --- Hooks ---
export function useRentPayments(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'rent', params],
        queryFn: async () => {
            return await PlatformService.getRentPayments(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useManualPayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { rentPaymentId: string; amount: number; paymentMode: string; referenceNote: string }) => {
            return await PlatformService.manualPayment(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'rent'] }),
    });
}

export function useWaiveCharges() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; reason: string; amount?: number }) => {
            return await PlatformService.waiveCharges(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'rent'] }),
    });
}

export function useMarkPaid() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; note?: string }) => {
            return await PlatformService.markPaid(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'rent'] }),
    });
}
