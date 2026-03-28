// src/features/analytics/services/analytics.service.ts
import api, { type ApiResponse } from '@/lib/api';
import type { GrowthAnalyticsResponse, CohortAnalysisResponse, TrialConversionResponse, MultiAccountResponse } from '../api/use-growth-analytics';
import type { AnalyticsOverview } from '../api/use-overview';
import type { PropertyAnalyticsResponse, TenantAnalyticsResponse, MaintenanceAnalyticsResponse, MoveOutAnalyticsResponse, BedOccupancyResponse, LeaseHealthResponse, PropertyComparisonResponse } from '../api/use-platform-analytics';
import type { RevenueAnalyticsResponse, PaymentAnalyticsResponse, RentRevisionsResponse, ReconciliationResponse, RentCycleResponse } from '../api/use-revenue-analytics';
import type { SubscriptionAnalyticsResponse } from '../api/use-subscription-analytics';

export const AnalyticsService = {
    // Overview
    async getOverview(period?: 'daily' | 'weekly' | 'monthly') {
        const { data } = await api.get<ApiResponse<AnalyticsOverview>>('/admin/api/analytics/overview', { params: { period } });
        return data.data;
    },

    // Growth
    async getGrowth(period: 'daily' | 'weekly' | 'monthly' = 'monthly', startDate?: string, endDate?: string) {
        const { data } = await api.get<ApiResponse<GrowthAnalyticsResponse>>('/admin/api/analytics/growth', { params: { period, startDate, endDate } });
        return data.data;
    },
    async getCohorts(cohortType: 'retention' | 'revenue' | 'churn' = 'retention', months: number = 6) {
        const { data } = await api.get<ApiResponse<CohortAnalysisResponse>>('/admin/api/analytics/cohorts', { params: { cohortType, months: months.toString() } });
        return data.data;
    },
    async getTrialConversion(startDate?: string, endDate?: string) {
        const { data } = await api.get<ApiResponse<TrialConversionResponse>>('/admin/api/analytics/trial-conversion', { params: { startDate, endDate } });
        return data.data;
    },
    async getMultiAccounts(page: number = 1, limit: number = 10, minAccounts: number = 2) {
        const { data } = await api.get<ApiResponse<MultiAccountResponse>>('/admin/api/analytics/multi-account', { params: { page: page.toString(), limit: limit.toString(), minAccounts: minAccounts.toString() } });
        return data.data;
    },

    // Platform
    async getProperties(type?: string) {
        const params: Record<string, string> = {}; if (type) params.type = type;
        const { data } = await api.get<ApiResponse<PropertyAnalyticsResponse>>('/admin/api/analytics/properties', { params });
        return data.data;
    },
    async getTenants() {
        const { data } = await api.get<ApiResponse<TenantAnalyticsResponse>>('/admin/api/analytics/tenants');
        return data.data;
    },
    async getMaintenance() {
        const { data } = await api.get<ApiResponse<MaintenanceAnalyticsResponse>>('/admin/api/analytics/maintenance');
        return data.data;
    },
    async getMoveOuts() {
        const { data } = await api.get<ApiResponse<MoveOutAnalyticsResponse>>('/admin/api/analytics/move-outs');
        return data.data;
    },
    async getBedOccupancy() {
        const { data } = await api.get<ApiResponse<BedOccupancyResponse>>('/admin/api/analytics/bed-occupancy');
        return data.data;
    },
    async getLeaseHealth(daysThreshold = 30) {
        const { data } = await api.get<ApiResponse<LeaseHealthResponse>>('/admin/api/analytics/lease-health', { params: { daysThreshold: daysThreshold.toString() } });
        return data.data;
    },
    async getPropertyComparison(propertyIds?: string) {
        const params: Record<string, string> = {}; if (propertyIds) params.propertyIds = propertyIds;
        const { data } = await api.get<ApiResponse<PropertyComparisonResponse>>('/admin/api/analytics/property-comparison', { params });
        return data.data;
    },

    // Revenue
    async getRevenue(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
        const { data } = await api.get<ApiResponse<RevenueAnalyticsResponse>>('/admin/api/analytics/revenue', { params: { period } });
        return data.data;
    },
    async getPayments(provider?: string) {
        const { data } = await api.get<ApiResponse<PaymentAnalyticsResponse>>('/admin/api/analytics/payments', { params: { provider } });
        return data.data;
    },
    async getRentRevisions(page: number = 1, limit: number = 10) {
        const { data } = await api.get<ApiResponse<RentRevisionsResponse>>('/admin/api/analytics/rent-revisions', { params: { page: page.toString(), limit: limit.toString() } });
        return data.data;
    },
    async getReconciliation(month?: number, year?: number) {
        const params: Record<string, string> = {}; if (month) params.month = month.toString(); if (year) params.year = year.toString();
        const { data } = await api.get<ApiResponse<ReconciliationResponse>>('/admin/api/analytics/reconciliation', { params });
        return data.data;
    },
    async getRentCycle(period: 'current' | 'previous' = 'current') {
        const { data } = await api.get<ApiResponse<RentCycleResponse>>('/admin/api/analytics/rent-cycle', { params: { period } });
        return data.data;
    },

    // Subscriptions
    async getSubscriptions(billingCycle?: string) {
        const params: Record<string, string> = {}; if (billingCycle) params.billingCycle = billingCycle;
        const { data } = await api.get<ApiResponse<SubscriptionAnalyticsResponse>>('/admin/api/analytics/subscriptions', { params });
        return data.data;
    }
};
