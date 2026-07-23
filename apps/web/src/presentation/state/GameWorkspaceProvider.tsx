'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { connectDashboardSocket } from '@/presentation/adapters/api/dashboard-socket';
import { fetchDashboard, type GameSessionDashboard } from '@/presentation/adapters/api/client';
import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';
import {
  buildEntityCatalogFromDashboard,
  buildNavigationQueryString,
  buildSessionSnapshots,
  parseNavigationState,
  recoverInvalidEntitySelection,
  type ApplicationSessionSnapshot,
  type EntitySelection,
  type NavigationState,
  type SimulationStatusSnapshot,
} from './navigation-state';

export type GameWorkspaceContextValue = {
  readonly navigation: NavigationState;
  readonly session: ApplicationSessionSnapshot;
  readonly simulation: SimulationStatusSnapshot;
  readonly dashboard: GameSessionDashboard | null;
  readonly isLoading: boolean;
  readonly isLiveConnected: boolean;
  readonly navigateToScreen: (screen: PrimaryScreenId) => void;
  readonly selectEntity: (selection: EntitySelection) => void;
  readonly clearEntitySelection: () => void;
  readonly refreshSession: () => Promise<void>;
};

const GameWorkspaceContext = createContext<GameWorkspaceContextValue | null>(null);

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

  const [dashboard, setDashboard] = useState<GameSessionDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const replaceNavigation = useCallback(
    (nextNavigation: NavigationState) => {
      const query = buildNavigationQueryString(nextNavigation);
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const refreshSession = useCallback(async (): Promise<void> => {
    const nextDashboard = await fetchDashboard();
    setDashboard(nextDashboard);
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
    if (dashboard === null) {
      return;
    }

    const catalog = buildEntityCatalogFromDashboard(dashboard);
    const recoveredNavigation = recoverInvalidEntitySelection(navigation, catalog);

    if (
      recoveredNavigation.entitySelection.kind !== navigation.entitySelection.kind ||
      (recoveredNavigation.entitySelection.kind !== 'none' &&
        navigation.entitySelection.kind !== 'none' &&
        recoveredNavigation.entitySelection.id !== navigation.entitySelection.id)
    ) {
      replaceNavigation(recoveredNavigation);
    }
  }, [dashboard, navigation, replaceNavigation]);

  useEffect(() => {
    const socket = connectDashboardSocket(
      () => {
        void refreshSession().catch((error: unknown) => {
          showNotification({
            tone: 'error',
            message: translatePresentationError(error),
          });
        });
      },
      (connected) => {
        setIsLiveConnected(connected);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [refreshSession, showNotification]);

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

  const snapshots = useMemo(
    () =>
      dashboard === null
        ? {
            session: {
              hasGame: false,
              companyId: null,
              companyName: null,
              tickNumber: null,
              simulationTime: null,
              availableCash: null,
            },
            simulation: {
              tickNumber: null,
              simulationTime: null,
              isPaused: false,
              speedMultiplier: 1,
              hasActiveSession: false,
            },
          }
        : buildSessionSnapshots(dashboard),
    [dashboard],
  );

  const value = useMemo<GameWorkspaceContextValue>(
    () => ({
      navigation,
      session: snapshots.session,
      simulation: snapshots.simulation,
      dashboard,
      isLoading,
      isLiveConnected,
      navigateToScreen,
      selectEntity,
      clearEntitySelection,
      refreshSession,
    }),
    [
      navigation,
      snapshots.session,
      snapshots.simulation,
      dashboard,
      isLoading,
      isLiveConnected,
      navigateToScreen,
      selectEntity,
      clearEntitySelection,
      refreshSession,
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
