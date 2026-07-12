/**
 * @module @project-genesis/api/dashboard/dashboard.module
 */

import { Module } from '@nestjs/common';
import { DashboardBroadcastService } from './dashboard-broadcast.service.js';
import { DashboardGateway } from './dashboard.gateway.js';

/** Registers dashboard WebSocket gateway and broadcast helpers. */
@Module({
  providers: [DashboardGateway, DashboardBroadcastService],
  exports: [DashboardBroadcastService],
})
export class DashboardModule {}
