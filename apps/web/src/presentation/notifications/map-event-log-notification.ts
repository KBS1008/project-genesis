import type { EventLogEntryDto } from '@/presentation/adapters/api/query-client';
import { formatEventCategory } from '@/presentation/formatting/presentation-formatters';
import type {
  SimulationNotification,
  SimulationNotificationActionKind,
  SimulationNotificationSeverity,
} from './simulation-notification-types';

function mapSeverity(
  severity: EventLogEntryDto['severity'],
  category: string,
  message: string,
): SimulationNotificationSeverity {
  if (severity === 'ERROR') {
    return 'critical';
  }

  if (severity === 'WARNING') {
    return 'warning';
  }

  if (category === 'SESSION' && message.includes('gespeichert')) {
    return 'success';
  }

  if (category === 'BUILDING') {
    return 'success';
  }

  if (category === 'RESEARCH') {
    return 'success';
  }

  if (
    category === 'PRODUCTION' &&
    (message.includes('abgeschlossen') || message.includes('gestartet'))
  ) {
    return 'success';
  }

  if (category === 'SIMULATION') {
    return 'system';
  }

  return 'information';
}

function mapAction(category: string, message: string): SimulationNotificationActionKind {
  switch (category) {
    case 'SESSION':
      return message.includes('fehlgeschlagen') ? 'retry-save' : 'open-event-log';
    case 'SIMULATION':
      return 'dismiss';
    case 'BUILDING':
      return 'open-building';
    case 'PRODUCTION':
      return 'open-production';
    case 'RESEARCH':
      return 'open-research';
    case 'TRANSPORT':
      return 'open-transport';
    case 'TRADE':
      return 'open-market';
    case 'EMPLOYEE':
      return 'open-inspector';
    default:
      return 'open-event-log';
  }
}

function mapEntityType(category: string): SimulationNotification['entityType'] {
  switch (category) {
    case 'BUILDING':
      return 'building';
    case 'PRODUCTION':
      return 'production';
    case 'RESEARCH':
      return 'research';
    case 'TRANSPORT':
      return 'transport';
    case 'TRADE':
      return 'resource';
    case 'EMPLOYEE':
      return 'employee';
    case 'SESSION':
    case 'SIMULATION':
      return 'event';
    default:
      return 'none';
  }
}

/** Maps one authoritative event log entry to a simulation notification. */
export function mapEventLogEntryToNotification(entry: EventLogEntryDto): SimulationNotification {
  const title = formatEventCategory(entry.category);
  const entityId = entry.entityId ?? null;

  return Object.freeze({
    notificationId: entry.id,
    severity: mapSeverity(entry.severity, entry.category, entry.message),
    title,
    message: entry.message,
    simulationTimestamp: entry.occurredAt,
    tickNumber: entry.tickNumber,
    entityId,
    entityType: entry.entityType ?? mapEntityType(entry.category),
    action: mapAction(entry.category, entry.message),
    readState: 'unread',
    eventLogId: entry.id,
    category: entry.category,
  });
}

/** Maps event log entries newest-first into notifications. */
export function mapEventLogEntriesToNotifications(
  entries: readonly EventLogEntryDto[],
): readonly SimulationNotification[] {
  return Object.freeze(entries.map(mapEventLogEntryToNotification));
}
