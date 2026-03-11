import {
    LayoutDashboard,
    Bell,
    TrendingUp,
    DollarSign,
    List,
    Building2,
    FileText,
    Users,
    UserCircle,
    CreditCard,
    Banknote,
    Home,
    UsersRound,
    Wrench,
    LogOut,
    LifeBuoy,
    Megaphone,
    HardHat,
    ShieldCheck,
    Settings,
} from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
};

export type NavSection = {
    title: string;
    items: NavItem[];
};

export const DASHBOARD_NAVIGATION: NavSection[] = [
    {
        title: "BUSINESS INTELLIGENCE",
        items: [
            { title: "Overview", href: "/overview", icon: LayoutDashboard },
            { title: "Alerts Center", href: "/alerts", icon: Bell },
            { title: "Growth Analytics", href: "/growth", icon: TrendingUp },
            { title: "Revenue & Billing", href: "/revenue", icon: DollarSign },
            { title: "Subscription Analytics", href: "/subscriptions", icon: List },
            { title: "Platform Analytics", href: "/platform", icon: Building2 },
            { title: "Reports", href: "/reports", icon: FileText },
        ]
    },
    {
        title: "ACCOUNT MANAGEMENT",
        items: [
            { title: "Landlords", href: "/accounts", icon: Users },
            { title: "All Users", href: "/users", icon: UserCircle },
            { title: "Plans & Subscriptions", href: "/plans", icon: CreditCard },
        ]
    },
    {
        title: "PLATFORM OPERATIONS",
        items: [
            { title: "Rent", href: "/rent", icon: Banknote },
            { title: "Properties", href: "/properties", icon: Home },
            { title: "Tenants", href: "/tenants", icon: UsersRound },
            { title: "Maintenance", href: "/maintenance", icon: Wrench },
            { title: "Move-Outs", href: "/move-outs", icon: LogOut },
            { title: "Support", href: "/support", icon: LifeBuoy },
            { title: "Notifications", href: "/notifications", icon: Megaphone },
            { title: "Staff", href: "/staff", icon: HardHat },
        ]
    },
    {
        title: "SYSTEM ADMIN",
        items: [
            { title: "Admin Users & Logs", href: "/admin-users", icon: ShieldCheck },
            { title: "Settings", href: "/settings", icon: Settings },
        ]
    }
];
