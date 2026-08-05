import { describe, expect, it } from 'vitest';
import {
  SIMULATION_BASE_TICK_INTERVAL_MS,
  resolveSimulationTickIntervalMs,
  shouldRunSimulationTickLoop,
} from '@/presentation/simulation/simulation-integration';

describe('simulation-integration', () => {
  it('scales tick interval inversely with speed multiplier', () => {
    expect(resolveSimulationTickIntervalMs(1)).toBe(SIMULATION_BASE_TICK_INTERVAL_MS);
    expect(resolveSimulationTickIntervalMs(2)).toBe(SIMULATION_BASE_TICK_INTERVAL_MS / 2);
    expect(resolveSimulationTickIntervalMs(4)).toBe(SIMULATION_BASE_TICK_INTERVAL_MS / 4);
  });

  it('guards invalid speed multipliers', () => {
    expect(resolveSimulationTickIntervalMs(0)).toBe(SIMULATION_BASE_TICK_INTERVAL_MS);
    expect(resolveSimulationTickIntervalMs(Number.NaN)).toBe(SIMULATION_BASE_TICK_INTERVAL_MS);
  });

  it('runs the tick loop only for active unpaused sessions', () => {
    expect(
      shouldRunSimulationTickLoop({ hasGame: true, isPaused: false, isBusy: false }),
    ).toBe(true);
    expect(
      shouldRunSimulationTickLoop({ hasGame: true, isPaused: true, isBusy: false }),
    ).toBe(false);
    expect(
      shouldRunSimulationTickLoop({ hasGame: false, isPaused: false, isBusy: false }),
    ).toBe(false);
    expect(
      shouldRunSimulationTickLoop({ hasGame: true, isPaused: false, isBusy: true }),
    ).toBe(false);
  });
});
