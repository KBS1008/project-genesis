'use client';

import type { ReactNode } from 'react';
import { NotificationHost } from '@/presentation/notifications/NotificationHost';
import { NotificationProvider } from '@/presentation/notifications/NotificationProvider';
import { PresentationErrorBoundary } from './PresentationErrorBoundary';

/** Root presentation shell: error boundary, notifications, and route content. */
export function ApplicationShell({ children }: { readonly children: ReactNode }) {
  return (
    <NotificationProvider>
      <div className="pg-shell">
        <PresentationErrorBoundary>{children}</PresentationErrorBoundary>
        <NotificationHost />
      </div>
    </NotificationProvider>
  );
}
