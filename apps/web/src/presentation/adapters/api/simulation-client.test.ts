import { describe, expect, it } from 'vitest';
import { SIMULATION_SPEED_OPTIONS } from './simulation-client';

describe('simulation-client', () => {
  it('exposes deterministic speed options', () => {
    expect(SIMULATION_SPEED_OPTIONS).toEqual([1, 2, 4]);
  });
});
