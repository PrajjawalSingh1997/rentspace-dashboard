"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth";
import { ROUTES } from "@/config/constants";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated && pathname !== ROUTES.AUTH.LOGIN) {
            router.replace(ROUTES.AUTH.LOGIN);
        }
    }, [isAuthenticated, router, pathname]);

    // Prevent hydration errors by not rendering anything until mounted
    if (!mounted) {
        return <div className="min-h-screen bg-[#111827] flex items-center justify-center" />;
    }

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-[#111827] flex items-center justify-center" />;
    }

    return <>{children}</>;
}
