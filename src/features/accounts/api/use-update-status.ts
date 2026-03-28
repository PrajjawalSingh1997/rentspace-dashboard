import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService, type UpdateStatusPayload } from '../services/accounts.service';
import { toast } from 'sonner';


export function useUpdateAccountStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateStatusPayload) => {
            return await AccountsService.updateStatus(payload);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
            toast.success(`Account status updated to ${variables.status}`);
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to update account status');
        },
    });
}
