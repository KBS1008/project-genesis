// @vitest-environment jsdom

import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardConnectionState } from '@/presentation/runtime/workspace-runtime-state';
import type { DashboardRefreshPayload } from '@/presentation/adapters/api/dashboard-socket';
import { NotificationProvider } from '@/presentation/notifications/NotificationProvider';
import {
  GameWorkspaceProvider,
  useGameWorkspace,
} from '@/presentation/state/GameWorkspaceProvider';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';

let connectionHandler: ((state: DashboardConnectionState) => void) | undefined;
let refreshHandler: ((payload: DashboardRefreshPayload) => void) | undefined;
const disconnectSpy = vi.fn();

const refreshWorkspaceScopes = vi.fn(async () =>
  Object.freeze({
    companyViewData: Object.freeze({
      ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
      hasGame: true,
      companyName: 'Reconnect Corp',
    }),
  }),
);

const loadWorkspaceQueries = vi.fn(async () =>
  Object.freeze({
    dashboard: Object.freeze({
      company: Object.freeze({ id: 'company_001', name: 'Reconnect Corp' }),
      tickNumber: 12,
      buildings: Object.freeze([]),
      productionJobs: Object.freeze([]),
      transportOrders: Object.freeze([]),
      researchJobs: Object.freeze([]),
      employees: Object.freeze([]),
      marketPrices: Object.freeze([]),
      inventory: Object.freeze({ items: Object.freeze([]) }),
      financeTransactions: Object.freeze([]),
      eventLogEntries: Object.freeze([]),
    }),
    regions: Object.freeze([
      Object.freeze({ id: 'region_north', name: 'Nord', description: 'North' }),
    ]),
    viewData: Object.freeze({
      session: Object.freeze({
        hasGame: true,
        companyId: 'company_001',
        companyName: 'Reconnect Corp',
        playerId: 'player_001',
        savePath: 'saves/browser-session.json',
      }),
      simulation: Object.freeze({
        tickNumber: 12,
        simulationTime: 360,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: true,
        speedLabel: '×1',
      }),
      world: Object.freeze({ regionCount: 1, mapName: 'Test Map' }),
      saves: Object.freeze([]),
    }),
    companyViewData: Object.freeze({
      ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
      hasGame: true,
      companyName: 'Reconnect Corp',
    }),
    chartPoints: Object.freeze([]),
  }),
);

vi.mock('next/navigation', () => ({
  usePathname: () => '/game',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/presentation/adapters/api/dashboard-socket', () => ({
  connectDashboardSocket: (
    onRefresh: (payload: DashboardRefreshPayload) => void,
    onConnectionChange?: (state: DashboardConnectionState) => void,
  ) => {
    refreshHandler = onRefresh;
    connectionHandler = onConnectionChange;
    onConnectionChange?.('connected');
    return { disconnect: disconnectSpy };
  },
}));

vi.mock('@/presentation/adapters/queries/load-workspace-queries', () => ({
  loadWorkspaceQueries: (...args: unknown[]) => loadWorkspaceQueries(...args),
}));

vi.mock('@/presentation/adapters/queries/refresh-workspace-scopes', () => ({
  refreshWorkspaceScopes: (...args: unknown[]) => refreshWorkspaceScopes(...args),
}));

vi.mock('@/presentation/adapters/api/query-client', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    fetchEventLog: vi.fn(async () => Object.freeze([])),
  };
});

function RuntimeProbe() {
  const workspace = useGameWorkspace();

  return (
    <div
      data-testid="runtime-probe"
      data-connection={workspace.connectionState}
      data-phase={workspace.runtimeState.phase}
      data-can-run={workspace.canRunCommands ? 'true' : 'false'}
      data-has-game={workspace.viewData.session.hasGame ? 'true' : 'false'}
    />
  );
}

describe('dashboard reconnect integration', () => {
  beforeEach(() => {
    connectionHandler = undefined;
    refreshHandler = undefined;
    disconnectSpy.mockClear();
    loadWorkspaceQueries.mockClear();
    refreshWorkspaceScopes.mockClear();
  });

  it('does not recover on initial socket connect or disconnect socket on tick refresh', async () => {
    render(
      <NotificationProvider>
        <GameWorkspaceProvider>
          <RuntimeProbe />
        </GameWorkspaceProvider>
      </NotificationProvider>,
    );

    await waitFor(() => {
      expect(loadWorkspaceQueries).toHaveBeenCalled();
    });

    expect(refreshWorkspaceScopes).not.toHaveBeenCalled();
    expect(disconnectSpy).not.toHaveBeenCalled();

    refreshHandler?.({ tickNumber: 13 });

    await waitFor(() => {
      expect(refreshWorkspaceScopes).toHaveBeenCalled();
    });

    expect(disconnectSpy).not.toHaveBeenCalled();
  });

  it('preserves view data, blocks commands on disconnect, and recovers on reconnect', async () => {
    render(
      <NotificationProvider>
        <GameWorkspaceProvider>
          <RuntimeProbe />
        </GameWorkspaceProvider>
      </NotificationProvider>,
    );

    await waitFor(() => {
      expect(loadWorkspaceQueries).toHaveBeenCalled();
    });

    await waitFor(() => {
      const probe = document.querySelector('[data-testid="runtime-probe"]');
      expect(probe?.getAttribute('data-has-game')).toBe('true');
      expect(probe?.getAttribute('data-can-run')).toBe('true');
    });

    connectionHandler?.('disconnected');

    await waitFor(() => {
      const probe = document.querySelector('[data-testid="runtime-probe"]');
      expect(probe?.getAttribute('data-connection')).toBe('disconnected');
      expect(probe?.getAttribute('data-phase')).toBe('stale');
      expect(probe?.getAttribute('data-can-run')).toBe('false');
      expect(probe?.getAttribute('data-has-game')).toBe('true');
    });

    connectionHandler?.('reconnecting');

    await waitFor(() => {
      const probe = document.querySelector('[data-testid="runtime-probe"]');
      expect(probe?.getAttribute('data-connection')).toBe('reconnecting');
      expect(probe?.getAttribute('data-can-run')).toBe('false');
    });

    connectionHandler?.('connected');

    await waitFor(() => {
      expect(refreshWorkspaceScopes).toHaveBeenCalled();
    });

    await waitFor(() => {
      const probe = document.querySelector('[data-testid="runtime-probe"]');
      expect(probe?.getAttribute('data-connection')).toBe('connected');
      expect(probe?.getAttribute('data-phase')).toBe('ready');
      expect(probe?.getAttribute('data-can-run')).toBe('true');
    });

    expect(refreshHandler).toBeTypeOf('function');
  });
});
