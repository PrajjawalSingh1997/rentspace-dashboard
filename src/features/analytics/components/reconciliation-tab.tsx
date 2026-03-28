import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { ReconciliationResponse } from '../api/use-revenue-analytics';

interface ReconciliationTabProps {
    data: ReconciliationResponse;
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function ReconciliationTab({ data }: ReconciliationTabProps) {
    return (
        <div className="space-y-6">
            {/* Period & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Period</p>
                        <p className="text-xl font-bold text-[#3b82f6] mt-1">{MONTH_NAMES[data.month]} {data.year}</p>
                    </CardContent>
                </Card>
                <SummaryCard label="Matched" value={data.summary.matched} total={data.summary.total} icon={CheckCircle2} color="text-emerald-600" bgColor="bg-emerald-50" />
                <SummaryCard label="Mismatched" value={data.summary.mismatched} total={data.summary.total} icon={XCircle} color="text-red-500" bgColor="bg-red-50" />
                <SummaryCard label="Pending" value={data.summary.pending} total={data.summary.total} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
            </div>

            {/* Items Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Reconciliation Details</CardTitle>
                    <p className="text-sm text-muted-foreground">{data.items.length} rent payments for {MONTH_NAMES[data.month]} {data.year}</p>
                </CardHeader>
                <CardContent>
                    {data.items.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">No payments to reconcile.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tenant</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Property</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Unit</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Expected</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Paid</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Txn Total</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Diff</th>
                                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map(item => (
                                        <tr key={item.rentPaymentId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-[#3b82f6]">{item.tenantName || '—'}</td>
                                            <td className="py-3 px-4 text-muted-foreground text-xs max-w-[120px] truncate">{item.propertyName || '—'}</td>
                                            <td className="py-3 px-4 text-muted-foreground">{item.unitNumber || '—'}</td>
                                            <td className="py-3 px-4 text-right">₹{item.expectedAmount.toLocaleString('en-IN')}</td>
                                            <td className="py-3 px-4 text-right">₹{item.paidAmount.toLocaleString('en-IN')}</td>
                                            <td className="py-3 px-4 text-right">₹{item.transactionTotal.toLocaleString('en-IN')}</td>
                                            <td className={`py-3 px-4 text-right font-medium ${item.difference === 0 ? '' : item.difference > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {item.difference > 0 ? '+' : ''}₹{item.difference.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge
                                                    variant={item.status === 'MATCHED' ? 'default' : item.status === 'MISMATCHED' ? 'destructive' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function SummaryCard({ label, value, total, icon: Icon, color, bgColor }: {
    label: string; value: number; total: number; icon: typeof CheckCircle2; color: string; bgColor: string;
}) {
    const pct = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{pct}% of total</p>
                    </div>
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
