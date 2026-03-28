'use client';

import { useState } from 'react';
import { useAdminSocket, type AdminEvent } from '../hooks/use-admin-socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Pause, Play, Trash2, AlertTriangle, CreditCard, UserPlus, Wrench, Shield, Server } from 'lucide-react';

const EVENT_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    NEW_SIGNUP: { icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    PAYMENT_RECEIVED: { icon: CreditCard, color: 'text-teal-600', bg: 'bg-teal-50' },
    PAYMENT_FAILED: { icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
    SUBSCRIPTION_CHANGE: { icon: Shield, color: 'text-violet-600', bg: 'bg-violet-50' },
    CHURN_RISK: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    SUPPORT_TICKET: { icon: Wrench, color: 'text-sky-600', bg: 'bg-sky-50' },
    MAINTENANCE_REQUEST: { icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
    JOB_FAILURE: { icon: Server, color: 'text-red-600', bg: 'bg-red-50' },
    SYSTEM_ALERT: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
};

const SEVERITY_COLORS: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-sky-100 text-sky-700',
    high: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700',
};

const EVENT_TYPES = Object.keys(EVENT_CONFIG);

export function LiveFeed() {
    const { events, connected, paused, togglePause, clearEvents } = useAdminSocket();
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const toggleFilter = (type: string) => {
        setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredEvents = activeFilters.length > 0 ? events.filter(e => activeFilters.includes(e.type)) : events;

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold text-[#3b82f6]">Live Feed</CardTitle>
                        <Badge className={`text-[10px] ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {connected ? <><Wifi className="h-2.5 w-2.5 mr-1" /> Connected</> : <><WifiOff className="h-2.5 w-2.5 mr-1" /> Disconnected</>}
                        </Badge>
                    </div>
                    <div className="flex gap-1.5">
                        <Button variant="ghost" size="sm" onClick={togglePause} className="h-7 px-2 text-xs gap-1">
                            {paused ? <><Play className="h-3 w-3" /> Resume</> : <><Pause className="h-3 w-3" /> Pause</>}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={clearEvents} className="h-7 px-2 text-xs gap-1 text-muted-foreground">
                            <Trash2 className="h-3 w-3" /> Clear
                        </Button>
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {EVENT_TYPES.map(type => {
                        const cfg = EVENT_CONFIG[type];
                        const active = activeFilters.includes(type);
                        return (
                            <button
                                key={type}
                                onClick={() => toggleFilter(type)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                                    active ? `${cfg.bg} ${cfg.color} border-current` : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                                }`}
                            >
                                {type.replace(/_/g, ' ')}
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent>
                <div className="max-h-[300px] overflow-y-auto space-y-1.5">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-muted-foreground">
                            <Wifi className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-xs">{paused ? 'Feed paused' : 'Waiting for events...'}</p>
                        </div>
                    ) : (
                        filteredEvents.map((event, i) => <EventRow key={`${event.timestamp}-${i}`} event={event} />)
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function EventRow({ event }: { event: AdminEvent }) {
    const cfg = EVENT_CONFIG[event.type] || { icon: AlertTriangle, color: 'text-gray-500', bg: 'bg-gray-50' };
    const Icon = cfg.icon;

    return (
        <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50/80 transition-colors group">
            <div className={`p-1.5 rounded-md ${cfg.bg} mt-0.5 shrink-0`}>
                <Icon className={`h-3 w-3 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-[#3b82f6] truncate">{event.title}</p>
                    <Badge className={`text-[9px] shrink-0 ${SEVERITY_COLORS[event.severity] || ''}`}>{event.severity}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{event.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
}
