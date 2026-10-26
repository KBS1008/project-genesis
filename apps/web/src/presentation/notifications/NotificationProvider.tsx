'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isDuplicateNotification } from './notification-deduplication';
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
    ({ message, tone = 'info', dismissMs, eventLogId }: ShowNotificationInput) => {
      const resolvedDismissMs = dismissMs === undefined ? defaultDismissMs(tone) : dismissMs;

      let createdId = '';

      setNotifications((current) => {
        if (isDuplicateNotification(current, { message, tone })) {
          createdId = current.find((entry) => entry.message === message && entry.tone === tone)?.id ?? '';
          return current;
        }

        const id = createNotificationId();
        createdId = id;

        return [
          ...current,
          {
            id,
            message,
            tone,
            createdAt: Date.now(),
            dismissMs: resolvedDismissMs,
            ...(eventLogId !== undefined ? { eventLogId } : {}),
          },
        ];
      });

      return createdId;
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
