'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { AccountStatusBadge } from './account-status-badge';
import { ChurnRiskBadge } from './churn-risk-badge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AccountListResponse } from '@/types/api';
import { AccountActions } from './account-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';

interface AccountsTableProps {
    data: AccountListResponse[];
    isLoading: boolean;
    selectedIds: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: string, checked: boolean) => void;
}

export function AccountsTable({
    data,
    isLoading,
    selectedIds,
    onSelectAll,
    onSelectOne
}: AccountsTableProps) {
    
    // We determine if all are selected for the header checkbox
    const allSelected = data?.length > 0 && selectedIds.length === data.length;

    const columns: ColumnDef<AccountListResponse>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked: boolean | "indeterminate") => onSelectAll(!!checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(checked: boolean | "indeterminate") => onSelectOne(row.original.id, !!checked)}
                    aria-label={`Select ${row.original.name}`}
                />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Landlord Name',
            cell: ({ row }) => {
                const account = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-[#3b82f6] text-white font-medium text-sm">
                            <AvatarFallback className="bg-[#3b82f6] text-white">
                                {(account.name || 'Unknown').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 leading-none">{account.name}</span>
                            <span className="text-xs text-gray-500 mt-1">ID: {account.id.substring(0, 5).toUpperCase()}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'contact',
            header: 'Contact Info',
            cell: ({ row }) => {
                const account = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-900 leading-none">{account.email}</span>
                        <span className="text-xs text-gray-500 mt-1">{account.phone || 'No phone'}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Signup Date',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{format(new Date(row.original.createdAt), 'MMM dd, yyyy')}</span>
            )
        },
        {
            accessorKey: 'plan',
            header: 'Plan',
            cell: ({ row }) => (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium">
                    {typeof row.original.plan === 'object' ? row.original.plan?.name || 'Free' : (row.original.plan || 'Free')}
                </Badge>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <AccountStatusBadge status={row.original.status} />
        },
        {
            id: 'health',
            header: 'Health Score',
            cell: ({ row }) => {
                const account = row.original;
                const mockHealth = account.churnRiskScore != null 
                    ? Math.max(0, 100 - account.churnRiskScore * 1.5)
                    : 100;
                const bgColor = mockHealth > 80 ? 'bg-emerald-100 text-emerald-800' : mockHealth > 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
                return (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${bgColor}`}>
                        {Math.round(mockHealth)}%
                    </span>
                );
            }
        },
        {
            accessorKey: 'churnRiskScore',
            header: 'Churn Risk',
            cell: ({ row }) => <ChurnRiskBadge score={row.original.churnRiskScore} />
        },
        {
            id: 'actions',
            header: () => <div className="text-right"></div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <AccountActions account={row.original} />
                </div>
            )
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={data || []}
            isLoading={isLoading}
            emptyMessage="No accounts found"
            emptySubMessage="Try adjusting your filters or search query."
        />
    );
}
