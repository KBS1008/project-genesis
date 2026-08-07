import { describe, expect, it, vi } from 'vitest';
import { executePresentationCommand } from '@/presentation/commands/execute-command';
import { buildProductionNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { mapEventLogEntryToNotification } from '@/presentation/notifications/map-event-log-notification';
import { resolveNotificationAction } from '@/presentation/notifications/notification-actions';
import { NotificationSyncSession } from '@/presentation/runtime/notification-sync-session';

describe('command pipeline integration', () => {
  it('executes save command with scoped workspace refresh and screen invalidation', async () => {
    const refreshWorkspaceScopes = vi.fn(async () => {});
    const invalidateScreenScopes = vi.fn();

    const result = await executePresentationCommand(
      async () => {},
      {
        commandId: 'session.save',
        generation: 1,
        isCurrentGeneration: () => true,
        refreshWorkspaceScopes,
        invalidateScreenScopes,
      },
    );

    expect(result.status).toBe('success');
    expect(refreshWorkspaceScopes).toHaveBeenCalledWith(['workspace.saves']);
    expect(invalidateScreenScopes).not.toHaveBeenCalled();
  });

  it('surfaces recoverable errors without refreshing scopes', async () => {
    const refreshWorkspaceScopes = vi.fn(async () => {
      throw new Error('network');
    });
    const invalidateScreenScopes = vi.fn();

    const result = await executePresentationCommand(
      async () => {},
      {
        commandId: 'production.start',
        generation: 1,
        isCurrentGeneration: () => true,
        refreshWorkspaceScopes,
        invalidateScreenScopes,
      },
    );

    expect(result.status).toBe('recoverable-error');
    expect(result.error?.recoverable).toBe(true);
    expect(invalidateScreenScopes).not.toHaveBeenCalled();
  });
});

describe('notification pipeline integration', () => {
  it('maps retry-save to the session.save command pipeline', () => {
    expect(resolveNotificationAction('retry-save', null).commandId).toBe('session.save');
  });

  it('routes production notification actions through shared navigation', () => {
    const resolution = resolveNotificationAction('open-production', 'production_001');

    expect(resolution.navigationTarget).toEqual(
      buildProductionNavigationTarget('production_001'),
    );
  });

  it('does not treat event log ids as gameplay entity ids', () => {
    const notification = mapEventLogEntryToNotification({
      id: 'event_log_001',
      tickNumber: 4,
      occurredAt: 120,
      category: 'BUILDING',
      message: 'Gebäude fertiggestellt',
      severity: 'INFO',
    });

    expect(notification.entityId).toBeNull();
    expect(notification.notificationId).toBe('event_log_001');
  });

  it('coalesces notification sync during overlapping refresh work', async () => {
    const session = new NotificationSyncSession();
    let syncCalls = 0;

    await Promise.all([
      session.run(async () => {
        syncCalls += 1;
        await Promise.resolve();
      }),
      session.run(async () => {
        syncCalls += 1;
        await Promise.resolve();
      }),
    ]);

    expect(syncCalls).toBe(2);
    expect(session.syncCount).toBe(2);
  });
});
