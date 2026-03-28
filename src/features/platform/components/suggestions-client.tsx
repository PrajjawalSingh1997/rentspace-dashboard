'use client';

import { useState } from 'react';
import { useSuggestions, useUpdateSuggestionStatus } from '../api/use-suggestions-management';
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
import { AlertCircle, Lightbulb, Clock, Rocket, CheckCircle2, Search, RefreshCw } from 'lucide-react';
import type { SuggestionItem } from '../api/use-suggestions-management';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    REVIEWED: 'bg-sky-100 text-sky-700',
    PLANNED: 'bg-violet-100 text-violet-700',
    IMPLEMENTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
};

const CATEGORY_LABELS: Record<string, string> = {
    PROPERTY: 'Property', RENT: 'Rent', TENANT: 'Tenant', MAINTENANCE: 'Maintenance',
    REPORTS: 'Reports', UI: 'UI/UX', OTHER: 'Other',
};

export function SuggestionsClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useSuggestions({
        page, limit: 20, status: status || undefined, category: category || undefined, search: search || undefined,
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
                <AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Suggestions</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Total', value: data.kpis.totalSuggestions, icon: Lightbulb, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Pending', value: data.kpis.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Planned', value: data.kpis.planned, icon: Rocket, color: 'text-violet-600', bg: 'bg-violet-50' },
        { title: 'Implemented', value: data.kpis.implemented, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Suggestions</h1>
                <p className="text-sm text-muted-foreground mt-1">User suggestions pipeline — review, plan, and implement</p>
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
                                <Input placeholder="Title, description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                    <SelectItem value="PLANNED">Planned</SelectItem>
                                    <SelectItem value="IMPLEMENTED">Implemented</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Category</Label>
                            <Select value={category} onValueChange={(v) => { setCategory(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Suggestions Pipeline</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No suggestions found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Title</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Category</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Created</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                </tr></thead>
                                <tbody>{data.data.map(s => <SuggestionRow key={s.id} suggestion={s} />)}</tbody>
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

function SuggestionRow({ suggestion }: { suggestion: SuggestionItem }) {
    const updateStatus = useUpdateSuggestionStatus();
    const [open, setOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(suggestion.status);
    const [note, setNote] = useState('');

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="py-3 px-3">
                <p className="font-medium text-[#3b82f6] text-xs">{suggestion.title}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{suggestion.description}</p>
            </td>
            <td className="py-3 px-3 text-center"><Badge variant="outline" className="text-[10px]">{CATEGORY_LABELS[suggestion.category] || suggestion.category}</Badge></td>
            <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[suggestion.status] || ''}`}>{suggestion.status}</Badge></td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(suggestion.createdAt).toLocaleDateString('en-IN')}</td>
            <td className="py-3 px-3 text-center">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><RefreshCw className="h-3 w-3" /> Update</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Update Status — {suggestion.title}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                            <div>
                                <Label>Pipeline Status</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                        <SelectItem value="PLANNED">Planned</SelectItem>
                                        <SelectItem value="IMPLEMENTED">Implemented</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes..." /></div>
                        </div>
                        <DialogFooter>
                            <Button onClick={async () => { await updateStatus.mutateAsync({ id: suggestion.id, status: newStatus, note: note || undefined }); setOpen(false); setNote(''); }} disabled={updateStatus.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </td>
        </tr>
    );
}
