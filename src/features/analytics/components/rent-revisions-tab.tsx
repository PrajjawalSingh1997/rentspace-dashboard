import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { RentRevisionsResponse } from '../api/use-revenue-analytics';

interface RentRevisionsTabProps {
    data: RentRevisionsResponse;
}

export function RentRevisionsTab({ data }: RentRevisionsTabProps) {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Revisions</p>
                        <p className="text-3xl font-bold text-[#3b82f6] mt-1">{data.summary.totalRevisions}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Avg Revision %</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className={`text-3xl font-bold ${data.summary.avgRevisionPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {data.summary.avgRevisionPct >= 0 ? '+' : ''}{data.summary.avgRevisionPct}%
                            </p>
                            {data.summary.avgRevisionPct >= 0 ? (
                                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <ArrowDownRight className="h-5 w-5 text-red-500" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revisions Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Recent Rent Revisions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Showing {data.data.length} of {data.total} revisions
                    </p>
                </CardHeader>
                <CardContent>
                    {data.data.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">No revisions found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tenant</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Unit</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Previous</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">New</th>
                                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Change</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Effective</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((rev) => {
                                        const changePct = rev.previousAmount > 0
                                            ? ((rev.newAmount - rev.previousAmount) / rev.previousAmount * 100).toFixed(1)
                                            : '0';
                                        const isIncrease = rev.newAmount >= rev.previousAmount;

                                        return (
                                            <tr key={rev.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-[#3b82f6]">{rev.contract?.tenant?.name || '—'}</td>
                                                <td className="py-3 px-4 text-muted-foreground">{rev.contract?.unit?.unitNumber || '—'}</td>
                                                <td className="py-3 px-4 text-right text-muted-foreground">₹{rev.previousAmount.toLocaleString('en-IN')}</td>
                                                <td className="py-3 px-4 text-right font-medium">₹{rev.newAmount.toLocaleString('en-IN')}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge variant={isIncrease ? 'default' : 'destructive'} className="text-xs">
                                                        {isIncrease ? '+' : ''}{changePct}%
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(rev.effectiveFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground text-xs max-w-[150px] truncate">{rev.reason || '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
