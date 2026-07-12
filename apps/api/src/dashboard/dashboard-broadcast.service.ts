/**
 * @module @project-genesis/api/dashboard/dashboard-broadcast.service
 *
 * Broadcasts dashboard refresh events to connected WebSocket clients.
 */

import { Inject, Injectable } from '@nestjs/common';
import { DashboardGateway } from './dashboard.gateway.js';

/** Notifies dashboard clients when session state changes. */
@Injectable()
export class DashboardBroadcastService {
  /**
   * @param dashboardGateway - Socket.io gateway for dashboard events.
   */
  constructor(
    @Inject(DashboardGateway)
    private readonly dashboardGateway: DashboardGateway,
  ) {}

  /** Emits a refresh event after simulation or session mutations. */
  notifyRefresh(tickNumber: number | null = null): void {
    this.dashboardGateway.emitRefresh({ tickNumber });
  }
}
