/**
 * Player-facing cycle (Zyklus) labels for dashboard hints in the application layer.
 * One presentation cycle = one simulation tick (presentation only).
 */

export function formatPlayerFacingCycleCount(count: number): string {
  if (!Number.isFinite(count)) {
    return '—';
  }

  const normalized = Math.trunc(count);

  if (normalized === 1) {
    return '1 Zyklus';
  }

  return `${normalized} Zyklen`;
}

export function formatApproximatePlayerFacingCycleDuration(durationCycles: number): string {
  return `~${formatPlayerFacingCycleCount(durationCycles)}`;
}

export function formatPlayerFacingCycleIntervalEvery(intervalCycles: number): string {
  return `alle ${formatPlayerFacingCycleCount(intervalCycles)}`;
}
