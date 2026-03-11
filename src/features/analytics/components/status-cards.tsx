import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, UserPlus, UserMinus, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINR } from '@/lib/utils';
import type { AnalyticsOverview } from '../api/use-overview';

interface StatusCardsProps {
    data: AnalyticsOverview;
}

export function StatusCards({ data }: StatusCardsProps) {
    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const donutData = [
        { name: 'Active', value: data.accounts.active },
        { name: 'Inactive', value: data.accounts.total - data.accounts.active },
    ];
    const COLORS = ['#10b981', '#f43f5e']; // Emerald and Rose

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MRR</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatINR(data.financials.mrr)}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">Monthly Recurring Revenue</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Signups</CardTitle>
                    <UserPlus className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{15}</div>
                    <p className="text-xs text-muted-foreground mt-1">This Month vs {10} Last Month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Churned</CardTitle>
                    <UserMinus className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.accounts.churned}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-red-500">Accounts lost</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                    <Activity className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.accounts.churnRate.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Platform-wide Account Churn</p>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-0">
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={40}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {donutData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1 pr-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Inactive</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
