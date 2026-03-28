// src/features/accounts/services/accounts.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { AccountListQuery } from '@/types/api';
import type { BackendAccountDetail } from '../api/use-account';

export interface BulkActionPayload {
    action: 'SUSPEND' | 'ACTIVATE' | 'CLOSE';
    accountIds: string[];
}

export interface AddNotePayload {
    id: string;
    note: string;
}

export interface UpdateStatusPayload {
    id: string;
    status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CLOSED';
}

export interface UpdateChurnPayload {
    id: string;
    score: number;
    reason: string;
}

export interface ChurnSignal { name: string; key: string; score: number; weight: number; weightedScore: number }

export interface ChurnBreakdown {
    accountId: string;
    accountName: string;
    overallScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    signals: ChurnSignal[];
}

export const AccountsService = {
    async getAccounts(query: AccountListQuery = {}) {
        const { data } = await api.get<ApiResponse<{ data?: Record<string, unknown>[]; items?: Record<string, unknown>[]; pagination?: Record<string, number> }>>('/admin/api/platform/accounts', { params: query });
        return data.data;
    },

    async getAccountById(id: string) {
        const { data } = await api.get<ApiResponse<BackendAccountDetail>>(`/admin/api/platform/accounts/${id}`);
        return data.data;
    },

    async bulkAction(payload: BulkActionPayload) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/platform/accounts/bulk-action', payload);
        return data.data;
    },

    async addNote({ id, note }: AddNotePayload) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>(`/admin/api/platform/accounts/${id}/notes`, { content: note });
        return data.data;
    },

    async updateStatus({ id, status }: UpdateStatusPayload) {
        const { data } = await api.patch<ApiResponse<Record<string, unknown>>>(`/admin/api/platform/accounts/${id}/status`, { status });
        return data.data;
    },

    async updateChurn({ id, score, reason }: UpdateChurnPayload) {
        const { data } = await api.patch<ApiResponse<Record<string, unknown>>>(`/admin/api/platform/accounts/${id}/churn-score`, { score, reason });
        return data.data;
    },

    async getChurnBreakdown(accountId: string) {
        const { data } = await api.get<ApiResponse<ChurnBreakdown>>(`/admin/api/platform/accounts/${accountId}/churn`);
        return data.data;
    },

    async impersonate(id: string) {
        const { data } = await api.post<ApiResponse<{ impersonationUrl: string }>>(`/admin/api/platform/accounts/${id}/impersonate`);
        return data.data;
    },

    async importCsv(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/platform/accounts/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    }
};
