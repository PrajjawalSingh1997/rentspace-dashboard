'use client';

import { useState } from 'react';
import { useRentPayments, useManualPayment, useWaiveCharges, useMarkPaid } from '../api/use-rent-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AlertCircle, DollarSign, Clock, TrendingUp, AlertTriangle,
    Search, Plus, CheckCircle, XCircle
} from 'lucide-react';
import type { RentPaymentItem } from '../api/use-rent-management';
import { RoleGate } from '@/components/ui/role-gate';

const STATUS_COLORS: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700',
    DUE: 'bg-sky-100 text-sky-700',
    OVERDUE: 'bg-red-100 text-red-700',
    PARTIALLY_PAID: 'bg-amber-100 text-amber-700',
    PENDING_APPROVAL: 'bg-purple-100 text-purple-700',
};

const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export function RentClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>('');
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, error } = useRentPayments({ page, limit: 20, status: status || undefined, search: search || undefined });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Rent Data</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Total Due', value: formatINR(data.kpis.totalDue), icon: DollarSign, color: 'text-sky-600', bg: 'bg-sky-50' },
        { title: 'Total Collected', value: formatINR(data.kpis.totalCollected), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Total Payments', value: data.kpis.totalPayments.toLocaleString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Overdue', value: data.kpis.overdueCount.toLocaleString(), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Rent Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">Platform-wide rent payments, actions, and overdue tracking</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => (
                    <Card key={i} className="hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${kpi.bg}`}>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-xs text-muted-foreground">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tenant, property, unit..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="min-w-[160px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="DUE">Due</SelectItem>
                                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                                    <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Rent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.data.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No rent payments found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Tenant</th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Property</th>
                                        <th className="text-right py-3 px-3 text-muted-foreground font-medium">Rent</th>
                                        <th className="text-right py-3 px-3 text-muted-foreground font-medium">Paid</th>
                                        <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Due Date</th>
                                        <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map(p => (
                                        <PaymentRow key={p.id} payment={p} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <p className="text-xs text-muted-foreground">
                                Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                                <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function PaymentRow({ payment }: { payment: RentPaymentItem }) {
    const manualPayment = useManualPayment();
    const waiveCharges = useWaiveCharges();
    const markPaid = useMarkPaid();
    const [modalOpen, setModalOpen] = useState<'manual' | 'waive' | 'mark' | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('CASH');
    const [note, setNote] = useState('');

    const isPaid = payment.status === 'PAID';

    const handleManualPayment = async () => {
        await manualPayment.mutateAsync({
            rentPaymentId: payment.id,
            amount: parseFloat(amount),
            paymentMode,
            referenceNote: note,
        });
        setModalOpen(null);
        setAmount(''); setNote('');
    };

    const handleWaive = async () => {
        await waiveCharges.mutateAsync({ id: payment.id, reason: note });
        setModalOpen(null);
        setNote('');
    };

    const handleMarkPaid = async () => {
        await markPaid.mutateAsync({ id: payment.id, note: note || undefined });
        setModalOpen(null);
        setNote('');
    };

    return (
        <tr className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${payment.status === 'OVERDUE' ? 'bg-red-50/30' : ''}`}>
            <td className="py-3 px-3 font-medium text-[#3b82f6] text-xs">{payment.tenantName || '—'}</td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{payment.propertyName || '—'} {payment.unitNumber ? `• ${payment.unitNumber}` : ''}</td>
            <td className="py-3 px-3 text-right text-xs font-medium">{formatINR(payment.rentAmount)}</td>
            <td className="py-3 px-3 text-right text-xs">{formatINR(payment.paidAmount)}</td>
            <td className="py-3 px-3 text-center">
                <Badge className={`text-[10px] ${STATUS_COLORS[payment.status] || 'bg-gray-100 text-gray-600'}`}>{payment.status}</Badge>
            </td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(payment.dueDate).toLocaleDateString('en-IN')}</td>
            <td className="py-3 px-3 text-center">
                {!isPaid && (
                    <RoleGate action="rent:manual-payment">
                    <div className="flex gap-1 justify-center">
                        {/* Manual Payment Modal */}
                        <Dialog open={modalOpen === 'manual'} onOpenChange={(o) => setModalOpen(o ? 'manual' : null)}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" /> Pay</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Record Manual Payment</DialogTitle></DialogHeader>
                                <div className="space-y-3">
                                    <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" /></div>
                                    <div>
                                        <Label>Payment Mode</Label>
                                        <Select value={paymentMode} onValueChange={setPaymentMode}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CASH">Cash</SelectItem>
                                                <SelectItem value="UPI">UPI</SelectItem>
                                                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                                <SelectItem value="CHEQUE">Cheque</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div><Label>Reference Note</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Receipt #, ref..." /></div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleManualPayment} disabled={!amount || !note || manualPayment.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                                        {manualPayment.isPending ? 'Processing...' : 'Record Payment'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Waive Charges */}
                        <Dialog open={modalOpen === 'waive'} onOpenChange={(o) => setModalOpen(o ? 'waive' : null)}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-amber-600"><XCircle className="h-3 w-3" /> Waive</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Waive Overdue Charges</DialogTitle></DialogHeader>
                                <div><Label>Reason</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Why waiving..." /></div>
                                <DialogFooter>
                                    <Button onClick={handleWaive} disabled={!note || waiveCharges.isPending} variant="destructive">
                                        {waiveCharges.isPending ? 'Processing...' : 'Waive Charges'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Mark Paid */}
                        <Dialog open={modalOpen === 'mark'} onOpenChange={(o) => setModalOpen(o ? 'mark' : null)}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-600"><CheckCircle className="h-3 w-3" /> Paid</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Mark as Paid</DialogTitle></DialogHeader>
                                <div><Label>Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes..." /></div>
                                <DialogFooter>
                                    <Button onClick={handleMarkPaid} disabled={markPaid.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                                        {markPaid.isPending ? 'Processing...' : 'Mark as Paid'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    </RoleGate>
                )}
            </td>
        </tr>
    );
}
