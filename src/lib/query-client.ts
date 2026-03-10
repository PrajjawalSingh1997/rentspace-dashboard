// src/lib/query-client.ts
// TanStack Query client configuration (Rule F12)

import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient configuration
 * 
 * - staleTime: 5 minutes — data is fresh for 5 min, no refetch
 * - gcTime: 10 minutes — cached data kept for 10 min after unmount
 * - retry: 1 — retry failed requests once (not for 4xx errors)
 * - refetchOnWindowFocus: false — no surprise refetches when switching tabs
 */
export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,         // 5 minutes
                gcTime: 10 * 60 * 1000,            // 10 minutes (was cacheTime)
                retry: (failureCount, error: any) => {
                    // Don't retry 4xx errors (client errors)
                    if (error?.response?.status >= 400 && error?.response?.status < 500) {
                        return false;
                    }
                    return failureCount < 1;
                },
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
            mutations: {
                retry: false,
            },
        },
    });
}
