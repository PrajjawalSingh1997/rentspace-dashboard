'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface ChartCardProps {
    title: string;
    data: Record<string, unknown>[];
    nameKey: string;
    dataKey: string;
    type: 'pie' | 'bar';
}

export function ChartCard({ title, data, nameKey, dataKey, type }: ChartCardProps) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">{title}</CardTitle></CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[280px] text-muted-foreground">No data available</div>
                ) : type === 'pie' ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={100} dataKey={dataKey} nameKey={nameKey} paddingAngle={3}>
                                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey={nameKey} tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-20} textAnchor="end" height={50} />
                            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <Tooltip />
                            <Bar dataKey={dataKey} fill="#059669" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
