import { LoginForm } from "@/features/auth/components/login-form";
import { BrandName } from "@/components/ui/brand-name";


export default function LoginPage() {
    return (
        <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-white">
            {/* Left Side - Branding / Illustration */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[45%] bg-[#084734] text-white p-8 xl:p-16 relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#063528] rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#CEF17B]/20 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 flex items-center gap-3">
                    {/* Rotated diamond logo */}
                    <div className="relative w-12 h-12 xl:w-16 xl:h-16 flex items-center justify-center">
                        <div className="w-[46px] h-[46px] border-[2.89px] border-white rounded-[9.25px] rotate-45" />
                        <span className="absolute font-scrib font-normal text-[23px] leading-[33px] text-center tracking-[-1.16px] capitalize text-white">
                            R
                        </span>
                    </div>
                    <BrandName className="text-2xl xl:text-3xl tracking-tight" />
                </div>

                <div className="relative z-10 space-y-6 lg:space-y-8 max-w-lg 2xl:max-w-2xl">
                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
                        Manage your properties with unprecedented clarity.
                    </h1>
                    <p className="text-[#cce3dd] text-lg xl:text-xl leading-relaxed">
                        <BrandName text="Rentlyf" /> Super Admin gives you real-time visibility into tenants, rent collections, maintenance requests, and platform growth metrics.
                    </p>
                </div>

                <div className="relative z-10 text-sm xl:text-base text-[#cce3dd]">
                    &copy; {new Date().getFullYear()} <BrandName text="Rentlyf" /> Technologies. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form Wrapper */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#F1F5F9]">
                <LoginForm />
            </div>
        </div>
    );
}
