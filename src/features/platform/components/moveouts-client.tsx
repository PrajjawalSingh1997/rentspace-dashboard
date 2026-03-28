'use client';

import { useState } from 'react';
import { useMoveOutRequests, useApproveMoveOut, useDeclineMoveOut } from '../api/use-moveouts-management';
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
import { AlertCircle, LogOut, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import type { MoveOutItem } from '../api/use-moveouts-management';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    DECLINED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
    COMPLETED: 'bg-sky-100 text-sky-700',
};

const REASON_LABELS: Record<string, string> = {
    RENT_INCREASE: 'Rent Increase',
    FAMILY_REASONS: 'Family Reasons',
    JOB_TRANSFER: 'Job Transfer',
    SHIFTING_TO_OTHER_CITY: 'Shifting City',
    OTHER: 'Other',
};

export function MoveOutsClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useMoveOutRequests({
        page, limit: 20, status: status || undefined, search: search || undefined,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Move-Outs</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Total Requests', value: data.kpis.totalRequests, icon: LogOut, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Pending', value: data.kpis.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Approved', value: data.kpis.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Declined', value: data.kpis.declined, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Move-Outs</h1>
                <p className="text-sm text-muted-foreground mt-1">Cross-platform move-out requests pending queue and approvals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((k, i) => (
                    <Card key={i} className="hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${k.bg}`}><k.icon className={`h-4 w-4 ${k.color}`} /></div>
                        </CardHeader>
                        <CardContent><div className={`text-2xl font-bold ${k.color}`}>{k.value}</div></CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-xs text-muted-foreground">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Tenant, property..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[160px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="DECLINED">Declined</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Move-Out Requests</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No move-out requests found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Tenant</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Property • Unit</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Reason</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Move-Out Date</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                </tr></thead>
                                <tbody>{data.data.map(r => <MoveOutRow key={r.id} request={r} />)}</tbody>
                            </table>
                        </div>
                    )}
                    {data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <p className="text-xs text-muted-foreground">Page {data.pagination.page} of {data.pagination.totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                                <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function MoveOutRow({ request }: { request: MoveOutItem }) {
    const approveMut = useApproveMoveOut();
    const declineMut = useDeclineMoveOut();
    const [modal, setModal] = useState<'approve' | 'decline' | null>(null);
    const [note, setNote] = useState('');
    const [declineReason, setDeclineReason] = useState('');

    const isPending = request.status === 'PENDING';

    return (
        <tr className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
            <td className="py-3 px-3 font-medium text-[#3b82f6] text-xs">{request.contract.tenantName || '—'}</td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{request.contract.propertyName || '—'} • {request.contract.unitNumber || '—'}</td>
            <td className="py-3 px-3 text-center"><Badge variant="outline" className="text-[10px]">{REASON_LABELS[request.reason] || request.reason}</Badge></td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(request.moveOutDate).toLocaleDateString('en-IN')}</td>
            <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[request.status] || ''}`}>{request.status}</Badge></td>
            <td className="py-3 px-3 text-center">
                {isPending && (
                    <div className="flex gap-1 justify-center">
                        {/* Approve */}
                        <Dialog open={modal === 'approve'} onOpenChange={(o) => setModal(o ? 'approve' : null)}>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-600"><CheckCircle className="h-3 w-3" /> Approve</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Approve Move-Out</DialogTitle></DialogHeader>
                                <div><Label>Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes..." /></div>
                                <DialogFooter>
                                    <Button onClick={async () => { await approveMut.mutateAsync({ id: request.id, note: note || undefined }); setModal(null); setNote(''); }} disabled={approveMut.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                                        {approveMut.isPending ? 'Approving...' : 'Approve'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Decline */}
                        <Dialog open={modal === 'decline'} onOpenChange={(o) => setModal(o ? 'decline' : null)}>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-red-500"><XCircle className="h-3 w-3" /> Decline</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Decline Move-Out</DialogTitle></DialogHeader>
                                <div className="space-y-3">
                                    <div><Label>Reason</Label><Input value={declineReason} onChange={e => setDeclineReason(e.target.value)} placeholder="Reason for decline..." /></div>
                                    <div><Label>Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes..." /></div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={async () => { await declineMut.mutateAsync({ id: request.id, declineReason, declineNote: note || undefined }); setModal(null); setDeclineReason(''); setNote(''); }} disabled={!declineReason || declineMut.isPending} variant="destructive">
                                        {declineMut.isPending ? 'Declining...' : 'Decline'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </td>
        </tr>
    );
}
