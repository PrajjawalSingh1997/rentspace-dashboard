import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../services/admin.service';

export interface AdminUserItem {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface AuditLogItem {
    id: string;
    adminId: string;
    action: string;
    targetType: string | null;
    targetId: string | null;
    metadata: Record<string, unknown>;
    ipAddress: string | null;
    createdAt: string;
    admin: { name: string; email: string };
}

export function useAdminUsers(params?: { page?: number; limit?: number; search?: string }) {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: async () => {
            return await AdminService.getUsers(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useAuditLogs(params?: { page?: number; limit?: number; action?: string; targetType?: string }) {
    return useQuery({
        queryKey: ['admin', 'audit-logs', params],
        queryFn: async () => {
            return await AdminService.getAuditLogs(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useCreateAdmin() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { email: string; password: string; name: string; role?: string }) => {
            return await AdminService.createUser(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}
