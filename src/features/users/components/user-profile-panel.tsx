'use client';

import { type UserListResponse } from '../api/use-users';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Pencil, Building2, CalendarDays, ShieldCheck, FileText, UserPlus } from 'lucide-react';

interface UserProfilePanelProps {
    user: UserListResponse | null;
}

export function UserProfilePanel({ user }: UserProfilePanelProps) {
    if (!user) {
        return (
            <Card className="h-full border border-gray-200 bg-white">
                <CardContent className="flex flex-col items-center justify-center h-full py-24 text-gray-400">
                    <UserPlus className="h-12 w-12 mb-4 opacity-40" />
                    <p className="text-sm font-medium">Select a user to view details</p>
                </CardContent>
            </Card>
        );
    }

    const initials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const roleBadge = user.membershipCount > 0
        ? (user.tenantCount > 0 ? 'TENANT' : 'OWNER')
        : 'USER';

    const roleColors: Record<string, string> = {
        OWNER: 'bg-emerald-600 text-white',
        TENANT: 'bg-blue-600 text-white',
        STAFF: 'bg-amber-600 text-white',
        USER: 'bg-gray-600 text-white',
    };

    // Mock activity data
    const activities = [
        { label: 'Account created', date: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: 'bg-yellow-400' },
    ];

    return (
        <Card className="border border-gray-200 bg-white overflow-hidden h-full">
            {/* Top colored banner */}
            <div className="relative h-24 bg-gradient-to-br from-[#3b82f6] to-[#2563eb]">
                <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition">
                    <Pencil className="h-3.5 w-3.5 text-white" />
                </button>
            </div>

            {/* Avatar + Info */}
            <div className="flex flex-col items-center -mt-10 px-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                    <AvatarFallback className="text-lg font-bold bg-[#3b82f6] text-white">{initials}</AvatarFallback>
                </Avatar>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{user.name || 'Unnamed User'}</h3>
                <Badge className={`mt-1 text-xs uppercase tracking-wider ${roleColors[roleBadge]}`}>{roleBadge}</Badge>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 w-full">
                    <Button className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm">
                        Message
                    </Button>
                    <Button variant="outline" size="icon" className="border-gray-200">
                        <Mail className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            </div>

            <Separator className="my-5" />

            {/* Membership Details */}
            <div className="px-6 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Membership Details</h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Accounts</span>
                        <span className="font-medium text-gray-900">{user.membershipCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Member Since</span>
                        <span className="font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Verification</span>
                        <span className={`font-medium ${user.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {user.isActive ? '✅ Verified' : '❌ Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            <Separator className="my-5" />

            {/* Recent Activity */}
            <div className="px-6 pb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recent Activity</h4>
                <div className="space-y-4">
                    {activities.map((act, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${act.color} shrink-0`} />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{act.label}</p>
                                <p className="text-xs text-gray-400">{act.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-4 text-sm font-medium text-[#3b82f6] hover:underline">
                    View All Activity
                </button>
            </div>
        </Card>
    );
}
