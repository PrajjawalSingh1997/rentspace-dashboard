import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="h-screen w-screen overflow-hidden bg-[#F1F5F9] text-gray-900 selection:bg-[#CEF17B] selection:text-[#063528] flex">
                {/* Desktop Sidebar - hidden on mobile, flexing as a sibling on desktop */}
                <Sidebar className="hidden md:flex z-20" />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                    <Header />

                    {/* Scrollable Main Area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 2xl:p-10 custom-scrollbar">
                        <div className="mx-auto max-w-screen-2xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
