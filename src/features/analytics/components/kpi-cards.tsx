import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Home, UserCheck, IndianRupee, Wallet } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import type { AnalyticsOverview } from '../api/use-overview';

interface KPICardsProps {
    data: AnalyticsOverview;
}

export function KPICards({ data }: KPICardsProps) {
    // Format currency
    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const kpis = [
        {
            title: 'Total Users',
            value: data.users.total.toLocaleString(),
            icon: Users,
            color: 'text-blue-500'
        },
        {
            title: 'Total Accounts',
            value: data.accounts.total.toLocaleString(),
            icon: Building2,
            color: 'text-indigo-500'
        },
        {
            title: 'Total Properties',
            value: data.portfolio.properties.toLocaleString(),
            icon: Home,
            color: 'text-emerald-500'
        },
        {
            title: 'Total Units',
            value: data.portfolio.units.toLocaleString(),
            icon: Home,
            color: 'text-teal-500'
        },
        {
            title: 'Total Tenants',
            value: data.portfolio.tenants.toLocaleString(),
            icon: UserCheck,
            color: 'text-green-500'
        },
        {
            title: 'MRR',
            value: formatINR(data.financials.mrr),
            icon: IndianRupee,
            color: 'text-amber-500'
        },
        {
            title: 'Total Rent Collected',
            value: formatINR(data.financials.totalRentCollected),
            icon: Wallet,
            color: 'text-orange-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {kpis.map((kpi, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            {kpi.title}
                        </CardTitle>
                        <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{kpi.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
