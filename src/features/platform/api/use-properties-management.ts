import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface PropertyItem {
    id: string;
    accountId: string;
    name: string;
    type: string;
    location: string;
    ownerName: string | null;
    totalUnits: number | null;
    totalFlats: number | null;
    totalShops: number | null;
    totalRooms: number | null;
    totalRent: number;
    totalRentCollected: number;
    createdAt: string;
    _count: { units: number };
}

export interface PropertiesKPIs { totalProperties: number; totalUnits: number; totalBeds: number; occupancyRate: number }

export interface ListPropertiesResponse {
    data: PropertyItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: PropertiesKPIs;
}

export function useProperties(params?: { page?: number; limit?: number; type?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'properties', params],
        queryFn: async () => {
            return await PlatformService.getProperties(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useTransferProperty() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; targetAccountId: string; reason: string }) => {
            return await PlatformService.transferProperty(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'properties'] }),
    });
}
