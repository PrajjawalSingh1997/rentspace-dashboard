// src/lib/api.ts
// Axios instance with JWT interceptor and error handling

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";

/**
 * Base API client for all dashboard requests
 * - Automatically attaches JWT token from auth store
 * - Handles 401 responses by logging out
 * - Points to the backend server
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — logout and redirect
            useAuthStore.getState().logout();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

/**
 * Type-safe API response wrapper
 * Matches the backend's sendSuccessResponse format
 */
export interface ApiResponse<T> {
    success: boolean;
    status: number;
    code: string;
    message: string;
    data: T;
    traceId: string;
    timestamp: string;
    path: string;
}

/**
 * Type-safe API error response
 * Matches the backend's sendErrorResponse format
 */
export interface ApiError {
    success: false;
    status: number;
    code: string;
    message: string;
    userMessage: string;
    retryable: boolean;
    traceId: string;
    timestamp: string;
    path: string;
}

/**
 * Extract error message from API error response
 * Falls back to generic message if structure doesn't match
 */
export function getApiErrorMessage(error: unknown): string {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ApiError;
        return data.userMessage || data.message || "An unexpected error occurred";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
}
