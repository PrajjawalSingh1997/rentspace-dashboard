'use client';

import { useState } from 'react';
import { useGenerateReport } from '../api/use-reports-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, BarChart2 } from 'lucide-react';

const METRICS = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'accounts', label: 'Accounts' },
    { key: 'properties', label: 'Properties' },
    { key: 'tenants', label: 'Tenants' },
    { key: 'rent_payments', label: 'Rent Payments' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'move_outs', label: 'Move-Outs' },
    { key: 'support_queries', label: 'Support Queries' },
    { key: 'suggestions', label: 'Suggestions' },
];

export function ReportsClient() {
    const generate = useGenerateReport();
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'accounts']);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [groupBy, setGroupBy] = useState('month');
    const [reportData, setReportData] = useState<{ generatedAt: string; groupBy: string; data: Record<string, { totalAmount?: number; count: number }> } | null>(null);

    const toggleMetric = (key: string) => {
        setSelectedMetrics(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleGenerate = async () => {
        const result = await generate.mutateAsync({
            metrics: selectedMetrics,
            dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
            dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
            groupBy,
        });
        setReportData(result.report as any);
    };

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Reports</h1>
                <p className="text-sm text-muted-foreground mt-1">Generate dynamic reports from platform data</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Builder */}
                <Card className="border-0 shadow-sm lg:col-span-1">
                    <CardHeader><CardTitle className="text-sm font-semibold text-[#3b82f6] flex items-center gap-2"><FileText className="h-4 w-4" /> Report Builder</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Select Metrics</Label>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                {METRICS.map(m => (
                                    <div key={m.key} className="flex items-center space-x-2">
                                        <Checkbox id={m.key} checked={selectedMetrics.includes(m.key)} onCheckedChange={() => toggleMetric(m.key)} />
                                        <label htmlFor={m.key} className="text-xs text-gray-700 cursor-pointer">{m.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div><Label className="text-xs text-muted-foreground">From</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
                            <div><Label className="text-xs text-muted-foreground">To</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Group By</Label>
                            <Select value={groupBy} onValueChange={setGroupBy}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['day', 'week', 'month', 'quarter', 'year'].map(g => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={selectedMetrics.length === 0 || generate.isPending} className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 gap-1.5">
                            <BarChart2 className="h-4 w-4" />{generate.isPending ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Report Results */}
                <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader><CardTitle className="text-sm font-semibold text-[#3b82f6]">Report Results</CardTitle></CardHeader>
                    <CardContent>
                        {!reportData ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <BarChart2 className="h-12 w-12 mb-3 opacity-30" />
                                <p className="text-sm">Select metrics and generate a report</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">Generated: {new Date(reportData.generatedAt).toLocaleString('en-IN')}</p>
                                    <Badge variant="outline" className="text-[10px]">Group: {reportData.groupBy}</Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(reportData.data).map(([key, value]) => (
                                        <div key={key} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{key.replace(/_/g, ' ')}</p>
                                            {value.totalAmount !== undefined ? (
                                                <div><p className="text-xl font-bold text-[#3b82f6]">₹{value.totalAmount.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">{value.count} records</p></div>
                                            ) : (
                                                <p className="text-xl font-bold text-[#3b82f6]">{value.count?.toLocaleString('en-IN') || 0}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
