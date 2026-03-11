export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="h-screen w-screen overflow-hidden selection:bg-[#CEF17B] selection:text-[#063528] bg-[#F1F5F9]">
            {children}
        </main>
    );
}
