"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building, LifeBuoy } from "lucide-react";
import { DASHBOARD_NAVIGATION } from "@/config/navigation";

export function Sidebar({ className, onNavClick }: { className?: string; onNavClick?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className={cn("w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0", className)}>
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#084734] flex items-center justify-center text-white">
                    <Building className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-gray-900 font-bold text-lg leading-tight">RentLyf Admin</h1>
                    <p className="text-gray-500 text-xs">Super Admin</p>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-4 pb-6 space-y-8 mt-2">
                {DASHBOARD_NAVIGATION.map((section) => (
                    <div key={section.title}>
                        <h2 className="text-gray-400 text-[11px] font-bold mb-3 px-3 uppercase tracking-wider">
                            {section.title}
                        </h2>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavClick}
                                            className={cn(
                                                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium overflow-hidden",
                                                isActive
                                                    ? "bg-[#084734] text-white shadow-md shadow-[#084734]/20"
                                                    : "text-gray-600 hover:text-[#084734] hover:bg-[#F1F5F9]"
                                            )}
                                        >
                                            {/* Active Indicator line (Tailadmin style) */}
                                            {isActive && (
                                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#CEF17B] rounded-r-full" />
                                            )}

                                            <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors",
                                                isActive ? "text-[#CEF17B]" : "text-gray-400 group-hover:text-[#084734]"
                                            )} />
                                            <span className="truncate">{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom Support Button */}
            <div className="p-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-[#084734] hover:text-white hover:border-[#084734] transition-colors text-sm font-medium">
                    <LifeBuoy className="w-4 h-4" />
                    Support Center
                </button>
            </div>
        </aside>
    );
}
