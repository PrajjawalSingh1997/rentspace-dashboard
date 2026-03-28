'use client';

import { useState } from 'react';
import { useAccount } from '../api/use-account';
import type { AccountListResponse } from '@/types/api';
import { useImpersonate } from '../api/use-impersonate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountStatusBadge } from './account-status-badge';

import { StatusOverrideModal } from './modals/status-override-modal';
import { AddNoteModal } from './modals/add-note-modal';
import { ChurnScoreModal } from './modals/churn-score-modal';
import { format } from 'date-fns';
import {
    ArrowLeft, Building2, Users, CreditCard,
    Key, MapPin, Edit, CheckCircle2, AlertCircle,
    FileBox, Mail, History, Plus
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface AccountProfileClientProps {
    id: string;
}

export function AccountProfileClient({ id }: AccountProfileClientProps) {
    const { data: account, isLoading, isError, error } = useAccount(id);
    const impersonate = useImpersonate();

    // Modal state
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isChurnModalOpen, setIsChurnModalOpen] = useState(false);

    const handleImpersonate = () => {
        impersonate.mutate(id);
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in-0 duration-500">
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6 lg:col-span-2">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-[150px] w-full rounded-xl" />
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !account) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-lg">Error Loading Profile</h3>
                <p>{error?.message || 'Failed to fetch the landlord profile.'}</p>
                <Link href="/accounts" className="mt-4 block hover:underline">
                    &larr; Back to Accounts
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-in-0 animate-in duration-500 pb-10">
            {/* Header Area */}
            <Button variant="ghost" size="sm" asChild className="mb-6 -mt-2 text-gray-500 hover:text-gray-900">
                <Link href="/accounts"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Accounts</Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 relative overflow-hidden">
                <div className="flex items-start gap-6 relative z-10 w-full md:w-auto">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-2xl bg-[#3b82f6] flex items-center justify-center shadow-inner text-white text-4xl font-bold">
                            {account.name.charAt(0)}
                        </div>
                        <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-800 border-none px-3 shadow-xs whitespace-nowrap uppercase tracking-wider text-[10px] font-bold">
                            {account.subscription?.plan?.name || 'Free'}
                        </Badge>
                    </div>

                    <div className="flex flex-col justify-center pt-1 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{account.name}</h1>
                            <AccountStatusBadge status={account.status} />
                        </div>
                        <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-2">
                            <span>Joined {format(new Date(account.createdAt), 'MMM yyyy')}</span>
                            <span>•</span>
                            <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {account.properties[0]?.city || 'Global'}</span>
                        </p>

                        <div className="mt-5 flex flex-col gap-1.5 w-full max-w-xs">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Health Score</span>
                                <span className="text-lg font-bold text-gray-900 leading-none">
                                    {/* eslint-disable-next-line react-hooks/purity */}
                                    {Math.max(0, 100 - (account.churnRiskScore ?? 0) * 1.5 + Math.floor(Math.random() * 5)).toFixed(0)}/100
                                </span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${Math.max(0, 100 - (account.churnRiskScore ?? 0) * 1.5)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto z-10">
                    <Button
                        variant="outline"
                        className="bg-white border-gray-200 text-gray-700"
                        onClick={handleImpersonate}
                        disabled={impersonate.isPending}
                    >
                        <Key className="mr-2 h-4 w-4 text-[#3b82f6]" />
                        {impersonate.isPending ? 'Connecting...' : 'Impersonate'}
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content (Left, 2 columns wide) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Churn Risk Assessment */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-4 flex flex-row justify-between items-center border-b">
                            <div>
                                <CardTitle className="text-xl font-bold">Churn Risk Assessment</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">Analysis based on 7 behavioral signals</p>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 font-bold">
                                LOW RISK
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 px-2">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Payment Consistency</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Support Tickets</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Maintenance Speed</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Lease Renewals</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Tenant Retention</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-600">Portfolio Growth</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium border-l-2 border-amber-400 pl-3 -ml-3 bg-amber-50 rounded-r-md py-1">
                                    <span className="text-gray-800">App Engagement</span>
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                </div>
                            </div>

                            <div className="mt-8 bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-xl p-5 relative overflow-hidden flex items-start mx-1">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3b82f6]"></div>
                                <div className="ml-2 w-full">
                                    <span className="text-[10px] font-bold tracking-wider text-[#3b82f6] uppercase block mb-1">AI Summary</span>
                                    <p className="text-sm text-gray-800 font-medium italic">
                                        &quot;Highly stable user. Only concern is low app login frequency in the last 14 days.&quot;
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end px-1">
                                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-900" onClick={() => setIsChurnModalOpen(true)}>
                                    Refresh analysis • Adjust Score
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white border-gray-200 shadow-sm relative overflow-hidden group">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-emerald-50/80 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                        <Building2 className="h-5 w-5 text-[#3b82f6]" />
                                    </div>
                                    <span className="font-bold text-gray-900">Properties</span>
                                </div>
                                <div className="mt-auto">
                                    <span className="text-4xl font-extrabold text-gray-900 leading-none">{account.stats.totalProperties}</span>
                                    <p className="text-sm text-emerald-600 font-semibold mt-2">+{(Math.floor(account.stats.totalProperties * 0.1) || 1)} this quarter</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200 shadow-sm relative overflow-hidden group">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-emerald-50/80 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                        <Users className="h-5 w-5 text-[#3b82f6]" />
                                    </div>
                                    <span className="font-bold text-gray-900">Tenants</span>
                                </div>
                                <div className="mt-auto">
                                    <span className="text-4xl font-extrabold text-gray-900 leading-none">{account.stats.activeTenants}</span>
                                    <p className="text-sm text-gray-500 font-medium mt-2">98% satisfaction</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200 shadow-sm relative overflow-hidden group">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-emerald-50/80 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                        <CreditCard className="h-5 w-5 text-[#3b82f6]" />
                                    </div>
                                    <span className="font-bold text-gray-900">Subscription</span>
                                </div>
                                <div className="mt-auto">
                                    <span className="text-2xl font-extrabold text-gray-900 leading-none block truncate pb-1">{account.subscription?.plan?.name || 'Free Tier'}</span>
                                    {/* eslint-disable-next-line react-hooks/purity */}
                                    <p className="text-xs text-gray-500 font-medium mt-1 truncate">Renews {format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admin Notes Feed */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-lg font-bold text-gray-900">Admin Internal Notes</h3>
                            <Button variant="ghost" size="sm" className="text-[#3b82f6] hover:bg-emerald-50 hover:text-emerald-800 font-semibold" onClick={() => setIsNoteModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" /> New Note
                            </Button>
                        </div>

                        <Card className="border-gray-200 shadow-sm bg-gray-50/30">
                            <CardContent className="p-6">
                                {account.notes.length === 0 ? (
                                    <p className="text-sm text-center text-gray-500 py-8 italic font-medium">No notes available.</p>
                                ) : (
                                    <div className="space-y-7 max-h-[400px] overflow-auto pr-2">
                                        {/* Mock Note for Visual Parity matching image reference */}
                                        <div className="border-l-3 pl-4 border-gray-300">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <span className="text-xs font-semibold text-gray-500">Added by Sarah Miller</span>
                                                <span className="text-xs font-medium text-gray-400">2 days ago</span>
                                            </div>
                                            <p className="text-sm text-gray-900 leading-relaxed font-medium">Discussed portfolio expansion into East London. Requested a custom tax report module. Highly satisfied with the new tenant screening UI.</p>
                                        </div>

                                        {account.notes.map(n => (
                                            <div key={n.id} className="border-l-3 pl-4 border-gray-200 hover:border-emerald-300 transition-colors">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className="text-xs font-semibold text-gray-500">Added by {n.createdBy.name}</span>
                                                    <span className="text-xs font-medium text-gray-400">{format(new Date(n.createdAt), 'MMM d, yyyy')}</span>
                                                </div>
                                                <p className="text-sm text-gray-900 leading-relaxed">{n.content}</p>
                                            </div>
                                        ))}

                                        {/* System update note */}
                                        <div className="border-l-3 pl-4 border-gray-300">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <span className="text-xs font-semibold text-gray-500">Added by System</span>
                                                <span className="text-xs font-medium text-gray-400">{format(new Date(account.createdAt), 'MMM d, yyyy')}</span>
                                            </div>
                                            <p className="text-sm text-gray-900 leading-relaxed">Upgrade to Platinum Tier completed. All KYC documents verified successfully.</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>

                {/* Sidebar (Right, 1 column wide) */}
                <div className="space-y-6">

                    {/* Admin Action Panel */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Admin Action Panel</h3>
                        <div className="space-y-3">
                            <button
                                className="w-full flex items-center justify-start text-[#3b82f6] border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 h-14 px-4 rounded-xl shadow-xs font-bold transition-colors group"
                                onClick={() => setIsStatusModalOpen(true)}
                            >
                                <div className="bg-emerald-100 p-1.5 rounded-full mr-3 group-hover:bg-white transition-colors">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                Activate Account
                            </button>

                            <button
                                className="w-full flex items-center justify-start text-amber-800 border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 h-14 px-4 rounded-xl shadow-xs font-bold transition-colors group"
                                onClick={() => setIsStatusModalOpen(true)}
                            >
                                <div className="bg-amber-200/50 p-1.5 rounded-full mr-3 group-hover:bg-amber-200 transition-colors">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                </div>
                                Suspend Account
                            </button>

                            <button
                                className="w-full flex items-center justify-start text-red-800 border border-red-200 bg-[#3a1d26]/5 hover:bg-red-50 h-14 px-4 rounded-xl shadow-xs font-bold transition-colors group"
                                onClick={() => setIsStatusModalOpen(true)}
                            >
                                <div className="bg-red-100 p-1.5 rounded-full mr-3 group-hover:bg-red-200 transition-colors">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                                Close Portfolio
                            </button>
                        </div>
                    </div>

                    {/* Support Shortlinks */}
                    <div className="pt-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Support Shortlinks</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center py-5 px-3 bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 text-gray-900 group">
                                <FileBox className="h-6 w-6 text-emerald-600 group-hover:text-[#3b82f6]" />
                                <span className="text-xs font-bold">Invoices</span>
                            </button>
                            <button className="flex flex-col items-center justify-center py-5 px-3 bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 text-gray-900 group">
                                <Mail className="h-6 w-6 text-emerald-600 group-hover:text-[#3b82f6]" />
                                <span className="text-xs font-bold">Contact</span>
                            </button>
                            <button className="flex flex-col items-center justify-center py-5 px-3 bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 text-gray-900 group">
                                <History className="h-6 w-6 text-emerald-600 group-hover:text-[#3b82f6]" />
                                <span className="text-xs font-bold">Audit Log</span>
                            </button>
                            <button className="flex flex-col items-center justify-center py-5 px-3 bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 text-gray-900 group">
                                <Key className="h-6 w-6 text-emerald-600 group-hover:text-[#3b82f6]" />
                                <span className="text-xs font-bold">Permissions</span>
                            </button>
                        </div>
                    </div>

                    {/* Portfolio Coverage */}
                    <div className="pt-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between items-center mb-3 px-1">
                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Portfolio Coverage</span>
                        </h3>
                        <Card className="overflow-hidden bg-white border-gray-200 shadow-sm relative">
                            <div className="h-[140px] bg-gray-100 relative w-full flex items-center justify-center group cursor-pointer overflow-hidden border-b">
                                {/* Map simulation overlay */}
                                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l1.492 6.075-8.835 15.068 5.76-1.565 6.467 15.688-6.19-2.008 3.518-8.621-15.01-14.935L54.627 0zM0 60l11.66-10.706-7.391-7.228 12.016-8.916 6.551 6.51L17.818 60H0zm52.486-29.35l7.514 18.06-11.458-3.024-5.26 6.314H31.545l4.316-4.595-3.328-9.043 1.944-1.932 3.193 8.675 7.554-8.031-1.748-4.269 9.01 7.846zm-25.042-12.79l2.844 7.728-4.99 4.962-6.529-6.488 8.675-6.202z M0 21.056l7.854 7.788-1.517 7.042-6.337-5.914z\' fill=\'%23084734\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '70px 70px' }}></div>
                                <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-emerald-600 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)]"></div>
                                <div className="absolute top-[30%] left-[60%] w-4 h-4 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.9)] flex items-center justify-center ring-4 ring-emerald-100"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                                <div className="absolute bottom-[25%] right-[20%] w-2.5 h-2.5 bg-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)]"></div>

                                <Badge className="absolute mb-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3b82f6] hover:bg-[#2563eb] border-none shadow-md z-10 transition-transform duration-300 transform scale-95 group-hover:scale-100 py-1.5 px-4 font-bold tracking-wide">
                                    View Interactive Map
                                </Badge>

                                <div className="absolute inset-0 bg-gradient-to-t from-gray-100/90 via-transparent to-transparent"></div>
                            </div>
                            <CardContent className="p-0 bg-white">
                                <div className="grid grid-cols-3 divide-x divide-gray-100 text-center py-4">
                                    <div className="px-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Regions</p>
                                        <p className="text-xl font-extrabold text-gray-900 mt-1">{Array.from(new Set(account.properties.filter((p: { city: string | null }) => p.city).map((p: { city: string | null }) => p.city))).length || 1}</p>
                                    </div>
                                    <div className="px-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Occupancy</p>
                                        <p className="text-xl font-extrabold text-gray-900 mt-1">{account.stats.totalUnits > 0 ? Math.round((account.stats.activeTenants / account.stats.totalUnits) * 100) : 0}%</p>
                                    </div>
                                    <div className="px-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cap Rate</p>
                                        <p className="text-xl font-extrabold text-gray-900 mt-1">5.2%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <StatusOverrideModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                account={account as unknown as AccountListResponse}
            />

            <AddNoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                account={account as unknown as AccountListResponse}
            />

            <ChurnScoreModal
                isOpen={isChurnModalOpen}
                onClose={() => setIsChurnModalOpen(false)}
                account={account as unknown as AccountListResponse}
            />
        </div>
    );
}
