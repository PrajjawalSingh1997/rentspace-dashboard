'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import type { GrowthAnalyticsResponse } from '../api/use-growth-analytics';

interface GrowthChartsProps {
    data: GrowthAnalyticsResponse;
    period: string;
}

export function GrowthCharts({ data, period }: GrowthChartsProps) {
    const chartData = data.trends.map((t) => ({
        period: formatPeriodLabel(t.period, period),
        Signups: t.signups,
        Churns: t.churns,
        'Net Growth': t.net,
    }));

    return (
        <div className="space-y-6">
            {/* Growth Over Time — Main line chart */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Growth Over Time</CardTitle>
                    <p className="text-sm text-muted-foreground">Cumulative signups vs churns per {period} period</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="Signups" stroke="#059669" fill="url(#signupGradient)" strokeWidth={2.5} dot={{ r: 4, fill: '#059669' }} />
                            <Line type="monotone" dataKey="Churns" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: '#ef4444' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Daily Growth Breakdown — Bar chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">
                            {period.charAt(0).toUpperCase() + period.slice(1)} Growth Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    }}
                                />
                                <Bar dataKey="Signups" fill="#059669" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Churns" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activation Rate — Radial summary */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">Account Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-[280px]">
                            <ActivationGauge totals={data.totals} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ActivationGauge({ totals }: { totals: Record<string, number> }) {
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    const active = totals['ACTIVE'] || 0;
    const rate = total > 0 ? ((active / total) * 100) : 0;

    const statusColors: Record<string, string> = {
        ACTIVE: '#059669',
        TRIAL: '#0ea5e9',
        SUSPENDED: '#f59e0b',
        CLOSED: '#ef4444',
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            {/* Circular indicator */}
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="42" fill="none" stroke="#059669"
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${rate * 2.64} ${264 - rate * 2.64}`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#3b82f6]">{rate.toFixed(0)}%</span>
                    <span className="text-xs text-muted-foreground">Active Rate</span>
                </div>
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {Object.entries(totals).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: statusColors[status] || '#94a3b8' }}
                        />
                        <span className="text-xs text-muted-foreground">{status}</span>
                        <span className="text-xs font-semibold ml-auto">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatPeriodLabel(period: string, type: string): string {
    if (type === 'daily') {
        // YYYY-MM-DD → DD/MM
        const parts = period.split('-');
        return `${parts[2]}/${parts[1]}`;
    }
    if (type === 'weekly') {
        const parts = period.split('-');
        return `W${parts[2]}/${parts[1]}`;
    }
    // monthly: YYYY-MM → MMM 'YY
    const date = new Date(period + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}
