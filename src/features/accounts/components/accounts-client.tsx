'use client';

import { useState } from 'react';
import { useAccounts } from '../api/use-accounts';
import type { AccountListQuery } from '@/types/api';
import { useBulkAction } from '../api/use-bulk-action';
import { AccountsTable } from './accounts-table';
import { CsvImportModal } from './modals/csv-import-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Download, Filter, ChevronDown, TrendingUp, AlertCircle, UserPlus, AlertTriangle, Activity, Building2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function AccountsClient() {
    const [query, setQuery] = useState<AccountListQuery>({ page: 1, limit: 10 });
    const { data, isLoading, isError, error } = useAccounts(query);

    // UI state
    const [activeTab, setActiveTab] = useState<'ALL' | 'AT_RISK'>('ALL');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const bulkAction = useBulkAction();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery((prev: AccountListQuery) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleSelectAll = (checked: boolean) => {
        if (!data) return;
        if (checked) {
            setSelectedIds(data.items.map(acc => acc.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const handleBulkAction = (action: 'SUSPEND' | 'ACTIVATE' | 'CLOSE') => {
        if (selectedIds.length === 0) return;
        bulkAction.mutate({ action, accountIds: selectedIds }, {
            onSuccess: () => {
                setSelectedIds([]);
            }
        });
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Accounts</h3>
                <p>{error?.message || 'Failed to fetch accounts data.'}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500 pb-10">
            {/* Header & Main Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    {/* Title removed as requested */}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white border-gray-200" onClick={() => setIsImportModalOpen(true)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                    <Button className="bg-[#3b82f6] hover:bg-[#2563eb]" onClick={() => setIsImportModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Landlord
                    </Button>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                {/* Tabs Row */}
                <div className="border-b px-2 flex items-center">
                    <button
                        onClick={() => setActiveTab('ALL')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ALL'
                                ? 'border-[#3b82f6] text-[#3b82f6]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All Accounts
                    </button>
                    <button
                        onClick={() => setActiveTab('AT_RISK')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'AT_RISK'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <AlertTriangle className="h-4 w-4" />
                        At-Risk
                        <span className="bg-red-100 text-red-700 py-0.5 px-2 rounded-full text-xs">
                            {data?.items?.filter(acc => (acc.churnRiskScore ?? 0) >= 50).length ?? 0}
                        </span>
                    </button>
                </div>

                {/* Filters Row */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email or phone..."
                            className="pl-9 bg-white border-gray-200"
                            onChange={handleSearch}
                            value={query.search || ''}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {/* Selected Bulk Actions Ribbon */}
                        {selectedIds.length > 0 && (
                            <div className="bg-emerald-50 text-emerald-800 text-sm px-3 py-1.5 rounded-md font-medium flex items-center gap-2 shrink-0">
                                <span>{selectedIds.length} selected</span>
                                <div className="h-4 w-px bg-emerald-200 mx-1"></div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="hover:text-emerald-900 transition-colors flex items-center outline-none">
                                            Bulk Actions <ChevronDown className="ml-1 h-3 w-3" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleBulkAction('ACTIVATE')} className="text-emerald-600">Activate Selected</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('SUSPEND')} className="text-amber-600">Suspend Selected</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('CLOSE')} className="text-red-600">Close Selected</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Mock Dropdowns for visual parity with reference image */}
                        <Button variant="outline" size="sm" className="bg-white text-gray-600 h-9 font-normal">
                            Status: All <ChevronDown className="ml-2 h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-600 h-9 font-normal">
                            Plan: All <ChevronDown className="ml-2 h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-600 h-9 font-normal">
                            Risk: All <ChevronDown className="ml-2 h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="bg-white text-gray-600 h-9 w-9 shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                {(data?.items?.length ?? 0) === 0 && !isLoading ? (
                    <EmptyState
                        icon={Building2}
                        title="No landlords found"
                        description="There are no landlord accounts matching your current filters."
                    />
                ) : (
                    <AccountsTable
                        data={data?.items || []}
                        isLoading={isLoading}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                    />
                )}
            </div>

            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">{(data.page - 1) * data.limit + 1}</span> to <span className="font-medium text-gray-900">{Math.min(data.page * data.limit, data.total)}</span> of <span className="font-medium text-gray-900">{data.total}</span> accounts
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery((prev: AccountListQuery) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                            disabled={data.page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery((prev: AccountListQuery) => ({ ...prev, page: Math.min(data.totalPages, (prev.page || 1) + 1) }))}
                            disabled={data.page >= data.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Bottom Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <Card className="bg-[#3b82f6] text-white overflow-hidden relative shadow-md">
                    <CardContent className="p-6">
                        <h3 className="text-emerald-100 text-xs font-semibold tracking-wider uppercase mb-1">Health Score Avg</h3>
                        <p className="text-4xl font-bold">
                            {data?.items?.length
                                ? `${(data.items.reduce((sum, acc) => sum + (100 - (acc.churnRiskScore ?? 0)), 0) / data.items.length).toFixed(1)}%`
                                : '—'}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-emerald-300 text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>{data?.total ?? 0} total account{(data?.total ?? 0) !== 1 ? 's' : ''}</span>
                        </div>
                    </CardContent>
                    <div className="absolute right-0 top-0 opacity-10 blur-xl">
                        <Activity className="h-48 w-48 -mt-10 -mr-10 text-white" />
                    </div>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                        <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">Churn Risk Alerts</h3>
                        <p className="text-4xl font-bold text-gray-900">
                            {data?.items?.filter(acc => (acc.churnRiskScore ?? 0) >= 50).length ?? 0} At Risk
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm font-medium">
                            <AlertCircle className="h-4 w-4" />
                            <span>Score ≥ 50 threshold</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                        <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">Active Accounts</h3>
                        <p className="text-4xl font-bold text-gray-900">{data?.total ?? 0}</p>
                        <div className="flex items-center gap-2 mt-4 text-emerald-600 text-sm font-medium">
                            <UserPlus className="h-4 w-4" />
                            <span>Total on platform</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <CsvImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
}
