'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import type { AnalyticsOverview } from '../api/use-overview';

interface OverviewChartsProps {
    data: AnalyticsOverview;
}

export function OverviewCharts({ data }: OverviewChartsProps) {
    // Placeholder data for charts until time-series backend API is ready
    const dauData = [
        { date: 'Mon', active: 120 }, { date: 'Tue', active: 132 },
        { date: 'Wed', active: 141 }, { date: 'Thu', active: 156 },
        { date: 'Fri', active: 168 }, { date: 'Sat', active: 121 },
        { date: 'Sun', active: 110 }
    ];

    const signupTrend = [
        { date: 'W1', signups: 10 }, { date: 'W2', signups: 15 },
        { date: 'W3', signups: 8 }, { date: 'W4', signups: 0 }
    ];

    const healthScore = [
        { score: '0-40', count: 5 },
        { score: '41-70', count: 12 },
        { score: '71-100', count: Math.max(0, data.accounts.active - 17) }
    ];

    return (
        <div className="flex flex-col gap-4 mt-4">
            {/* Row 3: Mini Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Rent Collection Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Simple Progress Bar representation of the gauge */}
                        <div className="w-full bg-gray-100 rounded-full h-4 mt-4 overflow-hidden border">
                            <div
                                className="bg-emerald-500 h-4 rounded-full"
                                style={{ width: `${Math.min(100, (data.financials.totalRentCollected / Math.max(1, data.financials.mrr || 1)) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                            <span>Collected</span>
                            <span>Target</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Signup Trend (30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signupTrend}>
                                <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Account Health Scores</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={healthScore} layout="vertical" margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="score" type="category" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Row 4: Activity Area Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="col-span-1 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Daily Active Users (DAU)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dauData}>
                                <defs>
                                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#084734" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#084734" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="active" stroke="#084734" fillOpacity={1} fill="url(#colorDau)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Platform Activity Volumes</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center bg-gray-50/50 rounded-md border border-dashed border-gray-200 m-4 mt-0 text-gray-500">
                        [API Log Data Integration Pending]
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
