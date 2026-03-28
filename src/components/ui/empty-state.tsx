'use client';

import { cn } from '@/lib/utils';
import { FileX2, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    /** Icon to display (defaults to FileX2) */
    icon?: LucideIcon;
    /** Main heading */
    title?: string;
    /** Descriptive message */
    description?: string;
    /** Optional action button */
    action?: React.ReactNode;
    /** Additional className */
    className?: string;
}

/**
 * Reusable empty state component with icon, title, and description.
 * Use when data fetches successfully but returns zero items.
 */
export function EmptyState({
    icon: Icon = FileX2,
    title = 'No data found',
    description = 'There are no items to display right now.',
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-16 px-4 text-center',
            className
        )}>
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
