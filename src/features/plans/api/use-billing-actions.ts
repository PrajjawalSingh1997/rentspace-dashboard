import { useMutation } from '@tanstack/react-query';
import { PlansService } from '../services/plans.service';
import { toast } from 'sonner';

export function useIssueRefund() {
    return useMutation({
        mutationFn: async (payload: { accountId: string; amount: number; reason: string }) => {
            return await PlansService.issueRefund(payload);
        },
        onSuccess: (data) => toast.success(data.message || 'Refund successfully initiated'),
        onError: (error: { response?: { data?: { userMessage?: string } } }) => toast.error(error.response?.data?.userMessage || 'Failed to issue refund')
    });
}

export function useApplyDiscount() {
    return useMutation({
        mutationFn: async (payload: { accountId: string; amount: number; reason: string }) => {
            return await PlansService.applyDiscount(payload);
        },
        onSuccess: (data) => toast.success(data.message || 'Discount applied successfully'),
        onError: (error: { response?: { data?: { userMessage?: string } } }) => toast.error(error.response?.data?.userMessage || 'Failed to apply discount')
    });
}

export function useClearArrears() {
    return useMutation({
        mutationFn: async (payload: { accountId: string }) => {
            return await PlansService.clearArrears(payload);
        },
        onSuccess: (data) => toast.success(data.message || 'Arrears cleared successfully'),
        onError: (error: { response?: { data?: { userMessage?: string } } }) => toast.error(error.response?.data?.userMessage || 'Failed to clear arrears')
    });
}

export function useResendInvoices() {
    return useMutation({
        mutationFn: async (payload: { accountId: string; limit?: number }) => {
            return await PlansService.resendInvoices(payload);
        },
        onSuccess: (data) => toast.success(data.message || 'Invoices queued for resend'),
        onError: (error: { response?: { data?: { userMessage?: string } } }) => toast.error(error.response?.data?.userMessage || 'Failed to resend invoices')
    });
}
