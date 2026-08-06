import type { EventLogEntryDto } from '@/presentation/adapters/api/query-client';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { mapEventLogEntriesToNotifications } from './map-event-log-notification';
import { mapRuntimeAlertsToNotifications } from './map-runtime-alerts';
import { mergeSimulationNotifications } from './merge-simulation-notifications';
import {
  shouldAnnounceNotificationAsToast,
  shouldAnnounceNotificationAssertively,
  mapSeverityToToastTone,
} from './notification-actions';
import type { SimulationNotification } from './simulation-notification-types';

export type NotificationSyncResult = {
  readonly notifications: readonly SimulationNotification[];
  readonly toastCandidates: readonly SimulationNotification[];
  readonly assertiveCandidates: readonly SimulationNotification[];
};

/** Builds the authoritative notification feed from event log and runtime alerts. */
export function buildSimulationNotificationFeed(input: {
  readonly eventLogEntries: readonly EventLogEntryDto[];
  readonly companyViewData: CompanyDashboardViewData;
  readonly previouslySeenIds: ReadonlySet<string>;
}): NotificationSyncResult {
  const eventNotifications = mapEventLogEntriesToNotifications(input.eventLogEntries);
  const runtimeNotifications = mapRuntimeAlertsToNotifications(input.companyViewData);
  const notifications = mergeSimulationNotifications(eventNotifications, runtimeNotifications);

  const toastCandidates = notifications.filter(
    (notification) =>
      !input.previouslySeenIds.has(notification.notificationId) &&
      shouldAnnounceNotificationAsToast(notification.severity),
  );

  const assertiveCandidates = toastCandidates.filter((notification) =>
    shouldAnnounceNotificationAssertively(notification.severity),
  );

  return Object.freeze({
    notifications,
    toastCandidates,
    assertiveCandidates,
  });
}

/** Returns toast tone for a surfaced notification. */
export function resolveToastTone(notification: SimulationNotification): 'info' | 'success' | 'warning' | 'error' {
  return mapSeverityToToastTone(notification.severity);
}
