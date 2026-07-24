'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buildEventNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { buildNavigationQueryString } from '@/presentation/state/navigation-state';
import { Button } from '@/presentation/primitives/Button';
import { useNotifications } from './NotificationProvider';
import type { NotificationEntry } from './types';

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
  readonly entry: NotificationEntry;
  readonly onDismiss: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (entry.dismissMs === null) {
      return undefined;
    }

    const timer = window.setTimeout(onDismiss, entry.dismissMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [entry.dismissMs, entry.id, onDismiss]);

  const openEventLog = () => {
    if (entry.eventLogId === undefined) {
      return;
    }

    const query = buildNavigationQueryString(buildEventNavigationTarget(entry.eventLogId));
    router.push(`/game${query}`);
    onDismiss();
  };

  return (
    <div
      className={`pg-notification pg-notification-${entry.tone}`.trim()}
      role={entry.tone === 'error' ? 'alert' : 'status'}
    >
      <span>{entry.message}</span>
      <div className="pg-notification-actions">
        {entry.eventLogId !== undefined ? (
          <Button variant="secondary" onClick={openEventLog}>
            Protokoll
          </Button>
        ) : null}
        <button type="button" className="pg-notification-dismiss" onClick={onDismiss} aria-label="Schließen">
          ×
        </button>
      </div>
    </div>
  );
}
