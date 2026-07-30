'use client';

import type { ReactNode } from 'react';
import { DialogHost } from '@/presentation/dialog/DialogHost';
import { DialogProvider } from '@/presentation/dialog/DialogProvider';
import { NotificationHost } from '@/presentation/notifications/NotificationHost';
import { NotificationProvider } from '@/presentation/notifications/NotificationProvider';
import { ThemeProvider } from '@/presentation/theme';
import { PresentationErrorBoundary } from './PresentationErrorBoundary';

/** Root presentation shell: error boundary, notifications, dialogs, theme, and route content. */
export function ApplicationShell({ children }: { readonly children: ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <DialogProvider>
          <div className="pg-shell">
            <PresentationErrorBoundary>{children}</PresentationErrorBoundary>
            <NotificationHost />
            <DialogHost />
          </div>
        </DialogProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
