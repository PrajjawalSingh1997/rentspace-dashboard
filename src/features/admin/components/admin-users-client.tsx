'use client';

import { useState, useMemo } from 'react';
import { useAdminUsers, useAuditLogs, useCreateAdmin } from '../api/use-admin-management';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Shield, UserPlus, Search, Clock, Users, ScrollText } from 'lucide-react';
import { RoleGate } from '@/components/ui/role-gate';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

export function AdminUsersClient() {
    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b82f6]">Admin Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage admin accounts and audit trail</p>
                </div>
                <RoleGate action="admin:create">
                    <CreateAdminDialog />
                </RoleGate>
            </div>

            <Tabs defaultValue="admins" className="w-full">
                <TabsList className="bg-white border shadow-sm">
                    <TabsTrigger value="admins" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Admin Users</TabsTrigger>
                    <TabsTrigger value="audit" className="gap-1.5"><ScrollText className="h-3.5 w-3.5" /> Audit Log</TabsTrigger>
                </TabsList>
                <TabsContent value="admins"><AdminsTab /></TabsContent>
                <TabsContent value="audit"><AuditTab /></TabsContent>
            </Tabs>
        </div>
    );
}

function CreateAdminDialog() {
    const create = useCreateAdmin();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 gap-1.5"><UserPlus className="h-4 w-4" /> Add Admin</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Create Admin User</DialogTitle></DialogHeader>
                <div className="space-y-3">
                    <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Admin name" /></div>
                    <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@example.com" /></div>
                    <div><Label>Password</Label><Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" /></div>
                </div>
                <DialogFooter>
                    <Button onClick={async () => { await create.mutateAsync({ name, email, password }); setOpen(false); setName(''); setEmail(''); setPassword(''); }} disabled={!name || !email || !password || create.isPending} className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                        {create.isPending ? 'Creating...' : 'Create Admin'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AdminsTab() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading, isError, error } = useAdminUsers({ page, limit: 20, search: search || undefined });

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <span className="font-medium text-[#3b82f6]">{row.original.name}</span>
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>
        },
        {
            accessorKey: 'role',
            header: () => <div className="text-center">Role</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge className="bg-violet-100 text-violet-700">
                        <Shield className="h-2.5 w-2.5 mr-1" />{row.original.role}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'isActive',
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge className={row.original.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                        {row.original.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'lastLoginAt',
            header: 'Last Login',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.lastLoginAt ? new Date(row.original.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}
                </span>
            )
        }
    ], []);

    if (isLoading) return <div className="mt-4"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
    if (isError || !data) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message || 'Failed to load.'}</AlertDescription></Alert>;

    return (
        <div className="space-y-4 mt-4">
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex gap-3 items-end mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-xs text-muted-foreground">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Name, email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
                            </div>
                        </div>
                    </div>
                    
                    <DataTable
                        columns={columns}
                        data={data.data}
                        emptyMessage="No admin users found"
                        emptySubMessage=""
                    />

                    {(data.pagination as any)?.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <p className="text-xs text-muted-foreground">Page {(data.pagination as any).page} of {(data.pagination as any).totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                                <Button variant="outline" size="sm" disabled={page >= (data.pagination as any).totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function AuditTab() {
    const [page, setPage] = useState(1);
    const [action, setAction] = useState('');
    const { data, isLoading, isError, error } = useAuditLogs({ page, limit: 20, action: action || undefined });

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'admin',
            header: 'Admin',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-[#3b82f6]">{row.original.admin?.name || '—'}</p>
                    <p className="text-xs text-muted-foreground">{row.original.admin?.email}</p>
                </div>
            )
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => <Badge variant="outline" className="font-mono">{row.original.action}</Badge>
        },
        {
            accessorKey: 'target',
            header: 'Target',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.targetType ? `${row.original.targetType}:${row.original.targetId?.slice(0, 8)}` : '—'}
                </span>
            )
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP',
            cell: ({ row }) => <span className="text-muted-foreground font-mono">{row.original.ipAddress || '—'}</span>
        },
        {
            accessorKey: 'createdAt',
            header: 'Time',
            cell: ({ row }) => (
                <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(row.original.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
            )
        }
    ], []);

    if (isLoading) return <div className="mt-4"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
    if (isError || !data) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message || 'Failed to load.'}</AlertDescription></Alert>;

    return (
        <div className="space-y-4 mt-4">
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex gap-3 items-end mb-4">
                        <div className="min-w-[200px]">
                            <Label className="text-xs text-muted-foreground">Filter by Action</Label>
                            <Input value={action} onChange={e => { setAction(e.target.value); setPage(1); }} placeholder="Action name..." />
                        </div>
                    </div>
                    
                    <DataTable
                        columns={columns}
                        data={data.data}
                        emptyMessage="No audit logs found"
                        emptySubMessage=""
                    />

                    {(data.pagination as any)?.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <p className="text-xs text-muted-foreground">Page {(data.pagination as any).page} of {(data.pagination as any).totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                                <Button variant="outline" size="sm" disabled={page >= (data.pagination as any).totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
