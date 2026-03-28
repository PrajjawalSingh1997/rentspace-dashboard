import { useQuery } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

export interface StaffItem {
    id: string;
    accountId: string;
    userId: string;
    role: string;
    status: string;
    name: string | null;
    jobTitle: string | null;
    createdAt: string;
    staffAssignments: { id: string; propertyId: string; modulePermissions: Record<string, unknown> }[];
}

export interface StaffKPIs { totalStaff: number; active: number; removed: number }

export interface ListStaffResponse {
    data: StaffItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: StaffKPIs;
}

export function useStaff(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'staff', params],
        queryFn: async () => {
            return await PlatformService.getStaff(params);
        },
        staleTime: 30 * 1000,
    });
}
