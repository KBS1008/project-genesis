/** Player-facing cycle (Zyklus) presentation — maps one presentation cycle to one simulation tick. */

export function formatPlayerCycleCount(count: number): string {
  if (!Number.isFinite(count)) {
    return '—';
  }

  const normalized = Math.trunc(count);

  if (normalized === 1) {
    return '1 Zyklus';
  }

  return `${normalized} Zyklen`;
}

/** Absolute simulation position for the player (Zyklus N). */
export function formatPlayerCyclePosition(cycleNumber: number | null | undefined): string {
  if (cycleNumber === null || cycleNumber === undefined || !Number.isFinite(cycleNumber)) {
    return '—';
  }

  return `Zyklus ${Math.trunc(cycleNumber)}`;
}

/** Total duration in player cycles (catalog / definition state). */
export function formatPlayerDuration(durationTicks: number): string {
  return formatPlayerCycleCount(durationTicks);
}

/** Remaining duration when a count is decision-relevant (running state). */
export function formatRemainingCycles(remainingTicks: number): string {
  return `${formatPlayerCycleCount(remainingTicks)} verbleibend`;
}

/** Per-step rate label (one presentation cycle = one simulation tick). */
export function formatPerCycleRate(formattedNumericValue: string): string {
  return `${formattedNumericValue} / Zyklus`;
}

/** Recurring interval copy (`alle N Zyklen`). */
export function formatPlayerCycleIntervalEvery(intervalCycles: number): string {
  return `alle ${formatPlayerCycleCount(intervalCycles)}`;
}

/** Approximate duration in player cycles (`~N Zyklen`). */
export function formatApproximatePlayerCycleDuration(durationCycles: number): string {
  return `~${formatPlayerCycleCount(durationCycles)}`;
}

/** Chart tooltip label for an absolute simulation position on the X axis. */
export function formatPlayerCycleChartTooltipLabel(
  tickLabel: string | number | null | undefined,
): string {
  if (tickLabel === null || tickLabel === undefined || tickLabel === '') {
    return formatPlayerCyclePosition(undefined);
  }

  const parsed = typeof tickLabel === 'number' ? tickLabel : Number(tickLabel);
  return formatPlayerCyclePosition(parsed);
}

/** Active game speed multiplier for player controls (not engine tick duration). */
export function formatPlayerGameSpeedMultiplier(multiplier: number): string {
  return `×${multiplier}`;
}
