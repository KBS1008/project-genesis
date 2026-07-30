'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';

export type PGNotificationItem = {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly tone: 'info' | 'success' | 'warning' | 'error';
  readonly timestampLabel?: string;
};

/** Notification center widget (DB-004). */
export function PGNotificationCenter({
  title = 'Benachrichtigungen',
  notifications,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Benachrichtigungen',
  emptyHint = 'Aktuelle Meldungen erscheinen hier.',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly notifications: readonly PGNotificationItem[];
}) {
  return (
    <section className="pg-widget pg-notification-center" aria-labelledby="pg-notification-center-title">
      <h3 id="pg-notification-center-title" className="pg-widget-title">
        {title}
      </h3>
      <PGWidgetSurface
        state={notifications.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        <ul className="pg-notification-list" aria-live="polite">
          {notifications.map((notification) => (
            <li key={notification.id} className={`pg-notification-item pg-tone-${notification.tone}`}>
              <div className="pg-notification-header">
                <strong>{notification.title}</strong>
                {notification.timestampLabel !== undefined ? (
                  <time>{notification.timestampLabel}</time>
                ) : null}
              </div>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      </PGWidgetSurface>
    </section>
  );
}
