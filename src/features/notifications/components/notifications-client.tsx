'use client';

import { useState } from 'react';
import { useDeliveryAnalytics, useNotificationHistory, useSendBroadcast, useRecallBroadcast } from '../api/use-notifications-management';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bell, Send, CheckCircle2, XCircle, Clock, Search, Undo2, BarChart3, History } from 'lucide-react';
import { RoleGate } from '@/components/ui/role-gate';

const CHANNEL_COLORS: Record<string, string> = {
    IN_APP: 'bg-sky-100 text-sky-700', EMAIL: 'bg-violet-100 text-violet-700',
    SMS: 'bg-amber-100 text-amber-700', PUSH: 'bg-emerald-100 text-emerald-700',
    WHATSAPP: 'bg-green-100 text-green-700',
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700', QUEUED: 'bg-sky-100 text-sky-700',
    SENT: 'bg-teal-100 text-teal-700', DELIVERED: 'bg-emerald-100 text-emerald-700',
    FAILED: 'bg-red-100 text-red-700', SKIPPED: 'bg-gray-100 text-gray-600',
};

const SEVERITY_COLORS: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600', MEDIUM: 'bg-sky-100 text-sky-700',
    HIGH: 'bg-amber-100 text-amber-700', CRITICAL: 'bg-red-100 text-red-700',
};

export function NotificationsClient() {
    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Notifications</h1>
                    <p className="text-sm text-muted-foreground mt-1">Broadcast, delivery analytics, and notification history</p>
                </div>
                <RoleGate action="notification:broadcast">
                    <BroadcastDialog />
                </RoleGate>
            </div>

            <Tabs defaultValue="delivery" className="w-full">
                <TabsList className="bg-white border shadow-sm">
                    <TabsTrigger value="delivery" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Delivery Analytics</TabsTrigger>
                    <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History Log</TabsTrigger>
                </TabsList>
                <TabsContent value="delivery"><DeliveryTab /></TabsContent>
                <TabsContent value="history"><HistoryTab /></TabsContent>
            </Tabs>
        </div>
    );
}

function BroadcastDialog() {
    const broadcast = useSendBroadcast();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [channels, setChannels] = useState<string[]>(['IN_APP']);
    const [category, setCategory] = useState('SYSTEM');
    const [severity, setSeverity] = useState('MEDIUM');

    const toggleChannel = (ch: string) => {
        setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
    };

    const handleSend = async () => {
        await broadcast.mutateAsync({ title, message, channels, category, severity });
        setOpen(false); setTitle(''); setMessage(''); setChannels(['IN_APP']);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 gap-1.5"><Send className="h-4 w-4" /> New Broadcast</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Send Broadcast Notification</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" /></div>
                    <div><Label>Message</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Notification message..." rows={3} /></div>
                    <div>
                        <Label className="mb-2 block">Channels</Label>
                        <div className="flex flex-wrap gap-2">
                            {['IN_APP', 'EMAIL', 'SMS', 'PUSH', 'WHATSAPP'].map(ch => (
                                <Button key={ch} variant={channels.includes(ch) ? 'default' : 'outline'} size="sm" onClick={() => toggleChannel(ch)}
                                    className={channels.includes(ch) ? 'bg-[#3b82f6] hover:bg-[#3b82f6]/90' : ''}>{ch.replace('_', ' ')}</Button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{['SYSTEM', 'PAYMENT', 'LEASE', 'PROPERTY', 'MAINTENANCE', 'SUBSCRIPTION'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Severity</Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSend} disabled={!title || !message || channels.length === 0 || broadcast.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                        {broadcast.isPending ? 'Sending...' : 'Send Broadcast'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeliveryTab() {
    const [page, setPage] = useState(1);
    const [channel, setChannel] = useState('');
    const [status, setStatus] = useState('');
    const { data, isLoading, isError, error } = useDeliveryAnalytics({ page, limit: 20, channel: channel || undefined, status: status || undefined });

    if (isLoading) return <div className="space-y-4 mt-4"><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-[300px] w-full rounded-xl" /></div>;
    if (isError || !data) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message || 'Failed to load.'}</AlertDescription></Alert>;

    const kpis = [
        { title: 'Total', value: data.kpis.total, icon: Bell, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Delivered', value: data.kpis.delivered, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Failed', value: data.kpis.failed, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Pending', value: data.kpis.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                    <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${k.bg}`}><k.icon className={`h-4 w-4 ${k.color}`} /></div>
                        </CardHeader>
                        <CardContent><div className={`text-2xl font-bold ${k.color}`}>{k.value}</div></CardContent>
                    </Card>
                ))}
            </div>

            {data.channelBreakdown.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-sm font-semibold text-[#3b82f6]">Channel Breakdown</CardTitle></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-3">{data.channelBreakdown.map(c => (
                        <div key={c.channel} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                            <Badge className={`text-[10px] ${CHANNEL_COLORS[c.channel] || ''}`}>{c.channel.replace('_', ' ')}</Badge>
                            <span className="text-sm font-semibold text-[#3b82f6]">{c.count}</span>
                        </div>
                    ))}</div></CardContent>
                </Card>
            )}

            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end mb-4">
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Channel</Label>
                            <Select value={channel} onValueChange={(v) => { setChannel(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    {['IN_APP', 'EMAIL', 'SMS', 'PUSH', 'WHATSAPP'].map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    {['PENDING', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'SKIPPED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No delivery records found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Notification</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Channel</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Retries</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Created</th>
                                </tr></thead>
                                <tbody>{data.data.map(d => (
                                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3"><p className="font-medium text-[#3b82f6] text-xs">{d.notification.title}</p><p className="text-[10px] text-muted-foreground">{d.notification.category}</p></td>
                                        <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${CHANNEL_COLORS[d.channel] || ''}`}>{d.channel.replace('_', ' ')}</Badge></td>
                                        <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${STATUS_COLORS[d.status] || ''}`}>{d.status}</Badge></td>
                                        <td className="py-3 px-3 text-center text-xs text-muted-foreground">{d.retryCount}</td>
                                        <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
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

function HistoryTab() {
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const recall = useRecallBroadcast();
    const [recallOpen, setRecallOpen] = useState(false);
    const [recallKey, setRecallKey] = useState('');
    const [recallReason, setRecallReason] = useState('');
    const { data, isLoading, isError, error } = useNotificationHistory({ page, limit: 20, category: category || undefined, search: search || undefined });

    if (isLoading) return <div className="space-y-4 mt-4"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
    if (isError || !data) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message || 'Failed to load.'}</AlertDescription></Alert>;

    return (
        <div className="space-y-4 mt-4">
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-xs text-muted-foreground">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Title, message..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                        <div className="min-w-[140px]">
                            <Label className="text-xs text-muted-foreground">Category</Label>
                            <Select value={category} onValueChange={(v) => { setCategory(v === 'ALL' ? '' : v); setPage(1); }}>
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    {['SYSTEM', 'PAYMENT', 'LEASE', 'PROPERTY', 'MAINTENANCE', 'SUBSCRIPTION'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Dialog open={recallOpen} onOpenChange={setRecallOpen}>
                            <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50"><Undo2 className="h-3.5 w-3.5" /> Recall</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Recall Broadcast</DialogTitle></DialogHeader>
                                <div className="space-y-3">
                                    <div><Label>Group Key</Label><Input value={recallKey} onChange={e => setRecallKey(e.target.value)} placeholder="broadcast_xxxx..." /></div>
                                    <div><Label>Reason</Label><Textarea value={recallReason} onChange={e => setRecallReason(e.target.value)} placeholder="Reason for recall..." /></div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={async () => { await recall.mutateAsync({ groupKey: recallKey, reason: recallReason }); setRecallOpen(false); setRecallKey(''); setRecallReason(''); }} disabled={!recallKey || !recallReason || recall.isPending} variant="destructive">
                                        {recall.isPending ? 'Recalling...' : 'Recall Broadcast'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {data.data.length === 0 ? <p className="text-center text-muted-foreground py-8">No notifications found</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Title</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Category</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Severity</th>
                                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">Deliveries</th>
                                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Sent</th>
                                </tr></thead>
                                <tbody>{data.data.map(n => (
                                    <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3"><p className="font-medium text-[#3b82f6] text-xs">{n.title}</p><p className="text-[10px] text-muted-foreground line-clamp-1">{n.message}</p></td>
                                        <td className="py-3 px-3 text-center"><Badge variant="outline" className="text-[10px]">{n.category}</Badge></td>
                                        <td className="py-3 px-3 text-center"><Badge className={`text-[10px] ${SEVERITY_COLORS[n.severity] || ''}`}>{n.severity}</Badge></td>
                                        <td className="py-3 px-3 text-center text-xs text-muted-foreground">{n._count.deliveries}</td>
                                        <td className="py-3 px-3 text-xs text-muted-foreground">{n.sentAt ? new Date(n.sentAt).toLocaleDateString('en-IN') : '—'}</td>
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
