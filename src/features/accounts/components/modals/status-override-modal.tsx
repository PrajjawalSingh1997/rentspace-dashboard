'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateAccountStatus } from '../../api/use-update-status';
import type { AccountListResponse } from '../../api/use-accounts';

interface StatusOverrideModalProps {
    account: AccountListResponse;
    isOpen: boolean;
    onClose: () => void;
}

export function StatusOverrideModal({ account, isOpen, onClose }: StatusOverrideModalProps) {
    const [status, setStatus] = useState<AccountListResponse['status']>(account.status);
    const updateStatus = useUpdateAccountStatus();

    const handleSave = () => {
        if (status === account.status) {
            onClose();
            return;
        }

        updateStatus.mutate(
            { id: account.id, status },
            {
                onSuccess: () => onClose(),
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Override Account Status</DialogTitle>
                    <DialogDescription>
                        Change the administrative status for {account.name}. This is audited.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Status</label>
                        <div className="col-span-3">
                            <Select value={status} onValueChange={(val: AccountListResponse['status']) => setStatus(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                    <SelectItem value="TRIAL">TRIAL</SelectItem>
                                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={updateStatus.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={updateStatus.isPending} className="bg-[#3b82f6] hover:bg-[#2563eb]">
                        {updateStatus.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
