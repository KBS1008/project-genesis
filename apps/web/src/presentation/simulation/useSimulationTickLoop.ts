'use client';

import { useEffect, useRef } from 'react';
import {
  resolveSimulationTickIntervalMs,
  shouldRunSimulationTickLoop,
} from '@/presentation/simulation/simulation-integration';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Drives automatic simulation ticks while the session is running and unpaused. */
export function useSimulationTickLoop(): void {
  const { viewData, isBusy, runSimulationTick } = useGameWorkspace();
  const timerRef = useRef<number | null>(null);
  const tickInFlightRef = useRef(false);

  const { session, simulation } = viewData;
  const shouldRun = shouldRunSimulationTickLoop({
    hasGame: session.hasGame,
    isPaused: simulation.isPaused,
    isBusy,
  });

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!shouldRun) {
      return;
    }

    const scheduleNextTick = () => {
      const intervalMs = resolveSimulationTickIntervalMs(simulation.speedMultiplier);

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;

        if (tickInFlightRef.current) {
          scheduleNextTick();
          return;
        }

        tickInFlightRef.current = true;

        void runSimulationTick()
          .catch(() => undefined)
          .finally(() => {
            tickInFlightRef.current = false;
            scheduleNextTick();
          });
      }, intervalMs);
    };

    scheduleNextTick();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [runSimulationTick, shouldRun, simulation.speedMultiplier]);
}
