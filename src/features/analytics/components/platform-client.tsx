'use client';

import { useState } from 'react';
import { usePropertyAnalytics, useTenantAnalytics, useMaintenanceAnalytics, useMoveOutAnalytics, useBedOccupancy, useLeaseHealth, usePropertyComparison } from '../api/use-platform-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { AlertCircle, Building2, Users, Wrench, DoorOpen, BedDouble, FileCheck, GitCompare } from 'lucide-react';

const ChartCard = dynamic(() => import('./platform-chart-card').then(mod => mod.ChartCard), {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />
});

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const STATUS_COLORS: Record<string, string> = {
    ACTIVE: '#059669', EXPIRED: '#94a3b8', TERMINATED: '#ef4444', PENDING: '#f59e0b',
    IN_PROGRESS: '#0ea5e9', COMPLETED: '#059669',
    APPROVED: '#059669', DECLINED: '#ef4444', CANCELLED: '#94a3b8',
};

export function PlatformClient() {
    const [activeTab, setActiveTab] = useState('properties');

    const propertyQ = usePropertyAnalytics();
    const tenantQ = useTenantAnalytics();
    const maintenanceQ = useMaintenanceAnalytics();
    const moveOutQ = useMoveOutAnalytics();
    const bedQ = useBedOccupancy();
    const leaseQ = useLeaseHealth();
    const comparisonQ = usePropertyComparison();

    if (propertyQ.isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (propertyQ.isError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Platform Analytics</AlertTitle>
                <AlertDescription>{propertyQ.error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Platform Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">Property, tenant, maintenance, and occupancy insights</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#3b82f6]/5 border border-[#3b82f6]/10 flex-wrap h-auto gap-1 p-1">
                    <TabsTrigger value="properties" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <Building2 className="h-3.5 w-3.5" /> Properties
                    </TabsTrigger>
                    <TabsTrigger value="tenants" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5" /> Tenants
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <Wrench className="h-3.5 w-3.5" /> Maintenance
                    </TabsTrigger>
                    <TabsTrigger value="moveouts" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <DoorOpen className="h-3.5 w-3.5" /> Move-Outs
                    </TabsTrigger>
                    <TabsTrigger value="beds" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <BedDouble className="h-3.5 w-3.5" /> Bed Occupancy
                    </TabsTrigger>
                    <TabsTrigger value="lease" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <FileCheck className="h-3.5 w-3.5" /> Lease Health
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-1.5 text-xs">
                        <GitCompare className="h-3.5 w-3.5" /> Comparison
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Properties */}
                <TabsContent value="properties" className="mt-4 space-y-6">
                    {propertyQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <KPICard title="Total Properties" value={propertyQ.data.kpis.totalProperties} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Total Units" value={propertyQ.data.kpis.totalUnits} color="text-sky-600" bg="bg-sky-50" />
                                <KPICard title="Active Contracts" value={propertyQ.data.kpis.activeContracts} color="text-emerald-600" bg="bg-emerald-50" />
                                <KPICard title="Occupancy Rate" value={`${propertyQ.data.kpis.occupancyRate}%`} color="text-purple-600" bg="bg-purple-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Property Types" data={propertyQ.data.typeDistribution} nameKey="type" dataKey="count" type="pie" />
                                <ChartCard title="Unit Types" data={propertyQ.data.unitTypes} nameKey="type" dataKey="count" type="bar" />
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 2: Tenants */}
                <TabsContent value="tenants" className="mt-4 space-y-6">
                    {tenantQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : tenantQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <KPICard title="Total Tenants" value={tenantQ.data.kpis.totalTenants} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Active Tenants" value={tenantQ.data.kpis.activeTenants} color="text-emerald-600" bg="bg-emerald-50" />
                                <KPICard title="Co-Tenants" value={tenantQ.data.kpis.coTenants} color="text-sky-600" bg="bg-sky-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Contract Status" data={tenantQ.data.contractStatus} nameKey="status" dataKey="count" type="pie" />
                                <ChartCard title="Tenant Modes" data={tenantQ.data.tenantModes} nameKey="mode" dataKey="count" type="bar" />
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 3: Maintenance */}
                <TabsContent value="maintenance" className="mt-4 space-y-6">
                    {maintenanceQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : maintenanceQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <KPICard title="Total Queries" value={maintenanceQ.data.kpis.totalQueries} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Avg Resolution" value={`${maintenanceQ.data.kpis.avgResolutionHours}h`} color="text-sky-600" bg="bg-sky-50" />
                                <KPICard title="Resolved" value={maintenanceQ.data.kpis.resolvedCount} color="text-emerald-600" bg="bg-emerald-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Status Distribution" data={maintenanceQ.data.statusBreakdown} nameKey="status" dataKey="count" type="pie" />
                                <ChartCard title="Issue Types" data={maintenanceQ.data.issueTypes} nameKey="type" dataKey="count" type="bar" />
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 4: Move-Outs */}
                <TabsContent value="moveouts" className="mt-4 space-y-6">
                    {moveOutQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : moveOutQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <KPICard title="Total Requests" value={moveOutQ.data.kpis.total} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Pending" value={moveOutQ.data.kpis.pending} color="text-amber-600" bg="bg-amber-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Request Status" data={moveOutQ.data.statusBreakdown} nameKey="status" dataKey="count" type="pie" />
                                <ChartCard title="Move-Out Reasons" data={moveOutQ.data.reasons} nameKey="reason" dataKey="count" type="bar" />
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 5: Bed Occupancy */}
                <TabsContent value="beds" className="mt-4 space-y-6">
                    {bedQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : bedQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <KPICard title="Total Beds" value={bedQ.data.kpis.totalBeds} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Occupied" value={bedQ.data.kpis.occupiedBeds} color="text-emerald-600" bg="bg-emerald-50" />
                                <KPICard title="Vacant" value={bedQ.data.kpis.vacantBeds} color="text-amber-600" bg="bg-amber-50" />
                                <KPICard title="Occupancy" value={`${bedQ.data.kpis.occupancyRate}%`} color="text-purple-600" bg="bg-purple-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Sharing Types" data={bedQ.data.sharingTypes} nameKey="type" dataKey="count" type="pie" />
                                <Card className="border-0 shadow-sm">
                                    <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Bed Occupancy by Property</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {bedQ.data.byProperty.map(p => (
                                                <div key={p.propertyId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                                                    <div>
                                                        <p className="text-sm font-medium text-[#3b82f6]">{p.propertyName}</p>
                                                        <p className="text-xs text-muted-foreground">{p.occupiedBeds}/{p.totalBeds} beds</p>
                                                    </div>
                                                    <Badge variant={p.occupancyRate >= 80 ? 'default' : p.occupancyRate >= 50 ? 'secondary' : 'destructive'}>
                                                        {p.occupancyRate}%
                                                    </Badge>
                                                </div>
                                            ))}
                                            {bedQ.data.byProperty.length === 0 && <p className="text-center text-muted-foreground py-4">No bed data</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 6: Lease Health */}
                <TabsContent value="lease" className="mt-4 space-y-6">
                    {leaseQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : leaseQ.data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <KPICard title="Total Leases" value={leaseQ.data.kpis.totalLeases} color="text-teal-600" bg="bg-teal-50" />
                                <KPICard title="Expiring (30d)" value={leaseQ.data.kpis.expiringCount} color="text-red-500" bg="bg-red-50" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartCard title="Renewal Status" data={leaseQ.data.renewalStatuses} nameKey="status" dataKey="count" type="pie" />
                                <Card className="border-0 shadow-sm">
                                    <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Expiring Leases</CardTitle></CardHeader>
                                    <CardContent>
                                        {leaseQ.data.expiringContracts.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-4">No leases expiring soon 🎉</p>
                                        ) : (
                                            <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">
                                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Tenant</th>
                                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Property</th>
                                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Expires</th>
                                                        <th className="text-center py-2 px-3 text-muted-foreground font-medium">Status</th>
                                                    </tr></thead>
                                                    <tbody>
                                                        {leaseQ.data.expiringContracts.map(c => {
                                                            // eslint-disable-next-line react-hooks/purity
                                                            const days = Math.ceil((new Date(c.leaseEndDate).getTime() - Date.now()) / (86400000));
                                                            return (
                                                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                                    <td className="py-2 px-3 text-xs font-medium">{c.tenantName || '—'}</td>
                                                                    <td className="py-2 px-3 text-xs text-muted-foreground">{c.propertyName || '—'}</td>
                                                                    <td className="py-2 px-3"><Badge variant={days <= 7 ? 'destructive' : 'secondary'} className="text-xs">{days}d</Badge></td>
                                                                    <td className="py-2 px-3 text-center"><Badge variant="outline" className="text-xs">{c.leaseRenewalStatus || 'N/A'}</Badge></td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Tab 7: Property Comparison */}
                <TabsContent value="comparison" className="mt-4 space-y-6">
                    {comparisonQ.isLoading ? <Skeleton className="h-[400px] rounded-xl" /> : comparisonQ.data && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Property Comparison</CardTitle></CardHeader>
                            <CardContent>
                                {comparisonQ.data.properties.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No properties to compare</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead><tr className="border-b border-gray-100">
                                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Property</th>
                                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Type</th>
                                                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Units</th>
                                                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Occupancy</th>
                                                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Beds</th>
                                                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Rent</th>
                                                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Collection</th>
                                            </tr></thead>
                                            <tbody>
                                                {comparisonQ.data.properties.map(p => (
                                                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-3 px-3 font-medium text-[#3b82f6]">{p.name}</td>
                                                        <td className="py-3 px-3"><Badge variant="outline" className="text-xs">{p.type}</Badge></td>
                                                        <td className="py-3 px-3 text-center">{p.occupiedUnits}/{p.totalUnits}</td>
                                                        <td className="py-3 px-3 text-center">
                                                            <Badge variant={p.occupancyRate >= 80 ? 'default' : p.occupancyRate >= 50 ? 'secondary' : 'destructive'}>
                                                                {p.occupancyRate}%
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-3 text-center">{p.occupiedBeds}/{p.totalBeds}</td>
                                                        <td className="py-3 px-3 text-right text-xs">₹{p.totalRent.toLocaleString('en-IN')}</td>
                                                        <td className="py-3 px-3 text-center">
                                                            <Badge variant={p.collectionRate >= 80 ? 'default' : 'secondary'}>{p.collectionRate}%</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- Reusable Components ---

// --- Reusable Components ---

function KPICard({ title, value, color, bg }: { title: string; value: string | number; color: string; bg: string }) {
    return (
        <Card className="hover:shadow-md transition-all duration-300 border-0 shadow-sm">
            <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </CardContent>
        </Card>
    );
}
