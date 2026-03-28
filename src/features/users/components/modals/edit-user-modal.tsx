'use client';

import { useState } from 'react';
import { useUpdateUser } from '../../api/use-update-user';
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

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    field: 'name' | 'phone' | 'email';
    currentValue?: string;
}

const fieldLabels: Record<string, string> = {
    name: 'Display Name',
    phone: 'Phone Number',
    email: 'Email Address',
};

export function EditUserModal({ open, onClose, userId, field, currentValue }: EditUserModalProps) {
    const [value, setValue] = useState(currentValue || '');
    const updateUser = useUpdateUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser.mutate({ userId, field, value }, {
            onSuccess: () => {
                onClose();
                setValue('');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit {fieldLabels[field]}</DialogTitle>
                    <DialogDescription>
                        Update the user&apos;s {fieldLabels[field].toLowerCase()}. This change will take effect immediately.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Label htmlFor="field-value">{fieldLabels[field]}</Label>
                        <Input
                            id="field-value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Enter new ${fieldLabels[field].toLowerCase()}`}
                            className="mt-2"
                            type={field === 'email' ? 'email' : 'text'}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb]" disabled={updateUser.isPending}>
                            {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
