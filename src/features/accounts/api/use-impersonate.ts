import { useMutation } from '@tanstack/react-query';
import { AccountsService } from '../services/accounts.service';
import { toast } from 'sonner';

export function useImpersonate() {
    return useMutation({
        mutationFn: async (id: string) => {
            return await AccountsService.impersonate(id);
        },
        onSuccess: () => {
            toast.success('Impersonation session established');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to start impersonation');
        },
    });
}
