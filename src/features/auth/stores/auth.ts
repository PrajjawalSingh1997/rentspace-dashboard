// src/stores/auth.ts
// Zustand store for authentication state

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/config/constants";

/**
 * Admin user profile from login response
 */
export interface AdminProfile {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "SUPPORT" | "READ_ONLY";
    isActive: boolean;
    lastLoginAt: string | null;
}

/**
 * Auth state interface
 */
interface AuthState {
    /** JWT access token */
    token: string | null;
    /** Admin user profile */
    admin: AdminProfile | null;
    /** Whether user is authenticated */
    isAuthenticated: boolean;

    /** Set auth data after successful login */
    login: (token: string, admin: AdminProfile) => void;
    /** Clear auth data and redirect to login */
    logout: () => void;
    /** Update token (e.g., after refresh) */
    setToken: (token: string) => void;
}

/**
 * Auth store with localStorage persistence
 * Token and admin profile survive page refreshes
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            admin: null,
            isAuthenticated: false,

            login: (token: string, admin: AdminProfile) =>
                set({
                    token,
                    admin,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    token: null,
                    admin: null,
                    isAuthenticated: false,
                }),

            setToken: (token: string) =>
                set({ token }),
        }),
        {
            name: STORAGE_KEYS.AUTH_STORE,
            // Only persist token and admin — isAuthenticated is derived
            partialize: (state) => ({
                token: state.token,
                admin: state.admin,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
