'use client';

import { LoadingState } from '@/presentation/primitives/LoadingState';

/** Full-surface loading overlay for long-running workspace commands. */
export function PGLoadingOverlay({
  active,
  label = 'Aktion wird ausgeführt…',
}: {
  readonly active: boolean;
  readonly label?: string;
}) {
  if (!active) {
    return null;
  }

  return (
    <div className="pg-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <LoadingState label={label} />
    </div>
  );
}
