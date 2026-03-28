'use client';

import { useState } from 'react';
import { useSupportQueries, useRespondToSupport, useCloseSupport, useAssignSupport } from '../api/use-support-management';
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
import { AlertCircle, HelpCircle, Clock, CheckCircle2, Search, MessageSquare, XCircle, UserPlus } from 'lucide-react';
import type { SupportItem } from '../api/use-support-management';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
};

const TYPE_LABELS: Record<string, string> = {
    BILLING: 'Billing',
    TECHNICAL_ISSUE: 'Technical',
    FEATURE_REQUEST: 'Feature',
    ACCOUNT: 'Account',
    OTHER: 'Other',
};

export function SupportClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [queryType, setQueryType] = useState('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useSupportQueries({
        page, limit: 20, status: status || undefined, queryType: queryType || undefined, search: search || undefined,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Support</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Total Queries', value: data.kpis.totalQueries, icon: HelpCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Pending', value: data.kpis.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Resolved', value: data.kpis.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Support</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage support queries from property owners</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <Input placeholder="Query number, description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Select value={queryType} onValueChange={(v) => { setQueryType(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Support Queries</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No support queries found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Query #</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Description</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Type</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Created</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                </tr></thead>
                                <tbody>{data.data.map(q => <SupportRow key={q.id} query={q} />)}</tbody>
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

function SupportRow({ query }: { query: SupportItem }) {
    const respondMut = useRespondToSupport();
    const closeMut = useCloseSupport();
    const assignMut = useAssignSupport();
    const [modal, setModal] = useState<'respond' | 'close' | 'assign' | null>(null);
    const [response, setResponse] = useState('');
    const [note, setNote] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const isPending = query.status === 'PENDING';

    return (
        <tr className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
            <td className="py-3 px-3 font-medium text-[#3b82f6] text-xs font-mono">{query.queryNumber}</td>
            <td className="py-3 px-3 text-xs text-muted-foreground max-w-[250px]"><p className="line-clamp-2">{query.queryDescription}</p></td>
            <td className="py-3 px-3 text-center"><Badge variant="outline" className="text-[10px]">{TYPE_LABELS[query.queryType] || query.queryType}</Badge></td>
            <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[query.status] || ''}`}>{query.status}</Badge></td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(query.createdAt).toLocaleDateString('en-IN')}</td>
            <td className="py-3 px-3 text-center">
                {isPending && (
                    <div className="flex gap-1 justify-center">
                        {/* Respond */}
                        <Dialog open={modal === 'respond'} onOpenChange={(o) => setModal(o ? 'respond' : null)}>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-600"><MessageSquare className="h-3 w-3" /></Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Respond — {query.queryNumber}</DialogTitle></DialogHeader>
                                <div><Label>Response Message</Label><Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Enter your response..." rows={4} /></div>
                                <DialogFooter>
                                    <Button onClick={async () => { await respondMut.mutateAsync({ id: query.id, responseMessage: response }); setModal(null); setResponse(''); }} disabled={!response || respondMut.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                                        {respondMut.isPending ? 'Sending...' : 'Send Response'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Close */}
                        <Dialog open={modal === 'close'} onOpenChange={(o) => setModal(o ? 'close' : null)}>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-gray-500"><XCircle className="h-3 w-3" /></Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Close Query — {query.queryNumber}</DialogTitle></DialogHeader>
                                <div><Label>Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for closing..." /></div>
                                <DialogFooter>
                                    <Button onClick={async () => { await closeMut.mutateAsync({ id: query.id, note: note || undefined }); setModal(null); setNote(''); }} disabled={closeMut.isPending} variant="destructive">
                                        {closeMut.isPending ? 'Closing...' : 'Close Query'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Assign */}
                        <Dialog open={modal === 'assign'} onOpenChange={(o) => setModal(o ? 'assign' : null)}>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-sky-600"><UserPlus className="h-3 w-3" /></Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Assign — {query.queryNumber}</DialogTitle></DialogHeader>
                                <div><Label>Admin ID</Label><Input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="Enter admin ID" /></div>
                                <DialogFooter>
                                    <Button onClick={async () => { await assignMut.mutateAsync({ id: query.id, assignedTo }); setModal(null); setAssignedTo(''); }} disabled={!assignedTo || assignMut.isPending} className="bg-sky-600 hover:bg-sky-700">
                                        {assignMut.isPending ? 'Assigning...' : 'Assign'}
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
