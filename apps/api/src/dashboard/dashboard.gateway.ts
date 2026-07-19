/**
 * @module @project-genesis/api/dashboard/dashboard.gateway
 *
 * WebSocket gateway for live dashboard refresh notifications.
 */

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';

/** Payload emitted when the dashboard should refresh. */
export type DashboardRefreshEvent = {
  readonly tickNumber: number | null;
};

/** Socket.io gateway for dashboard refresh events at `/ws/v1/dashboard`. */
@WebSocketGateway({
  namespace: '/ws/v1/dashboard',
  cors: {
    origin: process.env['WEB_ORIGIN'] ?? 'http://127.0.0.1:3000',
    credentials: true,
  },
})
export class DashboardGateway {
  @WebSocketServer()
  server!: Server;

  /** Broadcasts a dashboard refresh event to all connected clients. */
  emitRefresh(payload: DashboardRefreshEvent): void {
    if (this.server === undefined) {
      return;
    }

    this.server.emit('dashboard:refresh', payload);
  }
}
