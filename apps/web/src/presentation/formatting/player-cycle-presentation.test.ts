import { describe, expect, it } from 'vitest';
import {
  formatApproximatePlayerCycleDuration,
  formatPerCycleRate,
  formatPlayerCycleChartTooltipLabel,
  formatPlayerCycleCount,
  formatPlayerCycleIntervalEvery,
  formatPlayerCyclePosition,
  formatPlayerDuration,
  formatPlayerGameSpeedMultiplier,
  formatRemainingCycles,
} from '@/presentation/formatting/player-cycle-presentation';

describe('player-cycle-presentation', () => {
  it('formats singular and plural cycle counts', () => {
    expect(formatPlayerCycleCount(0)).toBe('0 Zyklen');
    expect(formatPlayerCycleCount(1)).toBe('1 Zyklus');
    expect(formatPlayerCycleCount(2)).toBe('2 Zyklen');
    expect(formatPlayerCycleCount(8)).toBe('8 Zyklen');
  });

  it('formats cycle position and duration', () => {
    expect(formatPlayerCyclePosition(148)).toBe('Zyklus 148');
    expect(formatPlayerCyclePosition(null)).toBe('—');
    expect(formatPlayerDuration(20)).toBe('20 Zyklen');
  });

  it('formats remaining cycles and per-cycle rates', () => {
    expect(formatRemainingCycles(3)).toBe('3 Zyklen verbleibend');
    expect(formatPerCycleRate('0,20')).toBe('0,20 / Zyklus');
  });

  it('formats game speed multiplier', () => {
    expect(formatPlayerGameSpeedMultiplier(2)).toBe('×2');
  });

  it('formats intervals, approximations, and chart tooltip labels', () => {
    expect(formatPlayerCycleIntervalEvery(10)).toBe('alle 10 Zyklen');
    expect(formatApproximatePlayerCycleDuration(5)).toBe('~5 Zyklen');
    expect(formatApproximatePlayerCycleDuration(1)).toBe('~1 Zyklus');
    expect(formatPlayerCycleChartTooltipLabel(12)).toBe('Zyklus 12');
    expect(formatPlayerCycleChartTooltipLabel('8')).toBe('Zyklus 8');
  });
});
