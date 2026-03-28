'use client';

import { useSubscriptionAnalytics } from '../api/use-subscription-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import dynamic from 'next/dynamic';
import { AlertCircle, CreditCard, Users, Clock, XCircle, ShieldCheck } from 'lucide-react';
import type { SubscriptionAnalyticsResponse } from '../api/use-subscription-analytics';

const PlanDistributionChart = dynamic(() => import('./subscription-charts').then(mod => mod.PlanDistributionChart), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />
});

const BillingCycleChart = dynamic(() => import('./subscription-charts').then(mod => mod.BillingCycleChart), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />
});

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: '#059669',
    TRIAL: '#0ea5e9',
    PAST_DUE: '#f59e0b',
    CANCELLED: '#ef4444',
    EXPIRED: '#94a3b8',
};

const PLAN_COLORS = ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444'];

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(amount);

export function SubscriptionClient() {
    const { data, isLoading, isError, error } = useSubscriptionAnalytics();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Subscription Analytics</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Subscription Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">Plan distribution, billing cycles, and subscription health</p>
            </div>

            {/* KPI Cards */}
            <KPICards data={data} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlanDistributionChart data={data} />
                <BillingCycleChart data={data} />
            </div>

            {/* Status + Expiring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusBreakdown data={data} />
                <ExpiringSubscriptions data={data} />
            </div>
        </div>
    );
}

function KPICards({ data }: { data: SubscriptionAnalyticsResponse }) {
    const kpis = [
        { title: 'Total Subscriptions', value: data.kpis.total.toLocaleString(), icon: CreditCard, color: 'text-teal-600', bgColor: 'bg-teal-50' },
        { title: 'Active', value: data.kpis.active.toLocaleString(), icon: ShieldCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'On Trial', value: data.kpis.trial.toLocaleString(), icon: Clock, color: 'text-sky-600', bgColor: 'bg-sky-50' },
        { title: 'Expired / Cancelled', value: `${data.kpis.expired + data.kpis.cancelled}`, icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
                <Card key={i} className="hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.title}</CardTitle>
                        <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#3b82f6]">{kpi.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatusBreakdown({ data }: { data: SubscriptionAnalyticsResponse }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.statusBreakdown.map(s => (
                        <div key={s.status} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] || '#94a3b8' }} />
                                <span className="text-sm font-medium">{s.status}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-[#3b82f6]">{s.count}</span>
                                <Badge variant="secondary" className="text-xs">{formatINR(s.revenue)}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ExpiringSubscriptions({ data }: { data: SubscriptionAnalyticsResponse }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">Expiring Soon</CardTitle>
                <p className="text-sm text-muted-foreground">Subscriptions ending within 30 days</p>
            </CardHeader>
            <CardContent>
                {data.expiringSoon.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">No subscriptions expiring soon 🎉</div>
                ) : (
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Account</th>
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Plan</th>
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Cycle</th>
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Expires</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.expiringSoon.map(sub => {
                                    // eslint-disable-next-line react-hooks/purity
                                    const daysLeft = Math.ceil((new Date(sub.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-2 px-3 font-medium text-[#3b82f6] text-xs">{sub.account.accountName || sub.account.accountEmail || '—'}</td>
                                            <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{sub.plan.name}</Badge></td>
                                            <td className="py-2 px-3 text-muted-foreground text-xs">{sub.billingCycle}</td>
                                            <td className="py-2 px-3">
                                                <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'} className="text-xs">
                                                    {daysLeft}d left
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
