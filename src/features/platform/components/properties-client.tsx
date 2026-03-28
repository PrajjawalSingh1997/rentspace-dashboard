'use client';

import { useState } from 'react';
import { useProperties, useTransferProperty } from '../api/use-properties-management';
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
import { AlertCircle, Building2, Home, Bed, TrendingUp, Search, ArrowRightLeft } from 'lucide-react';
import type { PropertyItem } from '../api/use-properties-management';

const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const TYPE_COLORS: Record<string, string> = {
    APARTMENT: 'bg-sky-100 text-sky-700', PG: 'bg-violet-100 text-violet-700',
    HOSTEL: 'bg-amber-100 text-amber-700', COMMERCIAL: 'bg-emerald-100 text-emerald-700',
};

export function PropertiesClient() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>('');
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useProperties({ page, limit: 20, type: type || undefined, search: search || undefined });

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
                <AlertTitle>Error Loading Properties</AlertTitle>
                <AlertDescription>{error?.message || 'Failed to fetch data.'}</AlertDescription>
            </Alert>
        );
    }

    const kpiCards = [
        { title: 'Properties', value: data.kpis.totalProperties, icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Units', value: data.kpis.totalUnits, icon: Home, color: 'text-sky-600', bg: 'bg-sky-50' },
        { title: 'Beds', value: data.kpis.totalBeds, icon: Bed, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Occupancy', value: `${data.kpis.occupancyRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#3b82f6]">Properties</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage platform properties, ownership, and metrics</p>
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
                                <Input placeholder="Name, location, owner..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[160px]">
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Select value={type} onValueChange={(v) => { setType(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                                    <SelectItem value="PG">PG</SelectItem>
                                    <SelectItem value="HOSTEL">Hostel</SelectItem>
                                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">All Properties</CardTitle></CardHeader>
                <CardContent>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No properties found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Property</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Type</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Location</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Units</th>
                                    <th className="text-right py-3 px-3 text-muted-foreground font-medium">Rent</th>
                                    <th className="text-right py-3 px-3 text-muted-foreground font-medium">Collected</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.data.map(p => <PropertyRow key={p.id} property={p} />)}
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

function PropertyRow({ property }: { property: PropertyItem }) {
    const transferMut = useTransferProperty();
    const [open, setOpen] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [reason, setReason] = useState('');

    const handleTransfer = async () => {
        await transferMut.mutateAsync({ id: property.id, targetAccountId: accountId, reason });
        setOpen(false); setAccountId(''); setReason('');
    };

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="py-3 px-3">
                <p className="font-medium text-[#3b82f6] text-xs">{property.name}</p>
                <p className="text-[10px] text-muted-foreground">{property.ownerName || '—'}</p>
            </td>
            <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${TYPE_COLORS[property.type] || ''}`}>{property.type}</Badge></td>
            <td className="py-3 px-3 text-xs text-muted-foreground">{property.location}</td>
            <td className="py-3 px-3 text-center text-xs">{property._count.units}</td>
            <td className="py-3 px-3 text-right text-xs font-medium">{formatINR(property.totalRent)}</td>
            <td className="py-3 px-3 text-right text-xs">{formatINR(property.totalRentCollected)}</td>
            <td className="py-3 px-3 text-center">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><ArrowRightLeft className="h-3 w-3" /> Transfer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Transfer Ownership — {property.name}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                            <div><Label>Target Account ID</Label><Input value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Enter account ID" /></div>
                            <div><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Why transferring..." /></div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleTransfer} disabled={!accountId || !reason || transferMut.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                                {transferMut.isPending ? 'Transferring...' : 'Transfer Ownership'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </td>
        </tr>
    );
}
