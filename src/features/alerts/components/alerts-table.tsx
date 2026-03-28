'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, FileWarning, Info, CheckCircle2, FileText, Banknote, UserRound, Activity, RotateCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { AlertResponse } from '@/types/api';
import { useUpdateAlertStatus } from '../api/use-alerts';
import { DataTable } from '@/components/ui/data-table';

interface AlertsTableProps {
    data: AlertResponse[];
    selectedIds: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: string, checked: boolean) => void;
}

// Severity mapping
const getSeverityConfig = (severity: string) => {
    switch (severity) {
        case 'CRITICAL': return { icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-600' };
        case 'WARNING': return { icon: FileWarning, color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' };
        default: return { icon: Info, color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-600' };
    }
};

// Source mapping for actions
const getActionConfig = (source: string) => {
    switch (source) {
        case 'ACCOUNT': return { label: 'View Account', icon: UserRound };
        case 'LEASE': return { label: 'View Contract', icon: FileText };
        case 'PAYMENT': return { label: 'View Order', icon: Banknote };
        case 'SUPPORT': return { label: 'View Ticket', icon: Info };
        case 'JOB': return { label: 'Retry Job', icon: RotateCw };
        default: return { label: 'View Details', icon: Activity };
    }
};

export function AlertsTable({ data, selectedIds, onSelectAll, onSelectOne }: AlertsTableProps) {
    const updateStatus = useUpdateAlertStatus();
    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    const handleResolve = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        updateStatus.mutate({ id, status: 'RESOLVED' });
    };

    const columns = useMemo<ColumnDef<AlertResponse>[]>(() => [
        {
            id: 'select',
            header: () => (
                <div className="pl-2">
                    <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={onSelectAll}
                        aria-label="Select all"
                        className="border-gray-300"
                    />
                </div>
            ),
            cell: ({ row }) => {
                const alert = row.original;
                const isSelected = selectedIds.includes(alert.id);
                return (
                    <div className="pl-2">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelectOne(alert.id, !!checked)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select alert ${alert.id}`}
                            className="border-gray-300 data-[state=checked]:bg-[#3b82f6] data-[state=checked]:border-[#3b82f6]"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: 'severity',
            header: 'Severity',
            cell: ({ row }) => {
                const alert = row.original;
                const sev = getSeverityConfig(alert.severity);
                return (
                    <div className="flex items-center gap-2">
                        <sev.icon className={`h-4 w-4 ${sev.color}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${sev.color}`}>
                            {alert.severity}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'title',
            header: 'Alert Message',
            cell: ({ row }) => {
                const alert = row.original;
                const isResolved = alert.status === 'RESOLVED';
                return (
                    <div className="flex flex-col">
                        <span className={`font-semibold text-sm ${isResolved ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                            {alert.title}
                        </span>
                        <span className="text-sm text-gray-500 mt-0.5 max-w-xl truncate">
                            {alert.description}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'source',
            header: 'Source',
            cell: ({ row }) => {
                return (
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                        {row.original.source}
                    </div>
                );
            },
        },
        {
            accessorKey: 'timestamp',
            header: 'Timestamp',
            cell: ({ row }) => {
                return (
                    <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(row.original.timestamp), { addSuffix: true })}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right pr-4">Actions</div>,
            cell: ({ row }) => {
                const alert = row.original;
                const action = getActionConfig(alert.source);
                const isResolved = alert.status === 'RESOLVED';
                
                if (isResolved) {
                    return <div className="text-right pr-4"><span className="text-sm font-medium text-gray-400">Resolved</span></div>;
                }
                return (
                    <div className="flex items-center justify-end gap-2 pr-4">
                        <Button variant="outline" size="sm" className="h-8 shadow-sm">
                            {action.label}
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 bg-[#3b82f6] hover:bg-[#2563eb] shadow-sm"
                            onClick={(e) => handleResolve(alert.id, e)}
                        >
                            Resolve
                        </Button>
                    </div>
                );
            },
        },
    ], [isAllSelected, selectedIds, onSelectAll, onSelectOne]);

    return (
        <DataTable
            columns={columns}
            data={data}
            emptyMessage="All clear!"
            emptySubMessage="No alerts matching your criteria exist."
        />
    );
}
