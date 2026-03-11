"use client";
import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/auth/stores/auth";

export function Header() {
    const logout = useAuthStore((state) => state.logout);
    const admin = useAuthStore((state) => state.admin);
    const [open, setOpen] = useState(false);

    return (
        <header className="h-[72px] bg-white border-b border-gray-200/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-2 md:gap-4 flex-1">
                <div className="md:hidden flex items-center">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 -ml-2 mr-2 text-gray-500 hover:text-[#084734] hover:bg-gray-50 rounded-lg transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[280px]" aria-describedby={undefined}>
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <Sidebar className="w-full border-r-0" onNavClick={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden md:flex items-center gap-2.5 text-[#084734] font-bold text-lg min-w-48 tracking-tight">
                    <TrendingUpIcon className="w-[22px] h-[22px] text-[#084734]" />
                    Command Center
                </div>

                <div className="max-w-md w-full relative ml-auto md:ml-0 group">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#084734]/50 group-focus-within:text-[#084734] transition-colors" />
                    <Input
                        placeholder="Search systems..."
                        className="pl-10 h-10 bg-[#084734]/10 border-transparent text-gray-900 focus-visible:ring-1 focus-visible:ring-[#084734] focus-visible:bg-white focus-visible:shadow-sm focus-visible:border-[#084734]/20 placeholder:text-[#084734]/50 w-full transition-all duration-200 rounded-lg"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5 md:gap-7">
                <button className="p-2 text-gray-400 hover:text-[#084734] hover:bg-gray-50 rounded-full relative transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#dc2626] rounded-full ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{admin?.name || "Admin User"}</p>
                        <p className="text-xs text-gray-500">{admin?.role || "Global Admin"}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <Avatar className="w-9 h-9 border border-gray-200">
                                <AvatarFallback className="bg-[#084734] text-white font-bold">
                                    {admin?.name?.charAt(0) || "A"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                            <DropdownMenuItem>Audit Logs</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout()} className="text-red-500 font-medium">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

// Temporary icon to match the stitch mockup next to "Command Center"
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
