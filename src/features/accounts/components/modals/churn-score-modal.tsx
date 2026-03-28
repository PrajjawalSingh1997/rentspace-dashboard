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
import { Input } from '@/components/ui/input';
import { useUpdateChurnScore } from '../../api/use-update-churn';
import type { AccountListResponse } from '../../api/use-accounts';

interface ChurnScoreModalProps {
    account: AccountListResponse;
    isOpen: boolean;
    onClose: () => void;
}

export function ChurnScoreModal({ account, isOpen, onClose }: ChurnScoreModalProps) {
    const [score, setScore] = useState(account.churnRiskScore?.toString() || '0');
    const [reason, setReason] = useState('');
    const updateChurn = useUpdateChurnScore();

    const handleSave = () => {
        const parsedScore = parseInt(score, 10);
        if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100 || !reason.trim()) return;

        updateChurn.mutate(
            { id: account.id, score: parsedScore, reason },
            {
                onSuccess: () => {
                    setReason('');
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adjust Churn Risk Score</DialogTitle>
                    <DialogDescription>
                        Manually override the AI-computed churn risk for {account.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Risk Score</label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                            <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Reason</label>
                        <Input
                            className="col-span-3"
                            placeholder="Why are you changing the score?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={updateChurn.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={updateChurn.isPending || !reason.trim()} 
                        className="bg-[#3b82f6] hover:bg-[#2563eb]"
                    >
                        {updateChurn.isPending ? 'Saving...' : 'Adjust Score'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
