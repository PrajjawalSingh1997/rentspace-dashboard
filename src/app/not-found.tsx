import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#111827] text-white flex flex-col items-center justify-center">
            <h1 className="text-9xl font-bold text-[#084734]">404</h1>
            <h2 className="text-2xl mt-4 mb-2 font-semibold text-gray-200">System Cannot Find Page</h2>
            <p className="text-gray-400 mb-8 max-w-md text-center">
                The dashboard node you're looking for doesn't exist, has been moved, or you don't have super admin access to view it.
            </p>
            <Link href="/">
                <Button className="bg-[#CEF17B] text-[#063528] hover:bg-[#b8e600] font-medium">
                    Return to Command Center
                </Button>
            </Link>
        </div>
    );
}
