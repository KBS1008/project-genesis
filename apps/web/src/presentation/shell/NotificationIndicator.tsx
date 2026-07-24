'use client';

import { useRouter } from 'next/navigation';
import { buildNavigationQueryString } from '@/presentation/state/navigation-state';
import { Button } from '@/presentation/primitives/Button';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';

/** Header control showing the number of active toast notifications. */
export function NotificationIndicator() {
  const router = useRouter();
  const { notifications } = useNotifications();
  const count = notifications.length;
  const latestEventId = notifications.findLast((entry) => entry.eventLogId !== undefined)?.eventLogId;

  if (count === 0) {
    return null;
  }

  return (
    <div className="pg-notification-indicator">
      <Button
        variant="secondary"
        aria-label={`${count} Benachrichtigung${count === 1 ? '' : 'en'} — Berichte öffnen`}
        onClick={() => {
          const query =
            latestEventId === undefined
              ? '?screen=reports'
              : buildNavigationQueryString({
                  screen: 'reports',
                  entitySelection: { kind: 'event', id: latestEventId },
                });
          router.push(`/game${query}`);
        }}
      >
        Benachrichtigungen
      </Button>
      <span className="pg-notification-indicator-badge" aria-hidden="true">
        {count}
      </span>
    </div>
  );
}
