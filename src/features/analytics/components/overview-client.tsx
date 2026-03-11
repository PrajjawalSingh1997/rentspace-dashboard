'use client';

import { useOverview } from '../api/use-overview';
import { AlertBanner } from './alert-banner';
import { KPICards } from './kpi-cards';
import { StatusCards } from './status-cards';
import { OverviewCharts } from './overview-charts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function OverviewClient() {
    const { data, isLoading, isError, error } = useOverview('monthly');

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl mt-6" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Dashboard</AlertTitle>
                <AlertDescription>
                    {error?.message || 'Failed to fetch the overview data. Please try again.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col space-y-4 fade-in-0 animate-in duration-500">
            <AlertBanner />
            <KPICards data={data} />
            <StatusCards data={data} />
            <OverviewCharts data={data} />
        </div>
    );
}
