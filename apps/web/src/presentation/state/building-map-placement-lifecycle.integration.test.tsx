// @vitest-environment jsdom

import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardConnectionState } from '@/presentation/runtime/workspace-runtime-state';
import type { DashboardRefreshPayload } from '@/presentation/adapters/api/dashboard-socket';
import type { WorkspaceRefreshInput } from '@/presentation/adapters/queries/refresh-workspace-scopes';
import { placeBuilding } from '@/presentation/adapters/api/gameplay-client';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { NotificationProvider } from '@/presentation/notifications/NotificationProvider';
import {
  GameWorkspaceProvider,
  useGameWorkspace,
} from '@/presentation/state/GameWorkspaceProvider';

const { navigationParamsRef } = vi.hoisted(() => ({
  navigationParamsRef: { current: new URLSearchParams('screen=world') },
}));

const placeBuildingMock = vi.mocked(placeBuilding);

const refreshWorkspaceScopes = vi.fn(async (input: WorkspaceRefreshInput) => {
  void input;
  return Object.freeze({});
});

const loadWorkspaceQueries = vi.fn(async () =>
  Object.freeze({
    dashboard: Object.freeze({
      company: Object.freeze({ id: 'company_001', name: 'Test Corp' }),
      tickNumber: 3,
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
      Object.freeze({ id: 'region_default', name: 'Default', description: 'Default region' }),
    ]),
    viewData: Object.freeze({
      session: Object.freeze({
        hasGame: true,
        companyId: 'company_001',
        companyName: 'Test Corp',
        playerId: 'player_001',
        savePath: 'saves/browser-session.json',
      }),
      simulation: Object.freeze({
        tickNumber: 3,
        simulationTime: 120,
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
      companyName: 'Test Corp',
    }),
    chartPoints: Object.freeze([]),
  }),
);

vi.mock('next/navigation', () => ({
  usePathname: () => '/game',
  useRouter: () => ({
    replace: (url: string) => {
      const queryStart = url.indexOf('?');
      navigationParamsRef.current =
        queryStart >= 0
          ? new URLSearchParams(url.slice(queryStart + 1))
          : new URLSearchParams();
    },
  }),
  useSearchParams: () => navigationParamsRef.current,
}));

vi.mock('@/presentation/adapters/api/dashboard-socket', () => ({
  connectDashboardSocket: (
    _onRefresh: (payload: DashboardRefreshPayload) => void,
    onConnectionChange?: (state: DashboardConnectionState) => void,
  ) => {
    onConnectionChange?.('connected');
    return { disconnect: vi.fn() };
  },
}));

vi.mock('@/presentation/adapters/queries/load-workspace-queries', () => ({
  loadWorkspaceQueries: () => loadWorkspaceQueries(),
}));

vi.mock('@/presentation/adapters/queries/refresh-workspace-scopes', () => ({
  refreshWorkspaceScopes: (input: WorkspaceRefreshInput) => refreshWorkspaceScopes(input),
}));

vi.mock('@/presentation/adapters/api/query-client', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    fetchEventLog: vi.fn(async () => Object.freeze([])),
  };
});

vi.mock('@/presentation/adapters/api/gameplay-client', () => ({
  placeBuilding: vi.fn(),
}));

const PLACEMENT_START = Object.freeze({
  buildingTypeId: 'sawmill',
  name: 'Sägewerk',
  canPlace: true,
});

const CANDIDATE_P1 = Object.freeze({ x: 12, y: 7 });
const CANDIDATE_P2 = Object.freeze({ x: 20, y: 15 });

function createWrapper() {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <NotificationProvider>
        <GameWorkspaceProvider>{children}</GameWorkspaceProvider>
      </NotificationProvider>
    );
  };
}

async function waitForReadyWorkspace(result: { current: ReturnType<typeof useGameWorkspace> }) {
  await waitFor(() => {
    expect(loadWorkspaceQueries).toHaveBeenCalled();
    expect(result.current.viewData.session.hasGame).toBe(true);
    expect(result.current.canRunCommands).toBe(true);
  });
}

describe('building map placement lifecycle (GameWorkspaceProvider)', () => {
  beforeEach(() => {
    navigationParamsRef.current = new URLSearchParams('screen=world');
    placeBuildingMock.mockReset();
    loadWorkspaceQueries.mockClear();
    refreshWorkspaceScopes.mockClear();
  });

  it('retains session after map-placement entry reaches World', async () => {
    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement({
        buildingTypeId: 'sawmill',
        name: 'Transition Sawmill',
        canPlace: true,
      });
    });
    rerender();

    expect(result.current.navigation.screen).toBe('world');
    expect(result.current.buildingMapPlacementSession).not.toBeNull();
  });

  it('does not call placeBuilding on start, pick P1, or repick P2', async () => {
    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement(PLACEMENT_START);
    });
    rerender();

    expect(placeBuildingMock).not.toHaveBeenCalled();
    expect(result.current.buildingMapPlacementSession).not.toBeNull();

    act(() => {
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P1);
    });
    rerender();

    expect(placeBuildingMock).not.toHaveBeenCalled();
    expect(result.current.buildingMapPlacementSession?.candidate).toEqual(CANDIDATE_P1);

    act(() => {
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P2);
    });
    rerender();

    expect(placeBuildingMock).not.toHaveBeenCalled();
    expect(result.current.buildingMapPlacementSession?.candidate).toEqual(CANDIDATE_P2);
  });

  it('confirm calls placeBuilding exactly once with exact session payload and clears session on success', async () => {
    placeBuildingMock.mockResolvedValue(undefined);

    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement(PLACEMENT_START);
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P1);
    });
    rerender();

    expect(result.current.buildingMapPlacementSession?.candidate).toEqual(CANDIDATE_P1);

    await act(async () => {
      await result.current.confirmBuildingMapPlacement();
    });
    rerender();

    expect(placeBuildingMock).toHaveBeenCalledTimes(1);
    expect(placeBuildingMock).toHaveBeenCalledWith({
      buildingTypeId: 'sawmill',
      name: 'Sägewerk',
      x: CANDIDATE_P1.x,
      y: CANDIDATE_P1.y,
    });
    expect(Object.keys(placeBuildingMock.mock.calls[0]?.[0] ?? {})).toEqual([
      'buildingTypeId',
      'name',
      'x',
      'y',
    ]);

    await waitFor(() => {
      expect(result.current.buildingMapPlacementSession).toBeNull();
    });

    expect(result.current.navigation.screen).toBe('world');
  });

  it('retains session and candidate when placeBuilding rejects', async () => {
    placeBuildingMock.mockRejectedValue(new Error('Nicht genug Kapital'));

    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement(PLACEMENT_START);
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P1);
    });
    rerender();

    await act(async () => {
      await result.current.confirmBuildingMapPlacement();
    });
    rerender();

    expect(placeBuildingMock).toHaveBeenCalledTimes(1);
    expect(result.current.buildingMapPlacementSession).not.toBeNull();
    expect(result.current.buildingMapPlacementSession?.candidate).toEqual(CANDIDATE_P1);
    expect(result.current.navigation.screen).toBe('world');
  });

  it('cancel clears session without calling placeBuilding and navigates to Buildings', async () => {
    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement(PLACEMENT_START);
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P1);
    });
    rerender();

    act(() => {
      result.current.cancelBuildingMapPlacement();
    });
    rerender();

    expect(placeBuildingMock).not.toHaveBeenCalled();
    expect(result.current.buildingMapPlacementSession).toBeNull();
    expect(result.current.navigation.screen).toBe('buildings');
  });

  it('clears session when navigating away from World without placement mutation', async () => {
    const { result, rerender } = renderHook(() => useGameWorkspace(), {
      wrapper: createWrapper(),
    });

    await waitForReadyWorkspace(result);

    act(() => {
      result.current.startBuildingMapPlacement(PLACEMENT_START);
      result.current.setBuildingMapPlacementCandidate(CANDIDATE_P1);
    });
    rerender();

    act(() => {
      result.current.navigateToScreen('production');
    });
    rerender();

    expect(placeBuildingMock).not.toHaveBeenCalled();
    expect(result.current.buildingMapPlacementSession).toBeNull();

    act(() => {
      result.current.navigateToScreen('world');
    });
    rerender();

    expect(result.current.buildingMapPlacementSession).toBeNull();
    expect(result.current.navigation.screen).toBe('world');
  });
});
