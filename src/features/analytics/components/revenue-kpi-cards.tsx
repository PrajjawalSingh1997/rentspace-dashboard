import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, TrendingUp, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { RevenueKPIs } from '../api/use-revenue-analytics';

interface RevenueKPICardsProps {
    data: RevenueKPIs;
}

const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export function RevenueKPICards({ data }: RevenueKPICardsProps) {
    const kpis = [
        {
            title: 'Total Collected',
            value: formatINR(data.totalCollected),
            icon: IndianRupee,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'MRR',
            value: formatINR(data.mrr),
            icon: TrendingUp,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
        },
        {
            title: 'Collection Rate',
            value: `${data.collectionRate}%`,
            icon: BarChart3,
            color: data.collectionRate >= 80 ? 'text-emerald-600' : 'text-amber-600',
            bgColor: data.collectionRate >= 80 ? 'bg-emerald-50' : 'bg-amber-50',
            change: data.collectionRate >= 80 ? 'healthy' : 'warning',
        },
        {
            title: 'Overdue Amount',
            value: formatINR(data.overdueAmount),
            subtitle: `${data.overdueCount} payments overdue`,
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
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
                        {kpi.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                        )}
                        {kpi.change && (
                            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.change === 'healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {kpi.change === 'healthy' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {kpi.change === 'healthy' ? 'Healthy' : 'Needs attention'}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
