import type { EntityNavigationTarget } from '@/presentation/navigation/entity-navigation';
import type { CompanyOperationsPendingNavigation } from '@/presentation/navigation/company-operations-pending-navigation';

/** Player-facing label for STALLED_WORKFORCE contextual personnel navigation. */
export const PRODUCTION_WORKFORCE_PERSONNEL_NAVIGATION_LABEL = 'Personal verwalten';

/** Maps structured workforce stall navigation to workspace targets and pending operations intent. */
export function resolveProductionWorkforcePersonnelNavigation(buildingId: string): {
  readonly target: EntityNavigationTarget;
  readonly pendingNavigation: CompanyOperationsPendingNavigation;
} {
  return {
    target: {
      screen: 'company',
      entitySelection: { kind: 'none' },
    },
    pendingNavigation: Object.freeze({
      kind: 'workforce_assignment',
      buildingId,
    }),
  };
}
