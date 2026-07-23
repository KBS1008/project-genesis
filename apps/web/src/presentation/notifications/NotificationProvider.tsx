'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createNotificationId,
  defaultDismissMs,
} from './translatePresentationError';
import type {
  NotificationContextValue,
  NotificationEntry,
  ShowNotificationInput,
} from './types';

const NotificationContext = createContext<NotificationContextValue | null>(null);

/** Provides transient toast notifications for presentation screens. */
export function NotificationProvider({ children }: { readonly children: ReactNode }) {
  const [notifications, setNotifications] = useState<readonly NotificationEntry[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showNotification = useCallback(
    ({ message, tone = 'info', dismissMs }: ShowNotificationInput) => {
      const id = createNotificationId();
      const resolvedDismissMs = dismissMs === undefined ? defaultDismissMs(tone) : dismissMs;

      setNotifications((current) => [
        ...current,
        {
          id,
          message,
          tone,
          createdAt: Date.now(),
          dismissMs: resolvedDismissMs,
        },
      ]);

      return id;
    },
    [],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      showNotification,
      dismissNotification,
      clearNotifications,
    }),
    [notifications, showNotification, dismissNotification, clearNotifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

/** Accesses the shared notification context from presentation screens. */
export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (context === null) {
    throw new Error('useNotifications must be used within NotificationProvider.');
  }

  return context;
}
