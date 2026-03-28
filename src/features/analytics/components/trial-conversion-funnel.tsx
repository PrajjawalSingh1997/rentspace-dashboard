import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, TrendingDown, Users } from 'lucide-react';
import type { TrialConversionResponse } from '../api/use-growth-analytics';

interface TrialConversionFunnelProps {
    data: TrialConversionResponse;
}

export function TrialConversionFunnel({ data }: TrialConversionFunnelProps) {
    const stages = [
        { label: 'Total Signups', value: data.funnel.totalSignups, color: '#3b82f6', bgColor: 'bg-[#3b82f6]/10' },
        { label: 'On Trial', value: data.funnel.onTrial, color: '#0ea5e9', bgColor: 'bg-sky-50' },
        { label: 'Converted', value: data.funnel.converted, color: '#059669', bgColor: 'bg-emerald-50' },
        { label: 'Churned', value: data.funnel.churned, color: '#ef4444', bgColor: 'bg-red-50' },
    ];

    return (
        <div className="space-y-6">
            {/* Funnel visualization */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#3b82f6]">Trial-to-Paid Conversion Funnel</CardTitle>
                    <p className="text-sm text-muted-foreground">Track how trial users progress through the conversion pipeline</p>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-2 py-8">
                        {stages.map((stage, idx) => (
                            <div key={stage.label} className="flex items-center gap-2">
                                <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${stage.bgColor} min-w-[120px]`}>
                                    <span className="text-2xl font-bold" style={{ color: stage.color }}>{stage.value.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-muted-foreground text-center">{stage.label}</span>
                                </div>
                                {idx < stages.length - 1 && (
                                    <ArrowRight className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Rate cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RateCard
                    title="Conversion Rate"
                    value={data.rates.conversionRate}
                    icon={TrendingUp}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    description="Trial → Active conversion"
                />
                <RateCard
                    title="Trial Rate"
                    value={data.rates.trialRate}
                    icon={Users}
                    color="text-sky-600"
                    bgColor="bg-sky-50"
                    description="Currently on trial"
                />
                <RateCard
                    title="Churn Rate"
                    value={data.rates.churnRate}
                    icon={TrendingDown}
                    color="text-red-500"
                    bgColor="bg-red-50"
                    description="Trial → Closed abandonment"
                />
            </div>
        </div>
    );
}

function RateCard({ title, value, icon: Icon, color, bgColor, description }: {
    title: string;
    value: number;
    icon: typeof TrendingUp;
    color: string;
    bgColor: string;
    description: string;
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}%</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
