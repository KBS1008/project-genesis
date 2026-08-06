/** Authoritative simulation-time notification severities. */
export type SimulationNotificationSeverity =
  | 'information'
  | 'success'
  | 'warning'
  | 'critical'
  | 'system';

export type SimulationNotificationReadState = 'unread' | 'read';

export type SimulationNotificationEntityType =
  | 'none'
  | 'region'
  | 'building'
  | 'production'
  | 'research'
  | 'transport'
  | 'resource'
  | 'employee'
  | 'event';

export type SimulationNotificationActionKind =
  | 'open-region'
  | 'open-building'
  | 'open-research'
  | 'open-production'
  | 'open-transport'
  | 'open-market'
  | 'open-inspector'
  | 'open-event-log'
  | 'center-world'
  | 'retry-save'
  | 'dismiss';

/** Unified presentation notification bound to simulation clock and event log. */
export type SimulationNotification = {
  readonly notificationId: string;
  readonly severity: SimulationNotificationSeverity;
  readonly title: string;
  readonly message: string;
  readonly simulationTimestamp: number;
  readonly tickNumber: number;
  readonly entityId: string | null;
  readonly entityType: SimulationNotificationEntityType;
  readonly action: SimulationNotificationActionKind | null;
  readonly readState: SimulationNotificationReadState;
  readonly eventLogId: string | null;
  readonly category: string;
};

export const MAX_SIMULATION_NOTIFICATION_HISTORY = 50;
