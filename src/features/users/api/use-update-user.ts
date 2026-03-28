import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/users.service';
import { toast } from 'sonner';

interface UpdateUserPayload {
    userId: string;
    field: 'phone' | 'email' | 'name';
    value: string;
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, field, value }: UpdateUserPayload) => {
            return await UsersService.updateUser(userId, field, value);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(`User ${variables.field} updated successfully`);
        },
        onError: (error: { response?: { data?: { userMessage?: string } } }) => {
            toast.error(error.response?.data?.userMessage || 'Failed to update user');
        },
    });
}
