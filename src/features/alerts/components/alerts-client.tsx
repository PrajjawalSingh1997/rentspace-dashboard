'use client';

import { useState } from 'react';
import { useAlerts, useBulkUpdateAlerts } from '../api/use-alerts';
import type { AlertListQuery } from '@/types/api';
import { AlertsMetricCards } from './alerts-metric-cards';
import { AlertsTable } from './alerts-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle2, CheckSquare, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export function AlertsClient() {
    const [query, setQuery] = useState<AlertListQuery>({ page: 1, limit: 15 });
    const { data, isLoading, isError, error } = useAlerts(query);
    const bulkUpdate = useBulkUpdateAlerts();

    // UI state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSearch = () => {
        // Search isn't explicitly in the backend dynamic alert mock right now,
        // but passing the search query string for future implementation.
        // setQuery(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const setFilter = (key: keyof AlertListQuery, value: string | number | undefined) => {
        setQuery((prev: AlertListQuery) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleSelectAll = (checked: boolean) => {
        if (!data) return;
        if (checked) {
            setSelectedIds(data.items.map(alert => alert.id));
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

    const handleBulkAction = (action: 'MARK_READ' | 'RESOLVE') => {
        if (selectedIds.length === 0) return;
        bulkUpdate.mutate({ action, alertIds: selectedIds }, {
            onSuccess: () => {
                setSelectedIds([]);
            }
        });
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Alerts</h3>
                <p>{error?.message || 'Failed to fetch alerts data.'}</p>
            </div>
        );
    }

    // Derive metrics from API data
    const totalActive = data?.total ?? 0;
    const criticalCount = data?.items?.filter(i => i.severity === 'CRITICAL').length ?? 0;
    const avgResolutionHours = totalActive > 0 ? '—' : '—';

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Alerts Center</h1>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search alerts, accounts, or jobs..."
                        className="pl-9 bg-white border-gray-200"
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Top Metrics Row */}
            <AlertsMetricCards
                totalActive={totalActive}
                criticalCount={criticalCount}
                avgResolutionHours={avgResolutionHours}
            />

            {/* Filters and Actions Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-3 border rounded-xl shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0">
                    <Button
                        variant={!query.severity ? "secondary" : "ghost"}
                        className={`text-sm rounded-full ${!query.severity ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500'}`}
                        onClick={() => setFilter('severity', undefined)}
                    >
                        All
                    </Button>
                    <Button
                        variant={query.severity === 'CRITICAL' ? "secondary" : "ghost"}
                        onClick={() => setFilter('severity', 'CRITICAL')}
                        className={`text-sm rounded-full gap-2 ${query.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 font-semibold border border-red-200' : 'text-gray-500'}`}
                    >
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        Critical
                    </Button>
                    <Button
                        variant={query.severity === 'WARNING' ? "secondary" : "ghost"}
                        onClick={() => setFilter('severity', 'WARNING')}
                        className={`text-sm rounded-full gap-2 ${query.severity === 'WARNING' ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200' : 'text-gray-500'}`}
                    >
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Warning
                    </Button>
                    <Button
                        variant={query.severity === 'INFO' ? "secondary" : "ghost"}
                        onClick={() => setFilter('severity', 'INFO')}
                        className={`text-sm rounded-full gap-2 ${query.severity === 'INFO' ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'text-gray-500'}`}
                    >
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        Info
                    </Button>

                    <div className="h-6 border-r border-gray-200 mx-2 hidden sm:block"></div>

                    {/* Status Toggle */}
                    <div className="flex bg-gray-100 rounded-md p-1">
                        <button
                            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${query.status === 'UNREAD' ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFilter('status', 'UNREAD')}
                        >
                            Unread
                        </button>
                        <button
                            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${query.status === 'READ' ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFilter('status', 'READ')}
                        >
                            Read
                        </button>
                        <button
                            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${query.status === 'RESOLVED' ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFilter('status', 'RESOLVED')}
                        >
                            Resolved
                        </button>
                        <button
                            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${!query.status ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFilter('status', undefined)}
                        >
                            All
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => handleBulkAction('MARK_READ')}
                        disabled={selectedIds.length === 0 || bulkUpdate.isPending}
                    >
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-sm"
                        onClick={() => handleBulkAction('RESOLVE')}
                        disabled={selectedIds.length === 0 || bulkUpdate.isPending}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Resolve Selected
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            {isLoading ? (
                <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : (
                <>
                    {(data?.items?.length ?? 0) === 0 ? (
                        <EmptyState
                            icon={Bell}
                            title="No alerts found"
                            description="There are no alerts matching your current filters."
                        />
                    ) : (
                        <AlertsTable
                            data={data?.items || []}
                            selectedIds={selectedIds}
                            onSelectAll={handleSelectAll}
                            onSelectOne={handleSelectOne}
                        />
                    )}

                    {/* Simplified Pagination Footer */}
                    <div className="flex justify-between items-center text-sm text-gray-500 px-1 mt-2">
                        <span>Showing 1 to {data?.items.length || 0} of {data?.total || 0} active alerts</span>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={query.page === 1} onClick={() => setFilter('page', (query.page || 1) - 1)}>&lt;</Button>
                            <Button variant="outline" size="sm" className="h-8 min-w-8 bg-[#3b82f6] text-white border-[#3b82f6]">{query.page}</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={query.page === data?.totalPages} onClick={() => setFilter('page', (query.page || 1) + 1)}>&gt;</Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
