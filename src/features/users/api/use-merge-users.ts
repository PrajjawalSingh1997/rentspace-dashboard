import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import { toast } from 'sonner';

interface MergeUsersPayload {
    sourceUserId: string;
    targetUserId: string;
}

export function useMergeUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: MergeUsersPayload) => {
            return await UsersService.mergeUsers(payload);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(data.message || 'Users merged successfully');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to merge users');
        },
    });
}
