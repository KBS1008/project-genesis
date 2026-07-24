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
import { loadWorkspaceQueries } from '@/presentation/adapters/queries/load-workspace-queries';
import type { EntityNavigationTarget } from '@/presentation/navigation/entity-navigation';
import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
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
  readonly runCommand: (
    action: () => Promise<void>,
    successMessage: string,
    options?: { readonly clearsDirty?: boolean },
  ) => Promise<void>;
  readonly markSessionSaved: (savePath?: string) => void;
  readonly navigateToTarget: (target: EntityNavigationTarget) => void;
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
  const isBusyRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
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
  }, []);

  const scheduleRefreshSession = useCallback((): void => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;

      if (isBusyRef.current) {
        return;
      }

      void refreshSession().catch((error: unknown) => {
        showNotification({
          tone: 'error',
          message: translatePresentationError(error),
        });
      });
    }, SOCKET_REFRESH_DEBOUNCE_MS);
  }, [refreshSession, showNotification]);

  const runCommand = useCallback(
    async (
      action: () => Promise<void>,
      successMessage: string,
      options?: { readonly clearsDirty?: boolean },
    ): Promise<void> => {
      try {
        setIsBusy(true);
        showNotification({ tone: 'info', message: 'Bitte warten…' });
        await action();
        await refreshSession();
        setIsSessionDirty(options?.clearsDirty === true ? false : true);

        let eventLogId: string | undefined;

        try {
          const entries = await fetchEventLog({ limit: 1 });
          eventLogId = entries[0]?.id;
        } catch {
          eventLogId = undefined;
        }

        showNotification({ tone: 'success', message: successMessage, eventLogId });
      } catch (error: unknown) {
        showNotification({
          tone: 'error',
          message: translatePresentationError(error),
        });
      } finally {
        setIsBusy(false);
      }
    },
    [refreshSession, showNotification],
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
      replaceNavigation({
        screen: target.screen,
        entitySelection: target.entitySelection,
      });
    },
    [replaceNavigation],
  );

  const navigateToScreen = useCallback(
    (screen: PrimaryScreenId) => {
      replaceNavigation({
        screen,
        entitySelection: navigation.entitySelection,
      });
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
      runCommand,
      markSessionSaved,
      navigateToTarget,
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
      runCommand,
      markSessionSaved,
      navigateToTarget,
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
