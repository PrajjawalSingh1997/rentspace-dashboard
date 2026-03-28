'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { RentCycleResponse } from '../api/use-revenue-analytics';

interface RentCycleTabProps {
    data: RentCycleResponse;
}

const STATUS_COLORS: Record<string, string> = {
    PAID: '#059669',
    DUE: '#0ea5e9',
    OVERDUE: '#ef4444',
    PARTIALLY_PAID: '#f59e0b',
    PENDING_APPROVAL: '#8b5cf6',
};

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function RentCycleTab({ data }: RentCycleTabProps) {
    const agingData = Object.entries(data.overdueAging).map(([bracket, count]) => ({
        bracket: `${bracket} days`,
        count,
    }));

    return (
        <div className="space-y-6">
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Cycle Period</p>
                        <p className="text-xl font-bold text-[#3b82f6] mt-1">{MONTH_NAMES[data.cycle.month]} {data.cycle.year}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Payments</p>
                        <p className="text-2xl font-bold text-[#3b82f6] mt-1">{data.totalPayments}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Prorated Rents</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-2xl font-bold text-teal-600">{data.proratedCount}</p>
                            <Badge variant="secondary" className="text-xs">
                                {data.totalPayments > 0 ? ((data.proratedCount / data.totalPayments) * 100).toFixed(1) : 0}%
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Donut */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">Rent Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.statusBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={data.statusBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="count"
                                        nameKey="status"
                                        paddingAngle={3}
                                    >
                                        {data.statusBreakdown.map((entry, i) => (
                                            <Cell key={i} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-muted-foreground">No data for this cycle</div>
                        )}
                    </CardContent>
                </Card>

                {/* Overdue Aging */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">Overdue Aging</CardTitle>
                        <p className="text-sm text-muted-foreground">Distribution of overdue payments by age bracket</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={agingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="bracket" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]}>
                                    {agingData.map((_, i) => (
                                        <Cell key={i} fill={i < 2 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Status Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {data.statusBreakdown.map(s => (
                            <div key={s.status} className="flex flex-col items-center p-4 rounded-xl bg-gray-50/50">
                                <div
                                    className="w-3 h-3 rounded-full mb-2"
                                    style={{ backgroundColor: STATUS_COLORS[s.status] || '#94a3b8' }}
                                />
                                <p className="text-xs text-muted-foreground">{s.status}</p>
                                <p className="text-xl font-bold text-[#3b82f6]">{s.count}</p>
                                <p className="text-xs text-muted-foreground">₹{s.totalRent.toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
