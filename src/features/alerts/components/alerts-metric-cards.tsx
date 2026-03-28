import { Bell, XCircle, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AlertsMetricCardsProps {
    totalActive: number;
    criticalCount: number;
    avgResolutionHours: string;
}

export function AlertsMetricCards({ totalActive, criticalCount, avgResolutionHours }: AlertsMetricCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Active Alerts</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalActive}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#3b82f6]">
                        <Bell className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-red-200 bg-red-50/30">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Critical Count</p>
                        <h3 className="text-3xl font-bold text-red-700">{criticalCount}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                        <XCircle className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Avg Resolution Time</p>
                        <h3 className="text-3xl font-bold text-gray-900">{avgResolutionHours}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Timer className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

