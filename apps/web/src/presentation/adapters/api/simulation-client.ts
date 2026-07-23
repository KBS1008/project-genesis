/** HTTP commands for simulation control (pause, resume, speed, step). */

import { callApi } from './client';

/** Supported deterministic simulation speed multipliers. */
export const SIMULATION_SPEED_OPTIONS = Object.freeze([1, 2, 4] as const);

export type SimulationSpeedOption = (typeof SIMULATION_SPEED_OPTIONS)[number];

/** Pauses simulation tick execution. */
export function pauseSimulation(): Promise<void> {
  return callApi<void>('/api/simulation/pause', {
    method: 'POST',
    body: '{}',
  });
}

/** Resumes simulation tick execution. */
export function resumeSimulation(): Promise<void> {
  return callApi<void>('/api/simulation/resume', {
    method: 'POST',
    body: '{}',
  });
}

/** Sets the simulation speed multiplier (tick duration). */
export function setSimulationSpeed(tickDuration: SimulationSpeedOption): Promise<void> {
  return callApi<void>('/api/simulation/speed', {
    method: 'POST',
    body: JSON.stringify({ tickDuration }),
  });
}

/** Advances the simulation by one or more ticks. */
export function advanceSimulation(count = 1): Promise<void> {
  return callApi<void>('/api/simulation/tick', {
    method: 'POST',
    body: JSON.stringify({ count }),
  });
}

/** Executes exactly one tick without changing paused state. */
export function stepSimulation(): Promise<void> {
  return callApi<void>('/api/simulation/step', {
    method: 'POST',
    body: '{}',
  });
}
