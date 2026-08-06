import { formatSimulationTime } from '@/presentation/formatting/presentation-formatters';
import type { PGNotificationItem } from '@/presentation/components/dashboard/PGNotificationCenter';
import {
  getNotificationActionLabel,
  mapSeverityToWidgetTone,
} from './notification-actions';
import type { SimulationNotification } from './simulation-notification-types';

/** Maps simulation notifications into dashboard widget items. */
export function mapSimulationNotificationsToWidgetItems(
  notifications: readonly SimulationNotification[],
): readonly PGNotificationItem[] {
  return Object.freeze(
    notifications.map((notification) =>
      Object.freeze({
        id: notification.notificationId,
        title: notification.title,
        message: notification.message,
        tone: mapSeverityToWidgetTone(notification.severity),
        timestampLabel: formatSimulationTime(notification.simulationTimestamp),
        ...(notification.action !== null
          ? {
              actionKind: notification.action,
              actionLabel: getNotificationActionLabel(notification.action),
            }
          : {}),
      }),
    ),
  );
}
