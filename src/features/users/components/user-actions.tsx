'use client';

import { type UserListResponse } from '../api/use-users';
import { useResetPassword } from '../api/use-reset-password';
import { useForceLogout } from '../api/use-force-logout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, KeyRound, LogOut, Pencil, Phone, Mail, GitMerge } from 'lucide-react';

interface UserActionsProps {
    user: UserListResponse;
    onEditField: (userId: string, field: 'name' | 'phone' | 'email') => void;
    onMerge: (userId: string) => void;
}

export function UserActions({ user, onEditField, onMerge }: UserActionsProps) {
    const resetPassword = useResetPassword();
    const forceLogout = useForceLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    onClick={() => onEditField(user.id, 'name')}
                    className="cursor-pointer"
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Name
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onEditField(user.id, 'phone')}
                    className="cursor-pointer"
                >
                    <Phone className="mr-2 h-4 w-4" />
                    Edit Phone
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onEditField(user.id, 'email')}
                    className="cursor-pointer"
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Edit Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => resetPassword.mutate(user.id)}
                    className="cursor-pointer text-amber-600"
                >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => forceLogout.mutate(user.id)}
                    className="cursor-pointer text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Force Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => onMerge(user.id)}
                    className="cursor-pointer"
                >
                    <GitMerge className="mr-2 h-4 w-4" />
                    Merge User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
