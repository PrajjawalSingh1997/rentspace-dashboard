import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AccountStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CLOSED';

export function AccountStatusBadge({ status, className }: { status: AccountStatus; className?: string }) {
    const variants: Record<AccountStatus, { label: string; bg: string; text: string }> = {
        ACTIVE: { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-800' },
        TRIAL: { label: 'Trial', bg: 'bg-blue-100', text: 'text-blue-800' },
        SUSPENDED: { label: 'Suspended', bg: 'bg-amber-100', text: 'text-amber-800' },
        CLOSED: { label: 'Closed', bg: 'bg-red-100', text: 'text-red-800' },
    };

    const style = variants[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
        <Badge variant="outline" className={cn(`px-2.5 py-0.5 border-transparent font-medium ${style.bg} ${style.text}`, className)}>
            {style.label}
        </Badge>
    );
}
