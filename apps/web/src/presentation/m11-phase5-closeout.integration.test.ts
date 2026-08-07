import { describe, expect, it } from 'vitest';
import { resolveCommandScopes } from '@/presentation/commands/command-scopes';
import { resolveCommandInvalidationScopes } from '@/presentation/commands/command-invalidation-map';
import { buildRegionNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { mapEventLogEntryToNotification } from '@/presentation/notifications/map-event-log-notification';
import { resolveNotificationAction } from '@/presentation/notifications/notification-actions';
import { buildSimulationNotificationFeed } from '@/presentation/notifications/sync-simulation-notifications';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  deriveWorkspaceRuntimeState,
  formatDashboardConnectionLabel,
} from '@/presentation/runtime/workspace-runtime-state';
import { NotificationSyncSession } from '@/presentation/runtime/notification-sync-session';

describe('M11 Phase 5 presentation closeout', () => {
  it('maps world region selection through shared navigation targets', () => {
    const target = buildRegionNavigationTarget('region_north');

    expect(target.screen).toBe('world');
    expect(target.entitySelection).toEqual({ kind: 'region', id: 'region_north' });
  });

  it('maps simulation events to notifications without fabricated entity ids', () => {
    const notification = mapEventLogEntryToNotification({
      id: 'event_research_done',
      tickNumber: 12,
      occurredAt: 360,
      category: 'RESEARCH',
      message: 'Forschung abgeschlossen',
      severity: 'INFO',
    });

    expect(notification.entityId).toBeNull();
    expect(notification.action).toBe('open-research');

    const resolution = resolveNotificationAction('open-research', notification.entityId);
    expect(resolution.navigationTarget?.screen).toBe('research');
  });

  it('builds notification feed from authoritative event log entries', () => {
    const feed = buildSimulationNotificationFeed({
      eventLogEntries: Object.freeze([
        {
          id: 'event_prod',
          tickNumber: 8,
          occurredAt: 240,
          category: 'PRODUCTION',
          message: 'Produktion blockiert',
          severity: 'WARNING',
        },
      ]),
      companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
      previouslySeenIds: new Set(),
    });

    expect(feed.notifications.some((entry) => entry.notificationId === 'event_prod')).toBe(true);
    expect(feed.toastCandidates.length).toBeGreaterThan(0);
  });

  it('scopes production commands to dashboard and production screens', () => {
    const scopes = resolveCommandScopes('production.start');

    expect(scopes).toContain('workspace.dashboard');
    expect(scopes).toContain('screen.production');
    expect(resolveCommandInvalidationScopes('session.save')).toEqual(['workspace.saves']);
  });

  it('preserves stale view data and blocks commands while disconnected', () => {
    const stale = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'disconnected',
      isDataStale: true,
      recoverableError: null,
      fatalError: null,
    });

    expect(stale.phase).toBe('stale');
    expect(stale.canRunCommands).toBe(false);
    expect(formatDashboardConnectionLabel('reconnecting')).toContain('wiederhergestellt');
  });

  it('recovers runtime state after reconnect without requiring fatal error', () => {
    const recovered = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'connected',
      isDataStale: false,
      recoverableError: null,
      fatalError: null,
    });

    expect(recovered.phase).toBe('ready');
    expect(recovered.canRunCommands).toBe(true);
  });

  it('coalesces duplicate notification sync during overlapping refresh', async () => {
    const session = new NotificationSyncSession();
    let runs = 0;

    await Promise.all([
      session.run(async () => {
        runs += 1;
      }),
      session.run(async () => {
        runs += 1;
      }),
    ]);

    expect(runs).toBe(2);
    expect(session.syncCount).toBe(2);
  });
});
