'use client';

import { useSimulationTickLoop } from '@/presentation/simulation/useSimulationTickLoop';

/** Headless component that keeps the simulation advancing while unpaused. */
export function SimulationTickLoop() {
  useSimulationTickLoop();
  return null;
}
