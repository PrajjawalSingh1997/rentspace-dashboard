"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Here we could log the error to an error reporting service
        console.error("Dashboard feature failed:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[50vh] bg-[#063528]/20 rounded-xl border border-red-900/50">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <span className="text-red-500 text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Critical System Error</h2>
            <p className="text-red-400 mb-6 max-w-md">
                {error.message || "An unexpected error occurred in this module. Please reset or contact support."}
            </p>
            <Button
                onClick={() => reset()}
                className="bg-[#CEF17B] text-[#063528] hover:bg-[#b8e600]"
            >
                Restart Module
            </Button>
        </div>
    );
}
