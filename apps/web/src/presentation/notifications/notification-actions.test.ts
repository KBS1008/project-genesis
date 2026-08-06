import { describe, expect, it } from 'vitest';
import {
  getNotificationActionLabel,
  resolveNotificationAction,
  shouldAnnounceNotificationAsToast,
  shouldAnnounceNotificationAssertively,
} from './notification-actions';

describe('resolveNotificationAction', () => {
  it('opens a building when entity id is provided', () => {
    const resolution = resolveNotificationAction('open-building', 'building_001');

    expect(resolution.navigationTarget?.screen).toBe('buildings');
    expect(resolution.navigationTarget?.entitySelection).toEqual({
      kind: 'building',
      id: 'building_001',
    });
  });

  it('opens the world screen when center-world has no entity', () => {
    const resolution = resolveNotificationAction('center-world', null);

    expect(resolution.screenOnly).toBe('world');
    expect(resolution.navigationTarget).toBeNull();
  });

  it('maps retry-save to session.save command intent', () => {
    const resolution = resolveNotificationAction('retry-save', null);

    expect(resolution.commandId).toBe('session.save');
  });

  it('returns labels for every action kind', () => {
    expect(getNotificationActionLabel('open-production')).toBe('Produktion öffnen');
    expect(getNotificationActionLabel('dismiss')).toBe('Ausblenden');
  });
});

describe('notification announcement rules', () => {
  it('surfaces warning and success notifications as toast candidates', () => {
    expect(shouldAnnounceNotificationAsToast('warning')).toBe(true);
    expect(shouldAnnounceNotificationAsToast('success')).toBe(true);
    expect(shouldAnnounceNotificationAsToast('information')).toBe(false);
  });

  it('uses assertive announcements only for critical severities', () => {
    expect(shouldAnnounceNotificationAssertively('critical')).toBe(true);
    expect(shouldAnnounceNotificationAssertively('warning')).toBe(false);
  });
});
