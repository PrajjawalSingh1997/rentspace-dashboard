'use client';

import { useState } from 'react';
import { useSystemHealth, useBackgroundJobs, useSecurityEvents, useApiPerformance, useClearCache, useScheduleMaintenance } from '../api/use-system-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Server, Database, HardDrive, Activity, Shield, Trash2, Clock, Zap, CheckCircle2 } from 'lucide-react';

export function SettingsClient() {
    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">System health, monitoring, and administration</p>
                </div>
                <div className="flex gap-2"><ClearCacheBtn /><MaintenanceBtn /></div>
            </div>
            <HealthCards />
            <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="bg-white border shadow-sm">
                    <TabsTrigger value="jobs" className="gap-1.5"><Activity className="h-3.5 w-3.5" /> Jobs</TabsTrigger>
                    <TabsTrigger value="security" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Security</TabsTrigger>
                    <TabsTrigger value="performance" className="gap-1.5"><Zap className="h-3.5 w-3.5" /> Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="jobs"><JobsTab /></TabsContent>
                <TabsContent value="security"><SecurityTab /></TabsContent>
                <TabsContent value="performance"><PerformanceTab /></TabsContent>
            </Tabs>
        </div>
    );
}

function ClearCacheBtn() {
    const clear = useClearCache();
    return <Button variant="outline" size="sm" className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50" onClick={() => clear.mutate()} disabled={clear.isPending}><Trash2 className="h-3.5 w-3.5" />{clear.isPending ? 'Clearing...' : 'Clear Cache'}</Button>;
}

function MaintenanceBtn() {
    const schedule = useScheduleMaintenance();
    const [open, setOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Schedule Maintenance</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Schedule Maintenance Window</DialogTitle></DialogHeader>
                <div className="space-y-3">
                    <div><Label>Start Time</Label><Input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
                    <div><Label>End Time</Label><Input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
                    <div><Label>Message</Label><Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Scheduled maintenance..." /></div>
                </div>
                <DialogFooter>
                    <Button onClick={async () => { await schedule.mutateAsync({ startTime, endTime, message }); setOpen(false); }} disabled={!startTime || !endTime || !message || schedule.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                        {schedule.isPending ? 'Scheduling...' : 'Schedule'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function HealthCards() {
    const { data, isLoading } = useSystemHealth();
    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>;
    if (!data) return null;
    const items = [
        { title: 'Server', icon: Server, status: data.server.status, detail: `Uptime: ${Math.floor(data.server.uptime / 3600)}h`, color: data.server.status === 'healthy' ? 'text-emerald-600' : 'text-red-500', bg: data.server.status === 'healthy' ? 'bg-emerald-50' : 'bg-red-50' },
        { title: 'Database', icon: Database, status: data.database.status, detail: 'PostgreSQL', color: data.database.status === 'healthy' ? 'text-emerald-600' : 'text-red-500', bg: data.database.status === 'healthy' ? 'bg-emerald-50' : 'bg-red-50' },
        { title: 'Redis', icon: HardDrive, status: data.redis.status, detail: 'Cache Store', color: data.redis.status === 'healthy' ? 'text-emerald-600' : 'text-red-500', bg: data.redis.status === 'healthy' ? 'bg-emerald-50' : 'bg-red-50' },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((h, i) => (
                <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{h.title}</CardTitle>
                        <div className={`p-2 rounded-lg ${h.bg}`}><h.icon className={`h-4 w-4 ${h.color}`} /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2"><Badge className={`text-[10px] ${h.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{h.status}</Badge></div>
                        <p className="text-xs text-muted-foreground mt-1">{h.detail}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function JobsTab() {
    const { data, isLoading } = useBackgroundJobs();
    if (isLoading) return <Skeleton className="h-[200px] w-full rounded-xl mt-4" />;
    if (!data) return null;
    return (
        <Card className="border-0 shadow-sm mt-4">
            <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Background Queues</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-3 text-muted-foreground font-medium">Queue</th>
                            <th className="text-center py-3 px-3 text-muted-foreground font-medium">Active</th>
                            <th className="text-center py-3 px-3 text-muted-foreground font-medium">Waiting</th>
                            <th className="text-center py-3 px-3 text-muted-foreground font-medium">Completed</th>
                            <th className="text-center py-3 px-3 text-muted-foreground font-medium">Failed</th>
                        </tr></thead>
                        <tbody>{data.queues.map((q) => (
                            <tr key={q.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 px-3 font-medium text-[#3b82f6] text-xs capitalize">{q.name}</td>
                                <td className="py-3 px-3 text-center"><Badge className="bg-sky-100 text-sky-700 text-[10px]">{q.active}</Badge></td>
                                <td className="py-3 px-3 text-center"><Badge className="bg-amber-100 text-amber-700 text-[10px]">{q.waiting}</Badge></td>
                                <td className="py-3 px-3 text-center"><Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{q.completed}</Badge></td>
                                <td className="py-3 px-3 text-center"><Badge className="bg-red-100 text-red-700 text-[10px]">{q.failed}</Badge></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function SecurityTab() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useSecurityEvents({ page, limit: 20 });
    if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl mt-4" />;
    if (isError || !data) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle></Alert>;
    return (
        <Card className="border-0 shadow-sm mt-4">
            <CardHeader><CardTitle className="text-lg font-semibold text-[#3b82f6]">Security Events</CardTitle></CardHeader>
            <CardContent>
                {data.data?.length === 0 ? <p className="text-center text-muted-foreground py-8">No security events found</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Admin</th>
                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Action</th>
                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">IP</th>
                                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Time</th>
                            </tr></thead>
                            <tbody>{data.data?.map((e) => (
                                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-3 text-xs"><p className="font-medium text-[#3b82f6]">{e.admin?.name}</p><p className="text-[10px] text-muted-foreground">{e.admin?.email}</p></td>
                                    <td className="py-3 px-3"><Badge variant="outline" className="text-[10px] font-mono">{e.action}</Badge></td>
                                    <td className="py-3 px-3 text-xs text-muted-foreground font-mono">{e.ipAddress || '—'}</td>
                                    <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
                {data.pagination?.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <p className="text-xs text-muted-foreground">Page {page} of {data.pagination.totalPages}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                            <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PerformanceTab() {
    const { data, isLoading } = useApiPerformance();
    if (isLoading) return <Skeleton className="h-[200px] w-full rounded-xl mt-4" />;
    if (!data) return null;
    const metrics = [
        { label: 'Avg Response', value: `${data.avgResponseTime}ms`, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'P95', value: `${data.p95ResponseTime}ms`, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'P99', value: `${data.p99ResponseTime}ms`, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Error Rate', value: `${data.errorRate}%`, color: data.errorRate > 1 ? 'text-red-500' : 'text-emerald-600', bg: data.errorRate > 1 ? 'bg-red-50' : 'bg-emerald-50' },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {metrics.map((m, i) => (
                <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{m.label}</CardTitle></CardHeader>
                    <CardContent><div className={`text-2xl font-bold ${m.color}`}>{m.value}</div></CardContent>
                </Card>
            ))}
        </div>
    );
}
