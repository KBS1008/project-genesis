/** Real-time interval between automatic ticks at ×1 speed (milliseconds). */
export const SIMULATION_BASE_TICK_INTERVAL_MS = 2000;

/** Resolves the client tick loop interval from the active speed multiplier. */
export function resolveSimulationTickIntervalMs(speedMultiplier: number): number {
  const speed = Number.isFinite(speedMultiplier) ? Math.max(1, Math.round(speedMultiplier)) : 1;
  return Math.round(SIMULATION_BASE_TICK_INTERVAL_MS / speed);
}

/** Returns whether the simulation should auto-advance ticks on the client. */
export function shouldRunSimulationTickLoop(input: {
  readonly hasGame: boolean;
  readonly isPaused: boolean;
  readonly isBusy: boolean;
}): boolean {
  return input.hasGame && !input.isPaused && !input.isBusy;
}
