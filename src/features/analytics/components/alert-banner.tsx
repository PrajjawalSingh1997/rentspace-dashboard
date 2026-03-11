import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export function AlertBanner() {
    return (
        <Alert variant="destructive" className="mb-6 bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="h-4 w-4" color="#dc2626" />
            <AlertTitle className="text-red-800 font-semibold">Critical Alerts (Static Placeholder)</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>You have 3 unresolved high-priority alerts waiting for admin review.</span>
                <Link href="/dashboard/alerts" className="text-red-700 underline font-medium hover:text-red-900">
                    View Alerts Center
                </Link>
            </AlertDescription>
        </Alert>
    );
}
