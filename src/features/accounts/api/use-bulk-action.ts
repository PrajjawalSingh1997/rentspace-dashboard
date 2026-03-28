import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService, type BulkActionPayload } from '../services/accounts.service';
import { toast } from 'sonner';


export function useBulkAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: BulkActionPayload) => {
            return await AccountsService.bulkAction(payload);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success(`${variables.accountIds.length} account(s) ${variables.action.toLowerCase()}d successfully`);
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to perform bulk action');
        },
    });
}
