import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store';

const WS_URL = import.meta.env.VITE_WS_URL;

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
    });

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', () => setStatus('disconnected'));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return { socket: socketRef.current, status };
}

