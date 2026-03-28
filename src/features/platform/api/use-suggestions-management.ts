import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformService } from '../services/platform.service';

// --- Types ---
export interface SuggestionItem {
    id: string;
    userId: string;
    title: string;
    category: string;
    description: string;
    status: string;
    createdAt: string;
}

export interface SuggestionsKPIs { totalSuggestions: number; pending: number; planned: number; implemented: number }

export interface ListSuggestionsResponse {
    data: SuggestionItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    kpis: SuggestionsKPIs;
}

export function useSuggestions(params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) {
    return useQuery({
        queryKey: ['platform', 'suggestions', params],
        queryFn: async () => {
            return await PlatformService.getSuggestions(params);
        },
        staleTime: 30 * 1000,
    });
}

export function useUpdateSuggestionStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; status: string; note?: string }) => {
            return await PlatformService.updateSuggestionStatus(payload);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'suggestions'] }),
    });
}
