import { AlertsClient } from '@/features/alerts/components/alerts-client';

export const metadata = {
    title: 'Alerts Center | RentSpace Super Admin',
    description: 'Monitor system, account, and financial alerts across the platform',
};

export default function AlertsPage() {
    return (
        <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
            <AlertsClient />
        </main>
    );
}
