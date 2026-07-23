const DEFAULT_DISMISS_MS: Readonly<Record<string, number | null>> = {
  info: null,
  success: 4500,
  warning: 6000,
  error: 7000,
};

/** Maps API and runtime errors to player-facing German messages. */
export function translatePresentationError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (message.length > 0) {
      return message;
    }
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error.trim();
  }

  return 'Ein unerwarteter Fehler ist aufgetreten.';
}

export function defaultDismissMs(tone: keyof typeof DEFAULT_DISMISS_MS): number | null {
  return DEFAULT_DISMISS_MS[tone] ?? 4500;
}

let notificationSequence = 0;

/** Creates a stable notification identifier for the toast host. */
export function createNotificationId(): string {
  notificationSequence += 1;
  return `notification-${notificationSequence}`;
}
