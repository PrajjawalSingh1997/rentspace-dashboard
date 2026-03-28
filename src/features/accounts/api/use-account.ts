import { useQuery } from '@tanstack/react-query';
import { AccountsService } from '../services/accounts.service';

export interface AccountProfileResponse {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CLOSED';
    churnRiskScore: number | null;
    createdAt: string;
    closedAt: string | null;
    owner: {
        id: string;
        name: string | null;
        phone: string | null;
    } | null;
    subscription: {
        plan: {
            name: string;
            price: number;
            billingCycle: string;
        } | null;
        status: string;
        startDate: string;
        endDate: string | null;
    } | null;
    properties: Array<{
        id: string;
        name: string;
        type: string;
        city: string | null;
        _count: { units: number };
    }>;
    tenants: Array<{
        id: string;
        name: string;
        phone: string;
        unit: {
            unitNumber: string;
            property: { name: string };
        };
        rentAmount: number;
        status: string;
    }>;
    notes: Array<{
        id: string;
        content: string;
        createdAt: string;
        createdBy: { name: string };
    }>;
    auditLogs: Array<{
        id: string;
        action: string;
        details: Record<string, unknown>;
        createdAt: string;
        adminUser: { name: string };
    }>;
    stats: {
        totalProperties: number;
        totalUnits: number;
        activeTenants: number;
        monthlyRentCollected: number;
        mrr: number;
    };
}

export interface BackendAccountDetail {
    id: string;
    accountName: string;
    accountEmail: string;
    accountPhone: string | null;
    status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CLOSED';
    churnRiskScore: number | null;
    createdAt: string;
    closedAt: string | null;
    memberships?: Array<{ user: { id: string; name: string | null; phone: string | null } }>;
    subscriptions?: Array<{ status: string; currentPeriodStart: string; currentPeriodEnd: string | null }>;
    plan?: { name: string; priceMonthly: number; billingCycle: string };
    properties?: Array<{ id: string; name: string; type: string; location?: { city: string }; totalUnits: number }>;
    activeTenants?: Array<{ id: string; tenantName: string; tenantPhone: string | null; unitNumber: string; propertyName: string; rentShare: number }>;
    notes?: Array<{ id: string; content: string; createdAt: string; admin?: { name: string } }>;
    totalProperties?: number;
    totalVacantProperties?: number;
    totalTenants?: number;
    totalRentAmount?: number;
}

export function useAccount(id: string) {
    return useQuery({
        queryKey: ['account', id],
        queryFn: async () => {
            const backendData = await AccountsService.getAccountById(id);

            // Map backend fields to frontend interface expected by AccountProfileClient
            const mappedData: AccountProfileResponse = {
                id: backendData.id,
                name: backendData.accountName,
                email: backendData.accountEmail,
                phone: backendData.accountPhone,
                status: backendData.status,
                churnRiskScore: backendData.churnRiskScore,
                createdAt: backendData.createdAt,
                closedAt: backendData.closedAt,
                owner: backendData.memberships?.[0]?.user ? {
                    id: backendData.memberships[0].user.id,
                    name: backendData.memberships[0].user.name,
                    phone: backendData.memberships[0].user.phone,
                } : null,
                subscription: backendData.subscriptions?.[0] ? {
                    plan: backendData.plan ? {
                        name: backendData.plan.name,
                        price: backendData.plan.priceMonthly,
                        billingCycle: backendData.plan.billingCycle
                    } : null,
                    status: backendData.subscriptions[0].status,
                    startDate: backendData.subscriptions[0].currentPeriodStart,
                    endDate: backendData.subscriptions[0].currentPeriodEnd,
                } : null,
                properties: backendData.properties?.map((p) => ({
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    city: p.location?.city || null,
                    _count: { units: p.totalUnits || 0 }
                })) || [],
                tenants: backendData.activeTenants?.map((t) => ({
                    id: t.id,
                    name: t.tenantName,
                    phone: t.tenantPhone || 'N/A',
                    unit: {
                        unitNumber: t.unitNumber,
                        property: { name: t.propertyName },
                    },
                    rentAmount: t.rentShare || 0,
                    status: 'ACTIVE'
                })) || [],
                notes: backendData.notes?.map((n) => ({
                    id: n.id,
                    content: n.content,
                    createdAt: n.createdAt,
                    createdBy: { name: n.admin?.name || 'Admin' }
                })) || [],
                auditLogs: [], // Assuming not mapped from this endpoint directly
                stats: {
                    totalProperties: backendData.totalProperties || 0,
                    totalUnits: backendData.totalVacantProperties || 0, // Simplifying mapping for now
                    activeTenants: backendData.totalTenants || 0,
                    monthlyRentCollected: backendData.totalRentAmount || 0,
                    mrr: 0 // Simplification
                }
            };

            return mappedData;
        },
        enabled: !!id,
    });
}
