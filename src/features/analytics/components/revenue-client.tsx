'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRevenueAnalytics, usePaymentAnalytics, useRentRevisions, useReconciliation, useRentCycle } from '../api/use-revenue-analytics';
import { RevenueKPICards } from './revenue-kpi-cards';
import { Skeleton } from '@/components/ui/skeleton';

const RevenueCharts = dynamic(() => import('./revenue-charts').then(mod => mod.RevenueCharts), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const PaymentAnalyticsTab = dynamic(() => import('./payment-analytics-tab').then(mod => mod.PaymentAnalyticsTab), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const RentRevisionsTab = dynamic(() => import('./rent-revisions-tab').then(mod => mod.RentRevisionsTab), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const ReconciliationTab = dynamic(() => import('./reconciliation-tab').then(mod => mod.ReconciliationTab), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const RentCycleTab = dynamic(() => import('./rent-cycle-tab').then(mod => mod.RentCycleTab), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, IndianRupee, CreditCard, FileText, Scale, RefreshCcw } from 'lucide-react';

export function RevenueClient() {
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [activeTab, setActiveTab] = useState('revenue');

    const revenueQuery = useRevenueAnalytics(period);
    const paymentQuery = usePaymentAnalytics();
    const revisionsQuery = useRentRevisions();
    const reconciliationQuery = useReconciliation();
    const rentCycleQuery = useRentCycle();

    if (revenueQuery.isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (revenueQuery.isError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Revenue Analytics</AlertTitle>
                <AlertDescription>
                    {revenueQuery.error?.message || 'Failed to fetch revenue data. Please try again.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Revenue & Billing</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track rent collection, payment analytics, and financial health</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={(v) => setPeriod(v as 'daily' | 'weekly' | 'monthly')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/5">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            {revenueQuery.data && <RevenueKPICards data={revenueQuery.data.kpis} />}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#3b82f6]/5 border border-[#3b82f6]/10 flex-wrap h-auto gap-1 p-1">
                    <TabsTrigger value="revenue" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <IndianRupee className="h-4 w-4" /> Revenue
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <CreditCard className="h-4 w-4" /> Payments
                    </TabsTrigger>
                    <TabsTrigger value="revisions" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <FileText className="h-4 w-4" /> Rent Revisions
                    </TabsTrigger>
                    <TabsTrigger value="reconciliation" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <Scale className="h-4 w-4" /> Reconciliation
                    </TabsTrigger>
                    <TabsTrigger value="cycle" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <RefreshCcw className="h-4 w-4" /> Rent Cycle
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="mt-4">
                    {revenueQuery.data && <RevenueCharts data={revenueQuery.data} period={period} />}
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                    {paymentQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : paymentQuery.data ? (
                        <PaymentAnalyticsTab data={paymentQuery.data} />
                    ) : null}
                </TabsContent>

                <TabsContent value="revisions" className="mt-4">
                    {revisionsQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : revisionsQuery.data ? (
                        <RentRevisionsTab data={revisionsQuery.data} />
                    ) : null}
                </TabsContent>

                <TabsContent value="reconciliation" className="mt-4">
                    {reconciliationQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : reconciliationQuery.data ? (
                        <ReconciliationTab data={reconciliationQuery.data} />
                    ) : null}
                </TabsContent>

                <TabsContent value="cycle" className="mt-4">
                    {rentCycleQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : rentCycleQuery.data ? (
                        <RentCycleTab data={rentCycleQuery.data} />
                    ) : null}
                </TabsContent>
            </Tabs>
        </div>
    );
}
