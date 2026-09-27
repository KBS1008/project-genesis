import { describe, expect, it } from 'vitest';
import {
  formatApproximatePlayerFacingCycleDuration,
  formatPlayerFacingCycleCount,
  formatPlayerFacingCycleIntervalEvery,
} from './player-facing-cycle-label.js';

describe('player-facing-cycle-label', () => {
  it('formats cycle counts for hint copy', () => {
    expect(formatPlayerFacingCycleCount(1)).toBe('1 Zyklus');
    expect(formatPlayerFacingCycleCount(5)).toBe('5 Zyklen');
    expect(formatApproximatePlayerFacingCycleDuration(5)).toBe('~5 Zyklen');
    expect(formatApproximatePlayerFacingCycleDuration(1)).toBe('~1 Zyklus');
    expect(formatPlayerFacingCycleIntervalEvery(20)).toBe('alle 20 Zyklen');
    expect(formatPlayerFacingCycleIntervalEvery(30)).toBe('alle 30 Zyklen');
  });
});
