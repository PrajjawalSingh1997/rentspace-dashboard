import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';

// --- Property Analytics ---
export interface PropertyAnalyticsResponse {
    kpis: { totalProperties: number; totalUnits: number; activeContracts: number; occupancyRate: number };
    typeDistribution: { type: string; count: number }[];
    unitTypes: { type: string; count: number }[];
}
export function usePropertyAnalytics(type?: string) {
    return useQuery({
        queryKey: ['analytics', 'properties', { type }],
        queryFn: async () => {
            return await AnalyticsService.getProperties(type);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Tenant Analytics ---
export interface TenantAnalyticsResponse {
    kpis: { totalTenants: number; activeTenants: number; coTenants: number };
    contractStatus: { status: string; count: number }[];
    tenantModes: { mode: string; count: number }[];
}
export function useTenantAnalytics() {
    return useQuery({
        queryKey: ['analytics', 'tenants'],
        queryFn: async () => {
            return await AnalyticsService.getTenants();
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Maintenance Analytics ---
export interface MaintenanceAnalyticsResponse {
    kpis: { totalQueries: number; avgResolutionHours: number; resolvedCount: number };
    statusBreakdown: { status: string; count: number }[];
    issueTypes: { type: string; count: number }[];
}
export function useMaintenanceAnalytics() {
    return useQuery({
        queryKey: ['analytics', 'maintenance'],
        queryFn: async () => {
            return await AnalyticsService.getMaintenance();
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Move-Out Analytics ---
export interface MoveOutAnalyticsResponse {
    kpis: { total: number; pending: number };
    statusBreakdown: { status: string; count: number }[];
    reasons: { reason: string; count: number }[];
}
export function useMoveOutAnalytics() {
    return useQuery({
        queryKey: ['analytics', 'move-outs'],
        queryFn: async () => {
            return await AnalyticsService.getMoveOuts();
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Bed Occupancy ---
export interface BedOccupancyResponse {
    kpis: { totalBeds: number; occupiedBeds: number; vacantBeds: number; occupancyRate: number };
    sharingTypes: { type: string; count: number }[];
    byProperty: { propertyId: string; propertyName: string; totalBeds: number; occupiedBeds: number; occupancyRate: number }[];
}
export function useBedOccupancy() {
    return useQuery({
        queryKey: ['analytics', 'bed-occupancy'],
        queryFn: async () => {
            return await AnalyticsService.getBedOccupancy();
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Lease Health ---
export interface LeaseHealthResponse {
    kpis: { totalLeases: number; expiringCount: number };
    renewalStatuses: { status: string; count: number }[];
    expiringContracts: { id: string; leaseEndDate: string; leaseRenewalStatus: string | null; tenantName: string | null; propertyName: string | null; unitNumber: string | null }[];
}
export function useLeaseHealth(daysThreshold = 30) {
    return useQuery({
        queryKey: ['analytics', 'lease-health', { daysThreshold }],
        queryFn: async () => {
            return await AnalyticsService.getLeaseHealth(daysThreshold);
        },
        staleTime: 5 * 60 * 1000,
    });
}

// --- Property Comparison ---
export interface PropertyComparisonItem {
    id: string; name: string; type: string; location: string;
    totalUnits: number; occupiedUnits: number; occupancyRate: number;
    totalBeds: number; occupiedBeds: number;
    totalRent: number; totalRentCollected: number; collectionRate: number;
}
export interface PropertyComparisonResponse {
    properties: PropertyComparisonItem[];
}
export function usePropertyComparison(propertyIds?: string) {
    return useQuery({
        queryKey: ['analytics', 'property-comparison', { propertyIds }],
        queryFn: async () => {
            return await AnalyticsService.getPropertyComparison(propertyIds);
        },
        staleTime: 5 * 60 * 1000,
    });
}
