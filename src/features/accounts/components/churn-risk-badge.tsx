import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ChurnRiskBadge({ score, className }: { score: number | null; className?: string }) {
    if (score === null || score === undefined) return <span className="text-gray-400 text-sm">N/A</span>;

    let variant = { label: 'Low Risk', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    
    if (score >= 75) {
        variant = { label: 'High Risk', bg: 'bg-red-50 text-red-700 border-red-200' };
    } else if (score >= 50) {
        variant = { label: 'Medium Risk', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    }

    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(`font-medium ${variant.bg}`, className)}>
                {variant.label}
            </Badge>
            <span className="text-xs text-gray-500 font-medium">{score}/100</span>
        </div>
    );
}
