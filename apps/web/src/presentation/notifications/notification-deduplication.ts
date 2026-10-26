import type { NotificationEntry, NotificationTone } from './types';

/** Minimum interval before the same toast message may appear again. */
export const NOTIFICATION_DEDUPE_WINDOW_MS = 8000;

/** Returns true when an identical notification is already visible or was shown recently. */
export function isDuplicateNotification(
  notifications: readonly NotificationEntry[],
  input: { readonly message: string; readonly tone: NotificationTone },
  now = Date.now(),
): boolean {
  return notifications.some(
    (entry) =>
      entry.message === input.message &&
      entry.tone === input.tone &&
      now - entry.createdAt < NOTIFICATION_DEDUPE_WINDOW_MS,
  );
}
