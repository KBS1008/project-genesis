import { describe, expect, it } from 'vitest';
import { isDuplicateNotification } from './notification-deduplication';
import type { NotificationEntry } from './types';

function entry(message: string, tone: NotificationEntry['tone'], ageMs: number): NotificationEntry {
  return {
    id: 'n1',
    message,
    tone,
    createdAt: Date.now() - ageMs,
    dismissMs: 7000,
  };
}

describe('isDuplicateNotification', () => {
  it('detects the same message and tone inside the dedupe window', () => {
    const notifications = [entry('Der Spielserver ist momentan nicht erreichbar.', 'error', 1000)];

    expect(
      isDuplicateNotification(notifications, {
        message: 'Der Spielserver ist momentan nicht erreichbar.',
        tone: 'error',
      }),
    ).toBe(true);
  });

  it('allows the same message after the dedupe window elapsed', () => {
    const notifications = [entry('Der Spielserver ist momentan nicht erreichbar.', 'error', 9000)];

    expect(
      isDuplicateNotification(notifications, {
        message: 'Der Spielserver ist momentan nicht erreichbar.',
        tone: 'error',
      }),
    ).toBe(false);
  });
});
