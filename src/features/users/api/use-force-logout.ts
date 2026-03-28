import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import { toast } from 'sonner';

export function useForceLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            return await UsersService.forceLogout(userId);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(data.message || 'User logged out from all sessions');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to force logout');
        },
    });
}
