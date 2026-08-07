'use client';

import { io, type Socket } from 'socket.io-client';
import type { DashboardConnectionState } from '@/presentation/runtime/workspace-runtime-state';

/** Payload emitted when the dashboard should refresh. */
export type DashboardRefreshPayload = {
  readonly tickNumber: number | null;
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://127.0.0.1:3001';

/** Connects to the dashboard WebSocket namespace and listens for refresh events. */
export function connectDashboardSocket(
  onRefresh: (payload: DashboardRefreshPayload) => void,
  onConnectionChange?: (state: DashboardConnectionState) => void,
): Socket {
  const socket = io(`${API_ORIGIN}/ws/v1/dashboard`, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
  });

  socket.on('connect', () => {
    onConnectionChange?.('connected');
  });

  socket.on('disconnect', () => {
    onConnectionChange?.('disconnected');
  });

  socket.io.on('reconnect_attempt', () => {
    onConnectionChange?.('reconnecting');
  });

  socket.io.on('reconnect', () => {
    onConnectionChange?.('connected');
  });

  socket.io.on('reconnect_failed', () => {
    onConnectionChange?.('disconnected');
  });

  socket.on('dashboard:refresh', (payload: DashboardRefreshPayload) => {
    onRefresh(payload);
  });

  return socket;
}
