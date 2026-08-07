import { vi } from 'vitest';
import type { GameWorkspaceContextValue } from '@/presentation/state/GameWorkspaceProvider';
import { deriveWorkspaceRuntimeState } from '@/presentation/runtime/workspace-runtime-state';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';

const defaultRuntimeState = deriveWorkspaceRuntimeState({
  hasGame: false,
  isLoading: false,
  isBusy: false,
  connectionState: 'connected',
  isDataStale: false,
  recoverableError: null,
  fatalError: null,
});

/** Minimal GameWorkspace context defaults for presentation tests. */
export function createGameWorkspaceMock(
  overrides: Partial<GameWorkspaceContextValue> = {},
): GameWorkspaceContextValue {
  return {
    navigation: { screen: 'company', entitySelection: { kind: 'none' } },
    companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
    viewData: {
      session: {
        hasGame: false,
        companyId: null,
        companyName: null,
        playerId: null,
        savePath: 'saves/browser-session.json',
      },
      simulation: {
        tickNumber: null,
        simulationTime: null,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: false,
        speedLabel: '×1',
      },
      world: null,
      saves: Object.freeze([]),
    },
    regions: Object.freeze([]),
    isLoading: false,
    isBusy: false,
    isLiveConnected: true,
    isSessionDirty: false,
    connectionState: 'connected',
    runtimeState: defaultRuntimeState,
    recoverableError: null,
    canRunCommands: true,
    retryRuntimeRecovery: vi.fn(),
    navigateToScreen: vi.fn(),
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    refreshSession: vi.fn(),
    runSimulationTick: vi.fn(),
    runCommand: vi.fn(),
    markSessionSaved: vi.fn(),
    navigateToTarget: vi.fn(),
    simulationNotificationItems: Object.freeze([]),
    criticalAnnouncement: null,
    executeNotificationAction: vi.fn(),
    dismissSimulationNotification: vi.fn(),
    ...overrides,
  };
}
