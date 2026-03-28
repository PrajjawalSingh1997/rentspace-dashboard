"use client";

import { useState } from "react";
import { ArrowLeftCircle, Tag, RotateCw, Receipt, AlertCircle } from "lucide-react";
import { useIssueRefund, useApplyDiscount, useClearArrears, useResendInvoices } from "../api/use-billing-actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickBillingActions() {
    const issueRefund = useIssueRefund();
    const applyDiscount = useApplyDiscount();
    const clearArrears = useClearArrears();
    const resendInvoices = useResendInvoices();

    const [activeModal, setActiveModal] = useState<'refund' | 'discount' | 'arrears' | 'invoices' | null>(null);
    const [accountId, setAccountId] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");

    const resetForm = () => {
        setAccountId("");
        setAmount("");
        setReason("");
        setActiveModal(null);
    };

    const handleAction = async () => {
        if (!accountId) return;

        try {
            if (activeModal === 'refund') {
                await issueRefund.mutateAsync({ accountId, amount: Number(amount), reason });
            } else if (activeModal === 'discount') {
                await applyDiscount.mutateAsync({ accountId, amount: Number(amount), reason });
            } else if (activeModal === 'arrears') {
                await clearArrears.mutateAsync({ accountId });
            } else if (activeModal === 'invoices') {
                await resendInvoices.mutateAsync({ accountId, limit: 3 });
            }
            resetForm();
        } catch (error) {
            // Error handled by hook toast
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Receipt className="w-5 h-5 text-[#3b82f6]" />
                Quick Billing Actions
            </h3>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                    <button 
                        onClick={() => setActiveModal('refund')}
                        className="flex flex-col items-center justify-center gap-3 p-8 hover:bg-gray-50 transition-colors group"
                    >
                        <ArrowLeftCircle className="w-6 h-6 text-gray-400 group-hover:text-[#3b82f6]" />
                        <span className="text-sm font-semibold text-gray-900">Issue Refund</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveModal('discount')}
                        className="flex flex-col items-center justify-center gap-3 p-8 hover:bg-gray-50 transition-colors group"
                    >
                        <Tag className="w-6 h-6 text-gray-400 group-hover:text-[#3b82f6]" />
                        <span className="text-sm font-semibold text-gray-900">Apply Discount</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveModal('arrears')}
                        className="flex flex-col items-center justify-center gap-3 p-8 hover:bg-gray-50 transition-colors group"
                    >
                        <RotateCw className="w-6 h-6 text-gray-400 group-hover:text-[#3b82f6]" />
                        <span className="text-sm font-semibold text-gray-900">Clear Arrears</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveModal('invoices')}
                        className="flex flex-col items-center justify-center gap-3 p-8 hover:bg-gray-50 transition-colors group"
                    >
                        <Receipt className="w-6 h-6 text-gray-400 group-hover:text-[#3b82f6]" />
                        <span className="text-sm font-semibold text-gray-900">Resend Invoices</span>
                    </button>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 items-start text-xs text-gray-500">
                    <AlertCircle className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                    <p>Refunds and discounts are applied instantly to the next billing cycle. Major adjustments require Admin approval.</p>
                </div>
            </div>

            <Dialog open={!!activeModal} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {activeModal === 'refund' && "Issue Refund"}
                            {activeModal === 'discount' && "Apply Discount"}
                            {activeModal === 'arrears' && "Clear Account Arrears"}
                            {activeModal === 'invoices' && "Resend Recent Invoices"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeModal === 'refund' && "Process a partial or full refund back to the customer's original payment method."}
                            {activeModal === 'discount' && "Apply a credit discount to the customer's upcoming billing cycle."}
                            {activeModal === 'arrears' && "Force clear all unpaid past-due invoices for this account."}
                            {activeModal === 'invoices' && "Re-trigger email delivery for the last 3 invoices."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Account ID</Label>
                            <Input 
                                placeholder="Enter account cUID..." 
                                value={accountId} 
                                onChange={(e) => setAccountId(e.target.value)} 
                            />
                        </div>
                        
                        {(activeModal === 'refund' || activeModal === 'discount') && (
                            <>
                                <div className="space-y-2">
                                    <Label>Amount (USD)</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason</Label>
                                    <Input 
                                        placeholder="Reason for adjustment..." 
                                        value={reason} 
                                        onChange={(e) => setReason(e.target.value)} 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm}>Cancel</Button>
                        <Button 
                            className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white" 
                            onClick={handleAction}
                            disabled={!accountId || ((activeModal === 'refund' || activeModal === 'discount') && (!amount || !reason))}
                        >
                            Confirm Action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
