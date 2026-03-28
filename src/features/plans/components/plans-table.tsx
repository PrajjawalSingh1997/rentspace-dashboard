"use client";

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { usePlans } from "../api/use-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { DataTable } from '@/components/ui/data-table';

export function PlansTable() {
    const { data: plans, isLoading } = usePlans();

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            id: 'name',
            header: 'PLAN NAME',
            cell: ({ row }) => {
                const plan = row.original;
                return (
                    <div>
                        <div className="font-medium text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-500 uppercase">{plan.code}</div>
                    </div>
                );
            },
        },
        {
            id: 'price',
            header: 'PRICE / TENANT',
            cell: ({ row }) => {
                const plan = row.original;
                return (
                    <div className="font-medium">
                        ${plan.pricePerTenant.toFixed(2)}<span className="text-gray-500 text-xs font-normal">/mo</span>
                    </div>
                );
            },
        },
        {
            id: 'maxProps',
            header: 'MAX PROPERTIES',
            cell: ({ row }) => {
                const plan = row.original;
                return (
                    <div className="text-gray-600">
                        {plan.maxProperties === null ? "Unlimited" : plan.maxProperties}
                    </div>
                );
            },
        },
        {
            id: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const plan = row.original;
                return (
                    <Badge 
                        className={plan.isActive 
                            ? "bg-[#1e293b] text-[#3b82f6] hover:bg-[#1e293b]" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"}
                    >
                        {plan.isActive ? "Active" : "Legacy"}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">ACTIONS</div>,
            cell: () => (
                <div className="text-right">
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-gray-500 hover:text-[#3b82f6]">
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <DataTable
            columns={columns}
            data={plans || []}
            isLoading={isLoading}
            emptyMessage="No plans found."
            emptySubMessage=""
        />
    );
}
