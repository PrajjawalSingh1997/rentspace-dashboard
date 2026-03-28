'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart
} from 'recharts';
import type { RevenueAnalyticsResponse } from '../api/use-revenue-analytics';

interface RevenueChartsProps {
    data: RevenueAnalyticsResponse;
    period: string;
}

const formatINR = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
};

export function RevenueCharts({ data, period }: RevenueChartsProps) {
    const chartData = data.rentPerMonth.map(r => ({
        period: formatPeriodLabel(r.period, period),
        'Rent Collected': r.amount,
    }));

    return (
        <div className="space-y-6">
            {/* Rent Collection Trend */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Rent Collection Trend</CardTitle>
                    <p className="text-sm text-muted-foreground">Rent collected per {period} period</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <YAxis tickFormatter={formatINR} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <Tooltip
                                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Collected']}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Rent Collected"
                                stroke="#059669"
                                fill="url(#revenueGradient)"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#059669' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Due"
                    value={`₹${data.kpis.totalDue.toLocaleString('en-IN')}`}
                    subtitle="Expected rent amount"
                    color="text-teal-600"
                    bgColor="bg-teal-50"
                />
                <SummaryCard
                    title="Total Collected"
                    value={`₹${data.kpis.totalCollected.toLocaleString('en-IN')}`}
                    subtitle="Rent received"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <SummaryCard
                    title="Outstanding"
                    value={`₹${(data.kpis.totalDue - data.kpis.totalCollected).toLocaleString('en-IN')}`}
                    subtitle="Yet to be collected"
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
            </div>
        </div>
    );
}

function SummaryCard({ title, value, subtitle, color, bgColor }: {
    title: string; value: string; subtitle: string; color: string; bgColor: string;
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

function formatPeriodLabel(period: string, type: string): string {
    if (type === 'daily') {
        const parts = period.split('-');
        return `${parts[2]}/${parts[1]}`;
    }
    const date = new Date(period + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}
