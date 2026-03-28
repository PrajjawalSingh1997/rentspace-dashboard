import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import { toast } from 'sonner';

export function useResetPassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            return await UsersService.resetPassword(userId);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(data.message || 'Password reset successfully');
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to reset password');
        },
    });
}
