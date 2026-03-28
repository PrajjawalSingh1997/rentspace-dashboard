import { Metadata } from 'next';
import { PlansClient } from '@/features/plans/components/plans-client';

export const metadata: Metadata = {
    title: 'Plans & Subscriptions | Admin',
    description: 'Manage subscription tiers and billing operations',
};

export default function PlansPage() {
    return <PlansClient />;
}
