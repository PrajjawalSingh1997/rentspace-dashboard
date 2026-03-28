'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface AdminEvent {
    type: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    data?: Record<string, unknown>;
}

interface UseAdminSocketOptions {
    url?: string;
    maxEvents?: number;
}

export function useAdminSocket(options: UseAdminSocketOptions = {}) {
    const { url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', maxEvents = 50 } = options;
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const pausedRef = useRef(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

        const socket = io(`${url}/admin`, {
            path: '/admin/ws',
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            setError(null);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('connect_error', (err) => {
            setError(err.message);
            setConnected(false);
        });

        socket.on('platform_event', (event: AdminEvent) => {
            if (!pausedRef.current) {
                setEvents(prev => [event, ...prev].slice(0, maxEvents));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [url, maxEvents]);

    const togglePause = useCallback(() => {
        pausedRef.current = !pausedRef.current;
        setPaused(p => !p);
    }, []);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    return { events, connected, error, paused, togglePause, clearEvents };
}
