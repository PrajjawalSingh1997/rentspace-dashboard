import { OverviewClient } from '@/features/analytics/components/overview-client';

export default function OverviewPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-[#084734] mb-6">Command Center Overview</h1>
            <OverviewClient />
        </div>
    );
}
