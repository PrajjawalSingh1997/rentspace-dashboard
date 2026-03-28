'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type UserListResponse } from '@/types/api';
import { UserActions } from './user-actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';

interface UsersTableProps {
    users: UserListResponse[];
    isLoading: boolean;
    selectedUserId: string | null;
    onSelectUser: (user: UserListResponse) => void;
    onEditField: (userId: string, field: 'name' | 'phone' | 'email') => void;
    onMerge: (userId: string) => void;
}

export function UsersTable({ users, isLoading, selectedUserId, onSelectUser, onEditField, onMerge }: UsersTableProps) {
    
    const getRoleBadge = (user: UserListResponse) => {
        if (user.membershipCount > 0 && user.tenantCount > 0) return { label: 'TENANT', color: 'bg-blue-100 text-blue-700' };
        if (user.membershipCount > 0) return { label: 'OWNER', color: 'bg-emerald-100 text-emerald-700' };
        return { label: 'USER', color: 'bg-gray-100 text-gray-600' };
    };

    const columns: ColumnDef<UserListResponse>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const user = row.original;
                const initials = user.name
                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : '??';
                
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs font-semibold bg-[#3b82f6] text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name || 'Unnamed'}</p>
                            <p className="text-xs text-gray-400">UID: {user.id.slice(-4)}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = getRoleBadge(row.original);
                return (
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider ${role.color}`}>
                        {role.label}
                    </Badge>
                );
            }
        },
        {
            id: 'contact',
            header: 'Contact',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div>
                        <p className="text-sm text-gray-700">{user.email || '—'}</p>
                        <p className="text-xs text-gray-400">{user.phone || '—'}</p>
                    </div>
                );
            }
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className={`text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isActive ? 'Active' : 'Pending'}
                        </span>
                    </div>
                );
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Signup Date',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.original.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-right" onClick={(e) => e.stopPropagation()}>
                        <UserActions user={row.original} onEditField={onEditField} onMerge={onMerge} />
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="No users found"
            emptySubMessage="Try adjusting your filters or search term."
            onRowClick={(row) => onSelectUser(row)}
            selectedRowId={selectedUserId || undefined}
        />
    );
}
