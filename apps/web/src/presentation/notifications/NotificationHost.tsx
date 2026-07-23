'use client';

import { useEffect } from 'react';
import { useNotifications } from './NotificationProvider';

/** Renders active toast notifications in a fixed viewport region. */
export function NotificationHost() {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div className="pg-notification-host" aria-live="polite" aria-relevant="additions">
      {notifications.map((entry) => (
        <NotificationToast
          key={entry.id}
          entry={entry}
          onDismiss={() => {
            dismissNotification(entry.id);
          }}
        />
      ))}
    </div>
  );
}

function NotificationToast({
  entry,
  onDismiss,
}: {
  readonly entry: {
    readonly id: string;
    readonly message: string;
    readonly tone: string;
    readonly dismissMs: number | null;
  };
  readonly onDismiss: () => void;
}) {
  useEffect(() => {
    if (entry.dismissMs === null) {
      return undefined;
    }

    const timer = window.setTimeout(onDismiss, entry.dismissMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [entry.dismissMs, entry.id, onDismiss]);

  return (
    <div
      className={`pg-notification pg-notification-${entry.tone}`.trim()}
      role={entry.tone === 'error' ? 'alert' : 'status'}
    >
      <span>{entry.message}</span>
      <button type="button" className="pg-notification-dismiss" onClick={onDismiss} aria-label="Schließen">
        ×
      </button>
    </div>
  );
}
