import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService, type UpdateChurnPayload } from '../services/accounts.service';
import { toast } from 'sonner';

export function useUpdateChurnScore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateChurnPayload) => {
            return await AccountsService.updateChurn(payload);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
            toast.success('Churn risk score updated');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to update churn score');
        },
    });
}
