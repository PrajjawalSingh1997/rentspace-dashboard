import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService, type AddNotePayload } from '../services/accounts.service';
import { toast } from 'sonner';


export function useAddAccountNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AddNotePayload) => {
            return await AccountsService.addNote(payload);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
            toast.success('Note added successfully');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to add note');
        },
    });
}
