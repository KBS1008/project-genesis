import type { DashboardIconName } from '@/presentation/icons/DashboardIcon';

/** API-aligned production operational states (presentation mapping only). */
export type ProductionOperationalState =
  | 'WAITING'
  | 'RUNNING'
  | 'FINISHED'
  | 'STALLED_ENERGY'
  | 'STALLED_WORKFORCE';

/**
 * Maps production operational state → decorative DashboardIcon, or null when text/progress alone is clearer.
 *
 * WAITING — NONE: summary copy already explains material/transport; `info` adds little and can read as alert.
 * RUNNING — NONE: progress bar + percentage in job rows is the established running signal.
 * FINISHED — success: matches PGTutorialPanel completion semantics (`check` unused for completion elsewhere).
 * STALLED_ENERGY — energy: blocks on power category; German label remains authoritative.
 * STALLED_WORKFORCE — employees: blocks on workforce category; German label remains authoritative.
 * Unknown — NONE: safe fallback; never invent a generic icon.
 */
export function resolveProductionOperationalStateDashboardIcon(
  state: string | undefined,
): DashboardIconName | null {
  switch (state) {
    case 'STALLED_ENERGY':
      return 'energy';
    case 'STALLED_WORKFORCE':
      return 'employees';
    case 'FINISHED':
      return 'success';
    case 'WAITING':
    case 'RUNNING':
      return null;
    default:
      return null;
  }
}
