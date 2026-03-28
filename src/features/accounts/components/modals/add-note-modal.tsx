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
import { useAddAccountNote } from '../../api/use-add-note';
import type { AccountListResponse } from '../../api/use-accounts';

interface AddNoteModalProps {
    account: AccountListResponse;
    isOpen: boolean;
    onClose: () => void;
}

export function AddNoteModal({ account, isOpen, onClose }: AddNoteModalProps) {
    const [note, setNote] = useState('');
    const addNote = useAddAccountNote();

    const handleSave = () => {
        if (!note.trim()) return;

        addNote.mutate(
            { id: account.id, note },
            {
                onSuccess: () => {
                    setNote('');
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Admin Note</DialogTitle>
                    <DialogDescription>
                        Leave an internal note on {account.name}&apos;s profile. This is visible to all admins.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <textarea
                        className="w-full min-h-[100px] border rounded-md p-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#3b82f6]"
                        placeholder="Type your note here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={addNote.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={addNote.isPending || !note.trim()} 
                        className="bg-[#3b82f6] hover:bg-[#2563eb]"
                    >
                        {addNote.isPending ? 'Saving...' : 'Add Note'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
