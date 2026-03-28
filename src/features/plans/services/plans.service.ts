// src/features/plans/services/plans.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { Plan } from '../api/use-plans';
import type { SubscriptionKPIs } from '../api/use-subscription-kpis';

export const PlansService = {
    // Plans
    async getPlans() {
        const { data } = await api.get<ApiResponse<Plan[]>>('/admin/api/platform/plans');
        return data.data;
    },

    // Subscriptions
    async getSubscriptionKPIs() {
        const { data } = await api.get<ApiResponse<SubscriptionKPIs>>('/admin/api/platform/subscriptions/kpis');
        return data.data;
    },
    async updateSubscription(payload: { accountId: string; planId: string; additionalProperties: number }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/accounts/${payload.accountId}/plan`, { planId: payload.planId, additionalProperties: payload.additionalProperties });
        return data.data;
    },

    // Billing Actions
    async issueRefund(payload: { accountId: string; amount: number; reason: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>('/admin/api/platform/billing/refund', payload);
        return data.data;
    },
    async applyDiscount(payload: { accountId: string; amount: number; reason: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>('/admin/api/platform/billing/discount', payload);
        return data.data;
    },
    async clearArrears(payload: { accountId: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>('/admin/api/platform/billing/clear-arrears', payload);
        return data.data;
    },
    async resendInvoices(payload: { accountId: string; limit?: number }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>('/admin/api/platform/billing/resend-invoices', payload);
        return data.data;
    }
};
