'use client';

import { Button } from '@/presentation/primitives/Button';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';

/** Header control showing the number of active toast notifications. */
export function NotificationIndicator() {
  const { notifications, clearNotifications } = useNotifications();
  const count = notifications.length;

  if (count === 0) {
    return null;
  }

  return (
    <div className="pg-notification-indicator">
      <Button
        variant="secondary"
        aria-label={`${count} Benachrichtigung${count === 1 ? '' : 'en'} anzeigen`}
        onClick={() => {
          clearNotifications();
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
