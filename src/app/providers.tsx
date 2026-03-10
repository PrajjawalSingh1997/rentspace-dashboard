// src/app/providers.tsx
// Client-side providers wrapper (QueryClient + Toaster)
"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { createQueryClient } from "@/lib/query-client";

import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * App-wide client providers
 * - QueryClientProvider for TanStack Query (data fetching)
 * - Toaster for toast notifications (sonner)
 * - TooltipProvider for Shadcn/UI tooltips
 * 
 * Wrapped in useState to prevent creating new QueryClient on every render
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
            </TooltipProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                    },
                }}
            />
        </QueryClientProvider>
    );
}
