import {
  buildBuildingNavigationTarget,
  buildEventNavigationTarget,
  buildRegionNavigationTarget,
  buildResourceNavigationTarget,
  type EntityNavigationTarget,
} from '@/presentation/navigation/entity-navigation';
import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import type { SimulationNotificationActionKind } from './simulation-notification-types';

export type NotificationActionResolution = {
  readonly navigationTarget: EntityNavigationTarget | null;
  readonly screenOnly: PrimaryScreenId | null;
  readonly commandId: 'session.save' | null;
};

const ACTION_LABELS: Readonly<Record<SimulationNotificationActionKind, string>> = Object.freeze({
  'open-region': 'Region öffnen',
  'open-building': 'Gebäude öffnen',
  'open-research': 'Forschung öffnen',
  'open-production': 'Produktion öffnen',
  'open-transport': 'Transport öffnen',
  'open-market': 'Markt öffnen',
  'open-inspector': 'Inspector öffnen',
  'open-event-log': 'Protokoll öffnen',
  'center-world': 'Weltkarte zentrieren',
  'retry-save': 'Speichern wiederholen',
  dismiss: 'Ausblenden',
});

/** Returns a human-readable action label. */
export function getNotificationActionLabel(action: SimulationNotificationActionKind): string {
  return ACTION_LABELS[action];
}

/** Resolves a notification action into navigation or command intent. */
export function resolveNotificationAction(
  action: SimulationNotificationActionKind,
  entityId: string | null,
): NotificationActionResolution {
  switch (action) {
    case 'open-region':
      return entityId === null
        ? { navigationTarget: null, screenOnly: 'world', commandId: null }
        : { navigationTarget: buildRegionNavigationTarget(entityId), screenOnly: null, commandId: null };
    case 'open-building':
      return {
        navigationTarget:
          entityId === null
            ? { screen: 'buildings', entitySelection: { kind: 'none' } }
            : buildBuildingNavigationTarget(entityId),
        screenOnly: null,
        commandId: null,
      };
    case 'open-production':
      return {
        navigationTarget: {
          screen: 'production',
          entitySelection:
            entityId === null ? { kind: 'none' } : { kind: 'production', id: entityId },
        },
        screenOnly: null,
        commandId: null,
      };
    case 'open-research':
      return {
        navigationTarget: {
          screen: 'research',
          entitySelection:
            entityId === null ? { kind: 'none' } : { kind: 'research', id: entityId },
        },
        screenOnly: null,
        commandId: null,
      };
    case 'open-transport':
      return {
        navigationTarget: {
          screen: 'transport',
          entitySelection:
            entityId === null ? { kind: 'none' } : { kind: 'transport', id: entityId },
        },
        screenOnly: null,
        commandId: null,
      };
    case 'open-market':
      return {
        navigationTarget:
          entityId === null
            ? { screen: 'markets', entitySelection: { kind: 'none' } }
            : buildResourceNavigationTarget(entityId),
        screenOnly: null,
        commandId: null,
      };
    case 'open-event-log':
    case 'open-inspector':
      return entityId === null
        ? { navigationTarget: { screen: 'reports', entitySelection: { kind: 'none' } }, screenOnly: null, commandId: null }
        : { navigationTarget: buildEventNavigationTarget(entityId), screenOnly: null, commandId: null };
    case 'center-world':
      return { navigationTarget: null, screenOnly: 'world', commandId: null };
    case 'retry-save':
      return { navigationTarget: null, screenOnly: null, commandId: 'session.save' };
    case 'dismiss':
      return { navigationTarget: null, screenOnly: null, commandId: null };
    default:
      return { navigationTarget: null, screenOnly: null, commandId: null };
  }
}

/** Maps simulation severities to widget tones. */
export function mapSeverityToWidgetTone(
  severity: 'information' | 'success' | 'warning' | 'critical' | 'system',
): 'info' | 'success' | 'warning' | 'error' {
  switch (severity) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    case 'system':
      return 'info';
    default:
      return 'info';
  }
}

/** Maps simulation severities to toast tones. */
export function mapSeverityToToastTone(
  severity: 'information' | 'success' | 'warning' | 'critical' | 'system',
): 'info' | 'success' | 'warning' | 'error' {
  return mapSeverityToWidgetTone(severity);
}

/** Whether a notification should surface as a toast. */
export function shouldAnnounceNotificationAsToast(
  severity: 'information' | 'success' | 'warning' | 'critical' | 'system',
): boolean {
  return severity === 'critical' || severity === 'warning' || severity === 'success';
}

/** Whether a notification should use assertive screen reader announcements. */
export function shouldAnnounceNotificationAssertively(
  severity: 'information' | 'success' | 'warning' | 'critical' | 'system',
): boolean {
  return severity === 'critical';
}
