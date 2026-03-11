export default function OverviewPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[#084734] mb-6">Command Center Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="h-32 bg-[#084734]/10 rounded-xl border border-[#084734]/20"></div>
                <div className="h-32 bg-[#084734]/10 rounded-xl border border-[#084734]/20"></div>
                <div className="h-32 bg-[#084734]/10 rounded-xl border border-[#084734]/20"></div>
                <div className="h-32 bg-[#084734]/10 rounded-xl border border-[#084734]/20"></div>
            </div>
            <div className="mt-6 h-96 bg-[#084734]/10 rounded-xl border border-[#084734]/20"></div>
        </div>
    );
}
