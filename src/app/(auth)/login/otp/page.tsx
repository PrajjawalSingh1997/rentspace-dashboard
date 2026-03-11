import { OtpForm } from "@/features/auth/components/otp-form";
import { Building2 } from "lucide-react";

export default function OtpLoginPage() {
    return (
        <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-white">
            {/* Left Side - Branding / Illustration */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[45%] bg-[#084734] text-white p-8 xl:p-16 relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#063528] rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#CEF17B]/20 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 xl:w-16 xl:h-16 rounded bg-[#CEF17B] flex items-center justify-center text-[#084734]">
                        <Building2 className="w-8 h-8 xl:w-10 xl:h-10" />
                    </div>
                    <span className="text-2xl xl:text-3xl font-bold tracking-tight">RentLyf</span>
                </div>

                <div className="relative z-10 space-y-6 lg:space-y-8 max-w-lg 2xl:max-w-2xl">
                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
                        Secure Access via OTP.
                    </h1>
                    <p className="text-[#cce3dd] text-lg xl:text-xl leading-relaxed">
                        Verify your identity using a one-time password sent directly to your registered mobile device.
                    </p>
                </div>

                <div className="relative z-10 text-sm xl:text-base text-[#cce3dd]">
                    &copy; {new Date().getFullYear()} RentLyf Technologies. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form Wrapper */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#F1F5F9]">
                <OtpForm />
            </div>
        </div>
    );
}
