// src/features/platform/services/platform.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { ListMaintenanceResponse } from '../api/use-maintenance-management';
import type { ListMoveOutsResponse } from '../api/use-moveouts-management';
import type { ListPropertiesResponse } from '../api/use-properties-management';
import type { ListRentResponse } from '../api/use-rent-management';
import type { ListStaffResponse } from '../api/use-staff-management';
import type { ListSuggestionsResponse } from '../api/use-suggestions-management';
import type { ListSupportResponse } from '../api/use-support-management';
import type { ListTenantsResponse } from '../api/use-tenants-management';

export const PlatformService = {
    // Maintenance
    async getMaintenanceQueries(params?: { page?: number; limit?: number; status?: string; issueType?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.issueType) qp.issueType = params.issueType;
        if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListMaintenanceResponse>>('/admin/api/platform/maintenance', { params: qp });
        return data.data;
    },
    async updateMaintenanceStatus({ id, status, note }: { id: string; status: string; note?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/maintenance/${id}/status`, { status, note });
        return data.data;
    },

    // Move-Outs
    async getMoveOutRequests(params?: { page?: number; limit?: number; status?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListMoveOutsResponse>>('/admin/api/platform/move-outs', { params: qp });
        return data.data;
    },
    async approveMoveOut({ id, note }: { id: string; note?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/move-outs/${id}/approve`, { note });
        return data.data;
    },
    async declineMoveOut({ id, declineReason, declineNote }: { id: string; declineReason: string; declineNote?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/move-outs/${id}/decline`, { declineReason, declineNote });
        return data.data;
    },

    // Properties
    async getProperties(params?: { page?: number; limit?: number; type?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.type) qp.type = params.type; if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListPropertiesResponse>>('/admin/api/platform/properties', { params: qp });
        return data.data;
    },
    async transferProperty({ id, targetAccountId, reason }: { id: string; targetAccountId: string; reason: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>(`/admin/api/platform/properties/${id}/transfer`, { targetAccountId, reason });
        return data.data;
    },

    // Rent
    async getRentPayments(params?: { page?: number; limit?: number; status?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListRentResponse>>('/admin/api/platform/rent', { params: qp });
        return data.data;
    },
    async manualPayment(payload: { rentPaymentId: string; amount: number; paymentMode: string; referenceNote: string }) {
        const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/admin/api/platform/rent/manual-payment', payload);
        return data.data;
    },
    async waiveCharges({ id, reason, amount }: { id: string; reason: string; amount?: number }) {
        const { data } = await api.patch<ApiResponse<Record<string, unknown>>>(`/admin/api/platform/rent/${id}/waive`, { reason, amount });
        return data.data;
    },
    async markPaid({ id, note }: { id: string; note?: string }) {
        const { data } = await api.patch<ApiResponse<Record<string, unknown>>>(`/admin/api/platform/rent/${id}/mark-paid`, { note });
        return data.data;
    },

    // Staff
    async getStaff(params?: { page?: number; limit?: number; status?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListStaffResponse>>('/admin/api/platform/staff', { params: qp });
        return data.data;
    },

    // Suggestions
    async getSuggestions(params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.category) qp.category = params.category;
        if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListSuggestionsResponse>>('/admin/api/platform/suggestions', { params: qp });
        return data.data;
    },
    async updateSuggestionStatus({ id, status, note }: { id: string; status: string; note?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/suggestions/${id}/status`, { status, note });
        return data.data;
    },

    // Support
    async getSupportQueries(params?: { page?: number; limit?: number; status?: string; queryType?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.queryType) qp.queryType = params.queryType;
        if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListSupportResponse>>('/admin/api/platform/support', { params: qp });
        return data.data;
    },
    async respondToSupport({ id, responseMessage }: { id: string; responseMessage: string }) {
        const { data } = await api.post<ApiResponse<{ message?: string }>>(`/admin/api/platform/support/${id}/respond`, { responseMessage });
        return data.data;
    },
    async closeSupport({ id, note }: { id: string; note?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/support/${id}/close`, { note });
        return data.data;
    },
    async assignSupport({ id, assignedTo }: { id: string; assignedTo: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/support/${id}/assign`, { assignedTo });
        return data.data;
    },

    // Tenants
    async getTenantContracts(params?: { page?: number; limit?: number; status?: string; search?: string }) {
        const qp: Record<string, string> = {};
        if (params?.page) qp.page = params.page.toString(); if (params?.limit) qp.limit = params.limit.toString();
        if (params?.status) qp.status = params.status; if (params?.search) qp.search = params.search;
        const { data } = await api.get<ApiResponse<ListTenantsResponse>>('/admin/api/platform/tenants', { params: qp });
        return data.data;
    },
    async editTenant({ id, ...body }: { id: string; tenantName?: string; tenantPhone?: string; businessName?: string; businessType?: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/tenants/${id}`, body);
        return data.data;
    },
    async extendLease({ id, extensionMonths, reason }: { id: string; extensionMonths: number; reason: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/tenants/${id}/extend-lease`, { extensionMonths, reason });
        return data.data;
    },
    async adjustRent({ id, newRentAmount, reason }: { id: string; newRentAmount: number; reason: string }) {
        const { data } = await api.patch<ApiResponse<{ message?: string }>>(`/admin/api/platform/tenants/${id}/adjust-rent`, { newRentAmount, reason });
        return data.data;
    }
};
