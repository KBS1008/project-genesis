'use client';

export type StatusBannerTone = 'info' | 'success' | 'warning' | 'error';

/** Inline status banner for persistent panel messages. */
export function StatusBanner({
  message,
  tone = 'info',
}: {
  readonly message: string;
  readonly tone?: StatusBannerTone;
}) {
  return (
    <div
      className={`pg-status-banner pg-status-banner-${tone}`.trim()}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      {message}
    </div>
  );
}
