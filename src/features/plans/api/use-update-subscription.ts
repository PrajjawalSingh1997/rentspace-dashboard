import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlansService } from '../services/plans.service';
import { toast } from 'sonner';

export function useUpdateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { accountId: string; planId: string; additionalProperties: number }) => {
            return await PlansService.updateSubscription(payload);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Tenant plan updated successfully');
            queryClient.invalidateQueries({ queryKey: ['subscription-kpis'] });
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to update plan');
        }
    });
}
