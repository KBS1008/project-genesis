'use client';

import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Assertive live region for critical simulation notifications. */
export function SimulationCriticalAnnouncer() {
  const { criticalAnnouncement } = useGameWorkspace();

  if (criticalAnnouncement === null) {
    return null;
  }

  return (
    <div className="pg-simulation-critical-announcer" role="alert" aria-live="assertive">
      {criticalAnnouncement}
    </div>
  );
}
