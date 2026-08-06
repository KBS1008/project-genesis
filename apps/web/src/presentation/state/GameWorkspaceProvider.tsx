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
  const criticalAnnouncementTimerRef = useRef<number | null>(null);

  useEffect(() => {
    companyViewDataRef.current = companyViewData;
  }, [companyViewData]);

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

  const syncSimulationNotifications = useCallback(async (): Promise<void> => {
    try {
      const entries = await fetchEventLog({ limit: MAX_SIMULATION_NOTIFICATION_HISTORY });
      const feed = buildSimulationNotificationFeed({
        eventLogEntries: entries,
        companyViewData: companyViewDataRef.current,
        previouslySeenIds: seenNotificationIdsRef.current,
      });

      applyNotificationFeed(feed);
    } catch {
      // Event log is optional for notification surfacing; dashboard runtime alerts still apply.
      const feed = buildSimulationNotificationFeed({
        eventLogEntries: Object.freeze([]),
        companyViewData: companyViewDataRef.current,
        previouslySeenIds: seenNotificationIdsRef.current,
      });

      applyNotificationFeed(feed);
    }
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

      const patch = await refreshWorkspaceScopes({
        scopes,
        currentSession: viewData.session,
        currentSimulation: viewData.simulation,
        currentWorld: viewData.world,
        currentSaves: viewData.saves,
        currentRegions: regions,
      });

      applyWorkspaceRefresh(patch);

      if (patch.companyViewData !== undefined) {
        companyViewDataRef.current = patch.companyViewData;
      }

      await syncSimulationNotifications();
    },
    [applyWorkspaceRefresh, regions, syncSimulationNotifications, viewData],
  );

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
          showNotification({
            tone: 'error',
            message: translatePresentationError(error),
          });
        });
    }, SOCKET_REFRESH_DEBOUNCE_MS);
  }, [refreshWorkspaceScopeSlices, showNotification]);

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
      await syncSimulationNotifications();
    } catch (error: unknown) {
      showNotification({
        tone: 'error',
        message: translatePresentationError(error),
      });
      throw error;
    }
  }, [refreshWorkspaceScopeSlices, showNotification, syncSimulationNotifications]);

  const runCommand = useCallback(
    async (
      action: () => Promise<void>,
      successMessage: string,
      options?: { readonly clearsDirty?: boolean; readonly commandId?: CommandId },
    ): Promise<void> => {
      if (isBusyRef.current) {
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
          await syncSimulationNotifications();
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
    [refreshWorkspaceScopeSlices, showNotification, syncSimulationNotifications],
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
    void refreshSession()
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        showNotification({
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
  }, [refreshSession, showNotification]);

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
        scheduleRefreshSession();
      },
      (connected) => {
        setIsLiveConnected(connected);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [scheduleRefreshSession]);

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
          () => saveGame({ filePath: viewData.session.savePath }),
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
