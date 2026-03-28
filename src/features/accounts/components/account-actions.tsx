'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, ShieldAlert, FileText, Activity } from 'lucide-react';
import type { AccountListResponse } from '../api/use-accounts';
import { StatusOverrideModal } from './modals/status-override-modal';
import { ChurnScoreModal } from './modals/churn-score-modal';
import { AddNoteModal } from './modals/add-note-modal';

interface AccountActionsProps {
    account: AccountListResponse;
}

export function AccountActions({ account }: AccountActionsProps) {
    const router = useRouter();
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isChurnOpen, setIsChurnOpen] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);

    const navigateToProfile = () => {
        router.push(`/accounts/${account.id}`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={navigateToProfile}>
                        <Eye className="mr-2 h-4 w-4 text-emerald-600" />
                        View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsStatusOpen(true)}>
                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" />
                        Override Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsChurnOpen(true)}>
                        <Activity className="mr-2 h-4 w-4 text-blue-600" />
                        Adjust Risk Score
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsNoteOpen(true)}>
                        <FileText className="mr-2 h-4 w-4 text-gray-600" />
                        Add Admin Note
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <StatusOverrideModal 
                account={account} 
                isOpen={isStatusOpen} 
                onClose={() => setIsStatusOpen(false)} 
            />
            <ChurnScoreModal 
                account={account} 
                isOpen={isChurnOpen} 
                onClose={() => setIsChurnOpen(false)} 
            />
            <AddNoteModal 
                account={account} 
                isOpen={isNoteOpen} 
                onClose={() => setIsNoteOpen(false)} 
            />
        </>
    );
}
