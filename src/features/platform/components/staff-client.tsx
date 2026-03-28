'use client';

import { useState } from 'react';
import { useStaff } from '../api/use-staff-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Users, UserCheck, UserX, Search } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    INVITED: 'bg-sky-100 text-sky-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REMOVED: 'bg-red-100 text-red-700',
};

export function StaffClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useStaff({ page, limit: 20, status: status || undefined, search: search || undefined });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message || 'Failed to load.'}</AlertDescription></Alert>;
    }

    const kpis = [
        { title: 'Total Staff', value: data.kpis.totalStaff, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Active', value: data.kpis.active, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Removed', value: data.kpis.removed, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Staff</h1>
                <p className="text-sm text-muted-foreground mt-1">Cross-platform staff members and property assignments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map((k, i) => (
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
                                <Input placeholder="Name, job title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INVITED">Invited</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REMOVED">Removed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Staff Members</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No staff members found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Name</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Job Title</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Assignments</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Joined</th>
                                </tr></thead>
                                <tbody>{data.data.map(s => (
                                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3 font-medium text-[#3b82f6] text-xs">{s.name || '—'}</td>
                                        <td className="py-3 px-3 text-xs text-muted-foreground">{s.jobTitle || '—'}</td>
                                        <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[s.status] || ''}`}>{s.status}</Badge></td>
                                        <td className="py-3 px-3 text-center text-xs text-muted-foreground">{s.staffAssignments.length}</td>
                                        <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}</tbody>
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
