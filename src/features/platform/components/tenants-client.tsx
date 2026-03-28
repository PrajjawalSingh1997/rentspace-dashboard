'use client';

import { useState } from 'react';
import { useTenantContracts, useEditTenant, useExtendLease, useAdjustRent } from '../api/use-tenants-management';
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
import { AlertCircle, Users, UserCheck, UserX, Search, Edit, CalendarPlus, DollarSign } from 'lucide-react';
import type { TenantContractItem } from '../api/use-tenants-management';

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    EXPIRED: 'bg-gray-100 text-gray-600',
    TERMINATED: 'bg-red-100 text-red-700',
};

const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export function TenantsClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useTenantContracts({ page, limit: 20, status: status || undefined, search: search || undefined });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Tenants</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Total Contracts', value: data.kpis.totalContracts, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Active', value: data.kpis.activeContracts, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Expired', value: data.kpis.expiredContracts, icon: UserX, color: 'text-gray-500', bg: 'bg-gray-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Tenants</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage tenant contracts, leases, and rent adjustments</p>
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
                                <Input placeholder="Tenant, property, unit, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[160px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Tenant Contracts</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No tenant contracts found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Tenant</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Property • Unit</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-right py-3 px-3 text-muted-foreground font-medium">Rent</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Lease End</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.data.map(t => <TenantRow key={t.id} tenant={t} />)}
                                </tbody>
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

function TenantRow({ tenant }: { tenant: TenantContractItem }) {
    const editMut = useEditTenant();
    const extendMut = useExtendLease();
    const adjustMut = useAdjustRent();
    const [modal, setModal] = useState<'edit' | 'extend' | 'adjust' | null>(null);
    const [name, setName] = useState(tenant.tenantName || '');
    const [phone, setPhone] = useState(tenant.tenantPhone || '');
    const [months, setMonths] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [reason, setReason] = useState('');

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="py-3 px-3">
                <p className="font-medium text-[#3b82f6] text-xs">{tenant.tenantName || '—'}</p>
                <p className="text-[10px] text-muted-foreground">{tenant.tenantPhone || '—'}</p>
            </td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{tenant.propertyName || '—'} • {tenant.unitNumber || '—'}</td>
            <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[tenant.status] || ''}`}>{tenant.status}</Badge></td>
            <td className="py-3 px-3 text-right text-xs font-medium">{tenant.rentShare ? formatINR(tenant.rentShare) : '—'}</td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString('en-IN') : '—'}</td>
            <td className="py-3 px-3 text-center">
                <div className="flex gap-1 justify-center">
                    {/* Edit */}
                    <Dialog open={modal === 'edit'} onOpenChange={(o) => setModal(o ? 'edit' : null)}>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Edit className="h-3 w-3" /></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Edit Tenant Details</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                                <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                                <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                            </div>
                            <DialogFooter><Button onClick={async () => { await editMut.mutateAsync({ id: tenant.id, tenantName: name, tenantPhone: phone }); setModal(null); }} disabled={editMut.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">{editMut.isPending ? 'Saving...' : 'Save'}</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Extend Lease */}
                    <Dialog open={modal === 'extend'} onOpenChange={(o) => setModal(o ? 'extend' : null)}>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-sky-600"><CalendarPlus className="h-3 w-3" /></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Extend Lease</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                                <div><Label>Months to Extend</Label><Input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="e.g. 6" /></div>
                                <div><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} /></div>
                            </div>
                            <DialogFooter><Button onClick={async () => { await extendMut.mutateAsync({ id: tenant.id, extensionMonths: parseInt(months), reason }); setModal(null); setMonths(''); setReason(''); }} disabled={!months || !reason || extendMut.isPending} className="bg-sky-600 hover:bg-sky-700">{extendMut.isPending ? 'Extending...' : 'Extend'}</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Adjust Rent */}
                    <Dialog open={modal === 'adjust'} onOpenChange={(o) => setModal(o ? 'adjust' : null)}>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-amber-600"><DollarSign className="h-3 w-3" /></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Adjust Rent</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                                <div><Label>New Rent Amount (₹)</Label><Input type="number" value={rentAmount} onChange={e => setRentAmount(e.target.value)} /></div>
                                <div><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} /></div>
                            </div>
                            <DialogFooter><Button onClick={async () => { await adjustMut.mutateAsync({ id: tenant.id, newRentAmount: parseFloat(rentAmount), reason }); setModal(null); setRentAmount(''); setReason(''); }} disabled={!rentAmount || !reason || adjustMut.isPending} className="bg-amber-600 hover:bg-amber-700">{adjustMut.isPending ? 'Adjusting...' : 'Adjust'}</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </td>
        </tr>
    );
}
