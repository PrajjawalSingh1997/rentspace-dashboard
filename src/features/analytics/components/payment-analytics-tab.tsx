'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { PaymentAnalyticsResponse } from '../api/use-revenue-analytics';

interface PaymentAnalyticsTabProps {
    data: PaymentAnalyticsResponse;
}

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export function PaymentAnalyticsTab({ data }: PaymentAnalyticsTabProps) {
    return (
        <div className="space-y-6">
            {/* Rate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RateCard title="Success Rate" value={`${data.rates.successRate}%`} color="text-emerald-600" />
                <RateCard title="Failure Rate" value={`${data.rates.failureRate}%`} color="text-red-500" />
                <RateCard title="Total Orders" value={data.rates.totalOrders.toLocaleString()} color="text-teal-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Mode Distribution */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.paymentModes.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={data.paymentModes}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="count"
                                        nameKey="mode"
                                        paddingAngle={3}
                                    >
                                        {data.paymentModes.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number, name: string) => [value, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-muted-foreground">No payment data available</div>
                        )}
                    </CardContent>
                </Card>

                {/* Provider Breakdown */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#3b82f6]">Payment Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.providers.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={data.providers} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                    <YAxis type="category" dataKey="provider" tick={{ fontSize: 11 }} width={100} stroke="#94a3b8" />
                                    <Tooltip formatter={(value: number) => [formatINR(value), 'Amount']} />
                                    <Bar dataKey="amount" fill="#059669" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-muted-foreground">No provider data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Statuses */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Order Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.orderStatuses.map(os => (
                            <div key={os.status} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50">
                                <div>
                                    <p className="text-sm text-muted-foreground">{os.status}</p>
                                    <p className="text-xl font-bold text-[#3b82f6]">{os.count.toLocaleString()}</p>
                                </div>
                                <Badge variant={os.status === 'PAID' ? 'default' : os.status === 'FAILED' ? 'destructive' : 'secondary'}>
                                    {formatINR(os.amount)}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function RateCard({ title, value, color }: { title: string; value: string; color: string; }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </CardContent>
        </Card>
    );
}
