import type { SimulationNotification } from './simulation-notification-types';
import { MAX_SIMULATION_NOTIFICATION_HISTORY } from './simulation-notification-types';

/** Merges event-log and runtime notifications without duplicates. */
export function mergeSimulationNotifications(
  eventNotifications: readonly SimulationNotification[],
  runtimeNotifications: readonly SimulationNotification[],
): readonly SimulationNotification[] {
  const merged = new Map<string, SimulationNotification>();

  for (const notification of eventNotifications) {
    merged.set(notification.notificationId, notification);
  }

  for (const notification of runtimeNotifications) {
    merged.set(notification.notificationId, notification);
  }

  const sorted = [...merged.values()].sort((left, right) => {
    if (right.tickNumber !== left.tickNumber) {
      return right.tickNumber - left.tickNumber;
    }

    return right.simulationTimestamp - left.simulationTimestamp;
  });

  return Object.freeze(sorted.slice(0, MAX_SIMULATION_NOTIFICATION_HISTORY));
}
