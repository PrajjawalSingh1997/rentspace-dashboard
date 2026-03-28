'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DialogProps } from '@radix-ui/react-dialog';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    LayoutDashboard,
    BellRing,
    TrendingUp,
    CreditCard,
    ShieldCheck,
    Building2,
    Users,
    KeySquare,
    DollarSign,
    Wrench,
    DoorClosed,
    MessageSquare,
    Lightbulb,
    Settings,
    FileText,
    Shield,
    Activity,
    UsersRound
} from 'lucide-react';

export function CommandMenu({ ...props }: DialogProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen} {...props}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="General">
                    <CommandItem onSelect={() => runCommand(() => router.push('/overview'))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/alerts'))}>
                        <BellRing className="mr-2 h-4 w-4" /> Active Alerts
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/notifications'))}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Notifications
                    </CommandItem>
                </CommandGroup>
                
                <CommandSeparator />

                <CommandGroup heading="Analytics">
                    <CommandItem onSelect={() => runCommand(() => router.push('/analytics/growth'))}>
                        <TrendingUp className="mr-2 h-4 w-4" /> Growth
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/analytics/revenue'))}>
                        <DollarSign className="mr-2 h-4 w-4" /> Revenue
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/analytics/subscriptions'))}>
                        <CreditCard className="mr-2 h-4 w-4" /> Subscriptions
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/status'))}>
                        <Activity className="mr-2 h-4 w-4" /> Platform Status
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Management">
                    <CommandItem onSelect={() => runCommand(() => router.push('/accounts'))}>
                        <Building2 className="mr-2 h-4 w-4" /> Accounts (Landlords)
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/users'))}>
                        <Users className="mr-2 h-4 w-4" /> Users
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/plans'))}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Plans & Subscriptions
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Platform Operations">
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/rent'))}>
                        <DollarSign className="mr-2 h-4 w-4" /> Rent Management
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/properties'))}>
                        <Building2 className="mr-2 h-4 w-4" /> Properties
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/tenants'))}>
                        <KeySquare className="mr-2 h-4 w-4" /> Tenants
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/maintenance'))}>
                        <Wrench className="mr-2 h-4 w-4" /> Maintenance
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/move-outs'))}>
                        <DoorClosed className="mr-2 h-4 w-4" /> Move-Outs
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/support'))}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Support Tickets
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/suggestions'))}>
                        <Lightbulb className="mr-2 h-4 w-4" /> Feature Suggestions
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/platform/staff'))}>
                        <UsersRound className="mr-2 h-4 w-4" /> Landlord Staff
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="System">
                    <CommandItem onSelect={() => runCommand(() => router.push('/admin-users'))}>
                        <Shield className="mr-2 h-4 w-4" /> Admin Users
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
                        <Settings className="mr-2 h-4 w-4" /> System Settings
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/reports'))}>
                        <FileText className="mr-2 h-4 w-4" /> Export Reports
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
