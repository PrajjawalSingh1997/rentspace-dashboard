"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Authentication boundary failed:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen text-center">
            <h2 className="text-xl font-semibold mb-2 text-white">Authentication Service Error</h2>
            <p className="text-red-400 mb-6 max-w-md">
                {error.message || "The authentication service is currently unavailable."}
            </p>
            <Button
                onClick={() => reset()}
                className="bg-[#CEF17B] text-[#063528] hover:bg-[#b8e600]"
            >
                Retry
            </Button>
        </div>
    );
}
