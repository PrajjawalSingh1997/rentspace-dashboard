"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../types/auth.schema";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/constants";
import api, { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { BrandName } from "@/components/ui/brand-name";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post("/admin/api/auth/login", {
                email: data.email,
                password: data.password,
            });

            const result = response.data;
            if (result.success && result.data.accessToken) {
                setAuth(result.data.accessToken, result.data.user);
                toast.success("Welcome back to Rentlyf Admin");
                router.push(ROUTES.DASHBOARD.OVERVIEW);
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-md lg:max-w-[70%] xl:max-w-lg 2xl:max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-6 text-center flex flex-col items-center">
                <div className="relative w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center mb-6 mt-2">
                    <div className="absolute w-[80%] h-[80%] border-[3px] border-[#084734] rounded-[10px] rotate-45" />
                    <span className="absolute font-scrib font-normal text-[28px] lg:text-[34px] text-center capitalize text-[#084734] z-10">
                        R
                    </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#084734] leading-tight mb-2">
                    Sign In to <BrandName />
                </h1>
                <p className="text-gray-500 text-sm lg:text-base">Enter your email and password to access the admin panel.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1 lg:mb-2">Email</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                            <Mail className="w-5 h-5" />
                        </span>
                        <input
                            type="email"
                            placeholder="admin@rentlyf.com"
                            {...register("email")}
                            className={`w-full pl-11 lg:pl-12 pr-4 py-3 bg-gray-50 border rounded-lg outline-none transition-colors text-gray-900 ${errors.email ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" : "border-gray-200 focus:border-[#084734] focus:ring-1 focus:ring-[#084734]"
                                }`}
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1 lg:mb-2">Password</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                            <Lock className="w-5 h-5" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full pl-11 lg:pl-12 pr-12 py-3 bg-gray-50 border rounded-lg outline-none transition-colors text-gray-900 ${errors.password ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" : "border-gray-200 focus:border-[#084734] focus:ring-1 focus:ring-[#084734]"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className="w-4 h-4 rounded border-gray-300 accent-[#084734] focus:ring-[#084734]"
                        />
                        <span className="text-sm lg:text-base text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm lg:text-base font-medium text-[#084734] hover:underline">
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#084734] hover:bg-[#063528] text-white font-medium lg:text-lg rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

        </div>
    );
}
