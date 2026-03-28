import { AccountProfileClient } from '@/features/accounts/components/account-profile-client';

export const metadata = {
    title: 'Account Profile | RentSpace Admin',
};

// NextJS dynamic route params await requirement for App router 
export default async function AccountProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <AccountProfileClient id={params.id} />
        </div>
    );
}
