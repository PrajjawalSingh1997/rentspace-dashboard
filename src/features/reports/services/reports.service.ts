import api, { type ApiResponse } from '@/lib/api';

export const ReportsService = {
    async generateReport(payload: { metrics: string[]; dateFrom?: string; dateTo?: string; groupBy?: string; format?: string }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/reports/generate', payload);
        return data.data;
    },

    async getTemplates() {
        const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/admin/api/reports/templates');
        return data.data;
    }
};
