import { describe, expect, it } from 'vitest';
import { DashboardBroadcastService } from './dashboard-broadcast.service.js';
import type { DashboardGateway, DashboardRefreshEvent } from './dashboard.gateway.js';

describe('DashboardBroadcastService', () => {
  it('forwards refresh payloads to the dashboard gateway', () => {
    const emitted: DashboardRefreshEvent[] = [];
    const gateway = {
      emitRefresh: (payload: DashboardRefreshEvent) => {
        emitted.push(payload);
      },
    } as DashboardGateway;
    const service = new DashboardBroadcastService(gateway);

    service.notifyRefresh(7);

    expect(emitted).toEqual([{ tickNumber: 7 }]);
  });
});
