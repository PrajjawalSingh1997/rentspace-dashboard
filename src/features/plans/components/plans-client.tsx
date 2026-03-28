"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickBillingActions } from "./quick-billing-actions";
import { TenantPlanManagement } from "./tenant-plan-management";
import { PlansTable } from "./plans-table";
import { useSubscriptionKPIs } from "../api/use-subscription-kpis";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function PlansClient() {
    const { data: kpis, isLoading } = useSubscriptionKPIs();

    // Mock trend values to match the design aesthetics 
    const trends = {
        subs: { value: "+12%", isPositive: true },
        mrr: { value: "+$4,020", isPositive: true },
        churn: { value: "Stable", isPositive: null },
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-shadow-sm">Plans & Subscriptions</h2>
                    <p className="text-gray-500 mt-1">Scale recurring revenue and issue manual billing overrides.</p>
                </div>
                <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white shadow-sm transition-all hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" /> Create New Plan
                </Button>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Active Subscriptions</p>
                    <div className="mt-4 flex items-end justify-between">
                        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tighter">
                            {isLoading ? "..." : kpis?.totalActiveSubscriptions?.toLocaleString()}
                        </h3>
                        {/* Trend Fake */}
                        <div className="flex items-center text-sm font-semibold text-[#3b82f6] bg-[#1e293b] px-2 py-1 rounded-md">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {trends.subs.value}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Monthly Recurring Revenue</p>
                    <div className="mt-4 flex items-end justify-between">
                        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tighter">
                            ${isLoading ? "..." : kpis?.mrr?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </h3>
                        <div className="flex items-center text-sm font-semibold text-[#3b82f6] bg-[#1e293b] px-2 py-1 rounded-md">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {trends.mrr.value}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Churn Rate (30d)</p>
                    <div className="mt-4 flex items-end justify-between">
                        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tighter">
                            {isLoading ? "..." : kpis?.churnRate?.toFixed(1)}%
                        </h3>
                        <div className="flex items-center text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            <Minus className="w-4 h-4 mr-1" />
                            {trends.churn.value}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Table */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Available Tier Plans</h3>
                <PlansTable />
            </div>

            {/* Bottom 2 Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <TenantPlanManagement />
                <QuickBillingActions />
            </div>
        </div>
    );
}
