'use client';

import { useChurnBreakdown, type ChurnSignal } from '../api/use-churn-breakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, TrendingDown, Shield, Clock, Home, CreditCard, HeadphonesIcon, Activity } from 'lucide-react';

const RISK_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    low: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Low Risk' },
    medium: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Medium Risk' },
    high: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High Risk' },
    critical: { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical Risk' },
};

const SIGNAL_ICONS: Record<string, React.ElementType> = {
    loginFrequency: Activity,
    rentCollection: TrendingDown,
    supportTickets: HeadphonesIcon,
    featureUsage: Shield,
    propertyVacancy: Home,
    paymentFailures: CreditCard,
    timeOnPlatform: Clock,
};

/**
 * Churn Risk Card — displays overall score with traffic light badge.
 * Placed on account detail pages.
 */
export function ChurnRiskCard({ accountId }: { accountId: string }) {
    const { data, isLoading } = useChurnBreakdown(accountId);

    if (isLoading) return <Skeleton className="h-28 w-full rounded-xl" />;
    if (!data) return null;

    const risk = RISK_CONFIG[data.riskLevel] || RISK_CONFIG.low;

    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Churn Risk</CardTitle>
                <div className={`p-2 rounded-lg ${risk.bg}`}>
                    <AlertTriangle className={`h-4 w-4 ${risk.color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${risk.color}`}>{data.overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
                <Badge className={`text-[10px] mt-1 ${risk.bg} ${risk.color}`}>{risk.label}</Badge>
            </CardContent>
        </Card>
    );
}

/**
 * Churn Signal Breakdown Table — 7-signal detail view.
 * Shows individual signal scores, weights, and weighted contributions.
 */
export function ChurnSignalBreakdown({ accountId }: { accountId: string }) {
    const { data, isLoading } = useChurnBreakdown(accountId);

    if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />;
    if (!data) return null;

    const risk = RISK_CONFIG[data.riskLevel] || RISK_CONFIG.low;

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-[#3b82f6]">Churn Risk Signals</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${risk.color}`}>{data.overallScore}/100</span>
                        <Badge className={`text-[10px] ${risk.bg} ${risk.color}`}>{risk.label}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.signals.map((signal: ChurnSignal) => {
                        const Icon = SIGNAL_ICONS[signal.key] || AlertTriangle;
                        const barWidth = Math.max(2, signal.score);
                        const barColor =
                            signal.score >= 70 ? 'bg-red-500'
                            : signal.score >= 40 ? 'bg-amber-500'
                            : 'bg-emerald-500';

                        return (
                            <div key={signal.key} className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-gray-100 shrink-0">
                                    <Icon className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-[#3b82f6]">{signal.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground">{signal.weight}%w</span>
                                            <span className="text-xs font-semibold">{signal.score}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${barWidth}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Simple health score badge for use in account tables/cards.
 */
export function HealthScoreBadge({ score }: { score: number | null | undefined }) {
    const s = score ?? 0;
    const level = s >= 70 ? 'critical' : s >= 50 ? 'high' : s >= 30 ? 'medium' : 'low';
    const risk = RISK_CONFIG[level];
    return <Badge className={`text-[10px] ${risk.bg} ${risk.color}`}>{s} — {risk.label}</Badge>;
}
