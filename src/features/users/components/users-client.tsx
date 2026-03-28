'use client';

import { useState } from 'react';
import { useUsers, type UserListQuery, type UserListResponse } from '../api/use-users';
import { UsersTable } from './users-table';
import { UserProfilePanel } from './user-profile-panel';
import { EditUserModal } from './modals/edit-user-modal';
import { MergeUsersModal } from './modals/merge-users-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function UsersClient() {
    // Query state
    const [query, setQuery] = useState<UserListQuery>({ page: 1, limit: 10 });
    const { data, isLoading, isError, error } = useUsers(query);

    // Selection state
    const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);

    // Modal state
    const [editModal, setEditModal] = useState<{
        open: boolean;
        userId: string;
        field: 'name' | 'phone' | 'email';
        currentValue?: string;
    }>({ open: false, userId: '', field: 'name' });
    const [mergeModal, setMergeModal] = useState<{ open: boolean; sourceUserId: string }>({ open: false, sourceUserId: '' });

    // Filter handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery((prev: UserListQuery) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleRoleFilter = (value: string) => {
        // Role filter — not directly in API, but we can use isActive as a proxy
        // In a real implementation, you'd add a role filter to the backend
        setQuery((prev: UserListQuery) => ({ ...prev, page: 1 }));
    };

    const handleStatusFilter = (value: string) => {
        if (value === 'all') {
            setQuery((prev: UserListQuery) => {
                const { isActive, ...rest } = prev;
                return { ...rest, page: 1 };
            });
        } else {
            setQuery((prev: UserListQuery) => ({ ...prev, isActive: value === 'active', page: 1 }));
        }
    };

    const handleEditField = (userId: string, field: 'name' | 'phone' | 'email') => {
        const user = data?.items.find(u => u.id === userId);
        setEditModal({
            open: true,
            userId,
            field,
            currentValue: user?.[field] || '',
        });
    };

    const handleMerge = (userId: string) => {
        setMergeModal({ open: true, sourceUserId: userId });
    };

    // Pagination
    const currentPage = query.page || 1;
    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    if (isError) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Users</h3>
                <p>{error?.message || 'Failed to fetch users data.'}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 fade-in-0 animate-in duration-500 pb-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage roles and permissions for all {totalItems.toLocaleString()} platform members.
                    </p>
                </div>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb]">
                    <Users className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">Role</span>
                    <Select defaultValue="all" onValueChange={handleRoleFilter}>
                        <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 text-sm">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">Status</span>
                    <Select defaultValue="all" onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 text-sm">
                            <SelectValue placeholder="Any Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1" />

                {/* Pagination info */}
                <span className="text-xs text-gray-400">
                    Showing {((currentPage - 1) * (query.limit || 10)) + 1}-{Math.min(currentPage * (query.limit || 10), totalItems)} of {totalItems}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage <= 1}
                        onClick={() => setQuery((prev: UserListQuery) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage >= totalPages}
                        onClick={() => setQuery((prev: UserListQuery) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Split Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Left: Data Table */}
                <div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search users by name, email, or phone..."
                            className="pl-10 bg-white border-gray-200"
                            value={query.search || ''}
                            onChange={handleSearch}
                        />
                    </div>
                    {(data?.items?.length ?? 0) === 0 && !isLoading ? (
                        <EmptyState
                            icon={Users}
                            title="No users found"
                            description="No users match your current search or filters."
                        />
                    ) : (
                        <UsersTable
                            users={data?.items || []}
                            isLoading={isLoading}
                            selectedUserId={selectedUser?.id || null}
                            onSelectUser={setSelectedUser}
                            onEditField={handleEditField}
                            onMerge={handleMerge}
                        />
                    )}
                </div>

                {/* Right: Profile Panel */}
                <div className="hidden lg:block">
                    <div className="sticky top-6">
                        <UserProfilePanel user={selectedUser} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditUserModal
                open={editModal.open}
                onClose={() => setEditModal(prev => ({ ...prev, open: false }))}
                userId={editModal.userId}
                field={editModal.field}
                currentValue={editModal.currentValue}
            />
            <MergeUsersModal
                open={mergeModal.open}
                onClose={() => setMergeModal({ open: false, sourceUserId: '' })}
                sourceUserId={mergeModal.sourceUserId}
            />
        </div>
    );
}
