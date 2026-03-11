import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
    phone: z.string().min(10, "Please enter a valid phone number."),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const verifyOtpSchema = z.object({
    phone: z.string(),
    otp: z.string().length(6, "OTP must be exactly 6 digits."),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
