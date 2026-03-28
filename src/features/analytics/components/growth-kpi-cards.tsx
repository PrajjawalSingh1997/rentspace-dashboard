import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Home, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { GrowthAnalyticsResponse } from '../api/use-growth-analytics';

interface GrowthKPICardsProps {
    data: GrowthAnalyticsResponse;
}

export function GrowthKPICards({ data }: GrowthKPICardsProps) {
    // Compute totals from latest trends
    const latestTrends = data.trends.slice(-1)[0];
    const prevTrends = data.trends.slice(-2, -1)[0];

    const totalSignups = data.trends.reduce((sum, t) => sum + t.signups, 0);
    const totalChurns = data.trends.reduce((sum, t) => sum + t.churns, 0);
    const netGrowth = totalSignups - totalChurns;

    const kpis = [
        {
            title: 'New Signups',
            value: totalSignups.toLocaleString(),
            change: latestTrends && prevTrends ? ((latestTrends.signups - prevTrends.signups) / (prevTrends.signups || 1) * 100) : 0,
            icon: Users,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Accounts Created',
            value: (data.totals['ACTIVE'] || 0).toLocaleString(),
            change: 0,
            icon: Building2,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
        },
        {
            title: 'Net Growth',
            value: netGrowth >= 0 ? `+${netGrowth.toLocaleString()}` : netGrowth.toLocaleString(),
            change: netGrowth >= 0 ? 1 : -1,
            icon: Home,
            color: netGrowth >= 0 ? 'text-emerald-600' : 'text-red-600',
            bgColor: netGrowth >= 0 ? 'bg-emerald-50' : 'bg-red-50',
        },
        {
            title: 'Total Churned',
            value: totalChurns.toLocaleString(),
            change: latestTrends && prevTrends ? ((latestTrends.churns - prevTrends.churns) / (prevTrends.churns || 1) * 100) : 0,
            icon: UserCheck,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {kpi.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#3b82f6]">{kpi.value}</div>
                        {kpi.change !== 0 && typeof kpi.change === 'number' && (
                            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {kpi.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(kpi.change).toFixed(1)}%
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
