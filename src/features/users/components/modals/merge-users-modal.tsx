'use client';

import { useState } from 'react';
import { useMergeUsers } from '../../api/use-merge-users';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface MergeUsersModalProps {
    open: boolean;
    onClose: () => void;
    sourceUserId: string;
}

export function MergeUsersModal({ open, onClose, sourceUserId }: MergeUsersModalProps) {
    const [targetUserId, setTargetUserId] = useState('');
    const mergeUsers = useMergeUsers();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mergeUsers.mutate({ sourceUserId, targetUserId }, {
            onSuccess: () => {
                onClose();
                setTargetUserId('');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Merge Duplicate User
                    </DialogTitle>
                    <DialogDescription>
                        This will move all memberships and tenant records from user <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{sourceUserId.slice(-8)}</code> to the target user, and deactivate the source account. This action is irreversible.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Label htmlFor="target-user">Target User ID</Label>
                        <Input
                            id="target-user"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="Paste the target user's ID here"
                            className="mt-2"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">The source user&apos;s records will be merged into this user.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={mergeUsers.isPending}>
                            {mergeUsers.isPending ? 'Merging...' : 'Confirm Merge'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
