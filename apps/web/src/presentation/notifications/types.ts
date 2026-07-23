export type NotificationTone = 'info' | 'success' | 'warning' | 'error';

export type NotificationEntry = {
  readonly id: string;
  readonly message: string;
  readonly tone: NotificationTone;
  readonly createdAt: number;
  readonly dismissMs: number | null;
};

export type ShowNotificationInput = {
  readonly message: string;
  readonly tone?: NotificationTone;
  readonly dismissMs?: number | null;
};

export type NotificationContextValue = {
  readonly notifications: readonly NotificationEntry[];
  readonly showNotification: (input: ShowNotificationInput) => string;
  readonly dismissNotification: (id: string) => void;
  readonly clearNotifications: () => void;
};
