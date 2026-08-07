// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { NotificationSyncSession } from './notification-sync-session';

describe('NotificationSyncSession', () => {
  it('coalesces overlapping sync requests into one follow-up pass', async () => {
    const session = new NotificationSyncSession();
    let active = 0;
    let maxActive = 0;

    const sync = vi.fn(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 10);
      });
      active -= 1;
    });

    await Promise.all([
      session.run(sync),
      session.run(sync),
      session.run(sync),
    ]);

    expect(sync).toHaveBeenCalledTimes(2);
    expect(session.syncCount).toBe(2);
    expect(maxActive).toBe(1);
  });
});
