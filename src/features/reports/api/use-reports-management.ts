import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportsService } from '../services/reports.service';

export function useGenerateReport() {
    return useMutation({
        mutationFn: async (payload: { metrics: string[]; dateFrom?: string; dateTo?: string; groupBy?: string; format?: string }) => {
            return await ReportsService.generateReport(payload);
        },
    });
}

export function useReportTemplates() {
    return useQuery({
        queryKey: ['reports', 'templates'],
        queryFn: async () => { return await ReportsService.getTemplates(); },
        staleTime: 60 * 1000,
    });
}
