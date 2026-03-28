import { AccountsClient } from '@/features/accounts/components/accounts-client';

export const metadata = {
    title: 'Landlords | RentSpace Admin',
};

export default function AccountsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-[#3b82f6] mb-6">Landlords & Accounts</h1>
            <AccountsClient />
        </div>
    );
}
