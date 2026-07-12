'use client';

import { io, type Socket } from 'socket.io-client';

/** Payload emitted when the dashboard should refresh. */
export type DashboardRefreshPayload = {
  readonly tickNumber: number | null;
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://127.0.0.1:3001';

/** Connects to the dashboard WebSocket namespace and listens for refresh events. */
export function connectDashboardSocket(
  onRefresh: (payload: DashboardRefreshPayload) => void,
  onConnectionChange?: (connected: boolean) => void,
): Socket {
  const socket = io(`${API_ORIGIN}/ws/v1/dashboard`, {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    onConnectionChange?.(true);
  });
  socket.on('disconnect', () => {
    onConnectionChange?.(false);
  });
  socket.on('dashboard:refresh', (payload: DashboardRefreshPayload) => {
    onRefresh(payload);
  });

  return socket;
}
