'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useGrowthAnalytics, useCohortAnalysis, useTrialConversion, useMultiAccountUsers } from '../api/use-growth-analytics';
import { GrowthKPICards } from './growth-kpi-cards';
import { Skeleton } from '@/components/ui/skeleton';

const GrowthCharts = dynamic(() => import('./growth-charts').then(mod => mod.GrowthCharts), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const CohortHeatmap = dynamic(() => import('./cohort-heatmap').then(mod => mod.CohortHeatmap), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const TrialConversionFunnel = dynamic(() => import('./trial-conversion-funnel').then(mod => mod.TrialConversionFunnel), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
const MultiAccountTable = dynamic(() => import('./multi-account-table').then(mod => mod.MultiAccountTable), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> });
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, TrendingUp, Grid3X3, ArrowRightLeft, Users } from 'lucide-react';

export function GrowthClient() {
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [activeTab, setActiveTab] = useState('growth');

    const growthQuery = useGrowthAnalytics(period);
    const cohortQuery = useCohortAnalysis('retention', 6);
    const trialQuery = useTrialConversion();
    const multiAccountQuery = useMultiAccountUsers();

    // Loading state
    if (growthQuery.isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-[300px] rounded-xl" />
                    <Skeleton className="h-[300px] rounded-xl" />
                </div>
            </div>
        );
    }

    // Error state
    if (growthQuery.isError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Growth Analytics</AlertTitle>
                <AlertDescription>
                    {growthQuery.error?.message || 'Failed to fetch growth data. Please try again.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Growth Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track platform expansion and user activation trends</p>
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
                        Export Data
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            {growthQuery.data && <GrowthKPICards data={growthQuery.data} />}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#3b82f6]/5 border border-[#3b82f6]/10">
                    <TabsTrigger value="growth" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <TrendingUp className="h-4 w-4" /> Growth Trends
                    </TabsTrigger>
                    <TabsTrigger value="cohort" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <Grid3X3 className="h-4 w-4" /> Cohort Analysis
                    </TabsTrigger>
                    <TabsTrigger value="trial" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <ArrowRightLeft className="h-4 w-4" /> Trial Conversion
                    </TabsTrigger>
                    <TabsTrigger value="multi" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white gap-2">
                        <Users className="h-4 w-4" /> Multi-Account
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="growth" className="mt-4">
                    {growthQuery.data && <GrowthCharts data={growthQuery.data} period={period} />}
                </TabsContent>

                <TabsContent value="cohort" className="mt-4">
                    {cohortQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : cohortQuery.data ? (
                        <CohortHeatmap data={cohortQuery.data} />
                    ) : null}
                </TabsContent>

                <TabsContent value="trial" className="mt-4">
                    {trialQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : trialQuery.data ? (
                        <TrialConversionFunnel data={trialQuery.data} />
                    ) : null}
                </TabsContent>

                <TabsContent value="multi" className="mt-4">
                    {multiAccountQuery.isLoading ? (
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : multiAccountQuery.data ? (
                        <MultiAccountTable data={multiAccountQuery.data} />
                    ) : null}
                </TabsContent>
            </Tabs>
        </div>
    );
}
