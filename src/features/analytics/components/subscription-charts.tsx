'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { SubscriptionAnalyticsResponse } from '../api/use-subscription-analytics';

const PLAN_COLORS = ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444'];

export function PlanDistributionChart({ data }: { data: SubscriptionAnalyticsResponse }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">Plan Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Subscribers per plan</p>
            </CardHeader>
            <CardContent>
                {data.planDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.planDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={110}
                                dataKey="subscribers"
                                nameKey="planName"
                                paddingAngle={3}
                            >
                                {data.planDistribution.map((_, i) => (
                                    <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number, name: string) => [value, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">No plan data</div>
                )}
            </CardContent>
        </Card>
    );
}

export function BillingCycleChart({ data }: { data: SubscriptionAnalyticsResponse }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">Billing Cycles</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of billing frequencies</p>
            </CardHeader>
            <CardContent>
                {data.billingCycles.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.billingCycles}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="cycle" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">No billing data</div>
                )}
            </CardContent>
        </Card>
    );
}
