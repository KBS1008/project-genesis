'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { connectDashboardSocket } from '@/presentation/adapters/api/dashboard-socket';
import type { GameSessionDashboard } from '@/presentation/adapters/api/client';
import type { RegionDto } from '@/presentation/adapters/api/query-client';
import { fetchEventLog } from '@/presentation/adapters/api/query-client';
import { advanceSimulation } from '@/presentation/adapters/api/simulation-client';
import { loadWorkspaceQueries } from '@/presentation/adapters/queries/load-workspace-queries';
import {
  refreshWorkspaceScopes,
  type WorkspaceRefreshResult,
} from '@/presentation/adapters/queries/refresh-workspace-scopes';
import type { EntityNavigationTarget } from '@/presentation/navigation/entity-navigation';
import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import { saveGame } from '@/presentation/adapters/api/session-client';
import type { WorkspaceQueryScope } from '@/presentation/commands/query-scopes';
import {
  executePresentationCommand,
  invalidateScreenQueryScopes,
  type CommandId,
} from '@/presentation/commands';
import type { PGNotificationItem } from '@/presentation/components/dashboard/PGNotificationCenter';
import { mapSimulationNotificationsToWidgetItems } from '@/presentation/notifications/map-simulation-notifications-to-widget';
import { resolveNotificationAction } from '@/presentation/notifications/notification-actions';
import {
  buildSimulationNotificationFeed,
  resolveToastTone,
} from '@/presentation/notifications/sync-simulation-notifications';
import type {
  SimulationNotification,
  SimulationNotificationActionKind,
} from '@/presentation/notifications/simulation-notification-types';
import { MAX_SIMULATION_NOTIFICATION_HISTORY } from '@/presentation/notifications/simulation-notification-types';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';
import type { DashboardConnectionState, WorkspaceRuntimeState } from '@/presentation/runtime/workspace-runtime-state';
import {
  deriveWorkspaceRuntimeState,
} from '@/presentation/runtime/workspace-runtime-state';
import { NotificationSyncSession } from '@/presentation/runtime/notification-sync-session';
import { buildEntityCatalogRegionIds } from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { WorkspaceViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import {
  buildEntityCatalogFromDashboard,
  buildNavigationQueryString,
  parseNavigationState,
  recoverInvalidEntitySelection,
  sanitizeNavigationState,
  type EntitySelection,
  type NavigationState,
} from './navigation-state';

export type GameWorkspaceContextValue = {
  readonly navigation: NavigationState;
  readonly viewData: WorkspaceViewData;
  readonly companyViewData: CompanyDashboardViewData;
  readonly regions: readonly RegionDto[];
  readonly isLoading: boolean;
  readonly isBusy: boolean;
  readonly isLiveConnected: boolean;
  readonly isSessionDirty: boolean;
  readonly connectionState: DashboardConnectionState;
  readonly runtimeState: WorkspaceRuntimeState;
  readonly recoverableError: string | null;
  readonly canRunCommands: boolean;
  readonly retryRuntimeRecovery: () => Promise<void>;
  readonly navigateToScreen: (screen: PrimaryScreenId) => void;
  readonly selectEntity: (selection: EntitySelection) => void;
  readonly clearEntitySelection: () => void;
  readonly refreshSession: () => Promise<void>;
  readonly runSimulationTick: () => Promise<void>;
  readonly runCommand: (
    action: () => Promise<void>,
    successMessage: string,
    options?: { readonly clearsDirty?: boolean; readonly commandId?: CommandId },
  ) => Promise<void>;
  readonly markSessionSaved: (savePath?: string) => void;
  readonly navigateToTarget: (target: EntityNavigationTarget) => void;
  readonly simulationNotificationItems: readonly PGNotificationItem[];
  readonly criticalAnnouncement: string | null;
  readonly executeNotificationAction: (
    notificationId: string,
    actionKind: SimulationNotificationActionKind,
  ) => void;
  readonly dismissSimulationNotification: (notificationId: string) => void;
};

const EMPTY_VIEW_DATA: WorkspaceViewData = Object.freeze({
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
});

const GameWorkspaceContext = createContext<GameWorkspaceContextValue | null>(null);

const SOCKET_REFRESH_DEBOUNCE_MS = 250;

const CRITICAL_ANNOUNCEMENT_CLEAR_MS = 5000;

/** Provides navigation, session, and simulation UI state for the game workspace. */
export function GameWorkspaceProvider({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const { showNotification } = useNotifications();

  const navigation = useMemo(
    () => parseNavigationState(searchParams),
    [searchKey, searchParams],
  );

  const [sessionDashboard, setSessionDashboard] = useState<GameSessionDashboard | null>(null);
  const [viewData, setViewData] = useState<WorkspaceViewData>(EMPTY_VIEW_DATA);
  const [companyViewData, setCompanyViewData] =
    useState<CompanyDashboardViewData>(EMPTY_COMPANY_DASHBOARD_VIEW_DATA);
  const [regions, setRegions] = useState<readonly RegionDto[]>(Object.freeze([]));
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<DashboardConnectionState>('disconnected');
  const [isDataStale, setIsDataStale] = useState(false);
  const [recoverableError, setRecoverableError] = useState<string | null>(null);
  const [isSessionDirty, setIsSessionDirty] = useState(false);
  const [simulationNotificationItems, setSimulationNotificationItems] = useState<
    readonly PGNotificationItem[]
  >(Object.freeze([]));
  const [criticalAnnouncement, setCriticalAnnouncement] = useState<string | null>(null);
  const isBusyRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);
  const commandGenerationRef = useRef(0);
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const dismissedNotificationIdsRef = useRef<Set<string>>(new Set());
  const simulationNotificationsRef = useRef<readonly SimulationNotification[]>(Object.freeze([]));
  const companyViewDataRef = useRef(companyViewData);
  const viewDataRef = useRef(viewData);
  const regionsRef = useRef(regions);
  const hadDisconnectRef = useRef(false);
  const refreshSessionRef = useRef<(() => Promise<void>) | null>(null);
  const refreshWorkspaceScopeSlicesRef = useRef<
    ((scopes: readonly WorkspaceQueryScope[]) => Promise<void>) | null
  >(null);
  const retryRuntimeRecoveryRef = useRef<(() => Promise<void>) | null>(null);
  const scheduleRefreshSessionRef = useRef<(() => void) | null>(null);
  const showNotificationRef = useRef(showNotification);
  const criticalAnnouncementTimerRef = useRef<number | null>(null);
  const notificationSyncSessionRef = useRef(new NotificationSyncSession());
  const hasLoadedSessionRef = useRef(false);

  const runtimeState = useMemo(
    () =>
      deriveWorkspaceRuntimeState({
        hasGame: viewData.session.hasGame,
        isLoading,
        isBusy,
        connectionState,
        isDataStale,
        recoverableError,
        fatalError: null,
      }),
    [connectionState, isBusy, isDataStale, isLoading, recoverableError, viewData.session.hasGame],
  );

  useEffect(() => {
    setIsLiveConnected(connectionState === 'connected');
  }, [connectionState]);

  const applyNotificationFeed = useCallback(
    (feed: ReturnType<typeof buildSimulationNotificationFeed>): void => {
      for (const notification of feed.notifications) {
        seenNotificationIdsRef.current.add(notification.notificationId);
      }

      for (const toast of feed.toastCandidates) {
        showNotification({
          tone: resolveToastTone(toast),
          message: `${toast.title}: ${toast.message}`,
          ...(toast.eventLogId !== null ? { eventLogId: toast.eventLogId } : {}),
        });
      }

      if (feed.assertiveCandidates.length > 0) {
        const latestAssertive = feed.assertiveCandidates[0];
        setCriticalAnnouncement(`${latestAssertive.title}: ${latestAssertive.message}`);

        if (criticalAnnouncementTimerRef.current !== null) {
          window.clearTimeout(criticalAnnouncementTimerRef.current);
        }

        criticalAnnouncementTimerRef.current = window.setTimeout(() => {
          criticalAnnouncementTimerRef.current = null;
          setCriticalAnnouncement(null);
        }, CRITICAL_ANNOUNCEMENT_CLEAR_MS);
      }

      const visibleNotifications = feed.notifications.filter(
        (notification) => !dismissedNotificationIdsRef.current.has(notification.notificationId),
      );

      simulationNotificationsRef.current = visibleNotifications;
      setSimulationNotificationItems(mapSimulationNotificationsToWidgetItems(visibleNotifications));
    },
    [showNotification],
  );

  useEffect(() => {
    companyViewDataRef.current = companyViewData;
  }, [companyViewData]);

  useEffect(() => {
    viewDataRef.current = viewData;
  }, [viewData]);

  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  useEffect(() => {
    showNotificationRef.current = showNotification;
  }, [showNotification]);

  const syncSimulationNotifications = useCallback(async (): Promise<void> => {
    await notificationSyncSessionRef.current.run(async () => {
      try {
        const entries = await fetchEventLog({ limit: MAX_SIMULATION_NOTIFICATION_HISTORY });
        const feed = buildSimulationNotificationFeed({
          eventLogEntries: entries,
          companyViewData: companyViewDataRef.current,
          previouslySeenIds: seenNotificationIdsRef.current,
        });

        applyNotificationFeed(feed);
      } catch {
        const feed = buildSimulationNotificationFeed({
          eventLogEntries: Object.freeze([]),
          companyViewData: companyViewDataRef.current,
          previouslySeenIds: seenNotificationIdsRef.current,
        });

        applyNotificationFeed(feed);
      }
    });
  }, [applyNotificationFeed]);

  const dismissSimulationNotification = useCallback((notificationId: string): void => {
    dismissedNotificationIdsRef.current.add(notificationId);

    const visibleNotifications = simulationNotificationsRef.current.filter(
      (notification) => notification.notificationId !== notificationId,
    );

    simulationNotificationsRef.current = visibleNotifications;
    setSimulationNotificationItems(mapSimulationNotificationsToWidgetItems(visibleNotifications));
  }, []);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
      }

      if (criticalAnnouncementTimerRef.current !== null) {
        window.clearTimeout(criticalAnnouncementTimerRef.current);
      }
    };
  }, []);

  const replaceNavigation = useCallback(
    (nextNavigation: NavigationState) => {
      const query = buildNavigationQueryString(nextNavigation);
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const refreshSession = useCallback(async (): Promise<void> => {
    const result = await loadWorkspaceQueries();
    setSessionDashboard(result.dashboard);
    setViewData(result.viewData);
    setCompanyViewData(result.companyViewData);
    setRegions(result.regions);
    companyViewDataRef.current = result.companyViewData;
    hasLoadedSessionRef.current = true;
    setIsDataStale(false);
    setRecoverableError(null);
    await syncSimulationNotifications();
  }, [syncSimulationNotifications]);

  const applyWorkspaceRefresh = useCallback((patch: WorkspaceRefreshResult): void => {
    if (patch.dashboard !== undefined) {
      setSessionDashboard(patch.dashboard);
    }

    if (patch.companyViewData !== undefined) {
      setCompanyViewData(patch.companyViewData);
    }

    if (patch.regions !== undefined) {
      setRegions(patch.regions);
    }

    if (
      patch.session !== undefined ||
      patch.simulation !== undefined ||
      patch.world !== undefined ||
      patch.saves !== undefined
    ) {
      setViewData((current) =>
        Object.freeze({
          ...current,
          session: patch.session ?? current.session,
          simulation: patch.simulation ?? current.simulation,
          world: patch.world !== undefined ? patch.world : current.world,
          saves: patch.saves ?? current.saves,
        }),
      );
    }
  }, []);

  const refreshWorkspaceScopeSlices = useCallback(
    async (scopes: readonly WorkspaceQueryScope[]): Promise<void> => {
      if (scopes.length === 0) {
        return;
      }

      try {
        const patch = await refreshWorkspaceScopes({
          scopes,
          currentSession: viewDataRef.current.session,
          currentSimulation: viewDataRef.current.simulation,
          currentWorld: viewDataRef.current.world,
          currentSaves: viewDataRef.current.saves,
          currentRegions: regionsRef.current,
        });

        applyWorkspaceRefresh(patch);

        if (patch.companyViewData !== undefined) {
          companyViewDataRef.current = patch.companyViewData;
        }

        setIsDataStale(false);
        setRecoverableError(null);
        await syncSimulationNotifications();
      } catch (error: unknown) {
        if (hasLoadedSessionRef.current) {
          setIsDataStale(true);
        }

        setRecoverableError(translatePresentationError(error));
        throw error;
      }
    },
    [applyWorkspaceRefresh, syncSimulationNotifications],
  );

  const retryRuntimeRecovery = useCallback(async (): Promise<void> => {
    setRecoverableError(null);

    try {
      await refreshWorkspaceScopeSlices([
        'workspace.dashboard',
        'workspace.session',
        'workspace.world',
      ]);
      invalidateScreenQueryScopes([
        'screen.buildings',
        'screen.production',
        'screen.research',
        'screen.transport',
        'screen.markets',
        'screen.finance',
        'screen.events',
        'screen.world-map',
        'screen.world-overlay',
        'screen.world-inspector',
        'screen.executive-buildings',
      ]);
    } catch (error: unknown) {
      showNotification({
        tone: 'error',
        message: translatePresentationError(error),
      });
    }
  }, [refreshWorkspaceScopeSlices, showNotification]);

  const scheduleRefreshSession = useCallback((): void => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;

      if (isBusyRef.current) {
        return;
      }

      void refreshWorkspaceScopeSlices([
        'workspace.dashboard',
        'workspace.session',
        'workspace.world',
      ])
        .then(() => {
          invalidateScreenQueryScopes([
            'screen.buildings',
            'screen.production',
            'screen.research',
            'screen.transport',
            'screen.markets',
            'screen.finance',
            'screen.events',
            'screen.world-map',
            'screen.world-overlay',
            'screen.world-inspector',
            'screen.executive-buildings',
          ]);
        })
        .catch((error: unknown) => {
          showNotificationRef.current({
            tone: 'error',
            message: translatePresentationError(error),
          });
        });
    }, SOCKET_REFRESH_DEBOUNCE_MS);
  }, [refreshWorkspaceScopeSlices]);

  refreshSessionRef.current = refreshSession;
  refreshWorkspaceScopeSlicesRef.current = refreshWorkspaceScopeSlices;
  retryRuntimeRecoveryRef.current = retryRuntimeRecovery;
  scheduleRefreshSessionRef.current = scheduleRefreshSession;

  const runSimulationTick = useCallback(async (): Promise<void> => {
    try {
      await advanceSimulation(1);
      await refreshWorkspaceScopeSlices(['workspace.session', 'workspace.dashboard']);
      invalidateScreenQueryScopes([
        'screen.buildings',
        'screen.production',
        'screen.research',
        'screen.transport',
        'screen.markets',
        'screen.finance',
        'screen.events',
        'screen.world-map',
        'screen.world-overlay',
        'screen.world-inspector',
        'screen.executive-buildings',
      ]);
      setIsSessionDirty(true);
    } catch (error: unknown) {
      showNotification({
        tone: 'error',
        message: translatePresentationError(error),
      });
      throw error;
    }
  }, [refreshWorkspaceScopeSlices, showNotification]);

  const runCommand = useCallback(
    async (
      action: () => Promise<void>,
      successMessage: string,
      options?: { readonly clearsDirty?: boolean; readonly commandId?: CommandId },
    ): Promise<void> => {
      if (isBusyRef.current || !runtimeState.canRunCommands) {
        return;
      }

      const commandId = options?.commandId ?? 'custom';
      const generation = ++commandGenerationRef.current;

      try {
        setIsBusy(true);

        const result = await executePresentationCommand(action, {
          commandId,
          generation,
          isCurrentGeneration: () => generation === commandGenerationRef.current,
          refreshWorkspaceScopes: async (scopes) => {
            const workspaceScopes = scopes.filter(
              (scope): scope is WorkspaceQueryScope => scope.startsWith('workspace.'),
            );

            await refreshWorkspaceScopeSlices(workspaceScopes);
          },
          invalidateScreenScopes: invalidateScreenQueryScopes,
        });

        if (result.status === 'cancelled') {
          return;
        }

        if (result.status === 'success') {
          setIsSessionDirty(options?.clearsDirty === true ? false : true);
          showNotification({ tone: 'success', message: successMessage });
          return;
        }

        if (result.error !== null) {
          showNotification({
            tone: 'error',
            message: result.error.message,
          });
        }
      } finally {
        if (generation === commandGenerationRef.current) {
          setIsBusy(false);
        }
      }
    },
    [refreshWorkspaceScopeSlices, runtimeState.canRunCommands, showNotification],
  );

  const markSessionSaved = useCallback((savePath?: string) => {
    setIsSessionDirty(false);

    if (savePath !== undefined) {
      setViewData((current) =>
        Object.freeze({
          ...current,
          session: Object.freeze({
            ...current.session,
            savePath,
          }),
        }),
      );
    }
  }, []);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    void refreshSessionRef
      .current?.()
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        showNotificationRef.current({
          tone: 'error',
          message: translatePresentationError(error),
        });
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    if (sessionDashboard === null) {
      return;
    }

    const catalog = {
      ...buildEntityCatalogFromDashboard(sessionDashboard),
      regionIds: buildEntityCatalogRegionIds(regions),
    };
    const recoveredNavigation = recoverInvalidEntitySelection(navigation, catalog);

    if (
      recoveredNavigation.entitySelection.kind !== navigation.entitySelection.kind ||
      (recoveredNavigation.entitySelection.kind !== 'none' &&
        navigation.entitySelection.kind !== 'none' &&
        recoveredNavigation.entitySelection.id !== navigation.entitySelection.id)
    ) {
      replaceNavigation(recoveredNavigation);
    }
  }, [sessionDashboard, navigation, regions, replaceNavigation]);

  useEffect(() => {
    const socket = connectDashboardSocket(
      () => {
        scheduleRefreshSessionRef.current?.();
      },
      (nextConnectionState) => {
        setConnectionState(nextConnectionState);

        if (nextConnectionState === 'disconnected' && hasLoadedSessionRef.current) {
          setIsDataStale(true);
          hadDisconnectRef.current = true;
        }

        if (
          nextConnectionState === 'connected' &&
          hasLoadedSessionRef.current &&
          hadDisconnectRef.current
        ) {
          hadDisconnectRef.current = false;
          void retryRuntimeRecoveryRef.current?.();
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const navigateToTarget = useCallback(
    (target: EntityNavigationTarget) => {
      replaceNavigation(sanitizeNavigationState({
        screen: target.screen,
        entitySelection: target.entitySelection,
      }));
    },
    [replaceNavigation],
  );

  const navigateToScreen = useCallback(
    (screen: PrimaryScreenId) => {
      replaceNavigation(
        sanitizeNavigationState({
          screen,
          entitySelection: navigation.entitySelection,
        }),
      );
    },
    [navigation.entitySelection, replaceNavigation],
  );

  const selectEntity = useCallback(
    (selection: EntitySelection) => {
      replaceNavigation({
        ...navigation,
        entitySelection: selection,
      });
    },
    [navigation, replaceNavigation],
  );

  const clearEntitySelection = useCallback(() => {
    replaceNavigation({
      ...navigation,
      entitySelection: { kind: 'none' },
    });
  }, [navigation, replaceNavigation]);

  const executeNotificationAction = useCallback(
    (notificationId: string, actionKind: SimulationNotificationActionKind): void => {
      if (actionKind === 'dismiss') {
        dismissSimulationNotification(notificationId);
        return;
      }

      const notification = simulationNotificationsRef.current.find(
        (entry) => entry.notificationId === notificationId,
      );
      const resolution = resolveNotificationAction(actionKind, notification?.entityId ?? null);

      if (resolution.navigationTarget !== null) {
        navigateToTarget(resolution.navigationTarget);
        return;
      }

      if (resolution.screenOnly !== null) {
        navigateToScreen(resolution.screenOnly);
        return;
      }

      if (resolution.commandId === 'session.save') {
        void runCommand(
          async () => {
            await saveGame({ filePath: viewData.session.savePath });
          },
          'Spielstand gespeichert.',
          { clearsDirty: true, commandId: 'session.save' },
        );
      }
    },
    [
      dismissSimulationNotification,
      navigateToScreen,
      navigateToTarget,
      runCommand,
      viewData.session.savePath,
    ],
  );

  const value = useMemo<GameWorkspaceContextValue>(
    () => ({
      navigation,
      viewData,
      companyViewData,
      regions,
      isLoading,
      isBusy,
      isLiveConnected,
      isSessionDirty,
      connectionState,
      runtimeState,
      recoverableError,
      canRunCommands: runtimeState.canRunCommands,
      retryRuntimeRecovery,
      navigateToScreen,
      selectEntity,
      clearEntitySelection,
      refreshSession,
      runSimulationTick,
      runCommand,
      markSessionSaved,
      navigateToTarget,
      simulationNotificationItems,
      criticalAnnouncement,
      executeNotificationAction,
      dismissSimulationNotification,
    }),
    [
      navigation,
      viewData,
      companyViewData,
      regions,
      isLoading,
      isBusy,
      isLiveConnected,
      isSessionDirty,
      connectionState,
      runtimeState,
      recoverableError,
      retryRuntimeRecovery,
      navigateToScreen,
      selectEntity,
      clearEntitySelection,
      refreshSession,
      runSimulationTick,
      runCommand,
      markSessionSaved,
      navigateToTarget,
      simulationNotificationItems,
      criticalAnnouncement,
      executeNotificationAction,
      dismissSimulationNotification,
    ],
  );

  return <GameWorkspaceContext.Provider value={value}>{children}</GameWorkspaceContext.Provider>;
}

/** Accesses game workspace navigation and session UI state. */
export function useGameWorkspace(): GameWorkspaceContextValue {
  const context = useContext(GameWorkspaceContext);

  if (context === null) {
    throw new Error('useGameWorkspace must be used within GameWorkspaceProvider.');
  }

  return context;
}
