"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, verifyOtpSchema, type OtpFormValues, type VerifyOtpFormValues } from "../types/auth.schema";
import { Building, Loader2, Phone, KeyRound, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/constants";
import api, { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export function OtpForm() {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phoneValue, setPhoneValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const setAuth = useAuthStore((state) => state.login);

    // Phone Form
    const phoneForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: { phone: "" },
    });

    // OTP Verification Form
    const otpVerifyForm = useForm<VerifyOtpFormValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { phone: "", otp: "" },
    });

    const onSendOtp = async (data: OtpFormValues) => {
        setIsLoading(true);
        try {
            // In a real system, there should be an admin OTP send route.
            // Assuming the backend has `/admin/api/auth/send-otp`
            await api.post("/admin/api/auth/send-otp", {
                phone: data.phone,
                role: "SUPER_ADMIN"
            });

            setPhoneValue(data.phone);
            otpVerifyForm.setValue("phone", data.phone);
            setStep("otp");
            toast.success("OTP sent to your registered phone number.");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (data: VerifyOtpFormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post("/admin/api/auth/verify-otp", {
                phone: data.phone,
                otp: data.otp,
                role: "SUPER_ADMIN"
            });

            const result = response.data;
            if (result.success && result.data.accessToken) {
                setAuth(result.data.accessToken, result.data.user);
                toast.success("Welcome back to RentLyf Admin");
                router.push(ROUTES.DASHBOARD.OVERVIEW);
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-md lg:max-w-[70%] xl:max-w-lg 2xl:max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 relative flex flex-col min-h-0">
            <div className="mb-6 text-center shrink-0">
                <div className="inline-flex w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-[#084734] items-center justify-center text-white mb-4">
                    <Building className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {step === "phone" ? "Login with OTP" : "Verify OTP"}
                </h1>
                <p className="text-gray-500 text-sm lg:text-base">
                    {step === "phone"
                        ? "Enter your registered phone number to receive a 6-digit code."
                        : `Enter the 6-digit code sent to ${phoneValue}.`}
                </p>
            </div>

            <div className="overflow-y-auto w-full no-scrollbar pb-2">
                {step === "phone" ? (
                    <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1 lg:mb-2">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Phone className="w-5 h-5" />
                                </span>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    {...phoneForm.register("phone")}
                                    className={`w-full pl-11 lg:pl-12 pr-4 py-3 bg-gray-50 border rounded-lg outline-none transition-colors text-gray-900 lg:text-lg ${phoneForm.formState.errors.phone ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" : "border-gray-200 focus:border-[#084734] focus:ring-1 focus:ring-[#084734]"
                                        }`}
                                />
                            </div>
                            {phoneForm.formState.errors.phone && <p className="mt-1 text-sm text-red-500">{phoneForm.formState.errors.phone.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-[#084734] hover:bg-[#063528] text-white font-medium lg:text-lg rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={otpVerifyForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1 lg:mb-2">6-Digit Code</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <KeyRound className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    {...otpVerifyForm.register("otp")}
                                    className={`w-full pl-11 lg:pl-12 pr-4 py-3 bg-gray-50 border rounded-lg outline-none transition-colors text-center tracking-widest text-lg lg:text-xl font-mono text-gray-900 ${otpVerifyForm.formState.errors.otp ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" : "border-gray-200 focus:border-[#084734] focus:ring-1 focus:ring-[#084734]"
                                        }`}
                                />
                            </div>
                            {otpVerifyForm.formState.errors.otp && <p className="mt-1 text-sm text-red-500">{otpVerifyForm.formState.errors.otp.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-[#084734] hover:bg-[#063528] text-white font-medium lg:text-lg rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-6 text-center relative z-10 shrink-0">
                <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="inline-flex items-center gap-1 text-sm lg:text-base font-medium text-gray-500 hover:text-[#084734] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Password Login
                </Link>
            </div>
        </div>
    );
}
