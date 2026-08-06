import { describe, expect, it } from 'vitest';
import { mergeSimulationNotifications } from './merge-simulation-notifications';
import type { SimulationNotification } from './simulation-notification-types';

function createNotification(
  id: string,
  tickNumber: number,
  simulationTimestamp: number,
): SimulationNotification {
  return {
    notificationId: id,
    severity: 'information',
    title: id,
    message: id,
    simulationTimestamp,
    tickNumber,
    entityId: null,
    entityType: 'none',
    action: null,
    readState: 'unread',
    eventLogId: null,
    category: 'TEST',
  };
}

describe('mergeSimulationNotifications', () => {
  it('sorts newest simulation events first and bounds history', () => {
    const merged = mergeSimulationNotifications(
      [
        createNotification('event_old', 1, 30),
        createNotification('event_new', 5, 150),
      ],
      [createNotification('runtime:energy-deficit', 4, 120)],
    );

    expect(merged[0]?.notificationId).toBe('event_new');
    expect(merged.some((entry) => entry.notificationId === 'runtime:energy-deficit')).toBe(true);
    expect(merged.length).toBeLessThanOrEqual(50);
  });

  it('keeps one entry per stable notification id', () => {
    const merged = mergeSimulationNotifications(
      [createNotification('dup', 2, 60)],
      [createNotification('dup', 3, 90)],
    );

    expect(merged.filter((entry) => entry.notificationId === 'dup')).toHaveLength(1);
    expect(merged[0]?.tickNumber).toBe(3);
  });
});
