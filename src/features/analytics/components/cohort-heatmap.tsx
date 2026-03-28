import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CohortAnalysisResponse } from '../api/use-growth-analytics';

interface CohortHeatmapProps {
    data: CohortAnalysisResponse;
}

export function CohortHeatmap({ data }: CohortHeatmapProps) {
    const maxMonth = Math.max(...data.matrix.map(r => r.retention.length));

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">
                    Cohort {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    How well each monthly cohort retains over time. Darker green = higher retention.
                </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium whitespace-nowrap">Cohort</th>
                            <th className="text-center py-2 px-3 text-muted-foreground font-medium">Size</th>
                            {Array.from({ length: maxMonth }, (_, i) => (
                                <th key={i} className="text-center py-2 px-3 text-muted-foreground font-medium whitespace-nowrap">
                                    M{i + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.matrix.map((row) => (
                            <tr key={row.cohort} className="border-t border-gray-100">
                                <td className="py-2 px-3 font-medium text-[#3b82f6] whitespace-nowrap">
                                    {formatCohortLabel(row.cohort)}
                                </td>
                                <td className="py-2 px-3 text-center font-semibold">{row.size}</td>
                                {Array.from({ length: maxMonth }, (_, i) => {
                                    const cell = row.retention[i];
                                    if (!cell) return <td key={i} className="py-2 px-3 text-center text-muted-foreground">—</td>;
                                    return (
                                        <td key={i} className="py-1.5 px-1.5 text-center">
                                            <div
                                                className="rounded-md py-1.5 px-2 text-xs font-medium transition-colors"
                                                style={{
                                                    backgroundColor: getRetentionColor(cell.rate),
                                                    color: cell.rate > 50 ? '#fff' : '#1f2937',
                                                }}
                                            >
                                                {cell.rate}%
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data.matrix.length === 0 && (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        No cohort data available for the selected period.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getRetentionColor(rate: number): string {
    if (rate >= 80) return '#059669';
    if (rate >= 60) return '#10b981';
    if (rate >= 40) return '#34d399';
    if (rate >= 20) return '#a7f3d0';
    return '#ecfdf5';
}

function formatCohortLabel(cohort: string): string {
    const date = new Date(cohort + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
