"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useUpdateSubscription } from "../api/use-update-subscription";
import { usePlans } from "../api/use-plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/features/accounts/api/use-accounts";

export function TenantPlanManagement() {
    const { data: plans } = usePlans();
    // Fetch a few active accounts for the mock dropdown 
    const { data: accountsData } = useAccounts({ limit: 50, status: 'ACTIVE' });
    const updateSub = useUpdateSubscription();

    const [accountId, setAccountId] = useState("");
    const [planId, setPlanId] = useState("");
    const [addlProperties, setAddlProperties] = useState("0");

    const selectedPlan = plans?.find(p => p.id === planId);
    
    // Naive calc of a simulated monthly total based on plan price
    const monthlyTotal = selectedPlan 
        ? (selectedPlan.pricePerTenant * 5) + (Number(addlProperties) * 20) 
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountId || !planId) return;

        await updateSub.mutateAsync({
            accountId,
            planId,
            additionalProperties: Number(addlProperties)
        });
        
        // Reset
        setAccountId("");
        setPlanId("");
        setAddlProperties("0");
    };

    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Users className="w-5 h-5 text-[#3b82f6]" />
                Tenant Plan Management
            </h3>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
                
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Select Tenant</Label>
                    <Select value={accountId} onValueChange={setAccountId}>
                        <SelectTrigger className="w-full bg-gray-50 border-transparent focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]">
                            <SelectValue placeholder="Search tenants..." />
                        </SelectTrigger>
                        <SelectContent>
                            {accountsData?.items.map(acc => (
                                <SelectItem key={acc.id} value={acc.id}>{acc.name || acc.email}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Assign Plan</Label>
                        <Select value={planId} onValueChange={setPlanId}>
                            <SelectTrigger className="w-full bg-gray-50 border-transparent focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]">
                                <SelectValue placeholder="Select plan..." />
                            </SelectTrigger>
                            <SelectContent>
                                {plans?.map(plan => (
                                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Addl. Properties</Label>
                        <Input 
                            type="number"
                            min="0"
                            value={addlProperties}
                            onChange={(e) => setAddlProperties(e.target.value)}
                            className="bg-gray-50 border-transparent focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                        />
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium text-gray-500">New Monthly Total:</span>
                    <span className="text-2xl font-bold text-[#e1b53e] tracking-tight">
                        ${monthlyTotal.toFixed(2)}<span className="text-sm font-semibold">/mo</span>
                    </span>
                </div>

                <Button 
                    type="submit" 
                    disabled={!accountId || !planId || updateSub.isPending}
                    className="w-full bg-[#1e293b] hover:bg-[#bbf7d0] text-[#3b82f6] font-bold py-6 text-sm hover:scale-[1.01] transition-all shadow-sm group"
                >
                    {updateSub.isPending ? "Updating..." : "Update Subscription & Limits"}
                </Button>
            </form>
        </div>
    );
}
